// Google API Key
// AIzaSyC_lsyj7OW5s82il8Sn3D7YLzFONtM1LMg
$(document).ready(function(){
 $("button").click(function(){

	
	var username = $("#username").val()
	// console.log(username);

	// if (isNaN(username)){
	// 	username = "Megaman703"
	// }
	
	getdata(username);

 	// $('#goButton').hide();
 	$("#data").show();

  });
});


function getdata(user){
	var summonerurl = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + user + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	// console.log(url);

	$.ajax({
		url: summonerurl,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function(data){
			console.log(data)
			user = user.replace(" ", "");
			user = user.toLowerCase().trim();
			sLevel = data[user].summonerLevel;
			sID = data[user].id;
			console.log("Level: " + sLevel);
			console.log("Name: " + user);
			console.log("ID: " + sID);
		}
	})
}