const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const RSVP_FILE = path.join(__dirname, 'rsvps.xlsx');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize Excel file if it doesn't exist
function initializeExcelFile() {
  if (!fs.existsSync(RSVP_FILE)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([
      ['Timestamp', 'Name', 'Email', 'Number of Guests', 'Dietary Restrictions', 'Message']
    ]);
    xlsx.utils.book_append_sheet(wb, ws, 'RSVPs');
    xlsx.writeFile(wb, RSVP_FILE);
    console.log('Created new RSVP file');
  }
}

// RSVP submission endpoint
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, email, guests, dietary, message } = req.body;

    // Validate required fields
    if (!name || !email || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Read existing workbook
    const workbook = xlsx.readFile(RSVP_FILE);
    const worksheet = workbook.Sheets['RSVPs'];

    // Convert to JSON to get existing data
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Add new row with timestamp
    const timestamp = new Date().toLocaleString();
    const newRow = [
      timestamp,
      name,
      email,
      guests,
      dietary || '',
      message || ''
    ];

    data.push(newRow);

    // Convert back to worksheet and save
    const newWorksheet = xlsx.utils.aoa_to_sheet(data);
    workbook.Sheets['RSVPs'] = newWorksheet;
    xlsx.writeFile(workbook, RSVP_FILE);

    console.log(`New RSVP received from ${name} at ${timestamp}`);

    res.json({
      success: true,
      message: 'Thank you for your RSVP! We can\'t wait to celebrate with you.'
    });

  } catch (error) {
    console.error('Error processing RSVP:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  initializeExcelFile();
  console.log(`Wedding website server running at http://localhost:${PORT}`);
  console.log(`RSVP submissions will be saved to ${RSVP_FILE}`);
});
