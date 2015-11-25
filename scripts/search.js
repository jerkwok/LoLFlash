function writeDB(type){
	var values = {
		'username':$("#username").val(),
		'region':$("#region").val(),
		'season':$("#season").val(),
		'type':type
	}
	$.ajax({
		url: "./scripts/writesearch.php",
		type:"POST",
		data:values
	})
}