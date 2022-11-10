import * as dotenv from "dotenv";
dotenv.config();
const MAPBOX_KEY = process.env.MAPBOX_KEY;

const addressForm = document.getElementById("address-form");

const getCoordinates = async (address) => {
    try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?types=address&access_token=${MAPBOX_KEY}`);
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }
};

addressForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const address = data.get("address");
    const coordinates = await getCoordinates(address);
});