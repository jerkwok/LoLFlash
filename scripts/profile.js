/*
 * Final Project for Web Development CSCI 3230U: LoL Flash
 *
 * Copyright (C) 2015, <Akira Aida 100526064, Jeremy Kwok 100341977>
 * All rights reserved.
 * 
 */
var champIdMap
var itemIdMap
var spellIdMap = {}
var spellImgMap = {}

$(document).ready(function(){
	getChampIdMap()
	getItemIdMap()
	getSpellIdMap()

	var parameters = location.search.substring(1).split("&");
	
	if(parameters != ""){
		var splitParams = parameters[0].split("=");

		var username = unescape(parameters[0].split("=")[1])
		var region = parameters[1].split("=")[1]
		var season = parameters[2].split("=")[1]

		getID(username, region, season);

		document.getElementById("player").style.display = "inline-block";
	}


	$(".goButton").click(function(){
		console.log("enter")
 		clear("userStats")
 		clear("userSum")

		var username = $("#username").val()
		var region = $('#region').val()
		var season = $('#season').val()
    	writeDB("profile")
		getID(username, region, season);
		// document.getElementById("player").style.display = "inline-block";
		$("#player").show();
  	});

	$("#username").keydown(function(event){
	    if(event.keyCode == 13){
    	   event.preventDefault();
        	$(".goButton").click();
    	}
	});
});

function clear(id){
	document.getElementById(id).innerHTML = ""
}


function getID(user, region, season){
	var summonerUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/" + user + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	rawUser = user;

	$.ajax({
		url: summonerUrl,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function(data){

			user = user.replace(" ", "");
			user = user.toLowerCase().trim();
			sLevel = data[user].summonerLevel;
			sID = data[user].id;
			icon = data[user].profileIconId

			dispSum(icon, rawUser, sLevel, sID, region);

			var statsUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + sID + "/ranked?season=" + season + "&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

			getWinStats(sID, region, season);

			getRecentChamps(sID,region,season);
		}
	})
}

function dispSum(icon, user, sLevel, sID, region){
	
	document.getElementById("userSum").innerHTML += getIconPic(icon);
	document.getElementById("userSum").innerHTML += "<p class=\"userName\">" + user + "</p>";
	document.getElementById("userSum").innerHTML += "<p class=\"userLevel\">" + "Level: " + sLevel + "</p></br>";

	document.getElementById("solo").innerHTML = "<h3>Ranked Solo/Duo:</h3>";
	document.getElementById("solo").innerHTML += "<img src=\"./images/unrankedTier.png\" class=\"rankPic\"></img>"
	document.getElementById("solo").innerHTML += "<h3>UNRANKED</h3>";
	document.getElementById("solo").innerHTML += "<p>(Wins: 0 - Losses: 0)</p>";

	document.getElementById("threes").innerHTML = "<h3>Ranked Threes:</h3>";
	document.getElementById("threes").innerHTML += "<img src=\"./images/unrankedTier.png\" class=\"rankPic\"></img>"
	document.getElementById("threes").innerHTML += "<h3>UNRANKED</h3>";
	document.getElementById("threes").innerHTML += "<p>(Wins: 0 - Losses: 0)</p>";				

	document.getElementById("fives").innerHTML = "<h3>Ranked Fives:</h3>";
	document.getElementById("fives").innerHTML += "<img src=\"./images/unrankedTier.png\" class=\"rankPic\"></img>"
	document.getElementById("fives").innerHTML += "<h3>UNRANKED</h3>";
	document.getElementById("fives").innerHTML += "<p>(Wins: 0 - Losses: 0)</p>";

	if(sLevel == 30){

		var leagueUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.5/league/by-summoner/" + sID + "/entry?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

		$.ajax({
			url: leagueUrl,
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function(data){

				for(var i = 0; i < data[sID].length; i++){

					queue = data[sID][i].queue
					tier = data[sID][i].tier
					tier = tier.toLowerCase().trim() + "Tier";

					if(queue == "RANKED_SOLO_5x5"){
						document.getElementById("solo").innerHTML = "<h3>Ranked Solo/Duo:</h3>";
						document.getElementById("solo").innerHTML += "<img src=\"./images/" + tier + ".png\" class=\"rankPic\"></img><br>"
						document.getElementById("solo").innerHTML += "<h3>" + data[sID][i].tier + " " + data[sID][i].entries[0].division + " - " + data[sID][i].entries[0].leaguePoints + " LP</h3>";
						document.getElementById("solo").innerHTML += "<p>(Wins: " + (data[sID][i].entries[0].wins + " - Losses: " + data[sID][i].entries[0].losses) + ")</p>";
					}

					if(queue == "RANKED_TEAM_3x3"){
						document.getElementById("threes").innerHTML = "<h3>Ranked Threes:</h3>";						
						document.getElementById("threes").innerHTML += "<img src=\"./images/" + tier + ".png\" class=\"rankPic\"></img><br>"
						document.getElementById("threes").innerHTML += "<h3>" + (data[sID][i].tier + " " + data[sID][i].entries[0].division) + + " - " + data[sID][i].entries[0].leaguePoints + " LP</h3>";
						document.getElementById("threes").innerHTML += "<p>(Wins: " + (data[sID][i].entries[0].wins + " - Losses: " + data[sID][i].entries[0].losses) + ")</p>";
					}

					if(queue == "RANKED_TEAM_5x5"){
						document.getElementById("fives").innerHTML = "<h3>Ranked Fives:</h3>";
						document.getElementById("fives").innerHTML += "<img src=\"./images/" + tier + ".png\" class=\"rankPic\"></img><br>"
						document.getElementById("fives").innerHTML += "<h3>" + (data[sID][i].tier + " " + data[sID][i].entries[0].division) + " - " + data[sID][i].entries[0].leaguePoints + " LP</h3>";
						document.getElementById("fives").innerHTML += "<p>(Wins: " + (data[sID][i].entries[0].wins + " - Losses: " + data[sID][i].entries[0].losses) + ")</p>";
					}
				}
			},
			error:function (xhr, ajaxOptions, thrownError){
    			if(xhr.status==404) {
    				console.log("404 Error: Page does not exist.");
    			}
			}
		})
	}
}

function getWinStats(id, region, season){
	var winUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + id + "/summary?season=" + season + "&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	$.ajax({
		url: winUrl,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function(data){
			console.log(data)
			for(var i = 0; i < data["playerStatSummaries"].length; i++){
				if(data["playerStatSummaries"][i].playerStatSummaryType == "Unranked"){

					document.getElementById("userStats").innerHTML += "<p>Normal Wins: " + data["playerStatSummaries"][i].wins + "</p>"

				} else if(data["playerStatSummaries"][i].playerStatSummaryType == "CAP5x5"){

					document.getElementById("userStats").innerHTML += "<p>Dominion Wins: " + data["playerStatSummaries"][i].wins + "</p>"

				} else if(data["playerStatSummaries"][i].playerStatSummaryType == "AramUnranked5x5"){

					document.getElementById("userStats").innerHTML += "<p>ARAM Wins: " + data["playerStatSummaries"][i].wins + "</p>"

				} else if(data["playerStatSummaries"][i].playerStatSummaryType == "Unranked3x3"){

					document.getElementById("userStats").innerHTML += "<p>Twisted Treeline Wins: " + data["playerStatSummaries"][i].wins + "</p>"

				} else if(data["playerStatSummaries"][i].playerStatSummaryType == "CoopVsAI3x3"){

					document.getElementById("userStats").innerHTML += "<p>Co-op vs. AI 3x3: " + data["playerStatSummaries"][i].wins + "</p>"

				} else if(data["playerStatSummaries"][i].playerStatSummaryType == "CoopVsAI"){

					document.getElementById("userStats").innerHTML += "<p>Co-op vs. AI 5x5: " + data["playerStatSummaries"][i].wins + "</p>"

				}
			}
		}
	})
}

function getRecentChamps(id, region, season){
	//get match history
	var optargs = ""

	if (season != undefined) {
		optargs += "&seasons=" + season;
	};

	var matchHistUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/matchlist/by-summoner/" + id + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec" + optargs;

	$.ajax({		
			url: matchHistUrl,
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function(data){
				console.log(data)
				// Change this value based on how many games you want
				var gamesToDisplay = 3;
				console.log(data.matches[0])
				if(data.totalGames > gamesToDisplay-1){
					for(var i = 0; i < gamesToDisplay; i++){
				 		displayChamp(id, data.matches[i], region,i);
				 	}
				}
			}
		})
}

function displayChamp(id, match, region, iterator){
	var champKey = match.champion;
	var champName = getChampName(champKey)
	var champPic;
	console.log(match.champion)
	divdest = "last"+iterator
	document.getElementById(divdest).innerHTML = getChampPic(getChampKey(champKey))
}

// Retrieves all of the champion's data and stores it into the champIdMap
function getChampIdMap(callback){

	$.ajax({
		url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec",
		type: 'GET',
		dataType: 'json',
		success: function(data){

			champIdMap = data;
		}
	})
}

//Retrieves all of the item data and stores it into the itemIdMap
function getItemIdMap(callback){

	$.ajax({
		url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec",
		type: 'GET',
		dataType: 'json',
		success: function(data){

			itemIdMap = data;
		}
	})
}

//Retrieves all of the spell data and stores it into the spellIdMap
function getSpellIdMap(callback){

	$.ajax({
		url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec",
		type: 'GET',
		dataType: 'json',
		success: function(response){
			for (var i in response.data){
				//Make our own map. Their json data doesn't work with what we want.
				spellIdMap[response.data[i].id] = response.data[i].name
				spellImgMap[response.data[i].id] = response.data[i].key
			}
		}
	})
}

// Gets the champion's name (full name with punctuation)
// Title is a boolean to return the title as well
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
function getChampPic(champKey,champName){
	return "<img title=\"" + champName + "\"class=\"champPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/" + champKey + ".png\"></img>"
}

function getSpellPic(spellName,spellRealName){
	return "<img title=\"" + spellRealName + "\"class=\"spellPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/spell/" + spellName + ".png\"></img>"
}

function getItemPic(itemId,itemName) {
	return "<img title=\"" + itemName + "\"class=\"itemPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/item/" + itemId + ".png\"></img>"
}

function getIconPic(iconId){
	return "<img class=\"iconPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.23.1/img/profileicon/" + iconId + ".png\"></img>"
}