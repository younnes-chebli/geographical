import * as dotenv from "dotenv";
import mapboxgl from "mapbox-gl";

dotenv.config();
const MAPBOX_KEY = process.env.MAPBOX_KEY;
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

const addressForm = document.getElementById("address-form");
const weatherMessage = document.getElementById("weather-message");
weatherMessage.style.visibility = "hidden";

const getTemperature = async (coordinates) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=${OPEN_WEATHER_KEY}&units=metric`)
    const responseJSON = await response.json();
    const temperature = responseJSON.list[0].main.temp;
    return temperature;
};

const getCoordinates = async (address) => {
    try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?types=address&access_token=${MAPBOX_KEY}`);
        const data = await response.json();
        const coordianates = data.features[0].center;
        return coordianates;
    } catch (err) {
        console.log(err);
    }
};

const isset = (string) => {
    return string != "";
};

const displayMap = (coordinates, temperature) => {
    mapboxgl.accessToken = MAPBOX_KEY;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        zoom: 15,
        projection: 'globe',
    });

    const popup = new mapboxgl.Popup({ offset: 25})
        .setText(`Température: ${temperature}°C`);

    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
    
    map.on('style.load', () => {
        map.setFog({});
    });
};

addressForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const address = data.get("address");
    if(isset(address)) {
        weatherMessage.style.visibility = "visible";
        const coordinates = await getCoordinates(address);
        const temperature = await getTemperature(coordinates);
        displayMap(coordinates, temperature);
    }
});