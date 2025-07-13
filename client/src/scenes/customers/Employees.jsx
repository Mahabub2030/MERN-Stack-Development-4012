import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "components/Header";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

const columns = [
  { field: "id", headerName: "S.N", width: 70  },
  { field: "employeeName", headerName: "Employee Name", width: 180 },
  { field: "jobDescription", headerName: "Job Title", width: 180 },
  { field: "iqamaId", headerName: "Iqama/ID", width: 120 },
  { field: "dacoId", headerName: "DACO ID", width: 130 },
  { field: "group", headerName: "Group", width: 130 },
  { field: "joiningDate", headerName: "Joining Date", width: 130 },
  { field: "phone", headerName: "Phone", width: 130 },
  { field: "email", headerName: "Email", width: 130 },
  { field: "nationality", headerName: "Nationality", width: 180 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      let bgColor = "";
      let textColor = "";

      switch (params.value) {
        case "Active":
          bgColor = "#d1fae5"; // green-100
          textColor = "#065f46"; // green-800
          break;
        case "Vacation":
        case "On Leave":
          bgColor = "#fef9c3"; // yellow-100
          textColor = "#854d0e"; // yellow-800
          break;
        case "Resigned":
          bgColor = "#ef4444"; // red-500
          textColor = "#ffffff"; // white
          break;
        default:
          bgColor = "#e5e7eb"; // gray-200
          textColor = "#374151"; // gray-700
          break;
      }

      return (
        <div
          style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: "4px 8px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 500,
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const handleEdit = () => {
        alert(`Edit employee: ${params.row.employeeName}`);
      };

      const handleDelete = () => {
        alert(`Delete employee: ${params.row.employeeName}`);
      };

      return (
        <div style={{ display: "flex", gap: 8 }}>
          <EditIcon
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={handleEdit}
            titleAccess="Edit"
          />
          <DeleteIcon
            style={{ cursor: "pointer", color: "#d32f2f" }}
            onClick={handleDelete}
            titleAccess="Delete"
          />
        </div>
      );
    },
  },
];

const rows = [
  {
    "id": 1,
    "employeeName": "ABDALLA SAMIR AHMED SAYED",
    "jobDescription": "Asst.Accounting",
    "iqamaId": "2554504510",
    "dacoId": "414041",
    "group": "Management",
    "joiningDate": "2022-08-01",
    "phone": "+966414041",
    "email": "abdalla.sayed@example.com",
    "nationality": "Egyptian",
    "status": "Active"
  },
  
];

export default function EmployeeTable() {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    return rows.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees.csv";
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Employees List", 14, 16);
    const tableColumn = columns
      .filter(col => col.field !== 'action') // exclude action column from export
      .map((col) => col.headerName);
    const tableRows = filteredRows.map((row) =>
      columns
        .filter(col => col.field !== 'action')
        .map((col) => row[col.field] || "")
    );
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("employees.pdf");
  };

  return (
    <div style={{ height: "70%", width: "100%", marginTop: 40,maxWidth:2500,  }}>
      <Header title="Employees" />
      <div style={{ marginBottom: 30, marginLeft:20 ,display: "flex", gap: 10 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" onClick={exportToExcel}>
          Export Excel
        </Button>
        <Button variant="contained" onClick={exportToCSV}>
          Export CSV
        </Button>
        <Button variant="contained" onClick={exportToPDF}>
          Export PDF
        </Button>
      </div>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        pagination
        autoHeight
      />
    </div>
  );
}
