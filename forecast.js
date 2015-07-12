
function printError(error) {
	msg = msg || "";
	console.log(error.message);
}

function forecast(zipcode) {
	var https = require("https");
	var googleApiKey = "AIzaSyCnUPwiA1UP0Fkpyhxx35R98SFBLttjAUQ";
	var geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?&components=postal_code:" + zipcode + "&key="+googleApiKey;

	https.get(geocodeUrl, function(geoResponse) {
		var geoData = "";
		var locationAddr = "";
		
		geoResponse.on("data", function(geoChunk) {
			geoData += geoChunk;
		});

		geoResponse.on("end", function() {
			geoData = JSON.parse(geoData);
		
			if (geoData.results.length) {
				var result = geoData.results[0],
					latitude = result.geometry.location.lat,
					longitude = result.geometry.location.lng,
					forecastApiKey = "0769bb85eabe49280f54916b58a2cc74", // forecast.io api key
					forecastUrl = "https://api.forecast.io/forecast/"+ forecastApiKey + "/" + latitude+","+ longitude;

				locationAddr = result.formatted_address;

				https.get(forecastUrl, function(forecastResponse) {
					var forecastData = "";

					forecastResponse.on("data", function(forecastChunk) {
						forecastData += forecastChunk;
					});

					forecastResponse.on("end", function() {
						forecastData = JSON.parse(forecastData);
						console.log("The temperature at " + locationAddr + " is " + forecastData.currently.temperature + " Fahrenheit");
					});

					forecastResponse.on("error", printError);
				});
			} else {
				printError({message: "Invalid zipcode or postal code"});
			}
		});

		geoResponse.on("error", printError);
	});
}


(function() {
	var zipcodes = process.argv.slice(2);
	if (zipcodes.length > 0) {
		zipcodes.forEach(forecast);
	} else {
		printError({message: "Insufficient data: zipcode or postal code missing."});
	}
})();
