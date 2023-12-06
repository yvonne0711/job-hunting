var selectedCity = "";

// + "&distance=" + distanceMax+ "&salary_min=" + salaryMin
function fetchJobData(selectedCity) {
fetch("https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id="+adzunaApiID+"&app_key=" +adzunaApiKey+ "&what=web%20developer&where=" + selectedCity)
.then(function (response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(function (data) {
    console.log(data); 
    // Process the job data and create markers on the map
    displayJobMarkers(data.results);
    
})
.catch(function (error) {
    console.error('Error fetching job data:', error);
});
}

function displayJobMarkers(jobResults) {
// Clear existing markers on the map


// Loop through job results and create markers
jobResults.forEach(function (job) {
const marker = new mapboxgl.Marker()
    .setLngLat([~~job.longitude, ~~job.latitude]) // Make sure to use the correct coordinates
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${job.title}</h3><p>${job.description}</p>`))
    .addTo(map);
    console.log(job.longitude, job.latitude)
});
}




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
    center: [-1.0147865491083536, 51.879295638075135],
    zoom: 7,
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

        // to work on
    // function openNav() {
    //     document.getElementById("mySidebar").style.width = "250px";
    //     document.getElementById("main").style.marginLeft = "250px";
    //   }
      
    //   function closeNav() {
    //     document.getElementById("mySidebar").style.width = "0";
    //     document.getElementById("main").style.marginLeft= "0";
    //   }
  
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

var searchBtn = document.querySelector("#search");

searchBtn.addEventListener("click" , function (event) {
    event.preventDefault();
    fetchJobData(selectedCity);

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
      max: 10000,
      values: [ 0, 0 ],
      slide: function( event, ui ) {
        $( "#minDistanceAmount" ).val( ui.values[ 0 ]);
        $( "#maxDistanceAmount" ).val( ui.values[ 1 ]);
      }
    });
    $( "#distanceAmount" ).val(  $( "#distanceSlider-range" ).slider( "values", 0 ) +
      $( "#distanceSlider-range" ).slider( "values", 1 ) );
  } );


//Updates the slider when a number is inputed, note: the user can currently select a minimum that is larger than the maximum 
$("#minDistanceAmount").keyup(function () { 
    $( "#distanceSlider-range" ).slider("values", 0, parseInt($(this).val()));
});

$("#maxDistanceAmount").keyup(function () { 
    $( "#distanceSlider-range" ).slider("values", 1, parseInt($(this).val()));
});

