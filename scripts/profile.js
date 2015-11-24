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

 		$("#userSum").show();
	}


	$("#goButton").click(function(){
 		clear("userstats")
 		clear("userSum")

 		$("#userSum").show();

		var username = $("#username").val()
		var region = $('#region').val()
		var season = $('#season').val()
	
		getID(username, region, season);
  	});

 	$("#clearButton").click(function(){
 		clear("userstats")
 	});
});

function clear(id){
	document.getElementById(id).innerHTML = ""
}


function getID(user, region, season){
	var summonerUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.4/summoner/by-name/" + user + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

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

			dispSum(icon, user, sLevel);

			var statsUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + sID + "/ranked?season=" + season + "&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

			getWinStats(sID, region, season);
			getRankedSoloStats(sID, region);
			getAramStats(sID, region, season);
		}
	})
}

function dispSum(icon, user, sLevel){
	
	document.getElementById("userSum").innerHTML += getIconPic(icon);
	document.getElementById("userSum").innerHTML += "<p class=\"userName\">" + user + "</p>";
	document.getElementById("userSum").innerHTML += "<p class=\"userLevel\">" + "Level: " + sLevel + "</p></br>";
}

function getWinStats(id, region, season) {
	var winUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + id + "/summary?season=" + season + "&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	$.ajax({
		url: winUrl,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function(data){

			document.getElementById("userstats").innerHTML += "Win Stats:" + "</br>"
			document.getElementById("userstats").innerHTML += data["playerStatSummaries"][0].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][0].wins + "</br>"
			document.getElementById("userstats").innerHTML += data["playerStatSummaries"][data["playerStatSummaries"].length-2].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-2].wins + "</br>"
			document.getElementById("userstats").innerHTML += data["playerStatSummaries"][data["playerStatSummaries"].length-1].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-1].wins + "</br>"

		}
	})
}

function getRankedSoloStats(id, region){
	var rankedSoloUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.5/league/by-summoner/" + id + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	$.ajax({
		url: rankedSoloUrl,
		type: 'GET',
		dataType: 'json',
	
		success: function(data){
			for (var i = 0; i < data[id].length - 1; i++) {
				if (data[id][i].queue == "RANKED_SOLO_5x5") {
					displayRankedSoloStats(id,data,i);
				}
			};
		}
	})
}

function displayRankedSoloStats(id, data, place){

	document.getElementById("userstats").innerHTML += "Ranked League:" + "</br>"
	document.getElementById("userstats").innerHTML += data[id][place].name + " " + data[id][place].tier + " - " + data[id][place].entries[0].division + " at " + data[id][0].entries[0].leaguePoints + " LP" + "</br>"
}

function getAramStats(id, region, season){
	var statsUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v1.3/stats/by-summoner/" + id + "/summary?season=" + season + "&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	
	$.ajax({
		url: statsUrl,
		type: 'GET',
		dataType: 'json',

		success: function(data){

			for (var i = 0; i < data.playerStatSummaries.length; i++) {
				if (data.playerStatSummaries[i].playerStatSummaryType == "AramUnranked5x5") {
					displayAramStats(id,data,i);
				}
			};
		}
	})
}

function displayAramStats(id, data, place){
	totKills = data.playerStatSummaries[place].aggregatedStats.totalChampionKills;
	totAssists = data.playerStatSummaries[place].aggregatedStats.totalAssists;
	totWins = data.playerStatSummaries[place].wins;

	document.getElementById("userstats").innerHTML += "ARAM Stats:" + "</br>"
	document.getElementById("userstats").innerHTML += "Kills: " + totKills + "</br>" + " Assists: " + totAssists  + "</br>" + " Wins: " + totWins + "</br>"

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
function getChampName(champId, title){
	var champion;
	for(var key in champIdMap.data){
		if(champIdMap.data[key].id == champId){
			if (title = false){
				return champIdMap.data[key].name;
			}else{
				return champIdMap.data[key].name + ", " + champIdMap.data[key].title;				
			}
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