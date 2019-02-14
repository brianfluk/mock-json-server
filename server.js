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
// Body format requirements:
// {
// 	"endpoint": text,
// 	"json": json
// }
app.post('/mock', (req, res) => {
    // TODO: type check and verify body

    let endpoint = req.body.endpoint;
    let serializedJSON = JSON.stringify(req.body.json);
    console.log("serializedJSON", serializedJSON);

    dao.run("insert or ignore into endpoints(mock_endpoint, mock_json) values('" + endpoint + "','"+ serializedJSON + "');");
    dao.run("replace into endpoints(mock_endpoint, mock_json) values('" + endpoint + "','"+ serializedJSON + "');")

    // TODO:  save endpoint url and serialized JSON to endpoints.db (insert or update if exists)

    console.log(req.body)
    res.send(`saved to database: ${serializedJSON} at link "${endpoint}"`);
});

// Retrieve a JSON from a previously updated endpoint
// Query requirements
// Use url query parameter "endpoint" to specify a desired URL, in quotations
app.get('/mock', (req, res) => {
    // TODO: fetch from endpoints.db by querying for the endpoint url
    let endpoint = req.query.endpoint;
    let query;
    dao.get(`select * from endpoints where mock_endpoint = ${endpoint}`).then((data)=> {
        query = data;
        console.log(data)
        res.json(JSON.parse(data['mock_json']))
    })
    console.log(req.query.endpoint);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
})