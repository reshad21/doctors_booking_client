/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportDropdownProps {
    data: any[];
    columns: { label: string; key: string }[];
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ data, columns,
}) => {
    // CSV Export
    const handleExportCSV = () => {
        const csv = Papa.unparse(data.map(row => {
            const obj: Record<string, any> = {};
            columns.forEach(col => {
                obj[col.label] = row[col.key];
            });
            return obj;
        }));
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "export.csv";
        link.click();
    };

    // Excel Export
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(row => {
            const obj: Record<string, any> = {};
            columns.forEach(col => {
                obj[col.label] = row[col.key];
            });
            return obj;
        }));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "export.xlsx");
    };

    // PDF Export
    const handleExportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = columns.map(col => col.label);
        const tableRows = data.map(row =>
            columns.map(col => {
                // Special handling for chamber name
                console.log(col, "col")
                if (col.key === "chamberName") {
                    // Try flat field, then nested object
                    return row.chamberName || (row.chamber && row.chamber.name) || "";
                }
                return row[col.key] ?? "";
            })
        );
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 10 },
            margin: { top: 20 },
        });
        doc.save("export.pdf");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-brand rounded hover:bg-green-800 cursor-pointer text-white">
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ExportDropdown;
