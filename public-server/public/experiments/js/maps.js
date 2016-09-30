function initMap() {
	var EARTH_R = 6371000;
	var map, marker, rectangle, center, rectangleWidth, rectangleHeight, clickMarker = false;

	map = new google.maps.Map(document.getElementById('map'), {
		scaleControl: true,
		center: { lat: 38.981, lng: -1.856 },
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});

	map.addListener('click', function (e) {
		center = e.latLng;
		moveMarker();
	});

	center = map.getCenter();

	marker = new google.maps.Marker({
		position: center,
		map: map,
		draggable: true,
		title: "Drag me!",
	});

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
	marker.addListener('dragend', function (e) {
		center = e.latLng;
		moveMarker();
	});
	rectangle.addListener('bounds_changed', boundsChanged);

	function moveMarker() {
		marker.setPosition(center);
		marker.setVisible(true);
		clickMarker = true;
		setBoundsFromInputs();
		$('#latitude').val(center.lat());
		$('#longitude').val(center.lng());
		map.panTo(center);
	};

	function distance(lat1, lon1, lat2, lon2) {
		var p = 0.017453292519943295;    // Math.PI / 180
		var c = Math.cos;
		var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	}

	function boundsChanged(event) {
		center = rectangle.getBounds().getCenter();
		var sw = rectangle.getBounds().getSouthWest(), ne = rectangle.getBounds().getNorthEast();
		rectangleWidth = distance(sw.lat(), sw.lng(), sw.lat(), ne.lng());
		rectangleHeight = distance(ne.lat(), ne.lng(), sw.lat(), ne.lng());
		marker.setPosition(center);
		if (!clickMarker) {
			$('#latitude').val(center.lat());
			$('#longitude').val(center.lng());
			$('#height').val(rectangleHeight/1000);
			$('#width').val(rectangleWidth/1000);
		}
		clickMarker = false;
	}

	$('#setCenterButton').click(function () {
		if ($('#latitude').val() && $('#longitude').val()) {
			center = new google.maps.LatLng({ lat: parseFloat($('#latitude').val()), lng: parseFloat($('#longitude').val()) });
			marker.setPosition(center);
			setBoundsFromInputs();
			map.panTo(center);
		}
	});

	$('#setBoundsButton').click(function () {
		if ($('#height').val() && $('#width').val()) {
			setBoundsFromInputs();
			map.panTo(center);
		}
	});

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

	function setBoundsFromInputs() {
		rectangle.setBounds({
			north: displace(center.lat(), center.lng(), $('#height').val()*1000 / 2.0, 0)[0],
			south: displace(center.lat(), center.lng(), $('#height').val()*1000 / 2.0, 180)[0],
			east: displace(center.lat(), center.lng(), $('#width').val()*1000 / 2.0, 90)[1],
			west: displace(center.lat(), center.lng(), $('#width').val()*1000 / 2.0, 270)[1]
		});
	}
}

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