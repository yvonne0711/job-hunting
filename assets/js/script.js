fetch("https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id="+adzunaApiID+"&app_key=" +adzunaApiKey)
.then(function(response){
    return response.json()
}).then(function(data){
    console.log(data);
})



//Mapbox api code, Note for coordinates it's always [long, lat] unless stated otherwise
mapboxgl.accessToken = mapboxApiKey;
const bounds = [
    [-11.597796819294665, 49.6674427790888], // Southwest coordinates
    [1.6745909020453322, 60.88683897281768] // Northeast coordinates
    ];

//Renders map 
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles [https://docs.mapbox.com/api/maps/styles/]
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [-2.5420163811789536, 54.93314456712494],
    zoom: 7,
    maxBounds: bounds,
    });

   
//search functionality
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: 'gb', //limits search to the UK
        mapboxgl: mapboxgl
    }
    ));

