
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/import-data', async (req, res) => {
  const data = req.body;
  const googleSheetsWebhook = 'YOUR API';

  if (!data || data.length === 0) {
    return res.status(400).send('No data recieved.');
  }

  try {
    const response = await axios.post(googleSheetsWebhook, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Data sent:', response.data);
    res.status(200).send('Recieved data.');
  } catch (error) {
    console.error('Error at sending data:', error.message);
    res.status(500).send('Server error.');
  }
});

app.listen(port, () => {
  console.log(`Proxy running on http://localhost:${port}`);

});
