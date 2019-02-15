const express = require('express');
const port = 3000;
const bodyParser = require('body-parser')
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/endpoints.db', (err) => {
    if (err) {
      console.log('Could not connect to database', err)
    } else {
      console.log('Connected to database')
    }
})

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let sql = `CREATE TABLE IF NOT EXISTS endpoints(
    mock_endpoint TEXT PRIMARY KEY,
    mock_json TEXT NOT NULL
);`;
db.run(sql, [], function (err) {
    if (err) {
      console.log('Error running sql ' + sql)
      console.log(err)
    }
});

/** Helper generic error handler*/
let errFn = (err)=> {
    if (err) console.log(err);
}

/** 
 * Upload your JSON to an arbitrary endpoint
 * Body keys: endpoint (text), json (json) 
 * */
app.post('/', (req, res) => {
    if (! req.body) {
        res.status(400).send('Error: need a body');
        return
    } else if (! req.body.endpoint) {
        res.status(400).send('Error: need a body that contains an endpoint');
        return
    } else if (! req.body.json) {
        res.status(400).send('Error: need a body that contains a json');
        return
    }

    let endpoint = req.body.endpoint;
    if (endpoint[0] !== '/') {
        endpoint = '/' + endpoint
    }

    let serializedJSON = JSON.stringify(req.body.json);
    db.serialize(function() {
        let mapping = { $endpoint: endpoint, $json: serializedJSON };
        
        db.run("insert or ignore into endpoints(mock_endpoint, mock_json) values(($endpoint),($json));", mapping, errFn);
        db.run("replace into endpoints(mock_endpoint, mock_json) values(($endpoint),($json));", mapping, errFn);
    })

    console.log("POST: ", req.body)
    res.send(`saved to database: ${serializedJSON} at link "${endpoint}"`);
});

/** 
 * Retrieve a JSON from a previously updated endpoint
 * */ 
app.use(function(req, res) {
    console.log(req.url)

    db.get(`select * from endpoints where mock_endpoint = '${req.url}'`, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error");
            return
        } else {
            res.json(JSON.parse(row.mock_json))
        }
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
})