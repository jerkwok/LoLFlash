$(document).ready(function(){

	$("#recentButton").click(function(){
		console.log("recent")
		data =  {'action': $(this).val()};
		$.post('./scripts/searches.php', data, function(response){
			document.getElementById("recent").innerHTML= "Recent Searches" + "</br>" + response
		})
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
