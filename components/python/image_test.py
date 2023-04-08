# code to manipulate image
from turtle import color
from PIL import Image, ImageFont, ImageDraw
from PIL import Image
from PIL import ImageDraw
import os
import json
import sys


imageno = sys.argv[1]
contenttype = sys.argv[2]
coordinate = sys.argv[3].split(',')
color = sys.argv[4]
colorList = color.split(',')
size = sys.argv[5]

print(coordinate)
# print(coordinate[0])
cwd = os.getcwd()
f = open(cwd+'\invitation\meta_data.json', 'r')
data = json.load(f)
imagename = data['imgbasename'] + str(imageno) + '.jpg'
img = Image.open(cwd+'\invitation\original_images\\'+imagename)
img_copy = img.copy()
I1 = ImageDraw.Draw(img_copy)

myFont = ImageFont.truetype(
    'Shree768.ttf', int(size), layout_engine=ImageFont.LAYOUT_RAQM)
I1.text((int(coordinate[0]), int(coordinate[1])), 'vgkyMcpC M¡_u',
        font=myFont, fill=(int(colorList[0]), int(colorList[1]), int(colorList[2])))
# img_copy.show()
p = cwd + '\public\\test\\test.jpg'
img_copy.save(p)
# else:
#     mno = str(mobileNo)+".jpg"
#     p = Path(working_directory/'invitation', mno)
#     myFont = ImageFont.truetype('Roboto-Bold.ttf', 28)
#     I1.text((320, 530), name, font=myFont, fill=(255, 255, 255))
#     img_copy.show()
#     # img_copy.save(p)
