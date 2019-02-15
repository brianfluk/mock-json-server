const express = require('express');
const port = 3000;
const bodyParser = require('body-parser')
const app = express();
const AppDAO = require('./dao');
const dao = new AppDAO('./db/endpoints.db');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let sql = `CREATE TABLE IF NOT EXISTS endpoints(
    mock_endpoint TEXT PRIMARY KEY,
    mock_json TEXT NOT NULL
);`;
dao.run(sql);

// Upload your JSON to an arbitrary endpoint
// Body keys: endpoint (text), json (json)
app.post('/mock', (req, res) => {
    if (! req.body) {
        res.send('Error: need a body');
    } else if (! req.body.endpoint) {
        res.send('Error: need a body that contains an endpoint');
    } else if (! req.body.json) {
        res.send('Error: need a body that contains a json');
    }

    let endpoint = req.body.endpoint;
    let serializedJSON = JSON.stringify(req.body.json);
    console.log("serializedJSON", serializedJSON);

    dao.run("insert or ignore into endpoints(mock_endpoint, mock_json) values('" + endpoint + "','"+ serializedJSON + "');");
    dao.run("replace into endpoints(mock_endpoint, mock_json) values('" + endpoint + "','"+ serializedJSON + "');")

    console.log("POST: ", req.body)
    res.send(`saved to database: ${serializedJSON} at link "${endpoint}"`);
});

// Retrieve a JSON from a previously updated endpoint
// URL query parameters: "endpoint"
app.get('/mock', (req, res) => {
    if (! req.query || ! req.query.endpoint) {
        console.log(`Error: need a query parameter of req.query`);
        res.send(`Error: need a query parameter of req.query`);
    }
    let endpoint = req.query.endpoint;
    // TODO: type check and verify body

    dao.get(`select * from endpoints where mock_endpoint = ${endpoint}`).then((data)=> {
        res.json(JSON.parse(data['mock_json']))
    })
    console.log("GET: ", req.query.endpoint);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
})