//Time variables
var NowMoment = moment();
var currentDate = NowMoment.format(' M / D / YYYY ');

//Api key for google maps
var apikeygoogle = 'AIzaSyCUhLVjRWl_hRcOuGutBWR_QwLWLQJWaSA';
$('#apartment').hide();
$('#school').hide();
$('#weatherDiv').hide();

//Api key for both mapquest apis
var apikeymapquest = 'wkAXQtPfXHFVQVVsUyUHn1VONKEaiGuR';

// function that runs once submit button is engaged
function submitFunction() {
	event.preventDefault();
	let city = document.getElementById('city-input').value;
	// setting API Key for specific query
	var apiKey = '&appid=95cf54f7d36ce72c2810b5fda5b06674';
	//  setting query URL for five day forecast
	var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + apiKey;

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).then(function(response) {
		// setting lat and lon variables so that we can call the currentQueryURL
		var lat = response.city.coord.lat;
		var lon = response.city.coord.lon;
		// setting current queryURL, retrieves today's data and next 7 days
		var currentQueryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + apiKey;
		// requesting the JSON object for the current data and next 7 days
		$.ajax({
			url: currentQueryURL,
			method: 'GET'
		}).then(function(weatherResponse) {
			$('#weather').html('');

			let icon = weatherResponse.current.weather[0].icon;
			// converting the data for ICON to an image
			let iconIMG = '<img src=http://openweathermap.org/img/w/' + icon + '.png>';

			// retrieve results for City, current date and icon append to the appropriate div
			let nameDateIcon = $('<div>').html(response.city.name + currentDate + iconIMG);
			$('#weather').append(nameDateIcon);

			var tempF = (weatherResponse.current.temp - 273.15) * 1.8 + 32;
			let tempDiv = $('<div>').html('Temp (F): ' + tempF.toFixed(1));
			$('#weather').append(tempDiv);

			let humidity = weatherResponse.current.humidity;
			let humidityDiv = $('<div>').html('Humidity: ' + humidity + '%');
			$('#weather').append(humidityDiv);

			// set current tempF variable to the results of the conversion of the kalvin within the object
			// apply termerature text to html
			// $("#weather").text("Temperature (F) " + tempF.toFixed(1));

			function timeConverter(timestamp, option) {
				var a = new Date(timestamp * 1000);
				var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
				var year = a.getFullYear();
				var month = months[a.getMonth()];
				var date = a.getDate();
				var hour = a.getHours();
				var min = a.getMinutes().toString();
				min = min.padStart(2, '0');
				const formatDate = date + ' ' + month + ' ' + year;
				const formatTime = hour + ':' + min;

				console.log(typeof formatTime);
				if (option === 'time') {
					return formatTime;
				}
				if (option === 'date') {
					return formatDate;
				}

				return {
					date: formatDate,
					time: formatTime
				};
			}
			console.log(timeConverter(weatherResponse.current.sunrise, 'time'));
			console.log(timeConverter(weatherResponse.current.sunset, 'time'));
			let sunrise = timeConverter(weatherResponse.current.sunrise, 'time');
			let sunset = timeConverter(weatherResponse.current.sunset, 'time');
			let sunriseDiv = $('<div>').html('Sunrise: ' + sunrise);
			$('#weather').append(sunriseDiv);

			let sunsetDiv = $('<div>').html('Sunset: ' + sunset);
			$('#weather').append(sunsetDiv);
		});
	});

	// ajax request from mapquest for list of apartments in the search area
	$.ajax({
		url:
			'https://www.mapquestapi.com/search/v2/radius?origin=' +
			city +
			'&radius=15&maxMatches=3&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|651303&outFormat=json&key=' +
			apikeymapquest,
		method: 'GET'
	}).then(function(response) {
		console.log(response);
		let htmlbox2 = document.getElementById('content');
		let htmlBox2Content = '';

		for (let i = 0; i < 3; i++) {
			let apartment = response.searchResults[i].name;
			let address = response.searchResults[i].fields.address;
			let city = response.searchResults[i].fields.city;
			htmlBox2Content +=
				'<p>Name: ' + apartment + '</p><br><p>Address: ' + address + ' City: ' + city + '</p><br>';
		}
		// showing content of each block in html format
		htmlbox2.innerHTML = htmlBox2Content;
	});

	//ajax request from mapquest for list of schools in the search area
	$.ajax({
		url:
			'https://www.mapquestapi.com/search/v2/radius?origin=' +
			city +
			'&radius=20&maxMatches=10&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|821103&outFormat=json&key=' +
			apikeymapquest,
		method: 'GET'
	}).then(function(response) {
		let htmlbox = document.getElementById('content1');
		let htmlBoxContent = '';

		for (let i = 0; i < 3; i++) {
			let school = response.searchResults[i].name;
			let schooladdress = response.searchResults[i].fields.address;
			let schoolcity = response.searchResults[i].fields.city;
			htmlBoxContent +=
				'<p>Name: ' + school + '</p><br><p>Address: ' + schooladdress + ' City: ' + schoolcity + '</p><br>';
		}
		// showing content of each block in html format
		htmlbox.innerHTML = htmlBoxContent;

		// update google map based on the city geo locations from the api call.
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: response.origin.latLng.lat,
				lng: response.origin.latLng.lng
			},
			zoom: 10
		});
	});
}

// initial geo location for map (Durham)

let lat = 36.008727;
let lng = -78.943908;

//function to run google maps based on latitude/longitude
(function(exports) {
	'use strict';
	function initMap() {
		exports.map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: lat,
				lng: lng
			},
			zoom: 10
		});
	}
	exports.initMap = initMap;
})((this.window = this.window || {}));

//onclick function for housing market
$('#housingMrkt').on('click', displayHousing);
function displayHousing(event) {
	event.preventDefault();
	$('#apartment').show();
	$('#weatherDiv').hide();
	$('#school').hide();
}

//onclick function for school district
$('#schoolDist').on('click', displaySchools);
function displaySchools(event) {
	event.preventDefault();
	$('#school').show();
	$('#weatherDiv').hide();
	$('#apartment').hide();
}

//onclick function for weather forcast
$('#weatherForecast').on('click', displayWeather);
function displayWeather(event) {
	event.preventDefault();
	$('#weatherDiv').show();
	$('#school').hide();
	$('#apartment').hide();
}
