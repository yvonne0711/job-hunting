//modal 
//load DOM content first
document.addEventListener("DOMContentLoaded", function () {
  const apiKey1 = localStorage.getItem("adzunaApiKey");
  const apiKey2 = localStorage.getItem("adzunaApiID");
  const apiKey3 = localStorage.getItem("mapboxApiKey");

  if (!apiKey1 || !apiKey2 || !apiKey3) {
    $("#apiKeyModal").modal('show')
    // Show the API key modal if any key is not present in local storage
    $("#apiKeyModal").modal({ backdrop: 'static', keyboard: false });

    // Add an event listener for the Save API Key button in the modal
    document.getElementById("saveApiKeyButton").addEventListener("click", function () {
      // Save API keys to local storage
      saveApiKeys();

      // Check if the entered keys match the ones in api.js
      if (correctApiKeys()) {
        // Close the modal if keys are validated
        $("#apiKeyModal").modal("hide");
      } else {
          // Display an error or take appropriate action if keys don't match
          alert("Invalid API keys. Please enter valid keys.");
      }
    });
  }
});

// Function to validate API keys
function correctApiKeys() {
  const enteredApiKey1 = document.getElementById("apiKey1").value;
  const enteredApiKey2 = document.getElementById("apiKey2").value;
  const enteredApiKey3 = document.getElementById("apiKey3").value;

  // Compare entered keys with the ones in api.js
  return (
    enteredApiKey1 === adzunaApiKey &&
    enteredApiKey2 === adzunaApiID &&
    enteredApiKey3 === mapboxApiKey
  );
}

// Function to save API keys to local storage
function saveApiKeys() {
  const apiKey1 = document.getElementById("apiKey1").value;
  const apiKey2 = document.getElementById("apiKey2").value;
  const apiKey3 = document.getElementById("apiKey3").value;

  localStorage.setItem("adzunaApiKey", apiKey1);
  localStorage.setItem("adzunaApiID", apiKey2);
  localStorage.setItem("mapboxApiKey", apiKey3);
}

var citySearched;
var centerOfSearch;
var storedDistance = [0,1000];

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

var selectedCity = "";
var distanceMax = 0;
var salaryMin = 0;
var markers = [];

function fetchJobData(selectedCity , distanceMax , salaryMin) {
    clearMarkers();
fetch("https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id="+adzunaApiID+"&app_key=" +adzunaApiKey+ "&what=web%20developer&results_per_page=50&where=" + selectedCity+ "&distance=" + Number(distanceMax)+ "&salary_min=" + Number(salaryMin))
.then(function (response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(function (data) {
    // console.log(data); 
    // Process the job data and create markers on the map
    displayJobMarkers(data.results);
    
})
.catch(function (error) {
    console.error('Error fetching job data:', error);
});
    distanceMax = document.querySelector("#maxDistanceAmount").value = 0;;
    salaryMin= document.querySelector("#salaryMin").value = 0;
}

function displayJobMarkers(jobResults) {
// Clear existing markers on the map
clearMarkers();

// Loop through job results and create markers
jobResults.forEach(function (job) {
    if (job.latitude !== undefined && job.longitude !== undefined) {
        const marker = new mapboxgl.Marker()
    .setLngLat([job.longitude, job.latitude]) // Make sure to use the correct coordinates
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${job.title}</h3><p>${job.description}</p><a  target= "blank" href="${job.redirect_url}">Get More Info</a>`))
    .addTo(map); 
    markers.push(marker);       
    }

    // console.log(job.longitude, job.latitude)
});
}

// function to clear markers

function clearMarkers() {
    markers.forEach(marker => marker.remove());

    markers = [];
}



//Mapbox api code, Note for coordinates it's always [long, lat] unless stated otherwise
mapboxgl.accessToken = mapboxApiKey;
const bounds = [
  [-20.292977710656487, 47.063922517628896], // Southwest coordinates
  [7.4041694390601736, 63.534042175490384], // Northeast coordinates
];

//Renders map
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles [https://docs.mapbox.com/api/maps/styles/]
    style: 'mapbox://styles/mapbox/navigation-night-v1',
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
        $(".map-place-search").toggle("hide")
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
 // Add an event listener to the geocoder control
 const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: 'gb',
    mapboxgl: mapboxgl,
}).on('result', function({ result }) { selectedCity = result.place_name.split(",")[0] });


map.addControl(geocoder, 'top-left');

// Access the geocoder input field
const geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder--input');

// Add an event listener to detect changes in the input field
geocoderInput.addEventListener('input', function () {
    // Retrieve the current value of the input field
    var  inputValue = geocoderInput.value;
    // save the value and use it on the job api
    selectedCity = inputValue;
    
    
});

var searchBtn = document.querySelector("#search-button");

searchBtn.addEventListener("click" , function (event) {
    event.preventDefault();
    distanceMax = document.querySelector("#maxDistanceAmount").value;
    salaryMin= document.querySelector("#salaryMin").value;
    fetchJobData(selectedCity , distanceMax , salaryMin);

});



//No longer in use now in index.html in sidebar-content
// function buildSearchInputs(){
//     var $minSalaryInput = $("<input></input>")
//         .attr({type: "number", min: "0", placeholder: "Minimum salary"})
//         .addClass("mapboxgl-ctrl-input mapboxgl-ctrl--min-salary-input");

//     var $distanceSlider = $("<div>").addClass("mapboxgl-ctrl distanceSliderContainer").append(
//         $("<label style='color:white'>Distance Range</label>"),
//         $("<div class='distance-input-box-container'>").append(
//         $('<input type="text" id="minDistanceAmount" style="border:0; color:#f6931f; font-weight:bold;">'),
//         $('<input type="text" id="maxDistanceAmount" style="border:0; color:#f6931f; font-weight:bold;">')),
//         $("<div id='distanceSlider-range'></div>")
//         );
    
    
    
//     $(".sidebar-content").append(
//         $("<div>").attr({id: "mapboxgl-ctrl--job-search-filters"})
//         .addClass("mapboxgl-ctrl").append(
//             $minSalaryInput, $distanceSlider
//         ));
//     }

// buildSearchInputs();

$( function() {
    $( "#distanceSlider-range" ).slider({
      range: true,
      min: 0,
      max: 1000,
      values: [ 0, 10000 ],
      slide: function( event, ui ) {
        $( "#minDistanceAmount" ).val( ui.values[ 0 ]);
        $( "#maxDistanceAmount" ).val( ui.values[ 1 ]);
      }
    });
    $("#minDistanceAmount").val(  $( "#distanceSlider-range" ).slider( "values", 0 ));
    $("#maxDistanceAmount").val(  $( "#distanceSlider-range" ).slider( "values", 1 ));
     
  } );


//Updates the slider when a number is inputed, note: the user can currently select a minimum that is larger than the maximum 
$("#minDistanceAmount").keyup(function () { 
    $( "#distanceSlider-range" ).slider("values", 0, parseInt($(this).val()));
});

$("#maxDistanceAmount").keyup(function () { 
    $("#distanceSlider-range").slider("values", 1, parseInt($(this).val()));
});
function addKeyword(keywordInput){
    $("#keywords-input").val("");
    if( keywordInput != ""){
        var $li = $("<li>").addClass("row").append(
            $("<p>").text(keywordInput).addClass("keyword col").append(
            $("<button>").addClass("delete-keyword btn btn-danger col").text("-")) 
            );
        $("#keywords-list").prepend($li);

    }
}

$("#keywords-input").keydown(function(event){
    if(event.keyCode == 13) {
        event.preventDefault();
        addKeyword($("#keywords-input").val().trim());
        return false;
    }
})
$("#keywords-submit").on("click", function(event){
    event.preventDefault();
    addKeyword($("#keywords-input").val().trim());
    getKeywords();
})

$("#keywords-list").on("click", ".delete-keyword", function(event){
    event.preventDefault();
    $(this).closest("li").remove();
})



function createRadiusCircle(center, radiusKm){

  const metersToPixelsAtMaxZoom = (meters, latitude) =>
    meters / 0.075 / Math.cos(latitude * Math.PI / 180);

    map.addSource('radius', {
      'type': 'geojson',
      'data': {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': center,
      }
      }}
      );
     
      
      map.addLayer({
      'id': 'radius',
      'type': 'circle',
      'source': 'radius',
      'paint': {
        "circle-radius": {
          'stops': [
            [0, 0],
            [20, metersToPixelsAtMaxZoom(radiusKm*1000, center[1])]
          ],
          'base': 2
        },
      'circle-color': '#B42222',
      'circle-opacity': 0.6,
      },
      'filter': ['==', '$type', 'Point']
      });
      }

$("#search-button").on("click", function(event){
  event.preventDefault();
  if(map.getSource('radius')){
    map.removeLayer('radius');
    map.removeSource('radius');
  }
  createRadiusCircle(centerOfSearch ,$("#maxDistanceAmount").val());
});

geocoder.on('result', function(e) {
   citySearched = e.result.place_name;
   centerOfSearch = e.result.center;
   

})

function getKeywords(){
  var array = [];
  $("#keywords-list").children('li').each(function(){
    array.push($(this).children('p').text().slice(0, -1));
  });
  return array;
}

$("#search-button").on("click", function(event){
  event.preventDefault();
  var storageObj = {
    "placeName": citySearched,
    "centerOfPlace": centerOfSearch,
    "minSalary": $(".min-salary-input").val(),
    "minDistance": $("#minDistanceAmount").val(),
    "maxDistance": $("#maxDistanceAmount").val(),
    "keywords": JSON.stringify(getKeywords()),
  }
  localStorage.setItem("searchSettings", JSON.stringify(storageObj));
});

function getStoredSearchSettings() {  
  var obj = localStorage.getItem("searchSettings");
  obj = JSON.parse(obj);
  obj.keywords = JSON.parse(obj.keywords);
  geocoder.setInput(obj.placeName);
  $(".min-salary-input").val(obj.minSalary);
  storedDistance = [obj.minDistance, obj.maxDistance];
  $("#minDistanceAmount").val(obj.minDistance);
  $("#maxDistanceAmount").val(obj.maxDistance);
  obj.keywords.reverse().forEach(function(keyword){
    addKeyword(keyword);
  });
}


$( function() {
  $( "#distanceSlider-range" ).slider({
    range: true,
    min: 0,
    max: 1000,
    values: [ storedDistance[0], storedDistance[1]],
    slide: function( event, ui ) {
      $( "#minDistanceAmount" ).val( ui.values[ 0 ]);
      $( "#maxDistanceAmount" ).val( ui.values[ 1 ]);
    }
  });
  $("#minDistanceAmount").val(  $( "#distanceSlider-range" ).slider( "values", 0 ));
  $("#maxDistanceAmount").val(  $( "#distanceSlider-range" ).slider( "values", 1 ));
   
} );

getStoredSearchSettings();
