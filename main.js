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
	
	getID(username,region,season);

 	// $('#goButton').hide();
 	$("#data").show();

  });
});


function getID(user,region,season){
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
			getrankedsolostats(sID,region);
			getaramstats(sID,region,season);
			//current game does NOT currently work.
			//Getting a Access Control Allow Origin error. observer doesn't support JSONP, 
			//so we need to make a new web script that forwards the request, adds the api key, 
			//and returns the api data with the CORS header header("Access-Control-Allow-Origin: *");

			getcurrentgame(sID,region);
		}
	})
}

function getcurrentgame (id,region) {
	if (region == "na") {
		region = "NA1"
	};

	var currgameurl = "https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/"+region+"/"+id+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	$.ajax({
		url: currgameurl,
		type: 'GET',
		dataType: 'json',	
		data: {
			success: function(data){
				console.log("Current Game:")
				console.log(data)
			}
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

function getrankedsolostats(id, region){
	var rankedsolourl = "https://na.api.pvp.net/api/lol/"+region+"/v2.5/league/by-summoner/"+id+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	$.ajax({
		url: rankedsolourl,
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function(data){
				for (var i = 0; i < data[id].length - 1; i++) {
					if (data[id][i].queue == "RANKED_SOLO_5x5") {
						displayrankedsolostats(id,data,i);
					}
				};
			}
		})
}

function displayrankedsolostats(id,data,place){
	console.log("Ranked League:")
	console.log(data[id][place].name + " " + data[id][place].tier + " - " + data[id][place].entries[0].division + " at " + data[id][0].entries[0].leaguePoints + " LP")	
}

function getaramstats(id,region,season){
	var statsurl = "https://na.api.pvp.net/api/lol/"+region+"/v1.3/stats/by-summoner/"+id+"/summary?season="+season+"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	$.ajax({
		url: statsurl,
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function(data){
				console.log(data)
				for (var i = 0; i < data.playerStatSummaries.length; i++) {
					if (data.playerStatSummaries[i].playerStatSummaryType == "AramUnranked5x5") {
						displayaramstats(id,data,i);
					}
				};
			}
		})
}

function displayaramstats(id,data,place){
	totkills = data.playerStatSummaries[place].aggregatedStats.totalChampionKills;
	totassists = data.playerStatSummaries[place].aggregatedStats.totalAssists;
	totwins = data.playerStatSummaries[place].wins;
	console.log("ARAM Stats:");
	console.log("Kills: " + totkills + " Assists: " + totassists  + " Wins: " + totwins);
}