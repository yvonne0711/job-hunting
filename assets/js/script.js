fetch("https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id="+adzunaApiID+"&app_key=" +adzunaApiKey)
.then(function(response){
    return response.json()
}).then(function(data){
    console.log(data);
})
mapboxgl.accessToken = mapboxApiKey;
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [0, 0],
    zoom: 0.4,
    projection: 'naturalEarth' // starting projection
    });
