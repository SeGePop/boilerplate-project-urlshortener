require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body; // Extract the 'url' field from the request body
  const short_url = `shorturl/${url.length + 1}`;
  res.json({ 
    "original_url": `${url}`,
    "short_url": `${short_url}`
   });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});