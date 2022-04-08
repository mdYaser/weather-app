const weather = {
	apiKey: "110a5097ce578f50917747cc5cb1d930",
	baseUrl: "https://api.openweathermap.org/data/2.5/weather?",
};

const bg = {
	accessKey: "8kzVbMFvNeNLvZHXYrHDx7tRopJ8jn6RVnyoauq-1xk",
	baseUrl: "https://api.unsplash.com/search/photos",
};

const mapIcon = {
	"01d": "fa-sun",
	"01n": "fa-moon",
	"02d": "fa-cloud-sun",
	"02n": "fa-cloud-moon",
	"03d": "fa-cloud",
	"03n": "fa-cloud",
	"04d": "fa-cloud-meatball",
	"04n": "fa-cloud-meatball",
	"09d": "fa-cloud-rain",
	"09n": "fa-cloud-rain",
	"10d": "fa-cloud-sun-rain",
	"10n": "fa-cloud-moon-rain",
	"11d": "fa-cloud-bolt",
	"11n": "fa-cloud-bolt",
	"13d": "fa-snowflake",
	"13n": "fa-snowflake",
	"50d": "fa-smog",
	"50n": "fa-smog",
};

const months = [
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
const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const containerEle = document.querySelector(".container");
const locationEle = document.querySelector(".location");
const dateEle = document.querySelector(".date");
const tempEle = document.querySelector(".temp");
const detailEle = document.querySelector(".detail");
const humidityEle = document.querySelector(".humidity");
const windEle = document.querySelector(".wind");
const feelsEle = document.querySelector(".feels-like");
const pressEle = document.querySelector(".pressure");
const iconEle = document.querySelector(".temp-container i");
const inputEle = document.querySelector(".search");
const searchEle = document.querySelector(".input-container i");
const totalWidth = document.body.clientWidth;

function showPosition(position) {
	getWeatherData(true, position);
}

function getWeatherData(isPosition, data) {
	let currUrl = weather.baseUrl + "units=metric&appid=" + weather.apiKey;
	if (isPosition) {
		currUrl += "&lat=" + data.coords.latitude + "&lon=" + data.coords.longitude;
	} else {
		currUrl += "&q=" + data;
	}
	fetch(currUrl)
		.then((res) => res.json())
		.then((res) => {
			locationEle.innerText = res.name;
			const d = new Date();
			dateEle.innerText =
				d.getDate() + " " + months[d.getMonth()] + " " + weeks[d.getDay()];
			tempEle.innerText = Math.round(res.main.temp);
			detailEle.innerText = res.weather[0].description;
			humidityEle.innerText =
				"Humidity: " + Math.round(res.main.humidity) + "%";
			windEle.innerText = "Wind: " + res.wind.speed + "km/h";
			feelsEle.innerText = "Feels like: " + res.main.feels_like + "°C";
			pressEle.innerText = "Pressure: " + res.main.pressure + "hPa";

			// Icon
			iconEle.className = "";
			iconEle.classList.add("fa-solid");
			iconEle.classList.add(mapIcon[res.weather[0].icon]);

			return res.weather[0].description;
		})
		.then((res) => {
			fetch(
				`${bg.baseUrl}?client_id=${bg.accessKey}&query=${res}&orientation=landscape`
			)
				.then((res) => res.json())
				.then((res) => {
					const imgLink = res.results[Math.floor(Math.random() * 11)].urls.raw;
					containerEle.style.background = `url("${imgLink}&w=${totalWidth}")`;
				});
		});
}
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert("Unable to find the location!");
	}
}
getLocation();

const fetchForCity = (city) => {
	getWeatherData(false, city);
};

searchEle.addEventListener("click", function () {
	if (inputEle.value) {
		fetchForCity(inputEle.value);
	}
});

inputEle.addEventListener("keyup", function (e) {
	if (e.keyCode === 13) {
		e.preventDefault();
		searchEle.click();
	}
});
