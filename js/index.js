$(document).ready(function() {



});

$("#form").submit(function(event) {
	event.preventDefault();

	var address = $("#address").val();
	var city = $("#city").val();
	var state = $("#state").val();
	var zip = $("#zip").val();

	getWeather(city, state, zip);

	// hide form
	$("#form").toggle(function() {
		$("#title").append(address + ", " + city + ", " + state + ", " + zip + ":");
	
		// show results div
		$("#results").toggle();
	});

});



function getWeather(city, state, zip) {
	// GET WEATHER FROM API
	$.get("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&APPID=61ed99bc6d6296086845054ce0c24986")
		.done(function(data) {
			var tempCurrent = JSON.stringify(data.main.temp);
			var tempHigh = JSON.stringify(data.main.temp_max);
			var tempLow = JSON.stringify(data.main.temp_min);
			$("#temp-current").append(tempCurrent);			
			$("#temp-high").append(tempHigh);
			$("#temp-low").append(tempLow);

		})
		.fail(function(xhr) {
			console.log('error', xhr)
	});

};