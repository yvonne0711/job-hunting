// modal 
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
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: 'gb', //limits search to the UK
    mapboxgl: mapboxgl,
})
map.addControl(geocoder, 'top-left');
$(".mapboxgl-ctrl-geocoder").addClass("map-place-search");


$(".job-search-filters").prepend(geocoder.onAdd(map));
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
function addKeyword(){
    var keywordInput = $("#keywords-input").val().trim()
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
        addKeyword();
        return false;
    }
})
$("#keywords-submit").on("click", function(event){
    event.preventDefault();
    addKeyword();
})

$("#keywords-list").on("click", ".delete-keyword", function(event){
    event.preventDefault();
    $(this).closest("li").remove();
})


