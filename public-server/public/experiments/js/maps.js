/**
 * This file is loaded in the map view
 */
function initMap() {
	var EARTH_R = 6371000; //Define the earth radious
	var map, marker, rectangle, center, rectangleWidth, rectangleHeight, changeInputBounds = true;

	//Initialize the map and set initial positon, the zoom and the map type (TERRAIN)
	map = new google.maps.Map(document.getElementById('map'), {
		scaleControl: true,
		center: { lat: 38.981, lng: -1.856 },
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});

	//Get the lat and lng of the map center
	center = map.getCenter();

	//Define the click event, when the user click the map, this event will be triggered
	map.addListener('click', function (e) {
		center = e.latLng;
		moveMarker();
	});

	//Create a marker in the center of the map
	marker = new google.maps.Marker({
		position: center,
		map: map,
		draggable: true,
		title: "Drag me!",
	});

	//Create a rectangle and sets its properties
	rectangle = new google.maps.Rectangle({
		strokeColor: '#FF0000',
		strokeOpacity: 0.6,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.2,
		editable: true,
		clickable: false,
		draggable: false,
		map: map,
	});

	setBoundsFromInputs();

	//This event will be triggered when the user drags the rectangle
	marker.addListener('dragend', function (e) {
		center = e.latLng;
		moveMarker();
	});

	//This event will be triggered when the user change the bounds of the rectangle
	rectangle.addListener('bounds_changed', boundsChanged);

	//This function update the info of the marker position. Also sets the #latitude and #longitude input values
	function moveMarker() {
		marker.setPosition(center);
		marker.setVisible(true);
		changeInputBounds = false;//Diable the flag because the change is for resize of the rectangle, not for the change of the width and heigh inputs
		setBoundsFromInputs();
		$('#latitude').val(center.lat());
		$('#longitude').val(center.lng());
		map.panTo(center);
	}

	//This function calculates the bound changes when the user resize the rectangle. It also cumputes the Width and Heigh values of the rectangle.
	function boundsChanged(event) {
		center = rectangle.getBounds().getCenter();
		var sw = rectangle.getBounds().getSouthWest(), ne = rectangle.getBounds().getNorthEast();
		rectangleWidth = distance(sw.lat(), sw.lng(), sw.lat(), ne.lng());
		rectangleHeight = distance(ne.lat(), ne.lng(), sw.lat(), ne.lng());
		marker.setPosition(center);
		if (changeInputBounds) {
			$('#latitude').val(center.lat());
			$('#longitude').val(center.lng());
			$('#height').val(rectangleHeight / 1000);
			$('#width').val(rectangleWidth / 1000);
		}
		changeInputBounds = true;
	}

	//This function is executed when the user any of the buttons with the setCenterButton class. This function sets the center of the map, marker and the rectangle with the #latitude and #longitude inputs
	$('.setCenterButton').click(function () {
		if ($('#latitude').val() && $('#longitude').val()) {
			center = new google.maps.LatLng({ lat: parseFloat($('#latitude').val()), lng: parseFloat($('#longitude').val()) });
			marker.setPosition(center);
			setBoundsFromInputs();
			map.panTo(center);
		}
	});

	//This function is executed when the user press any of the buttons with the setBoundsButton class. This functioin adjust the bounds of the rectangle.
	$('.setBoundsButton').click(function () {
		if ($('#height').val() && $('#width').val()) {
			changeInputBounds = false;
			setBoundsFromInputs();
			map.panTo(center);
		}
	});

	/**
	 * This function calculates lat and lng of the displacement from a point (lat, lng).
	 * lat: the initial latitude
	 * lng: the initial longitude
	 * dist: the distance of the displacement in meters
	 * theta: the angle of the displacement
	 */
	function displace(lat, lng, dist, theta) {
		var latG = lat * Math.PI / 180,
			lngG = lng * Math.PI / 180,
			thetaG = theta * Math.PI / 180,
			delta = dist / EARTH_R;

		dstLat = Math.asin(Math.sin(latG) * Math.cos(delta) + Math.cos(latG) * Math.sin(delta) * Math.cos(thetaG));
		dstLng = lngG + Math.atan2(Math.sin(thetaG) * Math.sin(delta) * Math.cos(latG), Math.cos(delta) - Math.sin(latG) * Math.sin(dstLat));
		dstLng = (dstLng + 3.0 * Math.PI) % (2.0 * Math.PI) - Math.PI;

		return [(dstLat * 180 / Math.PI), (dstLng * 180 / Math.PI)];
	}

	/**
	 * This function calculates the distance between two points
	 * lat1: the latitude of the first point
	 * lng1: the longitude of the first point
	 * lat2: the longitude of the second point
	 * lng2: the longitude of the second point
	 */
	function distance(lat1, lng1, lat2, lng2) {
		lat1 = lat1 * Math.PI / 180;
		lng1 = lng1 * Math.PI / 180;
		lat2 = lat2 * Math.PI / 180;
		lng2 = lng2 * Math.PI / 180;
		dLat = lat2 - lat1;
		dLng = lng2 - lng1;

		a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2.0) * Math.sin(dLng / 2.0);
		c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_R * c;
	}

	//This function set the bounds of the rectangle from the input values of the height and width
	function setBoundsFromInputs() {
		rectangle.setBounds({
			north: displace(center.lat(), center.lng(), $('#height').val() * 1000 / 2.0, 0)[0],
			south: displace(center.lat(), center.lng(), $('#height').val() * 1000 / 2.0, 180)[0],
			east: displace(center.lat(), center.lng(), $('#width').val() * 1000 / 2.0, 90)[1],
			west: displace(center.lat(), center.lng(), $('#width').val() * 1000 / 2.0, 270)[1]
		});
	}
}

//Disable some keys of the keyboard, to allow only insert numbers
$(".inputNumber").keydown(function (e) {
	// Allow: backspace, delete
	if ($.inArray(e.keyCode, [46, 8, 109, 110, 190]) !== -1 ||
		// Allow: Ctrl+A
		(e.keyCode == 65 && e.ctrlKey === true) ||
		// Allow: Ctrl+C
		(e.keyCode == 67 && e.ctrlKey === true) ||
		// Allow: Ctrl+X
		(e.keyCode == 88 && e.ctrlKey === true) ||
		// Allow: home, end, left, right
		(e.keyCode >= 35 && e.keyCode <= 39)) {
		// let it happen, don't do anything
		return;
	}
	// Ensure that it is a number and stop the keypress
	if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		e.preventDefault();
	}
});


$(function () {
	//Configure the date picker for the start time execution.
	$('#datetimeStart').datetimepicker({
		locale: 'en',
		minDate: moment('20070101', 'YYYYMMDD'),//Set the minimun date the 01/01/2007
		maxDate: moment().subtract(6, 'hours'),//Set the maximun date to six hours lees than the current date and time
		stepping: 60, //Set the steps of the clock to hours
		showTodayButton: true,
		showClose: true,
		showClear: true
	});

	$('#datetimeFinish').datetimepicker({
		locale: 'en',
		minDate: $('#datetimeStart').data('DateTimePicker').date(),//Set the minimun date and time with the date and time selected in the start picker
		maxDate: moment().add(12, 'day'),//Sets the maximun date to twelve days after current date
		stepping: 60,
		showTodayButton: true,
		showClose: true,
		showClear: true
	});

	//This function is triggered when the start picker changes and set the minimun finish date picker with the start picker date
	$('#datetimeStart').on("dp.change", function (e) {
		$('#datetimeFinish').data("DateTimePicker").minDate(e.date);
	});
});