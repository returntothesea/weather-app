$(document).ready(function() {

	$("#form").submit(function(event) {
		event.preventDefault();

		var address = $("#address").val();
		var city = $("#city").val();
		var state = $("#state").val();
		var zip = $("#zip").val();

		getWeather(zip);

		// hide form
		$("#form-container").toggle(function() {
			$("#title").append(address + ", " + city + ", " + state + ", " + zip + ":");
		
			// show results div
			$("#results").toggle();
		});


	});

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
					// And set the notification for using cached data to visible.
					$("#cached").show();
				}
			} else {
				console.log("data doesn't exist in cache yet, getting from weather api");
				// Get data from weather api and create in cache
				getFromWeatherApi(zip, "create");
			}
		});
};


function getFromWeatherApi(zip, flag, id=0) {
	$.get("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&APPID=61ed99bc6d6296086845054ce0c24986")
		.done(function(data) {
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
		})
		.fail(function(error) {
			console.log(error);
		});
};

function pushDataToDOM(data) {
	$("#description").append(JSON.stringify(data.weather[0].description).replace(/"/g, ""));
	$("#temp-current").append(JSON.stringify(data.main.temp) + " F");
};


// Takes the string format of a date from db query and parses it to Date,
// then subtracts it from the time now
function expired(dateString) {
	var updated = new Date(Date.parse(dateString));
	var now = new Date();

	// if the time now less the timestamp of the cache's latest update is greater than
	// 1800000 aka 30 mins, return true
	if ((now - updated) > 1800000) {
		return true;
	}

	return false;
};