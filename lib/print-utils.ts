export const printElement = (element: HTMLElement) => {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
          }
          .info {
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${element.innerHTML}
          <div class="footer">
            <p>This is an automatically generated report. Printed on ${new Date().toLocaleString()}</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

export const downloadAsPDF = async (element: HTMLElement, filename: string) => {
  // In a real application, you would use a library like jsPDF or html2pdf.js
  // For this example, we'll use the print functionality as a fallback
  printElement(element)
}

