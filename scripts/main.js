var champIdMap
var itemIdMap
var spellIdMap = {}
var spellImgMap = {}
var tableNum = 0;

$(document).ready(function(){
	getChampIdMap()
	getItemIdMap()
	getSpellIdMap()

	var loc = window.location.pathname;
	var dir = loc.substring(0, loc.lastIndexOf('/'));
		var parameters = location.search.substring(1).split("&");
	if (parameters != ""){
		var splitParams = parameters[0].split("=");

		var username = unescape(parameters[0].split("=")[1])
		var region = parameters[1].split("=")[1]
		var season = parameters[2].split("=")[1]

		getID(username, region, season);
	}

	$("#goButton").click(function(){
 		clear("resultsTableDiv")

		var username = $("#username").val()
		var region = $('#region').val()
		var season = $('#season').val()
	
		getID(username, region, season);
	});

	$("#clearButton").click(function(){
		clear("resultsTableDiv")
	});

});

function clear(id){
	document.getElementById(id).innerHTML = ""
}

function getID(user, region, season){

	var summonerUrl = "https://" + region + ".api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/" + user + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
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

			getMatchHistory(sID,region,season)
		}
	})
}

function getMatchHistory(id, region, season){

	var optargs = ""

	if (season != undefined) {
		optargs += "&season=" + season;
	};

	var matchHistUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/matchlist/by-summoner/" + id + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec" + optargs;

	$.ajax({
			
			url: matchHistUrl,
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function(data){

				document.getElementById("resultsTableDiv").innerHTML += "<p class=\"matchTitle\">" + "Match History:" + "</p>"

				// Change this value based on how many games you want
				var gamesToDisplay = 3;

				if(data.totalGames > gamesToDisplay-1){
					for(var i = 0; i < gamesToDisplay; i++){
				 		displayGame(id, data.matches[i], region);
				 	}
				}
			}
		})
}

function displayGame(playerID, match, region){

	getMatchInfo(region,match.matchId);

	var name = getChampName(match.champion,false)
}

function getMatchInfo(region, matchId){
	var matchUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/match/" + matchId + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	var champKey;
	var champPic;
	var KDA = [0,0,0];
	$.ajax({
			
			url: matchUrl,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				createTable((data.participants.length/2),tableNum);
				var tableId = tableNum + ""

				for(var i = 0; i < data.participants.length; i++){

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
					var playerdivdest = team + "_player_champ"  + tableId + teamplayernum

					document.getElementById(playerdivdest).innerHTML = champPic;

					//Summoners
					playerdivdest = team + "_player_spells" + tableId + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					getSpellPic(spellImgMap[data.participants[i].spell1Id],spellIdMap[data.participants[i].spell1Id]) + 
					getSpellPic(spellImgMap[data.participants[i].spell2Id],spellIdMap[data.participants[i].spell2Id]);

					//Name
					playerdivdest = team + "_player_name" + tableId + teamplayernum
					document.getElementById(playerdivdest).innerHTML =
					data.participantIdentities[i].player.summonerName; 

					//KDA
					playerdivdest = team + "_player_kda" + tableId + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					KDA[0] + "/" + KDA[1] + "/" + KDA[2];

					//End game items
					playerdivdest = team + "_player_items" + tableId + teamplayernum

					for (var itemnum = 0; itemnum < 7; itemnum++){
						var itemstring = "item"+itemnum
						var itemnump = itemnum+1
						if(itemIdMap.data.hasOwnProperty(data.participants[i].stats[itemstring])){
							document.getElementById(playerdivdest).innerHTML +=
							getItemPic(data.participants[i].stats[itemstring],itemIdMap.data[data.participants[i].stats[itemstring]].name)
						}else{
							//Need to make a empty item slot picture
							document.getElementById(playerdivdest).innerHTML += 
								"<img alt=\"No Item\"title=\"No Item\"class=\"iconPic\"src=\"./images/empty.png\"></img>"
						}
					}

					//Gold`
					playerdivdest = team + "_player_gold" + tableId + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					data.participants[i].stats.goldEarned;

					//CS
					playerdivdest = team + "_player_cs" + tableId + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					data.participants[i].stats.minionsKilled ;

					//Wards
					playerdivdest = team + "_player_wards" + tableId + teamplayernum
					document.getElementById(playerdivdest).innerHTML = 
					data.participants[i].stats.wardsPlaced;				
				}

				tableNum++;
			}
		})
}

//Argument is the number of players per team
function createTable(teamplayersNum, tableNum){

	//Create the table
	tableId = tableNum + ""
	var table = document.createElement('TABLE');
	table.setAttribute("class","resultstable")
	table.setAttribute("id","resultstable" + tableId)

	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	tableBody.setAttribute("class", "resultstablebody")
	tableBody.setAttribute("id", "resultstablebody")

	var summary_row = document.createElement('TR');
	tableBody.appendChild(summary_row);
	summary_row.setAttribute("class", "summary_row")
	summary_row.setAttribute("id", "summary_row")

	//Icons
	var iconslist = ["champion","spells","name","score","items","gold","minion","wards"]
	for (var i = 0; i < 2; i++) {
		var tdContainer = document.createElement('TD');
		for (var icon in iconslist){
			var td = document.createElement('TD');
			var tag = "icon" + "_" + icon;
		    td.setAttribute("class", tag)
			td.setAttribute("id", tag)

			if( i == 0 ){
				td.style.backgroundColor = "#0b3d59";
			} else{
				td.style.backgroundColor = "#6F0007";
			}

			if (iconslist[icon] != "name"){
				td.innerHTML = "<img alt=\"" + iconslist[icon] + "\"title=\"" + iconslist[icon] + "\"class=\"iconPic\"src=\"./images/" + iconslist[icon] + ".png\"></img>"
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

		player_row.setAttribute("class",  "player_row" + playernum)
		player_row.setAttribute("id",  "player_row" + tableId + playernum)

		// Blue player table
		var player_a = document.createElement('TD')

		player_a.setAttribute("class", "blue_player" + playernum)
		player_a.setAttribute("id", "blue_player" + tableId + playernum)

		for(var col in colslist){
			var currTD = document.createElement('TD')

			currTD.setAttribute("id", "blue_player_" + colslist[col] + tableId + playernum)
			currTD.setAttribute("class", "blue_player_" + colslist[col]);
			currTD.style.backgroundColor = "#0b3d59";
			player_a.appendChild(currTD)
		}

		// Red player table
		var player_b = document.createElement('TD')

		player_b.setAttribute("class", "red_player" + playernum)
		player_b.setAttribute("id", "red_player"+ tableId + playernum)

		for(var col in colslist){
			var currTD = document.createElement('TD')

			currTD.setAttribute("id", "red_player_" + colslist[col] + tableId + playernum)
			currTD.setAttribute("class", "red_player_" + colslist[col]);
			currTD.style.backgroundColor = "#6F0007";
			player_b.appendChild(currTD)
		}

        player_row.appendChild(player_a)
        player_row.appendChild(player_b)
	}
	document.getElementById('resultsTableDiv').appendChild(table);
}

function getKDA(data,participantId){
	return [data.stats.kills,
			 			 data.stats.deaths,
			 			 data.stats.assists]
}

function KDACallback(KDA,container){
	document.getElementById(container).innerHTML += "Kills: " + KDA[0] + " Deaths: " + KDA[1] + " Assists: " + KDA[2]+ "</br>" 
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

function getItemPic (itemId,itemName) {
	return "<img title=\"" + itemName + "\"class=\"itemPic\" src=\"http://ddragon.leagueoflegends.com/cdn/5.22.3/img/item/" + itemId + ".png\"></img>"
}