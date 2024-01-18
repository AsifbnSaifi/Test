const express = require('express');
const multer = require('multer');
const path = require('path');
const connection = require('../database.js')
// const readXlsxFile = require('read-excel-file')
// const xlsx = require('xlsx');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));

    },
});

const middlewareupload = multer({ storage: storage });
const upload = express.Router();


// Use the middleware directly in the route definition
upload.post('/upload', middlewareupload.single('file'), async (req, res) => {
       
    try {
        const fileName = req.file.filename;

        // Perform database operations using the 'connection' object
        const query = 'INSERT INTO studentstable (subject , date , marks , name) VALUES (?)';
        await connection.query(query, fileName);

        res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
        console.error('Error uploading file to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
      

       
});

module.exports = upload;
