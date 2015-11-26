$(document).ready(function(){

	var parameters = location.search.substring(1).split("&");
	
	if(parameters != ""){
		var splitParams = parameters[0].split("=");

		var username = unescape(parameters[0].split("=")[1])
		var region = parameters[1].split("=")[1]
		var queue = parameters[2].split("=")[1]

		getID(username, region, queue);
	}

	$(".goButton").click(function(){

		var username = $("#username").val()
		var region = $('#region').val()
		var season = $('#season').val()
		// season not used in this page. May remove after

		getID(username, region, season);
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
		success: function(data){
			user = user.replace(" ", "");
			user = user.toLowerCase().trim();

			sID = data[user].id;

			getLeagues(region, sID);
		}
	})
}

function getLeagues(region, sID){
	
	var leagueUrl = "https://" + region + ".api.pvp.net/api/lol/" + region + "/v2.5/league/by-summoner/" + sID + "?api_key=a45ee173-8cd1-4345-955c-c06a8ae10bec"

	$.ajax({
		url: leagueUrl,
		type: 'GET',
		dataType: 'json',
		success: function(data){

			for(i = 0; i < data[sID].length; i++){

				if(data[sID][i].queue == "RANKED_SOLO_5x5"){
					
					tier = data[sID][i].tier

					var divisionList = [];

					// Find the division the summoner is in
					for(j = 0; j < data[sID][i].entries.length; j++){
						
						if(sID == data[sID][i].entries[j].playerOrTeamId){
							division = data[sID][i].entries[j].division
						}
					}

					// Push all the summoners of the same divison into the divisionList
					for(j = 0; j < data[sID][i].entries.length; j++){
						
						if(division == data[sID][i].entries[j].division){
							divisionList.push(data[sID][i].entries[j])
						}
					}

					// Sorts the divison list
					divisionList.sort(function(a, b){
    					return b.leaguePoints - a.leaguePoints;
					});

					// Builds the table
					buildTable(tier, divisionList, sID)

					break;
				}

			}

		}
	})
}

function buildTable(tier, divisionList, sID){

	clear("container")

	newTable = document.createElement("table");
	newTable.setAttribute("class", "table table-inverse");
	newBody = document.createElement("tbody");

	titles = ["Rank", "Summoner Name", "Emblems", "Wins", "LP/Series"]

	newRow = document.createElement("tr");

	for(title in titles){
		newCol = document.createElement("th");
		text = document.createTextNode(titles[title]);
		newCol.appendChild(text)
		newRow.appendChild(newCol)
	}

	newBody.appendChild(newRow)

	for(i = 0; i < divisionList.length; i++){
		
		newRow = document.createElement("tr");

		if(divisionList[i].playerOrTeamId == sID){
			newRow.setAttribute("style", "background-color: #424242;");
		}


		for(j = 0; j < 5; j++){
			newCol = document.createElement("td");
			text = document.createTextNode("")

			if(j == 0){

				text.nodeValue = i+1

			} else if(j == 1){

				text.nodeValue = divisionList[i].playerOrTeamName

			} else if(j == 2){

				hot = document.createElement("div")
				hot.setAttribute("id", "hot")
				fresh = document.createElement("fresh")
				fresh.setAttribute("id", "fresh")

				hot.innerHTML = "<img title=\"Hot Streak (3 wins in a row)\" src=\"./images/hot.png\">"
				fresh.innerHTML = "<img title=\"Fresh (New to this Divison)\" src=\"./images/fresh.png\">"

				if(divisionList[i].isFreshBlood == false){
					fresh.style.opacity = "0.1";
				}

				if(divisionList[i].isHotStreak == false){
					hot.style.opacity = "0.1";
				}

				newCol.appendChild(hot)
				newCol.appendChild(fresh)

			} else if(j == 3){

				text.nodeValue = divisionList[i].wins

			} else if(j == 4){

				if(divisionList[i].leaguePoints == 100 && (tier != "CHALLENGER" && tier != "MASTER")){

					progress = divisionList[i].miniSeries.progress

					progress = progress.split("")

					for(k = 0; k < progress.length; k++){

						if(progress[k] == "N"){
							progress[k] = "\u2610";	//box
						}

						if(progress[k] == "W"){
							progress[k] = "\u2611";	//checkmark
						}

						if(progress[k] == "L"){
							progress[k] = "\u2612";	//x
						}
					}

					progress = progress.join("")

					text.nodeValue = progress

				} else{

					text.nodeValue = divisionList[i].leaguePoints

				}
			}

			newCol.appendChild(text)
			newRow.appendChild(newCol)
		}
		
		newBody.appendChild(newRow)
	}

	newTable.appendChild(newBody);
	document.getElementById("container").appendChild(newTable)
}


