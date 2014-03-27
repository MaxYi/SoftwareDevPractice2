import win32com.client
import os
import json
from pprint import pprint

path = os.getcwd()

file_path = path+'/public/res/temp.json'
# read from .json
json_data=open(file_path)
data = json.load(json_data)

word = win32com.client.Dispatch("wps.application")

word.Visible=0

doc = word.Documents.Open(path+'/public/res/origin/template1-1.doc')

# more auto-fill in V2.0
word.Selection.Find.ClearFormatting()
word.Selection.Find.Replacement.ClearFormatting()
word.Selection.Find.Execute("name", False, False, False, False, False, True, 1, True, data["name"], 2)
word.Selection.Find.Execute("sex", False, False, False, False, False, True, 1, True, data["sex"], 2)
word.Selection.Find.Execute("birth", False, False, False, False, False, True, 1, True, data["birth"], 2)
word.Selection.Find.Execute("id", False, False, False, False, False, True, 1, True, data["idNum"], 2)
word.Selection.Find.Execute("workplace", False, False, False, False, False, True, 1, True, data["workPlace"], 2)
word.Selection.Find.Execute("email", False, False, False, False, False, True, 1, True, data["email"], 2)
word.Selection.Find.Execute("phone", False, False, False, False, False, True, 1, True, data["phone"], 2)
word.Selection.Find.Execute("location", False, False, False, False, False, True, 1, True, data["location"], 2)
# pic replace
doc.Bookmarks("pic").Select()
doc.InlineShapes.AddPicture(path+'/public/res/user/'+data["account"]+'/'+data["pic_name"])

doc.SaveAs(path+'/public/res/user/'+data["account"]+'/out.doc')

doc.Close()
word.Documents.Close()
word.Quit()