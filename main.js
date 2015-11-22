var champIdMap

$(document).ready(function(){
getChampIdMap()
//Calls the ajax at the start

 $("#goButton").click(function(){
 	//console.log(champIdMap)

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

 $("#clearButton").click(function(){
 	clear("teamA")
 	clear("teamB")
 });

});

function clear(id){
	document.getElementById(id).innerHTML = ""
}


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
			// console.log(data)
			user = user.replace(" ", "");
			user = user.toLowerCase().trim();
			sLevel = data[user].summonerLevel;
			sID = data[user].id;
			// console.log("Level: " + sLevel);
			// console.log("Name: " + user);
			// console.log("ID: " + sID);
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "Name: " + user + "</br>";
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "Level: " + sLevel + "</br>";
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "ID: " + sID + "</br>";

			var region = "na"
			// var statsurl = "https://na.api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/" + sID + "/ranked?season="+ season +"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

			// getwinstats(sID,region,season);
			// getrankedsolostats(sID,region);
			// getaramstats(sID,region,season);
			getMatchHistory(sID,region)
			//current game does NOT currently work.
			//Getting a Access Control Allow Origin error. observer doesn't support JSONP, 
			//so we need to make a new web script that forwards the request, adds the api key, 
			//and returns the api data with the CORS header header("Access-Control-Allow-Origin: *");	

			// getcurrentgame(sID,region);
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
				//console.log("Current Game:")
				document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "Current Game:" + "</br>"
				//console.log(data)
				document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + data + "</br>"
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
			// console.log("Win Stats:")
			// console.log(data["playerStatSummaries"])
			// console.log(data["playerStatSummaries"][0].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][0].wins)
			// console.log(data["playerStatSummaries"][data["playerStatSummaries"].length-2].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-2].wins)
			// console.log(data["playerStatSummaries"][data["playerStatSummaries"].length-1].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-1].wins)
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "Win Stats:" + "</br>"
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + data["playerStatSummaries"][0].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][0].wins + "</br>"
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + data["playerStatSummaries"][data["playerStatSummaries"].length-2].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-2].wins + "</br>"
			document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + data["playerStatSummaries"][data["playerStatSummaries"].length-1].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-1].wins + "</br>"

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
	// console.log("Ranked League:")
	// console.log(data[id][place].name + " " + data[id][place].tier + " - " + data[id][place].entries[0].division + " at " + data[id][0].entries[0].leaguePoints + " LP")	
	document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "Ranked League:" + "</br>"
	document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + data[id][place].name + " " + data[id][place].tier + " - " + data[id][place].entries[0].division + " at " + data[id][0].entries[0].leaguePoints + " LP" + "</br>"

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
				// console.log(data)
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
	// console.log("ARAM Stats:");
	// console.log("Kills: " + totkills + " Assists: " + totassists  + " Wins: " + totwins);
	document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "ARAM Stats:" + "</br>"
	document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + "Kills: " + totkills + "</br>" + " Assists: " + totassists  + "</br>" + " Wins: " + totwins + "</br>"

}

function getMatchHistory (id,region,champids,rankedQueues, seasons,begintime,endtime,beginindex,endindex) {
	//last 7 args are optional.
	var optargs = ""

	//these need to be comma separated values
	if (champids != undefined) {
		optargs += "&champids=" + starttime;
	};

	if (rankedQueues != undefined) {
		optargs += "&rankedQueues=" + starttime;
	};

	if (seasons != undefined) {
		optargs += "&seasons=" + seasons;
	};

	if (begintime != undefined) {
		optargs += "&beginTime=" + begintime;
	};

	if (endtime != undefined) {
		optargs += "&endTime=" + endtime;
	};

	if (beginindex != undefined) {
		optargs += "?&beginIndex=" + beginindex;
	};

	if (endindex != undefined) {
		optargs += "&endIndex=" + endindex;
	};

	// if (region == "na") {
	// 	region = "NA1"
	// };
	var matchhisturl = "https://na.api.pvp.net/api/lol/"+region+"/v2.2/matchlist/by-summoner/"+id+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec" + optargs;

	//Posts the match history url to the main.php
	// $.ajax({
	// 	url: "main.php",
	// 	type: "POST",
	// 	data: { data: matchhisturl },
	// 	success: function(response) {
 //        	alert(response);
 //        	console.log(matchhisturl);
 //    	}
	// });

	$.ajax({
			
			url: matchhisturl,
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function(data){
				// console.log("Match History:")
				// console.log("Last 10 Games:")
				document.getElementById("content").innerHTML += "Match History:" + "</br>"
				// console.log(data)
				// for (var i = 0; i < data.playerStatSummaries.length; i++) {
				// 	if (data.playerStatSummaries[i].playerStatSummaryType == "AramUnranked5x5") {
				// 		displayaramstats(id,data,i);
				// 	}
				// };
				for(var i = 0; i < 1; i++){
					displayGame(id, data.matches[i], region);
				}
			}
		})
}

function displayGame(playerID, match, region){

	var name = getChampName(match.champion)
	document.getElementById("content").innerHTML += "Match Id:" + match.matchId + 
		" Champion Played Id:" + match.champion + " Name:" + name
	//displayChampPic(name);
	document.getElementById("content").innerHTML +="</br>" 
	// var KDA = getKDA(match.matchId, playerID, region)
	// console.log(KDA)

	getMatchInfo(region, match.matchId);
}

function getMatchInfo(region, matchId){
	var matchurl = "https://na.api.pvp.net/api/lol/" + region + "/v2.2/match/" + matchId + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	var champKey;
	var champPic;
	var KDA = [0,0,0];
	$.ajax({
			
			url: matchurl,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				for(var i = 0; i < data.participants.length; i++){
					console.log(data.participants[i]);
					champKey = getChampKey(data.participants[i].championId);
					champPic = getChampPic(champKey);
					KDA = getKDA(data.participants[i],i);

					if(data.participants[i].teamId == 100){
						document.getElementById("teamA").innerHTML += 
						data.participantIdentities[i].player.summonerName +champPic + "</br>" +
						"Kills: " + KDA[0] + " Deaths: " + KDA[1] + " Assists: " + KDA[2]+ "</br>" ;
					} else{
						document.getElementById("teamB").innerHTML += 
						data.participantIdentities[i].player.summonerName +champPic + "</br>"+
						"Kills: " + KDA[0] + " Deaths: " + KDA[1] + " Assists: " + KDA[2]+ "</br>" ;
					}
				}
			}
		})
}

function getKDA(data,participantId){
	return [data.stats.kills,
			 			 data.stats.deaths,
			 			 data.stats.assists]
			// KDACallback(
			//  [data.participants[participantId].stats.kills,
			//  			 data.participants[participantId].stats.deaths,
			//  			 data.participants[participantId].stats.assists],container)
}

// function getKDA(matchId,playerId,region){
// 	var participantId

// 	$.ajax({
// 		url: "https://na.api.pvp.net/api/lol/"+region+"/v2.2/match/"+matchId+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec",
// 		type: 'GET',
// 		dataType: 'json',
// 		success: function(data){
// 			console.log(data)
// 			//first, need to match the PlayerID to the summonerID located in 
// 			//participantIdentities->[number]->player->summonerId. that participantIdentities->[number] object 
// 			//has participantId. This is what we need. 
// 			//Then look in participants->[participantId]->stats->(kills/assists/deaths)

// 			//Find participantId
// 			for(var key in data.participantIdentities){
// 				if(data.participantIdentities[key].player.summonerId == playerId){
// 					participantId = data.participantIdentities[key].participantId
// 					console.log(participantId)
// 				}
// 			}
// 			KDACallback(
// 			 [data.participants[participantId].stats.kills,
// 			 			 data.participants[participantId].stats.deaths,
// 			 			 data.participants[participantId].stats.assists])
// 	}	
// 	})

// }
function KDACallback(KDA,container){
	document.getElementById(container).innerHTML += "Kills: " + KDA[0] + " Deaths: " + KDA[1] + " Assists: " + KDA[2]+ "</br>" 
}

// Below code is for champion related functions
// Retrieves all of the champion's data and stores it into the champIdMap
function getChampIdMap(callback){

	// May need to find a better way to do this since it's bad when the internet is slow
	$.ajax({
		url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec",
		type: 'GET',
		dataType: 'json',
		success: function(data){

			champIdMap = data;
		}
	})
}

// Gets the champion's name (full name with punctuation)
function getChampName(champId){
	var champion;
	for(var key in champIdMap.data){
		if(champIdMap.data[key].id == champId){
			return champIdMap.data[key].name;
		}
	}
}

// Gets the champion's key (no punctuation, used for links and data)
function getChampKey(champId){
	var champion;
	for(var key in champIdMap.data){
		if(champIdMap.data[key].id == champId){
			return champIdMap.data[key].key;
		}
	}
}

// Gets the champion's title (full punctuation)
function getChampTitle(champId){
	var champion;
	for(var key in champIdMap.data){
		if(champIdMap.data[key].id == champId){
			return champIdMap.data[key].title;
		}
	}
}

// Displays the champion's picture using the champion's key
function getChampPic(champKey){
	return "<img class=\"champPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/" + champKey + ".png\"></img>"
	//document.getElementById("content").innerHTML += "<img class=\"champPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/" + champKey + ".png\"></img>"
}