const XLSX = require('xlsx');
const fs = require('fs');

// Read Excel file
const workbook = XLSX.readFile('./data/quality.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(sheet);

// Write JSON to file
fs.writeFileSync('./data/Quality.json', JSON.stringify(jsonData, null, 2));
console.log('Excel converted to dashboard_data.json');