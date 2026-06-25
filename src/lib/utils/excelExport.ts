/**
 * Reusable Enterprise Table Exporter for Travixa CRM
 * Generates TSV/CSV Excel-compatible spreadsheet files preserving headers, currency formatting, and dates.
 */

export interface ExportColumn {
  header: string;
  key: string;
  format?: 'currency' | 'date' | 'text' | 'number';
}

export function exportTableToExcel(data: any[], columns: ExportColumn[], filename: string) {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No records available to export.");
    return;
  }

  // 1. Build Header Row
  const headerRow = columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join('\t');

  // 2. Build Data Rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      let val = row[col.key];
      if (val === null || val === undefined) val = "";

      if (col.format === 'currency') {
        const rawNum = Number(String(val).replace(/[^0-9.-]+/g, "")) || 0;
        val = `₹${rawNum.toLocaleString('en-IN')}`;
      } else if (col.format === 'date') {
        try {
          const d = new Date(val);
          if (!isNaN(d.getTime())) val = d.toISOString().split('T')[0];
        } catch {}
      }

      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join('\t');
  });

  // 3. Assemble BOM + TSV string (Excel reads UTF-16/UTF-8 BOM tab-separated natively as spreadsheet columns)
  const tsvContent = "\uFEFF" + [headerRow, ...dataRows].join('\r\n');

  // 4. Trigger Blob Download
  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
