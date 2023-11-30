fetch("https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id="+adzunaApiID+"&app_key=" +adzunaApiKey)
.then(function(response){
    return response.json()
}).then(function(data){
    console.log(data);
})



//Mapbox api code, Note for coordinates it's always [long, lat] unless stated otherwise
mapboxgl.accessToken = mapboxApiKey;
const bounds = [
    [-20.292977710656487, 47.063922517628896], // Southwest coordinates
    [7.4041694390601736, 63.534042175490384,],  // Northeast coordinates
];

//Renders map 
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles [https://docs.mapbox.com/api/maps/styles/]
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [ -1.0147865491083536, 51.879295638075135],
    zoom: 7,
    maxBounds: bounds,
    });

  
//search functionality
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: 'gb', //limits search to the UK
        mapboxgl: mapboxgl,
    }
    ), 'top-left');

