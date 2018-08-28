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
	$("#form").toggle();

	$("title").append(address, ", ", city, ", ", state, ", ", zip, ":");


	// show results div
	$("#results").toggle();

});



function getWeather(city, state, zip) {
	// GET WEATHER FROM API
	console.log('get weather from api');
}