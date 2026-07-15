const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFile = path.join(__dirname, 'memberlist', 'list data', 'BMTP MEMBERS DATA.xlsx');
const jsonFile = path.join(__dirname, 'memberlist', 'list data', 'member_data.json');

const workbook = XLSX.readFile(excelFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(worksheet);

fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), 'utf-8');
console.log('Converted to JSON. Data size:', data.length);
console.log('First row:', data[0]);
