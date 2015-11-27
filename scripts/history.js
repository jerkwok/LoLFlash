var champIdMap
var itemIdMap
var spellIdMap = {}
var spellImgMap = {}
var tableNum = 0;

$(document).ready(function(){
	getChampIdMap()
	getItemIdMap()
	getSpellIdMap()

	var parameters = location.search.substring(1).split("&");
	
	if(parameters != ""){
		var splitParams = parameters[0].split("=");

		var username = unescape(parameters[0].split("=")[1])
		var region = parameters[1].split("=")[1]
		var queue = parameters[2].split("=")[1]

		getID(username, region, queue);
	}

	$(".goButton").click(function(){
 		clear("resultsTableDiv")

		var username = $("#username").val()
		var region = $('#region').val()
		var season = $('#season').val()
	
		writeDB("history")
		getID(username, region, season);
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

				document.getElementById("resultsTableDiv").innerHTML += "<p class=\"matchTitle\">" + "Match History" + "</br>(click to expand/collapse)</p>"

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

	getMatchInfo(region,match.matchId,playerID);

	var name = getChampName(match.champion,false)
}

function getMatchInfo(region, matchId,playerID){
	var matchUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.2/match/" + matchId + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"
	var champKey;
	var champPic;
	var KDA = [0,0,0];
	$.ajax({
			
			url: matchUrl,
			type: 'GET',
			dataType: 'json',
			success: function(data){

				//find out who's game we're looking at
				for(var i = 0; i < data.participantIdentities.length; i++){
					if (data.participantIdentities[i].player.summonerId == playerID)
					spotlightID = data.participantIdentities[i].participantId - 1
				}
				createTable((data.participants.length/2),tableNum);
				var tableId = tableNum + ""

				//create mini match table

				console.log(data)

				//minitable summary
				//match id
				var playerdivdest = "minisummary_" + "id" + tableId
				document.getElementById(playerdivdest).innerHTML = 				
					"MatchId: " + matchId

				//date of game
				var playerdivdest = "minisummary_" + "date" + tableId

				var d = new Date(data.matchCreation);

				document.getElementById(playerdivdest).innerHTML = 				
					d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

				//duration
				var playerdivdest = "minisummary_" + "duration" + tableId
				var formattedDate = ""
				var hours = ""
				var minutes = ""
				var seconds = ""
				if (data.matchDuration > 3600){
					hours = Math.floor(data.matchDuration/60) 
					minutes = Math.floor(data.matchDuration - 3600 / 60)
					seconds = (data.matchDuration - 3600) % 60
				} else{
					minutes = Math.floor(data.matchDuration / 60)
					seconds = (data.matchDuration) % 60 
				}

				if (minutes < 10){
					minutes = "0" + minutes
				}

				if (seconds < 10){
					seconds = "0" + seconds
				}

				if (data.matchDuration > 3600){
					formattedDate = formattedDate + hours + ":"
				}

				formattedDate = formattedDate + minutes + ":" + seconds
				

				document.getElementById(playerdivdest).innerHTML = 				
					"Duration: " + formattedDate;

				//result
				var playerdivdest = "minisummary_" + "result" + tableId
				// console.log((data.participants[spotlightID].teamId-100)/100)
				if (data.teams[(data.participants[spotlightID].teamId-100)/100].winner == true){
					document.getElementById(playerdivdest).innerHTML = 				
						"Victory"
				}else{
					document.getElementById(playerdivdest).innerHTML = 				
						"Defeat"
				}

				//minitable elements
				var playerdivdest = "miniplayer_" + "champ" + tableId
				document.getElementById(playerdivdest).innerHTML = 
				getChampPic(getChampKey(data.participants[spotlightID].championId),
					getChampName(data.participants[spotlightID].championId,true))
				
				var playerdivdest = "miniplayer_" + "spells" + tableId
				document.getElementById(playerdivdest).innerHTML = 
					getSpellPic(spellImgMap[data.participants[spotlightID].spell1Id],spellIdMap[data.participants[spotlightID].spell1Id]) + 
					getSpellPic(spellImgMap[data.participants[spotlightID].spell2Id],spellIdMap[data.participants[spotlightID].spell2Id]);
				
				var playerdivdest = "miniplayer_" + "kda" + tableId
				KDA = getKDA(data.participants[spotlightID],spotlightID);
				var ratio=parseFloat((KDA[0]+KDA[2])/KDA[1]).toFixed(2);
				document.getElementById(playerdivdest).innerHTML = KDA[0] + "/" + KDA[1] + "/" + KDA[2] +"</br>" +" KDA:" 
				+ ratio;
				
				var playerdivdest = "miniplayer_" + "items" + tableId
				console.log(data.participants[spotlightID])
				for (var itemnum = 0; itemnum < 7; itemnum++){
						var itemstring = "item"+itemnum
						var itemnump = itemnum+1
						console.log(data.participants[spotlightID].stats[itemstring])
						if(itemIdMap.data.hasOwnProperty(data.participants[spotlightID].stats[itemstring])){
							document.getElementById(playerdivdest).innerHTML +=
							getItemPic(data.participants[spotlightID].stats[itemstring],itemIdMap.data[data.participants[spotlightID].stats[itemstring]].name)
						}else{
							//Need to make a empty item slot picture
							document.getElementById(playerdivdest).innerHTML += 
								"<img alt=\"No Item\"title=\"No Item\"class=\"iconPic\"src=\"./images/empty.png\"></img>"
						}
				}

				var playerdivdest = "miniplayer_" + "stats" + tableId
				document.getElementById(playerdivdest).innerHTML = 
				"CS: "+
				data.participants[spotlightID].stats.minionsKilled + 
				" Wards: "+
				data.participants[spotlightID].stats.wardsPlaced


				//Create full match table
				for(var i = 0; i < data.participants.length; i++){

					champKey = getChampKey(data.participants[i].championId);
					champPic = getChampPic(champKey,getChampName(data.participants[i].championId,true));
					KDA = getKDA(data.participants[i],i);

					//Team variables
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

function tableClick(clickedNum){
	console.log(clickedNum)
	tablestring = "#resultstable"+clickedNum
	if ($(tablestring).is(':visible')){
		// $(tablestring).hide()		
		$(tablestring).fadeOut('fast')		
	}else{
		// $(tablestring).show()
		$(tablestring).fadeIn('fast')
	}
}

//Argument is the number of players per team
function createTable(teamplayersNum, tableNum){

	tableId = tableNum + ""
	//Create mini table
	var minitable = document.createElement('TABLE');
	minitable.setAttribute("class","minitable")
	minitable.setAttribute("id","miniresultstable" + tableId)
	minitable.setAttribute("onclick","tableClick("+tableId+")")

	var minitableBody = document.createElement('TBODY');
	minitable.appendChild(minitableBody);
	minitableBody.setAttribute("class", "miniresultstablebody")
	minitableBody.setAttribute("id", "miniresultstablebody")

	var minisummary = document.createElement('TABLE');
	minisummary.setAttribute("class","minisummary")
	minisummary.setAttribute("id","miniresultstableS" + tableId)
	minisummary.setAttribute("onclick","tableClick("+tableId+")")

	var minisummaryBody = document.createElement('TBODY');
	minisummary.appendChild(minisummaryBody);
	minisummaryBody.setAttribute("class", "miniresultstableSbody")
	minisummaryBody.setAttribute("id", "miniresultstableSbody")

	var minisummary_row = document.createElement('TR');
	minisummaryBody.appendChild(minisummary_row);
	minisummary_row.setAttribute("class", "minisummary_row")
	minisummary_row.setAttribute("id", "minisummary_row")

	var minisumcolslist = ["id","date","duration","result"]

	for(var col in minisumcolslist){
		var currTD = document.createElement('TD')

		currTD.setAttribute("id", "minisummary_" + minisumcolslist[col] + tableId)
		currTD.setAttribute("class", "minisummary_" + minisumcolslist[col]);
		currTD.style.backgroundColor = "#0b3d59";
		minisummary_row.appendChild(currTD)
	}

	var minicolslist = ["champ","spells","kda","items","stats"]
	var miniplayer_row = document.createElement('TR');
	minitableBody.appendChild(miniplayer_row);

	miniplayer_row.setAttribute("class", "miniplayer_row")
	miniplayer_row.setAttribute("id",  "miniplayer_row" + tableId)

	for(var col in minicolslist){
		var currTD = document.createElement('TD')

		currTD.setAttribute("id", "miniplayer_" + minicolslist[col] + tableId)
		currTD.setAttribute("class", "miniplayer_" + minicolslist[col]);
		currTD.style.backgroundColor = "#0b3d59";
		miniplayer_row.appendChild(currTD)
	}
	

	//Create the table
	var table = document.createElement('table');
	table.setAttribute("class","resultstable")
	table.setAttribute("id","resultstable" + tableId)

	var tableBody = document.createElement('tbody');
	table.appendChild(tableBody);
	tableBody.setAttribute("class", "resultstablebody")
	tableBody.setAttribute("id", "resultstablebody")

	var summary_row = document.createElement('tr');
	summary_row.setAttribute("class", "summary_row")
	summary_row.setAttribute("id", "summary_row")

	//Icons
	var iconslist = ["champion","spells","name","score","items","gold","minion","wards"]
	for (var i = 0; i < 2; i++) {
		for (var icon in iconslist){
			var th = document.createElement('th');
			var tag = "icon" + "_" + icon;
		    th.setAttribute("class", tag)
			th.setAttribute("id", tag + i)

			if( i == 0 ){
				th.style.backgroundColor = "#0b3d59";
			} else{
				th.style.backgroundColor = "#6F0007";
			}

			if (iconslist[icon] != "name"){
				th.innerHTML = "<img alt=\"" + iconslist[icon] + "\"title=\"" + iconslist[icon] + "\"class=\"iconPic\"src=\"./images/" + iconslist[icon] + ".png\"></img>"
			}else{
				th.innerHTML = "Name"
			}
			summary_row.appendChild(th);
		}
	}

	tableBody.appendChild(summary_row);

	var colslist = ["champ","spells","name","kda","items","gold", "cs","wards"]
	for (var playernum = 0; playernum < teamplayersNum; playernum++){
		var player_row = document.createElement('tr');

		player_row.setAttribute("class",  "player_row" + playernum)
		player_row.setAttribute("id",  "player_row" + tableId + playernum)

		// Blue player table

		for(var col in colslist){
			var currTD = document.createElement('td')

			currTD.setAttribute("id", "blue_player_" + colslist[col] + tableId + playernum)
			currTD.setAttribute("class", "blue_player_" + colslist[col]);
			currTD.style.backgroundColor = "#0b3d59";
			player_row.appendChild(currTD)
		}

		// Red player table

		for(var col in colslist){
			var currTD = document.createElement('td')

			currTD.setAttribute("id", "red_player_" + colslist[col] + tableId + playernum)
			currTD.setAttribute("class", "red_player_" + colslist[col]);
			currTD.style.backgroundColor = "#6F0007";
			player_row.appendChild(currTD)
		}

        tableBody.appendChild(player_row);
	}


	document.getElementById('resultsTableDiv').appendChild(minisummary);
	document.getElementById('resultsTableDiv').appendChild(minitable);
	document.getElementById('resultsTableDiv').appendChild(table);
	$("#resultstable" + tableId).hide();
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
			console.log(data)
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