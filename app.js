const express = require('express');
const bodyParser = require('body-parser');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const app = express();

// Middleware to parse URL-encoded bodies (needed for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

// Utility function to format XML for pretty printing
function formatXml(xml) {
  let formatted = '';
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    }
    const padding = new Array(pad + 1).join('  ');
    formatted += padding + node + '\n';
    pad += indent;
  });
  return formatted;
}

// POST endpoint to receive SAML assertions
app.post('/saml/acs', (req, res) => {
  const samlResponse = req.body.SAMLResponse;
  if (!samlResponse) {
    return res.status(400).send('Missing SAMLResponse');
  }

  try {
    // Decode the base64-encoded SAMLResponse
    const decoded = Buffer.from(samlResponse, 'base64').toString('utf8');

    // Parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(decoded, 'application/xml');

    // Serialize XML back to string and format it
    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(xmlDoc);
    const prettyXml = formatXml(xmlStr);

    // Return the pretty-printed XML in an HTML page
    res.send(`
      <html>
        <head>
          <title>SAML Assertion</title>
        </head>
        <body>
          <h1>Received SAML Assertion</h1>
          <pre>${prettyXml}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error processing SAMLResponse: ' + err);
  }
});

// A simple landing page to indicate the service is running
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SAML Test Service Provider</title>
      </head>
      <body>
        <h1>SAML Test Service Provider</h1>
        <p>This service is ready to receive SAML assertions at <code>/saml/acs</code>.</p>
      </body>
    </html>
  `);
});

// Start the server on the port provided by Heroku or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
