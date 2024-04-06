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

let local_addresses = {};

app.get("/api/shorturl/:url", (req, res) => {
  const { url } = req.params;
  res.redirect(local_addresses[url]);
});

function extractDomain(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    return null;
  }
}

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  const domain = extractDomain(url);
  dns.lookup(domain, (err, addresses) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      const short_url = Object.keys(local_addresses).length + 1; // Generate unique short_url
      local_addresses[short_url] = url;
      res.json({
        original_url: `${url}`,
        short_url: short_url,
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
