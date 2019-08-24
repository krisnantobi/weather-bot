const Express = require('express');
const bodyParser = require('body-parser');
const app = Express();

const Request = require('request');


app.use(
	bodyParser.urlencoded({
		extended:true
	})
);
app.use(bodyParser.json());

var path = require('path');

var server = require('http').createServer(app);

function send(res, status, data){
	res.set({
	  'Content-Type': 'application/json',
	  'Content-Length': '123'
	});
	res.status(status)
	res.send(
		{
		  "fulfillmentText": "This is a text response",
		  "fulfillmentMessages": [
		    {
		      "card": {
		        "title": "card title",
		        "subtitle": "card text",
		        "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
		        "buttons": [
		          {
		            "text": "button text",
		            "postback": "https://assistant.google.com/"
		          }
		        ]
		      }
		    }
		  ],
		  "source": "example.com",
		  "payload": {
		    "google": {
		      "expectUserResponse": true,
		      "richResponse": {
		        "items": [
		          {
		            "simpleResponse": {
		              "textToSpeech": "this is a simple response"
		            }
		          }
		        ]
		      }
		    },
		    "facebook": {
		      "text": "Hello, Facebook!"
		    },
		    "slack": {
		      "text": "This is a text response for Slack."
		    }
		  },
		  "outputContexts": [
		    {
		      "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/context name",
		      "lifespanCount": 5,
		      "parameters": {
		        "param": "param value"
		      }
		    }
		  ],
		  "followupEventInput": {
		    "name": "event name",
		    "languageCode": "en-US",
		    "parameters": {
		      "param": "param value"
		    }
		  }
		}
	)
}

var apiKey = "dd7727afe45c8e8f7e7a9bd7774de6ad";
var url = "https://api.openweathermap.org/data/2.5/weather?q=";



app.post('/weather', function(req, res){
	var city = req.body.queryResult.parameters.city;
	Request.get(url + city +"&appid="+apiKey, function(err, resp, body){
		var body = JSON.parse(body);

		var temp = (body.main.temp - 273.15).toFixed(2);
		switch (body.weather[0].main) {
			case "Clear":
			var clouds = "Cerah";
				break;
			case "Rain":
			var clouds = "Hujan";
				break;
			case "Snow":
			var clouds = "Salju";
				break;
			case "Extreme":
			var clouds = "Extrim";
				break;
			case "Clouds":
			var clouds = "Mendung";
				break;
			default:
			var clouds = body.weather.main;
				break;
		}

		var text = "Hi, kris. Cuaca di "+body.name+" sekarang sedang "+clouds+". Dengan Suhu "+temp+" Celcius.";
		send(res, 200, text);
	});	
});

//Server listening
app.listen(process.env.PORT || 4000,() =>{
  console.log('Server started on port '+process.env.PORT);
});
