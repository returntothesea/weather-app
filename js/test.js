$(document).ready(function() {

	getWeather(95404);

});

function getWeather(zip) {
	// Check chache database first
	$.get("http://localhost:3000/weather_calls?zip=" + zip)
		.done(function(data) {

			// If the data exists in the cache database
			if (data) {
				// If the data is more than 30 mins old
				if (expired(data.updated_at)) {
					console.log("data in cache is expired, getting from weather api");
					// Get data from the weather api and push it to the cache db
					getFromWeatherApi(zip, "update", data.id);
				} else {
					console.log("data in cache is not expired");
					// Otherwise just use data from cache
					pushDataToDOM(JSON.parse(data.response));
				}
			} else {
				console.log("data doesn't exist in cache yet, getting from weather api");
				// GET FROM WEATHER API AND CREATE IN CACHE
				getFromWeatherApi(zip, "create");
			}
		});
};


function getFromWeatherApi(zip, flag, id=0) {
	console.log(flag);
	console.log("getting info for " + zip + " from weather api")
	$.get("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&APPID=61ed99bc6d6296086845054ce0c24986")
		.done(function(data) {
			console.log(data);
			// UPDATE DOM FROM DATA
			pushDataToDOM(data);

			if (flag == "create") {
				console.log("creating new cache entry");
				$.post("http://localhost:3000/weather_calls?zip=" + zip, {response: JSON.stringify(data)});
			}
			if (flag == "update") {
				console.log("patching cache entry");
				$.ajax({
					url: "http://localhost:3000/weather_calls/" + id,
					data: {response: JSON.stringify(data)},
					type: "PATCH"
				});
			}
		});
};

function pushDataToDOM(data) {
	console.log(data);
	$("#temp-current").append(JSON.stringify(data.main.temp));
	$("#temp-high").append(JSON.stringify(data.main.temp_max));
	$("#temp-low").append(JSON.stringify(data.main.temp_min));
};


// Takes the string format of a date from db query and parses it to Date,
// then subtracts it from the time now
function expired(dateString) {
	var updated = new Date(Date.parse(dateString));
	var now = new Date();

	console.log(now - updated);
	// if the time now less the timestamp of the cache's latest update is greater than
	// 1800000 aka 30 mins, return true
	if ((now - updated) > 1800000) {
		return true;
	}

	return false;
};