$(document).ready(function(){

	$("#recent").hide()

	$("#recentButton").click(function(){
		if ($("#recent").is(':visible')){
			$("#recent").fadeOut('fast')
		}else{
			$.ajax({
				url: "./scripts/displaysearches.php",
				success: function(response){
					console.log(response)
					splitresponse = response.split("<br />")
					responsedata = new Array(splitresponse.length);
					console.log(splitresponse)
					for (var i = 0; i < 10; i++) {
						responsedata[i] = new Array(4);
					}

					for (i = 0; i < splitresponse.length;i++){
						if (splitresponse[i] != ""){
							// console.log(splitresponse[i])
							rowdata = splitresponse[i].split(",")
							// console.log(rowdata)
							for(j = 0; j < 4; j++){
								responsedata[i][j] = rowdata[j]
							}
						}else{
							responsedata[i][0]= ""
						}
					}
					console.log(responsedata)
					buildTable(responsedata)
					// document.getElementById("recent").innerHTML = response
					$("#recent").fadeIn('fast')
				}
			})
		}
	});


	$("#findButton").click(function(){
	    var name = $("#username").val();
    	writeDB("profile")
	    if (name != undefined && name != null) {
	        window.location = './profile.html?username=' + name+'&region=' 
	        + $("#region").val() + '&season=' +  $("#season").val();
	    }
	    console.log(name)
	});

	$("#historyButton").click(function(){
	    var name = $("#username").val();
    	writeDB("history")
	    if (name != undefined && name != null) {
			window.location = './history.html?username=' + name+'&region=' 
				        + $("#region").val() + '&queue=' +  $("#queueType").val();
		}
	    
	});

	$("#leaguesButton").click(function(){
	    var name = $("#username").val();

	    if (name != undefined && name != null) {
	    	writeDB("leagues")
	        window.location = './leagues.html?username=' + name+'&region=' 
	        + $("#region").val() + '&queue=' + $("#queueType").val();
	    }
	    console.log(name)
	});

});

function buildTable(responsedata){

	regionMap = getregionMap();
	seasonMap = getseasonMap();
	newTable = document.createElement("table");
	newTable.setAttribute("class", "table table-inverse");
	newBody = document.createElement("tbody");

	for(i = 0; i < responsedata.length; i++){
		
			if (responsedata[i][1] != undefined){

			newRow = document.createElement("tr");
			var clickID = "rowClick("+i+")"
			newRow.setAttribute("onclick",clickID)
			var rowID = "results_row_" + i
			newRow.setAttribute("id",rowID)
			
			for(j = 1; j < 5; j++){
				newCol = document.createElement("td");
				text = document.createTextNode("")

				if(j == 1){
					//username
					text.nodeValue = responsedata[i][0]
				} else if(j == 2){
					//region
					text.nodeValue = regionMap[responsedata[i][1]]
				} else if(j == 3){
					//season
					text.nodeValue = seasonMap[responsedata[i][2]]
				} else if(j == 4){
					//history
					text.nodeValue = responsedata[i][3]
				}

				newCol.appendChild(text)
				newRow.appendChild(newCol)
			}
			
			newBody.appendChild(newRow)
		}
	}

	newTable.appendChild(newBody);
	document.getElementById("recent").appendChild(newTable)
}

function rowClick(row){

	RregionMap = getRregionMap();
	RseasonMap = getRseasonMap();

	console.log(RseasonMap)

	rowID = "results_row_" + row
	var rowdata = document.getElementById(rowID).childNodes
	window.location = './'+ rowdata[3].textContent +
				'.html?username=' + rowdata[0].textContent +
				'&region=' + RregionMap[rowdata[1].textContent] + 
				'&season=' + RseasonMap[rowdata[2].textContent];
	// console.log(rowID)
}

function getregionMap(){
	var regionMap = new Object();

	regionMap["na"]="North America"
 	regionMap["euw"]="Europe West"
 	regionMap["eune"]="Europe Nordic & East"
 	regionMap["br"]="Brazil"
 	regionMap["kr"]="Korea"
 	regionMap["tr"]="Turkey"
 	regionMap["ru"]="Russia"
 	regionMap["lan"]="Latin America North"
 	regionMap["las"]="Latin America South"
 	regionMap["oce"]="Oceania"

 	return regionMap
}

function getseasonMap(){
	var seasonMap = new Object();

 	seasonMap["PRESEASON3"]="Preseason 3"
    seasonMap["SEASON3"]="Season 3"
    seasonMap["PRESEASON2014"]="Preseason 4"
    seasonMap["SEASON2014"]="Season 4"
    seasonMap["PRESEASON2015"]="Preseason 5"
    seasonMap["SEASON2015"]="Season 5"
    seasonMap["PRESEASON2016"]="Preseason 6"

    return seasonMap
}

function getRregionMap(){

    var RregionMap = new Object();
    regionMap = getregionMap();
    for(i in regionMap){
    	RregionMap[regionMap[i]] = i
    }

    return RregionMap
}

function getRseasonMap(){
	var RseasonMap = new Object();
	seasonMap = getseasonMap();
    for(i in seasonMap){
    	RseasonMap[seasonMap[i]] = i
    }

    return RseasonMap
}