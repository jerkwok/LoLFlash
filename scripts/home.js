$(document).ready(function(){

	$("#recent").hide()

	$("#recentButton").click(function(){
		if ($("#recent").is(':visible')){
			$("#recent").fadeOut('fast')
		}else{
			$.ajax({
				url: "./scripts/displaysearches.php",
				success: function(response){
					document.getElementById("recent").innerHTML = "Recent Searches" + "</br>" + response
					$("#recent").fadeIn('fast')
				}
			})
		}
	});


	$("#findButton").click(function(){
	    var name = $("#username").val();
    	writeDB("profile")
	    if (name != undefined && name != null) {
	        window.location = './profile.html?username=' + name+'&region=' 
	        + $("#region").val() + '&season=' +  $("#season").val();
	    }
	    console.log(name)
	});

	$("#historyButton").click(function(){
	    var name = $("#username").val();
    	writeDB("history")
	    if (name != undefined && name != null) {
			window.location = './history.html?username=' + name+'&region=' 
				        + $("#region").val() + '&queue=' +  $("#queueType").val();
		}
	    
	});

	$("#leaguesButton").click(function(){
	    var name = $("#username").val();

	    if (name != undefined && name != null) {
	    	writeDB("leagues")
	        window.location = './leagues.html?username=' + name+'&region=' 
	        + $("#region").val() + '&queue=' + $("#queueType").val();
	    }
	    console.log(name)
	});

});

function writeDB(button){
	var values = {
		'username':$("#username").val(),
		'region':$("#region").val(),
		'season':$("#season").val(),
		'type':button
	}
	$.ajax({
		url: "./scripts/writesearch.php",
		type:"POST",
		data:values,
		success: function(response){
			console.log("success")
			console.log(response)
			document.getElementById("recent").innerHTML = "Recent Searches" + "</br>" + response
			$("#recent").fadeIn('fast')
		}
	})
}