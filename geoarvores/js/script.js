var mapProp = {
	center: {lat: -19.9289019, lng: -43.9528173}, // Cemig Distribuição
	zoom: 14,
	mapTypeId:google.maps.MapTypeId.ROADMAP,
}

var marker = new google.maps.Marker({
	position: mapProp.center,
	draggable: true,
	animation: google.maps.Animation.DROP
});

var map = new google.maps.Map(document.getElementById('map-tile'), mapProp);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(atzPosition);
    } else {
        document.getElementById("map-tile").innerHTML = "Geolocation is not supported by this browser.";
    };
}

function getLatLng () {
	return new google.maps.LatLng(mapProp.center.lat, mapProp.center.lng);
}

function centraliza(){
	var latlng = getLatLng();

    marker.setPosition(latlng);
    map.setCenter(latlng);
}

function atzPosition(position) {
    mapProp.center.lat = position.coords.latitude;
    mapProp.center.lng = position.coords.longitude;

    centraliza();
    showPosition();
}

function atzPositionByMarker(evt) {
    mapProp.center.lat = evt.latLng.lat();
    mapProp.center.lng = evt.latLng.lng();

    showPosition();
}

function showPosition() {
	var x = document.getElementById("poda_longitude");
	var y = document.getElementById("poda_latitude");

    y.value = mapProp.center.lat;
    x.value = mapProp.center.lng; 

    geoCoding (mapProp.center.lat, mapProp.center.lng);
}

function initialize() {
  marker.setMap(map);

  marker.addListener('click', toggleBounce);
  marker.addListener('dragend', atzPositionByMarker);

  showPosition();
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function geoCoding (lat, lng) {
	$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true', function(data) {
		var poda_municipio = document.getElementById("poda_municipio");
		poda_municipio.value = data.results[0].address_components[3].long_name;

		var poda_bairro = document.getElementById("poda_bairro");
		poda_bairro.value = data.results[0].address_components[2].long_name;

		var poda_logradouro = document.getElementById("poda_logradouro");
		poda_logradouro.value = data.results[0].address_components[1].long_name;

		var poda_numero = document.getElementById("poda_numero");
		poda_numero.value = data.results[0].address_components[0].long_name;
	});
}

function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] 
               || document.documentElement;

    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

}

google.maps.event.addDomListener(window, 'load', initialize);

