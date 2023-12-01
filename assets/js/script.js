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
    center: [-1.0147865491083536, 51.879295638075135],
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


function buildSearchInputs(){
    var $minSalaryInput = $("<input></input>")
        .attr({type: "number", min: "0", placeholder: "Minimum salary"})
        .addClass("mapboxgl-ctrl-input mapboxgl-ctrl--min-salary-input");

    var $distanceSlider = $("<div>").addClass("mapboxgl-ctrl distanceSliderContainer").append(
        $("<label style='color:white'>Distance Range</label>"),
        $("<div class='distance-input-box-container'>").append(
        $('<input type="text" id="minDistanceAmount" style="border:0; color:#f6931f; font-weight:bold;">'),
        $('<input type="text" id="maxDistanceAmount" style="border:0; color:#f6931f; font-weight:bold;">')),
        $("<div id='distanceSlider-range'></div>")
        );
    
    
    
    $(".mapboxgl-ctrl-top-left").append(
        $("<div>").addClass("mapboxgl-ctrl mapboxgl-ctrl--job-search-filters").append(
            $minSalaryInput, $distanceSlider
        ));
    }

buildSearchInputs();
$( function() {
    $( "#distanceSlider-range" ).slider({
      range: true,
      min: 0,
      max: 10000,
      values: [ 0, 0 ],
      slide: function( event, ui ) {
        $( "#minDistanceAmount" ).val( ui.values[ 0 ] + " km");
        $( "#maxDistanceAmount" ).val( ui.values[ 1 ] + " km");
      }
    });
    $( "#distanceAmount" ).val(  $( "#distanceSlider-range" ).slider( "values", 0 ) +
      " km -" + $( "#distanceSlider-range" ).slider( "values", 1 ) + " km" );
  } );


//Updates the slider when a number is inputed, note: the user can currently select a minimum that is larger than the maximum 
$("#minDistanceAmount").keyup(function () { 
    $( "#distanceSlider-range" ).slider("values", 0, parseInt($(this).val()));
});

$("#maxDistanceAmount").keyup(function () { 
    $( "#distanceSlider-range" ).slider("values", 1, parseInt($(this).val()));
});
 