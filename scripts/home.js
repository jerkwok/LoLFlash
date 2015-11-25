$(document).ready(function(){

	$("#recentButton").click(function(){
		console.log($("#username").val())
		var values = {
			'username':$("#username").val(),
			'region':$("#region").val(),
			'season':$("#season").val(),
			'type':"recent"
		}
		$.ajax({
			url: "./scripts/searches.php",
			type:"POST",
			data:values,
			success: function(response){
				console.log("success")
				console.log(response)
				document.getElementById("recent").innerHTML = "Recent Searches" + "</br>" + response
			}
		})

		// $.post('./scripts/searches.php', data, function(response){
		// 	document.getElementById("recent").innerHTML= "Recent Searches" + "</br>" + response
		// })
	});


	$("#findButton").click(function(){
	    var name = $("#username").val();

	    if (name != undefined && name != null) {
	        window.location = './profile.html?username=' + name+'&region=' 
	        + $("#region").val() + '&season=' +  $("#season").val();
	    }
	    console.log(name)
	});

	$("#historyButton").click(function(){
	    var name = $("#username").val();

	    if (name != undefined && name != null) {
			window.location = './history.html?username=' + name+'&region=' 
				        + $("#region").val() + '&queue=' +  $("#queueType").val();
		}
	    
	});

	$("#leaguesButton").click(function(){
	    var name = $("#username").val();

	    if (name != undefined && name != null) {
	        window.location = './leagues.html?username=' + name+'&region=' 
	        + $("#region").val() + '&queue=' + $("#queueType").val();
	    }
	    console.log(name)
	});

});
