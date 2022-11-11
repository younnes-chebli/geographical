import * as dotenv from "dotenv"
dotenv.config()
const MAPBOX_KEY = process.env.MAPBOX_KEY

const addressForm = document.getElementById("address-form")

const getCoordinates = async (address) => {
    try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?types=address&access_token=${MAPBOX_KEY}`)
        const data = await response.json()
        const coordianates = data.features[0].center
        return coordianates
    } catch (err) {
        console.log(err)
    }
}

const isset = (string) => {
    return string != ""
}

const displayMap = (coordinates) => {
    mapboxgl.accessToken = MAPBOX_KEY
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        zoom: 15,
        projection: 'globe',
    })

    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
    
    map.on('style.load', () => {
        map.setFog({})
    })
}

addressForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const address = data.get("address")
    if(isset(address)) {
        const coordinates = await getCoordinates(address)
        displayMap(coordinates)
    }
})