/*
 * Final Project for Web Development CSCI 3230U: LoL Flash
 *
 * Copyright (C) 2015, <Akira Aida 100526064, Jeremy Kwok 100341977>
 * All rights reserved.
 * 
 */
 
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
		data:values,
		success: function(response){
		}

	})
}