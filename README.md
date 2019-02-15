# Mock JSON Server
This minimalist server makes it easy to store and retrieve JSONs at any endpoint on your
localhost. All you need to do is post your JSON with an specified url,
then you will be able to fetch that JSON from your localhost at that url.

## Installation and Running
1. ```npm install```
2. ```npm start```

## How to Use
### Uploading JSON
Send a POST request to ```localhost:3000/``` with the body in the following
format: 
```
{
	"endpoint": <text>,
	"json": <json>
}
```

### Retrieving JSON
GET from ```localhost:3000/your/link"```

## Conclusion
**TADAA!!! That's all!!!**
