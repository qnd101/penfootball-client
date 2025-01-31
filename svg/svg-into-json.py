import os
import json
import xml.etree.ElementTree as ET

save_path = '..\\src\\imgs\\svg-data.json'

dir = os.path.dirname(__file__)
dirlist = [file for file in os.listdir(dir) if file[-4:]==".svg"]

result = {}
for path in dirlist:
    with open(dir + "\\"+path, 'r') as fileobj:
        root = ET.fromstring(fileobj.read())
        result[path[:-4]]={"viewBox": root.get("viewBox"),"d":list(root)[0].get("d")}

with open(dir + '\\'+save_path, 'w') as savefileobj:
    savefileobj.write(json.dumps(result))