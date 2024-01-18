const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  database: 'studentsmarks',
  password: '12345678',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error: ', err);
  } else {
    console.log('Connected to the database');
  }
});

app.get("/" ,(req , res) =>{
    res.send('Save as file')
})

app.post('/upload', upload.single('file'), (req, res) => {

   res.send('upload')
  const { filename, path } = req.file;
   
  // Read Excel file
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const excelData = xlsx.utils.sheet_to_json(sheet);

  // Insert data into the database
  const sql = 'INSERT INTO studentstable ( subject, date, marks , name) VALUES ?';
  const values = excelData.map((row) => Object.values(row));
  
  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting into database: ', err);
      res.status(500).json({ error: 'Error uploading file' });
    } else {
      res.json({ success: true, message: 'File uploaded and data inserted successfully' });
      console.log('File uploaded and data inserted successfully ');
    }
  }); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
