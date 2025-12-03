#!/usr/bin/env python3

from bs4 import BeautifulSoup
import re
import requests
import csv
import os
from datetime import datetime
import time
from urllib.parse import urljoin

# Create directories
output_dir = "student_data"
os.makedirs(output_dir, exist_ok=True)
os.makedirs(f"{output_dir}/images", exist_ok=True)

s = requests.Session()
s.get("https://oa.cc.iitk.ac.in/Oa/Jsp/Main_Frameset.jsp")
s.get("https://oa.cc.iitk.ac.in/Oa/Jsp/Main_Intro.jsp?frm='SRCH'")
s.get("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITK_Srch.jsp?typ=stud")

headers = {
    "Referer": "https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITK_Srch.jsp?typ=stud"
}

headers1 = {
    "Referer": "https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchStudRoll_new.jsp"
}

payload = {
    'k4': 'oa',
    'numtxt': '',
    'recpos': 0,
    'str': '',
    'selstudrol': '',
    'selstuddep': '',
    'selstudnam': '',
    'txrollno': '',
    'Dept_Stud': '',
    'selnam1': '',
    'mail': ''
}

payload1 = {
    'typ': ['stud'] * 12,
    'numtxt': '',
    'sbm': ['Y'] * 12
}

MAX_RECORDS = 24
BATCH_SIZE = 12
DELAY = 1

def extract_student_photo_url_from_style(style):
    urls = re.findall(r'url\(&quot;(.*?)&quot;\)', style)
    if not urls:
        urls = re.findall(r'url\("([^"]+)"\)', style)
    if len(urls) > 1:
        return urls[1]
    elif urls:
        return urls[0]
    return ""

def download_image(url, roll_number):
    try:
        if not url.startswith('http'):
            url = f"https://oa.cc.iitk.ac.in{url}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        }
        response = s.get(url, headers=headers)
        if response.status_code == 200:
            image_path = f"{output_dir}/images/{roll_number}.jpg"
            with open(image_path, 'wb') as f:
                f.write(response.content)
            return image_path
        else:
            print(f"Failed to download image for {roll_number}. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error downloading image for {roll_number}: {e}")
    return ""

def process_response_soup(soup, csv_writer, count):
    for link in soup.select('.TableText a'):
        if count[0] >= MAX_RECORDS:
            return False

        roll = link.get_text().strip()
        payload1['numtxt'] = roll
        time.sleep(DELAY)
        r1 = s.post("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchRes_new.jsp", headers=headers1, data=payload1)
        soup1 = BeautifulSoup(r1.text, 'html.parser')

        data = dict(roll=roll, username='', name='', program='', dept='', hall='', room='', blood_group='', gender='', hometown='', image_url='', image_path='')

        img_tag = soup1.find('img')
        # Always use the known URL format for images
        student_photo_url = f"https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/{roll}_0.jpg"
        data['image_url'] = student_photo_url
        data['image_path'] = download_image(student_photo_url, roll)


        for para in soup1.select('.TableContent p'):
            body = para.get_text().strip()
            field = body.split(':')
            if len(field) >= 2:
                key = field[0].strip()
                value = field[1].strip()
                if key == 'Name':
                    data['name'] = value.lower().title()
                elif key == 'Program':
                    data['program'] = value
                elif key == 'Department':
                    data['dept'] = value.lower().title()
                elif key == 'Hostel Info':
                    if len(value.split(',')) > 1:
                        data['hall'] = value.split(',')[0].strip()
                        data['room'] = value.split(',')[1].strip()
                elif key == 'E-Mail':
                    if len(value.split('@')) > 1:
                        data['username'] = value.split('@')[0].strip()
                elif key == 'Blood Group':
                    data['blood_group'] = value
                elif key == 'Gender':
                    data['gender'] = value

        body = soup1.prettify()
        if len(body.split('Permanent Address :')) > 1:
            address = body.split('Permanent Address :')[1].split(',')
            if len(address) > 2:
                address = address[len(address) - 3: len(address) - 1]
                data['hometown'] = "{}, {}".format(address[0], address[1])

        csv_writer.writerow([
            data['roll'], data['username'], data['name'], data['program'],
            data['dept'], data['hall'], data['room'], data['blood_group'],
            data['gender'], data['hometown'], data['image_url'], data['image_path']
        ])

        count[0] += 1
        print(f"Processed record {count[0]}/{MAX_RECORDS} - {data['name']}")

    return True

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
csv_filename = f"{output_dir}/students_100_with_images_{timestamp}.csv"

with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow([
        'roll', 'username', 'name', 'program', 'dept', 'hall', 'room',
        'blood_group', 'gender', 'hometown', 'image_url', 'image_path'
    ])

    count = [0]

    r = s.post("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchStudRoll_new.jsp",
               headers=headers, data=payload)
    soup = BeautifulSoup(r.text, 'html.parser')
    if not process_response_soup(soup, writer, count):
        print("Reached 100 records in first batch")

    for i in range(BATCH_SIZE, MAX_RECORDS, BATCH_SIZE):
        if count[0] >= MAX_RECORDS:
            break

        payload['recpos'] = i
        time.sleep(DELAY)
        r = s.post("https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITk_SrchStudRoll_new.jsp",
                   headers=headers, data=payload)
        soup = BeautifulSoup(r.text, 'html.parser')
        if not process_response_soup(soup, writer, count):
            break

print(f"\nSuccessfully extracted {min(count[0], MAX_RECORDS)} records to:")
print(f"- CSV file: {csv_filename}")
print(f"- Images folder: {output_dir}/images/")
