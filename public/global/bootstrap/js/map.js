$(document).ready(function(){
	var mp = {
			map : null,
			marker : null
	};
	$.fn.initMap = function(){
		var id = $(this).attr('id');
		geocoder = new google.maps.Geocoder();
		var mapOptions = {
		          center: new google.maps.LatLng(20.593684, 78.96288000000004),
		          zoom:5,
		          mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		        map = new google.maps.Map(document.getElementById(id),mapOptions);
		        mp.map = map;
		return map;
	};
	$.fn.extend({
		mapLocation : function(){
			var lc = $(this).data('lc');
			geocoder.geocode({'address': lc},function(result, status){
				if(status == google.maps.GeocoderStatus.OK)
				{
					mp.map.setCenter(result[0].geometry.location);
					mp.map.setZoom(14);
					var marker = new google.maps.Marker({
						map : mp.map,
						position : result[0].geometry.location
					});
				}
			});
			return mp.map;
		},
		
		mapAutocomplete : function() {
			var $this = $(this);
			var id = $this.attr('id');
			var input = document.getElementById(id);
			var autocomplete = new google.maps.places.Autocomplete(input);
			var marker = new google.maps.Marker({map:mp.map});
			
			autocomplete.bindTo('bounds',mp.map);
			
			google.maps.event.addListener(autocomplete,'place_changed',function(){
				marker.setVisible(false);
				input.className = '';
				var place = autocomplete.getPlace();
				if(!place.geometry)
				{
					input.className = 'error';
					return;
				}
				
				if(place.geometry.viewport)
				{
					map.fitBounds(place.geometry.viewport);
				} else {
					map.setCenter(place.geometry.location);
					map.setZoom(15);
				}
				
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);
				$this.data('lc',input.value);
			});
		}
	});
});