var champidmap

$(document).ready(function(){
getchampidmap()
//Calls the ajax at the start

 $("#goButton").click(function(){
 	console.log(champidmap)

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
 	clear("content")
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

			getwinstats(sID,region,season);
			getrankedsolostats(sID,region);
			getaramstats(sID,region,season);
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
				for(var i = 0; i < 10; i++){
					displayGame(data.matches[i]);
				}
			}
		})
}

function displayGame(match){
	document.getElementById("content").innerHTML += "Match Id:" + match.matchId + " Champion Played Id:" + match.champion + "</br>" 

	displayChampPic(match.champion);

	// document.getElementById("content").innerHTML += " Match Id:" + match.matchId
}

function displayChampPic(champId){
	var champion;
	// May be a more efficient way to do this instead
	// of looping through all the champions til the id matches
	for(var key in champidmap.data){
		if(champidmap.data[key].id == champId){
			champion = champidmap.data[key].key;
			break;
		}
	}
	document.getElementById("content").innerHTML += "<img class=\"champpic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/" + champion + ".png\"></img>"
}

function getchampidmap(callback){

	$.ajax({
		url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec",
		type: 'GET',
		dataType: 'json',
		success: function(data){

			//champidmap is a global variable defined at the top
			champidmap = data;
		}
	})
	//Current work around right now.
 	//Issue is ajax call is asynchronous so if the ajax call
 	//doesn't finish and put the data in champidmap then it is
 	//undefined when the button is pressed
 	//Especially bad if the internet is slow and the ajax call takes awhile.
}