// Google API Key
// AIzaSyC_lsyj7OW5s82il8Sn3D7YLzFONtM1LMg
$(document).ready(function(){
 $("button").click(function(){

	
	var username = $("#username").val()
	var region = $('#region').val()
	var season = $('#season').val()
	// console.log(season);

	// if (isNaN(username)){
	// 	username = "Megaman703"
	// }
	
	getdata(username,region,season);

 	// $('#goButton').hide();
 	$("#data").show();

  });
});


function getdata(user,region,season){
	var summonerurl = "https://na.api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/" + user + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
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

			var region = "na"
			// var statsurl = "https://na.api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/" + sID + "/ranked?season="+ season +"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

			getwinstats(sID,region,season);
		}
	})
}

function getwinstats (id,region,season) {
	var winurl = "https://na.api.pvp.net/api/lol/"+region+"/v1.3/stats/by-summoner/"+id+"/summary?season="+season+"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	$.ajax({
		url: winurl,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function(data){
			console.log("Win Stats:")
			console.log(data["playerStatSummaries"])
			console.log(data["playerStatSummaries"][0].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][0].wins)
			console.log(data["playerStatSummaries"][data["playerStatSummaries"].length-2].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-2].wins)
			console.log(data["playerStatSummaries"][data["playerStatSummaries"].length-1].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-1].wins)
		}
	})
}