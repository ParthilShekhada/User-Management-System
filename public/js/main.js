const submitBtn = document.getElementById('submitBtn')
const cityName = document.getElementById("cityname")
const city_name = document.getElementById("city_name")
const temp_real = document.getElementById("temp_real")
const temp_status = document.getElementById("temp_status")
const datahide = document.querySelector('.middle_layer')
const day1 = document.getElementById("day")
const today = document.getElementById("today_data")

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let currentTime = new Date();
let day = weekday[currentTime.getDay()];

var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
];

var now = new Date();
var month = months[now.getMonth() + 1];
var date = now.getDate();

day1.innerText = `${day}`
today.innerText = `${date} ${month}`


const getInfo = async (event) => {
    event.preventDefault()
    let cityVal = cityName.value
    if (cityVal === "") {
        city_name.innerText = `Plz write the name before serach`
        datahide.classList.add('data_hide')
    }
    else {
        try {
            datahide.classList.remove('data_hide')

            let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=227327ed766088223a5eeae4fececa4d`
            const response = await fetch(url)
            const data = await response.json()
            const arrData = [data]

            city_name.innerText = `${arrData[0].name},${arrData[0].sys.country}`
            temp_real.innerText = arrData[0].main.temp;
            const tempStatus = arrData[0].weather[0].main;

            if (tempStatus == "Sunny") {
                temp_status.innerHTML = "<i class='fas  fa-sun' style='color: #eccc68;'></i>";
            } else if (tempStatus == "Clouds") {
                temp_status.innerHTML = "<i class='fas  fa-cloud' style='color: #f1f2f6;'></i>";
            } else if (tempStatus == "Rainy") {
                temp_status.innerHTML = "<i class='fas  fa-cloud-rain' style='color: #a4b0be;'></i>";
            } else {
                temp_status.innerHTML = "<i class='fas  fa-cloud' style='color:#f1f2f6;'></i>";
            }


        }
        catch {
            city_name.innerText = `Plz enter the city name properly`
            datahide.classList.add('data_hide')

        }

    }
}




submitBtn.addEventListener('click', getInfo)