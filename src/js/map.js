/*
-------------------------
Global variables
-------------------------
*/

var map;
var innerHTML = '';

var markers = [];
var largeInfowindow;

// This global polygon variable is to ensure only ONE polygon is rendered.
var polygon = null;

function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13,
        styles: styles
    });

    largeInfowindow = new google.maps.InfoWindow();
    var viewModel = new ViewModel;

    // Initialize the drawing manager.
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });

    if (drawingManager.map) {
        drawingManager.setMap(null);
        // In case the user drew anything, get rid of the polygon
        if (polygon !== null) {
            polygon.setMap(null);
        }
    } else {
        drawingManager.setMap(map);
    }

    // Add an event listener so that the polygon is captured,  call the
    // searchWithinPolygon function. This will show the markers in the polygon,
    // and hide any outside of it.
    drawingManager.addListener('overlaycomplete', function(event) {
        // First, check if there is an existing polygon.
        // If there is, get rid of it and remove the markers
        if (polygon) {
            polygon.setMap(null);
            hideMarkers(markers);
        }
        // Switching the drawing mode to the HAND (i.e., no longer drawing).
        drawingManager.setDrawingMode(null);
        // Creating a new editable polygon from the overlay.
        polygon = event.overlay;
        polygon.setEditable(true);
        // Searching within the polygon.
        searchWithinPolygon();
        // Make sure the search is re-done if the poly is changed.
        polygon.getPath().addListener('set_at', searchWithinPolygon);
        polygon.getPath().addListener('insert_at', searchWithinPolygon);

        //modified polygon search result would reflect in list view as well
        polygon.getPath().addListener('set_at', viewModel.mapTags);
        polygon.getPath().addListener('insert_at', viewModel.mapTags);

        viewModel.mapTags();
    });

    ko.applyBindings(viewModel);


}


/*
------------------------------
Model Definition
------------------------------
*/

var locations = [{
    tag: [
        "places",
        "historical",
        "monument"
    ],
    name: "Humayun's Tomb",
    location: {
        lat: 28.593843,
        lng: 77.250705
    }
}, {
    tag: [
        "places",
        "historical",
        "monument"
    ],
    name: "Qutb Minar",
    location: {
        lat: 28.524758,
        lng: 77.185424
    }
}, {
    tag: [
        "places",
        "historical",
        "monument"
    ],
    name: "Red Fort",
    location: {
        lat: 28.656366,
        lng: 77.241010
    }
}, {
    tag: [
        "places",
        "historical",
        "monument"
    ],
    name: "Tomb of Safdar Jang",
    location: {
        lat: 28.589311,
        lng: 77.210503
    }
}, {
    tag: [
        "places",
        "worship"
    ],
    name: "Lotus Temple",
    location: {
        lat: 28.553492,
        lng: 77.258816
    }
}, {
    tag: [
        "places",
        "historical",
        "war",
        "memorial"
    ],
    name: "India Gate",
    location: {
        lat: 28.612950,
        lng: 77.229456
    }
}, {
    tag: [
        "places",
        "historical",
        "worship",
        "muslim"
    ],
    name: "Qila-i-Kuhna Mosque",
    location: {
        lat: 28.609575,
        lng: 77.243712
    }
}, {
    tag: [
        "places",
        "historical",
        "worship",
        "muslim"
    ],
    name: "Jama Masjid, Delhi",
    location: {
        lat: 28.650727,
        lng: 77.233442
    }
}, {
    tag: [
        "places",
        "historical",
        "worship",
        "hindu"
    ],
    name: "Laxminarayan Temple",
    location: {
        lat: 28.632685,
        lng: 77.198953
    }
}, {
    tag: [
        "places",
        "historical"
    ],
    name: "Agrasen ki Baoli",
    location: {
        lat: 28.626132,
        lng: 77.224987
    }
}, {
    tag: [
        "places",
        "historical",
        "worship",
        "christian"
    ],
    name: "Cathedral Church of the Redemption",
    location: {
        lat: 28.618416,
        lng: 77.201859
    }
}];

/*
------------------------------
 Map Style definition
------------------------------
*/

// Create a styles array to use with the map.
var styles = [{
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f7f1df"
        }]
    }, {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
            "color": "#d0e3b4"
        }]
    }, {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{ "visibility": "off" }]
    }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [{
            "color": "#fbd3da"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#bde6ab" }]
    }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "visibility": "off" }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffe15f"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#efd151"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#ffffff" }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "black"
        }]
    }, {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#cfb2db"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#a2daf2"
        }]
    }
];

/*
------------------------------
 View Model definition
------------------------------
*/

function ViewModel() {

    //Create markers and displays them on map as its loads
    //addtionally it adds a marker field to the locatons JSON
    displayMarkers(locations);

    var self = this;
    this.selectItem = ko.observable('');
    //populates observable using locations array into all available locations
    self.availableTags = ko.observableArray(locations);
    // matchedTags will carry filtered locations.
    self.matchedTags = ko.observableArray([]);

    self.mapTags = function() {
        self.matchedTags.removeAll();
        for (var i = 0; i < self.availableTags().length; i++) {
            if (self.availableTags()[i].marker.getVisible() === true) {
                self.matchedTags.push(self.availableTags()[i]);
            }
        }
    };

    // a location clicked in List View will trigger a click event on marker
    // so that click listener will listen and open the infowindow on Google Map
    self.setSelected = function(aClickedLocation) {
        self.selectItem(aClickedLocation);
        google.maps.event.trigger(aClickedLocation.marker, 'click');
    }

    self.tag = ko.observable().extend({
        rateLimit: {
            timeout: 1000,
            method: "notifyWhenChangesStop"
        }
    });

    self.tag.subscribe(function(value) {
        self.matchedTags.removeAll();

        if (value !== '') {
            // populate matched tags as per matched values
            for (var i = 0; i < self.availableTags().length; i++) {
                var aName = self.availableTags()[i].name;
                ///var aTag = self.availableTags()[i].tag;
                if (aName.toLowerCase().indexOf(value) >= 0 /*|| aTag.toLowerCase().indexOf(value) >= 0*/ )
                    self.matchedTags.push(self.availableTags()[i]);
            }

            if (self.matchedTags().length === 0) {
                for (var i = 0; i < self.availableTags().length; i++) {
                    var aTagLength = self.availableTags()[i].tag.length;
                    var aTag = '';
                    for (var j = 0; j < aTagLength; j++) {

                        aTag = self.availableTags()[i].tag[j];

                        if (aTag.toLowerCase().indexOf(value) >= 0)
                            self.matchedTags.push(self.availableTags()[i]);
                    }
                }
            }

            if (self.matchedTags().length === 0) {
                // display no markers and locations if nothing matches
                self.matchedTags.push("");
            }

            if (self.matchedTags().length > 0) {

                // if one or more matches found
                for (var i = 0; i < self.availableTags().length; i++) {
                    aLocation = self.availableTags()[i];
                    aLocation.marker.setVisible(false);
                }

                for (var i = 0; i < self.matchedTags().length; i++) {
                    aMatchedLocation = self.matchedTags()[i];
                    aMatchedLocation.marker.setVisible(true);
                }
            }

        } else {
            // if nothing is typed
            if (self.availableTags().length != 0) {
                for (var i = 0; i < self.availableTags().length; i++) {
                    aLocation = self.availableTags()[i];
                    aLocation.marker.setVisible(true);
                }
            }
        }

    });
}



// This display the markers on the map as per location array provided
function displayMarkers(locationsToMark) {

    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locationsToMark.length; i++) {
        // Get the position from the location array.
        latlng = new google.maps.LatLng(locationsToMark[i].location.lat, locationsToMark[i].location.lng);
        var title = locationsToMark[i].name;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Add the newly created marker into locations array
        locations[i].marker = marker;
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });

        marker.addListener('click', function() {
            toggleBounce(this);
        });

        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    });

    map.addListener('center_changed', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // bound.
        window.setTimeout(function() {
            map.panTo(bounds.getCenter());
        }, 3000);
    });

}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        load_content(map, marker, infowindow);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}


function load_content(map, marker, infowindow) {

    // Wikipedia API Call to fetch photo and title
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=' + marker.title + '\
    &format=json&pithumbsize=300&callback=wikiCallback';

    // Wikidata API call to fetch wikidata ID against the marker title
    var wikiDataUrl = 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=&sites=enwiki&titles=' + marker.title + '\
    &props=info&languages=en&languagefallback=1&sitefilter=enwiki&formatversion=2&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        innerHTML += '<div>Failed too get wikipedia resources</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(map, marker);
    }, 4000);


    function getData(callback) {
        jQuery.ajax({
            url: wikiDataUrl,
            dataType: "jsonp",
            success: callback,
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }

    getData(function(response) {
        //wikiDataId = Object.values(response.entities)[0].id;
        clearTimeout(wikiRequestTimeout);
        var wikiDataId = Object.values(response.entities)[0].id;

        //Fetch heritage status from wikidata
        var wikiDataUrl2 = 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=' + wikiDataId + '&sites=enwiki&titles=&props=claims&languages=en&languagefallback=1&sitefilter=enwiki&formatversion=2&format=json&callback=wikiCallback';

        function checkItsHeritageStatus(callback) {
            jQuery.ajax({
                url: wikiDataUrl2,
                dataType: "jsonp",
                success: callback,
                error: function(xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            });
        }

        checkItsHeritageStatus(function(data) {

            clearTimeout(wikiRequestTimeout);
            // fetch heritage detais from data object
            var wikiClaimHeritage = Object.values(data.entities)[0].claims.P1435;

            //P31
            var wikiP31 = Object.values(data.entities)[0].claims.P31;
            var wikiP31ClaimValues = Object.values(wikiP31)[0];
            var wikiP31ClaimValueID = wikiP31ClaimValues.mainsnak.datavalue.value.id;
            var wikiP31ClaimIDURL = 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=' + wikiP31ClaimValueID + '&sitefilter=enwiki&formatversion=2&format=json&callback=wikiCallback';

            function getP373(callback) {
                jQuery.ajax({
                    url: wikiP31ClaimIDURL,
                    dataType: "jsonp",
                    success: callback,
                    error: function(xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                        alert(err.Message);
                    }
                });
            }

            getP373(function(data) {
                clearTimeout(wikiRequestTimeout);
                var wikiP373IDValue = Object.values(data.entities)[0].claims.P373[0].mainsnak.datavalue.value;
                console.log(wikiP373IDValue);

                if (typeof(wikiClaimHeritage) != 'undefined') {

                    var wikiClaimValues = Object.values(wikiClaimHeritage)[0];
                    var wikiHeritageID = wikiClaimValues.mainsnak.datavalue.value.id;
                    var wikiHeritageIDvalueURL = 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=' + wikiHeritageID + '&props=labels%7Cdescriptions&languages=&languagefallback=1&sitefilter=enwiki&formatversion=2&format=json&callback=wikiCallback';

                    function getHeritageIDStatus(callback) {
                        jQuery.ajax({
                            url: wikiHeritageIDvalueURL,
                            dataType: "jsonp",
                            success: callback,
                            error: function(xhr, status, error) {
                                var err = eval("(" + xhr.responseText + ")");
                                alert(err.Message);
                            }
                        });
                    }

                    getHeritageIDStatus(function(data) {

                        clearTimeout(wikiRequestTimeout);
                        // fetch heritage detais from data object
                        var wikiHeritageIDValue = Object.values(data.entities)[0].labels.en.value;
                        // Fetch the site photo from wikipedia
                        jQuery.ajax({
                            url: wikiUrl,
                            dataType: "jsonp",
                            success: function(response) {
                                imageURL = Object.values(response.query.pages)[0].thumbnail.source;
                                title = Object.values(response.query.pages)[0].title;
                                heritageHTML = '<div class="heritage">' + wikiHeritageIDValue + '</div>';
                                buildingCategoryP373 = '<div class="p373ID">' + "Site information: " + wikiP373IDValue + '</div>';
                                wikipediaReference = '<div align="right" class="text-muted wikiref">powered by wikipedia</div>';
                                innerHTML = '<div class="infoContainer"><img class="infoImage" src="' + imageURL + '"><h4 class="titleHeading">' + title + '</h4>' + heritageHTML + '<br>' + buildingCategoryP373 + wikipediaReference + '</div>';
                                infowindow.setContent(innerHTML);
                                infowindow.open(map, marker);
                                clearTimeout(wikiRequestTimeout);
                            },
                            error: function(xhr, status, error) {
                                var err = eval("(" + xhr.responseText + ")");
                                alert(err.Message);
                            }
                        });
                    });
                } else {
                    // Fetch the site photo from wikipedia for non-heritage sites
                    jQuery.ajax({
                        url: wikiUrl,
                        dataType: "jsonp",
                        success: function(response) {
                            imageURL = Object.values(response.query.pages)[0].thumbnail.source;
                            title = Object.values(response.query.pages)[0].title;
                            buildingCategoryP373 = '<div class="p373ID">' + "Site information: " + wikiP373IDValue + '</div>';
                            wikipediaReference = '<div align="right" class="text-muted wikiref">powered by wikipedia</div>';
                            innerHTML = '<div class="infoContainer"><img class="infoImage" src="' + imageURL + '"><h4 class="titleHeading">' + title + '</h4>' + '<br>' + buildingCategoryP373 + wikipediaReference + '</div>';
                            infowindow.setContent(innerHTML);
                            infowindow.open(map, marker);
                            clearTimeout(wikiRequestTimeout);
                        },
                        error: function(xhr, status, error) {
                            var err = eval("(" + xhr.responseText + ")");
                            alert(err.Message);
                        }
                    });
                }

            });



        });
    });
}


// This function hides all markers outside the polygon,
// and shows only the ones within it. This is so that the
// user can specify an exact area of search.
function searchWithinPolygon() {
    for (var i = 0; i < locations.length; i++) {
        if (google.maps.geometry.poly.containsLocation(locations[i].marker.position, polygon)) {
            //markers[i].setMap(map);
            locations[i].marker.setVisible(true);
        } else {
            locations[i].marker.setVisible(false);
            //markers[i].setMap(null);

        }
    }
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
        //markers[i].setMap(null);
    }
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { marker.setAnimation(null); }, 700 * 2);
    }
}

$(document).ready(function() {
    $('[data-toggle="offcanvas"]').click(function() {
        $('.row-offcanvas').toggleClass('active')
    });
});

function errorHandling() {
    alert("Google Maps has failed to load. Please check console logs.");
}