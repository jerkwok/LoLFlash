$(document).ready(function(){

	$("#findButton").click(function(){
	    var name = $("#username").val();

	    if (name != undefined && name != null) {
	        window.location = './profile.html?username=' + name+'&region=' 
	        + $("#region").val() + '&queue=' +  $("#queueType").val();
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
