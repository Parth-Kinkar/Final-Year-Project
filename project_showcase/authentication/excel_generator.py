import openpyxl
from openpyxl.styles import Font
from django.http import HttpResponse

def generate_excel_template():
    # ✅ Create Excel workbook & sheet
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Students"

    # ✅ Define headers (Removed Year & Department)
    headers = ["Full Name", "Email", "Roll Number"]
    ws.append(headers)

    # ✅ Apply bold font to headers
    for col in range(1, len(headers) + 1):
        ws.cell(row=1, column=col).font = Font(bold=True)

    # ✅ Send as downloadable response
    response = HttpResponse(content_type="application/vnd.openpyxl")
    response["Content-Disposition"] = 'attachment; filename="student_template.xlsx"'
    wb.save(response)
    
    return response
