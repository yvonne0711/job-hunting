fetch("https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id="+adzunaApiID+"&app_key=" +adzunaApiKey)
.then(function(response){
    return response.json()
}).then(function(data){
    console.log(data);
})


//Mapbox api code, Note for coordinates it's always [long, lat]
mapboxgl.accessToken = mapboxApiKey;
const bounds = [
    [-11.597796819294665, 49.6674427790888], // Southwest coordinates
    [1.6745909020453322, 60.88683897281768] // Northeast coordinates
    ];

const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [-2.5420163811789536, 54.93314456712494],
    zoom: 7,
    projection: 'naturalEarth', // starting projection
    maxBounds: bounds,
    });

    function toggleSidebar(id) {
        const elem = document.getElementById(id);
        // Add or remove the 'collapsed' CSS class from the sidebar element.
        // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
        const collapsed = elem.classList.toggle('collapsed');
        const padding = {};
        // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
        padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
        // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
        map.easeTo({
        padding: padding,
        duration: 1000 // In ms. This matches the CSS transition duration property.
        });
        }
         
        map.on('load', () => {
        toggleSidebar('left');
        });
