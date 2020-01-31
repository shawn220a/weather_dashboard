$(document).ready(function() {
  const API_KEY = "ef520636f39c506ecb6d5946a35d006b";
  const units = "&units=imperial";
  const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
  const uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=";
  const forcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=";

  $('hr').hide();
  $('.fiveForecast').hide();

  $("button").click(function() {
    event.preventDefault();

    let search = $("#search").val();
    let queryURLOne = currentWeatherURL + search + "&appid=" + API_KEY + units;

    
    $('tr').empty();

    // Request the Current Forecast
    $.ajax({
      url: queryURLOne,
      method: "GET"
    }).then(response => {
      $("#cName").text(
        response.name + " " + moment().format("MMM Do YYYY")
      );
      $("#cTemp").text("Temperature: " + response.main.temp + " F");
      $("#cHumidity").text("Humidity: " + response.main.humidity + "%");
      $("#cWinds").text("Wind Speed: " + response.wind.speed + " MPH");

      let queryURLTwo =
        uvURL +
        API_KEY +
        "&lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon;
      let queryURLThree =
        forcastURL + response.id + units + "&appid=" + API_KEY;

      // Request the UV Index by Lat and Lon
      $.ajax({
        url: queryURLTwo,
        method: "GET"
      }).then(response => {
        $("#cUV").text("UV Index: " + response.value);
        $('hr').show();
      });

      //  Request the 5 day Forcast by ID
      $.ajax({
        url: queryURLThree,
        method: "GET"
      }).then(response => {
        console.log(response);
        $('.fiveForecast').show();
        const i = [0, 8, 16, 24, 32];

        $("#forecastTable").append(
            $("<tr></tr>").append(
              $("<th></th>").text('City'),
              $("<th></th>").text('Date & Time'),
              $("<th></th>").text('Image'),
              $("<th></th>").text('Temperature'),
              $("<th></th>").text('Humidity')
            )
          );

        
        for (x of i) {
          let img = $("<img>");
          img.attr("src", 'https://openweathermap.org/img/w/' +response.list[x].weather[0].icon + '.png');
          $("#forecastTable").append(
            $("<tr></tr>").append(
              $("<td></td>").append(response.city.name),
              $("<td></td>").append(response.list[x].dt_txt),
              $("<td></td>").append(img),
              $("<td></td>").append(response.list[x].main.temp + " F"),
              $("<td></td>").append(response.list[x].main.humidity + "%")
            )
          );
        }
      });
    });
  });



  $(document).on("click", ".recent-search", function() {
    alert($(this).text());
  });

});

