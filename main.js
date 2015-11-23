var champIdMap
var itemIdMap
var spellIdMap = {}
var spellImgMap = {}

$(document).ready(function(){
	getChampIdMap()
	getItemIdMap()
	getSpellIdMap()
	//Calls the ajax at the start

 $("#goButton").click(function(){
 	console.log(itemIdMap)

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
 	// clear("teamA")
 	// clear("teamB")
 	clear("userstats")
 });

});

function clear(id){
	document.getElementById(id).innerHTML = ""
}


function getID(user,region,season){
	var summonerurl = "https://" + region + ".api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/" + user + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	// console.log(season);

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
			document.getElementById("userstats").innerHTML += "Name: " + user + "</br>";
			document.getElementById("userstats").innerHTML += "Level: " + sLevel + "</br>";
			document.getElementById("userstats").innerHTML += "ID: " + sID + "</br>";

			// var statsurl = "https://" + region + ".api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/" + sID + "/ranked?season="+ season +"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

			// getwinstats(sID,region,season);
			// getrankedsolostats(sID,region);
			// getaramstats(sID,region,season);
			getMatchHistory(sID,region,season)
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

	var currgameurl = "https://" + region + ".api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/"+region+"/"+id+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	$.ajax({
		url: currgameurl,
		type: 'GET',
		dataType: 'json',	
		data: {
			success: function(data){
				//console.log("Current Game:")
				document.getElementById("userstats").innerHTML += "Current Game:" + "</br>"
				//console.log(data)
				document.getElementById("userstats").innerHTML += data + "</br>"
			}
		}
	})
}

function getwinstats (id,region,season) {
	var winurl = "https://" + region + ".api.pvp.net/api/lol/"+region+"/v1.3/stats/by-summoner/"+id+"/summary?season="+season+"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

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
			document.getElementById("userstats").innerHTML += "Win Stats:" + "</br>"
			document.getElementById("userstats").innerHTML += data["playerStatSummaries"][0].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][0].wins + "</br>"
			document.getElementById("userstats").innerHTML += data["playerStatSummaries"][data["playerStatSummaries"].length-2].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-2].wins + "</br>"
			document.getElementById("userstats").innerHTML += data["playerStatSummaries"][data["playerStatSummaries"].length-1].playerStatSummaryType + " Wins:" + data["playerStatSummaries"][data["playerStatSummaries"].length-1].wins + "</br>"

		}
	})
}

function getrankedsolostats(id, region){
	var rankedsolourl = "https://" + region + ".api.pvp.net/api/lol/"+region+"/v2.5/league/by-summoner/"+id+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
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
	document.getElementById("userstats").innerHTML += "Ranked League:" + "</br>"
	document.getElementById("userstats").innerHTML += data[id][place].name + " " + data[id][place].tier + " - " + data[id][place].entries[0].division + " at " + data[id][0].entries[0].leaguePoints + " LP" + "</br>"

}

function getaramstats(id,region,season){
	var statsurl = "https://" + region + ".api.pvp.net/api/lol/"+region+"/v1.3/stats/by-summoner/"+id+"/summary?season="+season+"&api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
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
	document.getElementById("userstats").innerHTML += "ARAM Stats:" + "</br>"
	document.getElementById("userstats").innerHTML += "Kills: " + totkills + "</br>" + " Assists: " + totassists  + "</br>" + " Wins: " + totwins + "</br>"

}

// function getMatchHistory (id,region,seasons,rankedQueues,champids,seasons,begintime,endtime,beginindex,endindex) {
function getMatchHistory (id,region,seasons) {
	console.log(seasons)
	//last 7 args are optional.
	var optargs = ""

	//these need to be comma separated values
	// if (champids != undefined) {
	// 	optargs += "&champids=" + champids;
	// };

	// if (rankedQueues != undefined) {
	// 	optargs += "&rankedQueues=" + starttime;
	// };

	if (seasons != undefined) {
		optargs += "&seasons=" + seasons;
	};

	// if (begintime != undefined) {
	// 	optargs += "&beginTime=" + begintime;
	// };

	// if (endtime != undefined) {
	// 	optargs += "&endTime=" + endtime;
	// };

	// if (beginindex != undefined) {
	// 	optargs += "?&beginIndex=" + beginindex;
	// };

	// if (endindex != undefined) {
	// 	optargs += "&endIndex=" + endindex;
	// };

	console.log(optargs)
	// if (region == "na") {
	// 	region = "NA1"
	// };
	var matchhisturl = "https://" + region + ".api.pvp.net/api/lol/"+region+"/v2.2/matchlist/by-summoner/"+id+"?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec" + optargs;
	console.log(matchhisturl)

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
				document.getElementById("userstats").innerHTML += "Match History:" + "</br>"
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

	var name = getChampName(match.champion,false)
	document.getElementById("userstats").innerHTML += "Match Id:" + match.matchId + 
		" Champion Played Id:" + match.champion + " Name:" + name
	//displayChampPic(name);
	document.getElementById("userstats").innerHTML +="</br>" 
	// var KDA = getKDA(match.matchId, playerID, region)
	// console.log(KDA)

	getMatchInfo(region, match.matchId);
}

function getMatchInfo(region, matchId){
	var matchurl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/match/" + matchId + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	var champKey;
	var champPic;
	var KDA = [0,0,0];
	$.ajax({
			
			url: matchurl,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				createTable((data.participants.length/2));

				var match = document.createElement("div");
				match.setAttribute("class", "match");

				// var teamA = document.createElement("div");
				// teamA.setAttribute("class", "teamA");
				// var teamB = document.createElement("div");
				// teamB.setAttribute("class", "teamB");

				// match.appendChild(teamA);
				// match.appendChild(teamB);
				console.log(data)	
				for(var i = 0; i < data.participants.length; i++){
					console.log(data.participants[i]);
					champKey = getChampKey(data.participants[i].championId);
					champPic = getChampPic(champKey,getChampName(data.participants[i].championId,true));
					KDA = getKDA(data.participants[i],i);

					if(data.participants[i].teamId == 100){
						var team = "blue"
						var teamplayernum = i

					} else{
						var team = "red"
						var teamplayernum = i-(data.participants.length/2)
					}
					//Champ
					var playerdivdest = team + "_player_champ" + teamplayernum
					document.getElementById(playerdivdest).innerHTML = champPic;

					//Summoners
					playerdivdest = team + "_player_spells" + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					getSpellPic(spellImgMap[data.participants[i].spell1Id],spellIdMap[data.participants[i].spell1Id]) + 
					getSpellPic(spellImgMap[data.participants[i].spell2Id],spellIdMap[data.participants[i].spell2Id]);

					//Name
					playerdivdest = team + "_player_name" + teamplayernum
					document.getElementById(playerdivdest).innerHTML =
					data.participantIdentities[i].player.summonerName; 

					//KDA
					playerdivdest = team + "_player_kda" + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					KDA[0] + "/" + KDA[1] + "/" + KDA[2];
					//"Kills: " + KDA[0] + " Deaths: " + KDA[1] + " Assists: " + KDA[2];

					//end game items
					playerdivdest = team + "_player_items" + teamplayernum

					for (var itemnum = 0; itemnum < 7; itemnum++){
						var itemstring = "item"+itemnum
						var itemnump = itemnum+1
						if(itemIdMap.data.hasOwnProperty(data.participants[i].stats[itemstring])){
							document.getElementById(playerdivdest).innerHTML +=
							getItemPic(data.participants[i].stats[itemstring],itemIdMap.data[data.participants[i].stats[itemstring]].name)
						}else{
							//need to make a empty item slot picture
							document.getElementById(playerdivdest).innerHTML += 
								"<img alt=\"No Item\"title=\"No Item\"class=\"iconPic\"src=\"./images/empty.png\"></img>"
						}
					}

					//Gold
					playerdivdest = team + "_player_gold" + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					data.participants[i].stats.goldEarned;

					//CS
					playerdivdest = team + "_player_cs" + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					data.participants[i].stats.minionsKilled ;

					//Wards
					playerdivdest = team + "_player_wards" + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					data.participants[i].stats.wardsPlaced;				
				}
				document.getElementById("matchlist").appendChild(match);
			}
		})
}

//argument is the number of players per team
function createTable(teamplayersNum){
	document.getElementById('resultstablediv').innerHTML = ""
	//Create the table

	var table = document.createElement('TABLE');
	table.setAttribute("class","resultstable")
	table.setAttribute("id","resultstable")

	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	tableBody.setAttribute("class", "resultstablebody")
	tableBody.setAttribute("id", "resultstablebody")

	var summary_row = document.createElement('TR');
	tableBody.appendChild(summary_row);
	summary_row.setAttribute("class", "summary_row")
	summary_row.setAttribute("id", "summary_row")

	var icons_row = document.createElement('TR');
	tableBody.appendChild(summary_row);
	icons_row.setAttribute("class", "icons_row")
	icons_row.setAttribute("id", "icons_row")

	//Icons
	var iconslist = ["champion","spells","name","score","items","gold","minion","wards"]
	for (var i = 0; i < 2; i++) {
		var tdContainer = document.createElement('TD');
		for (var icon in iconslist){
			var td = document.createElement('TD');
			var tag = "icon" + "_" + icon;
		    td.setAttribute("class", tag)
			td.setAttribute("id", tag)
			if (iconslist[icon] != "name"){
				td.innerHTML = "<img alt=\""+iconslist[icon]+"\"title=\""+iconslist[icon]+"\"class=\"iconPic\"src=\"./images/"+iconslist[icon]+".png\"></img>"
			}else{
				td.innerHTML = "Name"
			}
		    tdContainer.appendChild(td);
		}
		summary_row.appendChild(tdContainer);
	}

	var colslist = ["champ","spells","name","kda","items","gold", "cs","wards"]
	for (var playernum = 0; playernum < teamplayersNum; playernum++){
		var player_row = document.createElement('TR');
		tableBody.appendChild(player_row);

		var rowID = "player_row"+playernum
		player_row.setAttribute("class", rowID)
		player_row.setAttribute("id", rowID)

		//blue player table
		var player_a = document.createElement('TD')

		var playerDivId = "blue_player"+playernum
		player_a.setAttribute("class", playerDivId)
		player_a.setAttribute("id", playerDivId)

		for(var col in colslist){
			var currTD = document.createElement('TD')
			DivId = "blue_player_"+ colslist[col] +playernum

			// currTD.setAttribute("class", DivId)
			currTD.setAttribute("id", DivId)
			currTD.setAttribute("class", "blue_player_" + colslist[col]);
			player_a.appendChild(currTD)
		}

		//red player table
		var player_b = document.createElement('TD')

		var playerDivId = "red_player"+playernum
		player_b.setAttribute("class", playerDivId)
		player_b.setAttribute("id", playerDivId)

		for(var col in colslist){
			var currTD = document.createElement('TD')
			DivId = "red_player_"+ colslist[col] +playernum

			// currTD.setAttribute("class", DivId)
			currTD.setAttribute("id", DivId)
			currTD.setAttribute("class", "red_player_" + colslist[col]);
			player_b.appendChild(currTD)
		}

        player_row.appendChild(player_a)
        player_row.appendChild(player_b)
	}
	// console.log(document.getElementById('player_row0').children)
	document.getElementById('resultstablediv').appendChild(table);
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

//Retrieves all of the item data and stores it into the itemIdMap
function getItemIdMap(callback){

	// May need to find a better way to do this since it's bad when the internet is slow
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

	// May need to find a better way to do this since it's bad when the internet is slow
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
//title is a boolean to return the title as well
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
	return "<img title=\""+ champName + "\"class=\"champPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/" + champKey + ".png\"></img>"
}

function getSpellPic(spellName,spellRealName){
	return "<img title=\""+ spellRealName +"\"class=\"spellPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/spell/" + spellName + ".png\"></img>"
}

function getItemPic (itemId,itemName) {
	return "<img title=\""+ itemName +"\"class=\"itemPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/item/" + itemId + ".png\"></img>"
}