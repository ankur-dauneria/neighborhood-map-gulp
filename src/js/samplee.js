function loc(d) {
    var self = this;
    this.lat = ko.observable(d.lat);
    this.lng = ko.observable(d.lng);
}

function point(tag, name, location) {
    var self = this;
    this.tag = ko.observable(tag);
    this.name = ko.observable(name);
    this.location = new loc(location);
}

function viewModel() {
    var self = this;
    this.points = ko.observableArray('');
    this.selectedPoint = ko.observable('');

    this.setSelected = function(item) {
        self.selectedPoint(item);
        var locations = ko.toJS(self.filteredNames)
        $.each(locations, function(i, item) {
            var marker = new google.maps.Marker({
                position: item.location,
                title: item.name
            });
            marker.setMap(map);
            map.setCenter(marker.getPosition());
        });
    }

    this.justtags = ko.computed(function() {
        var tags = ko.utils.arrayMap(this.points(), function(item) {
            return item.tag();
        });
        return tags.sort();
    }, this);

    this.uniquetags = ko.dependentObservable(function() {
        return ko.utils.arrayGetDistinctValues(self.justtags()).sort();
    }, this);

    this.filteredNames = ko.computed(function() {
        var filter = self.selectedPoint()
        if (!filter) {} else {
            return ko.utils.arrayFilter(this.points(), function(item) {
                if (item.tag() === filter) {
                    return item
                };
            });
        }
    }, this);

}



var map;

var data = [{
    tag: "places",
    name: "Dubai Marina",
    location: {
        lat: 24.4473236,
        lng: 54.3927349
    }
}, {
    tag: "places",
    name: "Burj Khalifa",
    location: {
        lat: 24.4707202,
        lng: 54.3422700
    }
}, {
    tag: "Coffee",
    name: "StarBucks",
    location: {
        lat: 24.4707202,
        lng: 54.3422700
    }
}, {
    tag: "Coffee",
    name: "Costa",
    location: {
        lat: 24.4752239,
        lng: 54.3388363
    }
}, {
    tag: "Club",
    name: "Beach Club",
    location: {
        lat: 24.4707202,
        lng: 54.3422700
    }
}, {
    tag: "Club",
    name: "Cheers Club",
    location: {
        lat: 24.4707202,
        lng: 54.3422700
    }
}];

var vm = new viewModel();

function initialize() {
    var myLatlng = new google.maps.LatLng(-34.397, 150.644);
    var myOptions = {
        zoom: 14,
        center: new google.maps.LatLng(24.4481884, 54.3803007),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}
$(document).ready(function() {
    initialize();


    ko.applyBindings(vm);
    $.each(data, function(i, item) {
        vm.points.push(new point(item.tag, item.name, item.location))
    })
});