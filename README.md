# JSON Server for Testing
This minimalist server makes it easy to store and retrieve JSONs at any endpoint on your
localhost. All you need to do is post your JSON with an specified url,
then you will be able to fetch that JSON from your localhost at that url.

## Installation and Running
1. ```npm install```
2. ```npm start```
3. It will be available at ```localhost:3000/mock``` by default

## How to Use
### Uploading JSON
Send a POST request to ```localhost:3000/mock``` with the body in the following
format: 
```
{
	"endpoint": <text>,
	"json": <json>
}
```

### Retrieving JSON
GET from ```localhost:3000/mock?endpoint="your_link"```

## Conclusion
**TADAA!!! That's all!!!**

Please help me and star this if this helped you at all <(*ΦωΦ*)>
