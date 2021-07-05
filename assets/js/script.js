$("#searchBtn").on("click", function(event) {
    var userInput = $("#search-form").val();
    event.preventDefault();

    cityLibrary.push(userInput);
    weather(userInput);
    renderCities();

    $("#five-day-content").empty();
    $("#current-icon").empty();
    $("#search-form").empty();
});

debugger;

var weather = function(userInput) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=71963ecbbbb65aaaba5406e39c2b6adb";

    $.ajax({
        url: apiUrl,
        type: "GET"
    }).then(function(response) {
        
        var tempKelvin = response.list[0].main.temp;
        var temperature = (tempKelvin - 273.15) * 1.80 + 32;

        var date = moment().format("MM/DD/YYYY");
        var humidity = response.list[0].main.humidity;
        var windSpeed = response.list[0].main.wind.speed;

        var weatherIcon = $("<img>");
            weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png");
        
            $("#current-icon").append(weatherIcon);
            $("#city-name").text(userInput + "(" + date + ")");
            $("#temp").text(temperature.toFixed(1) + "°F");
            $("#humidity").text(humidity + "%");
            $("#wind").text(windSpeed.toFixed(1) + "MPH");

        var latitude = response.city.coord.lat;
        var longitude = response.city.coord.lon;

        var coordinateURL = "https://api.openweathermap.org/data/2.5/uvi?appid=e5f561d692ee5b0d5bfef99cb764f31d&lat=" + latitude + "&lon=" + longitude;

        $.ajax({
            url: coordinateURL,
            type: "GET"
        }).then(function(uvIndex) {
            var currentUv = uvIndex.value;
            
            $("#uv-index").text(currentUv);
        });
    });

    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=71963ecbbbb65aaaba5406e39c2b6adb";

    $.ajax({
        url: forecastUrl,
        type: "GET"
    }).then(function(forecast) {
        for (i = 2; i < 40; i + 8) {
            var forecastDiv = $("<div>").attr("id", "number" + [i]).addClass("col-2 five-days");
            var weekday = forecast.list[i].dt_txt;

            weekday = weekday.slice(0, 10);
            weekday = moment(weekday).format("MM/DD/YYYY");
                $("<p>").text(weekday);

            var weekIcon = forecast.list[i].weather[0].icon;
            weekIcon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + weekIcon + ".png");

            var weekTemp = forecast.list[i].main.temp;
            var farWeekTemp = (weekTemp - 273.15) * 1.80 + 32;
            farWeekTemp = $("<p>").text("Temp: " + farWeekTemp + "°F");

            var weekHumidity = forecast.list[i].main.humidity;
            weekHumidity = $("<p>").text("Humidity: " + weekHumidity);

            var displayInfo = $(forecastDiv).append(weekday, weekIcon, farWeekTemp, weekHumidity);
                $("#five-day-content").append(displayInfo);
        };

        console.log(forecast)
    });
};

var cityLibrary = [];

var renderCities = function() {
    $("#city-storage").empty();

    for (i = 0; i < cityLibrary.length; i++) {
        var cityDiv = $("<div>").attr("id", "city" + [i]);
        var cityBtn = $("<button>").text(cityLibrary[i]).addClass("city-btn");
        var displayDiv = $(cityDiv).prepend(cityBtn);

        $("#city-storage").prepend(displayDiv);

        localStorage.setItem("key" + [i], cityLibrary[i]);
    };

    $(".city-button").on("click", function() {
        var cityInput = $(this).text;
        $("five-day-content").empty();
        $("#current-icon").empty();

        weather(cityInput);
    });
};