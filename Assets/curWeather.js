var NowMoment = moment();
var currentDate = NowMoment.format(" M / D / YYYY ");

function submitFunction1() {
  event.preventDefault();
  let city = document.getElementById("city-input").value;

  // setting API Key for specific query
  var apiKey = "&appid=95cf54f7d36ce72c2810b5fda5b06674";
  //  setting query URL for five day forecast
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    // setting lat and lon variables to that we can call the currentQueryURL
    var lat = response.city.coord.lat;
    var lon = response.city.coord.lon;
    // setting current queryURL, retrieves today's data and next 7 days
    var currentQueryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      apiKey;
    // requesting the JSON object for the current data and next 7 days
    $.ajax({
      url: currentQueryURL,
      method: "GET",
    }).then(function (weatherResponse) {
      console.log(weatherResponse);
      let htmlWeather = $("#weather");
      let htmlWeatherContent = "";

      let icon = weatherResponse.current.weather[0].icon;
      // converting the data for ICON to an image
      let iconIMG =
        "<img src=http://openweathermap.org/img/w/" + icon + ".png>";
      // retrieve results for City, current date and icon append to the appropriate div

      let nameDateIcon = $("<div>").html(
        response.city.name + currentDate + iconIMG
      );
      $("#weather").append(nameDateIcon);

      var tempF = (weatherResponse.current.temp - 273.15) * 1.8 + 32;
      let tempDiv = $("<div>").html("Temp (F): " + tempF.toFixed(1));
      $("#weather").append(tempDiv);

      let humidity = weatherResponse.current.humidity;
      let humidityDiv = $("<div>").html("Humidity: " + humidity + "%");
      $("#weather").append(humidityDiv);

      // set current tempF variable to the results of the conversion of the kalvin within the object
      // apply termerature text to html
      // $("#weather").text("Temperature (F) " + tempF.toFixed(1));

      function timeConverter(timestamp, option) {
        var a = new Date(timestamp * 1000);
        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes().toString();
        min = min.padStart(2, "0");
        const formatDate = date + " " + month + " " + year;
        const formatTime = hour + ":" + min;

        console.log(typeof formatTime);
        if (option === "time") {
          return formatTime;
        }
        if (option === "date") {
          return formatDate;
        }

        return {
          date: formatDate,
          time: formatTime,
        };
      }
      console.log(timeConverter(weatherResponse.current.sunrise, "time"));
      console.log(timeConverter(weatherResponse.current.sunset, "time"));
      let sunrise = timeConverter(weatherResponse.current.sunrise, "time");
      let sunset = timeConverter(weatherResponse.current.sunset, "time");
      let sunriseDiv = $("<div>").html("Sunrise: " + sunrise);
      $("#weather").append(sunriseDiv);

      let sunsetDiv = $("<div>").html("Sunset: " + sunset);
      $("#weather").append(sunsetDiv);
    });
  });
}
