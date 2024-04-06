require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let addresses = {};

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

app.get("/api/shorturl/:url", (req, res) => {
  const { url } = req.params;
  res.redirect(addresses[url]);
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  if(isValidUrl(url)){
  const short_url = Object.keys(addresses).length + 1; // Generate unique short_url
  addresses[short_url] = url;
  res.json({
    original_url: `${url}`,
    short_url: short_url,
  });}
  else
  res.json({ error: 'invalid url' })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
