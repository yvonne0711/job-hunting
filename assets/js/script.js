fetch(
  "https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=" +
    adzunaApiID +
    "&app_key=" +
    adzunaApiKey
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });

//Mapbox api code, Note for coordinates it's always [long, lat] unless stated otherwise
mapboxgl.accessToken = mapboxApiKey;
const bounds = [
  [-20.292977710656487, 47.063922517628896], // Southwest coordinates
  [7.4041694390601736, 63.534042175490384], // Northeast coordinates
];

//Renders map
const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles [https://docs.mapbox.com/api/maps/styles/]
  style: "mapbox://styles/mapbox/navigation-night-v1",
  center: [-1.0147865491083536, 51.879295638075135],
  zoom: 7,
  maxBounds: bounds,
});

// toggle sidebar
function toggleSidebar(id) {
  const elem = document.getElementById(id);
  // Add or remove the 'collapsed' CSS class from the sidebar element.
  // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
  const collapsed = elem.classList.toggle("collapsed");
  const padding = {};
  // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
  padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
  // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
  map.easeTo({
    padding: padding,
    duration: 1000, // In ms. This matches the CSS transition duration property.
  });
}

map.on("load", () => {
  toggleSidebar("left");
});

//search functionality
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "gb", //limits search to the UK
    mapboxgl: mapboxgl,
  }),
  "top-left"
);
