import sys
from pathlib import Path
from pdf2image import convert_from_path
import os
import json
# print("Pdf converted")

# working_directory = Path(__file__).parent
# print(working_directory)
cwd = os.getcwd()
# print(cwd)
# print(os.path.normpath(os.getcwd() + os.sep + os.pardir))

# working_directory = Path(__file__).absolute().parent
f = open(cwd+'\invitation\meta_data.json', 'r')
data = json.load(f)
# print(data)
images = convert_from_path(
    cwd+'\invitation\original_pdf\\'+data['pdfname'])

#images = convert_from_path("kheni.pdf")
for i in range(len(images)):
    img_store_name = data['imgbasename'] + str(i) + ".jpg"
    p = Path(cwd+'\invitation\original_images\\', img_store_name)
    images[i].save(p, 'JPEG')

print(str(len(images)))
# print("Pdf converted")
