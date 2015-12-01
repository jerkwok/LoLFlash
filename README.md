# LoLFlash
*"The bonjwa of LoL sites"*
---
**Final Project for CSCI3230U**
by
**Akira Aida - 100526064** and **Jeremy Kwok -100341977**

### Introduction
---
LoLFlash is a website that allows users to look up information of users on the computer game League of Legends. Using LoLFlash, one can look up the user profiles, recent games played, and leaderboards.

### Navigation Bar
---
Each page on LoLFlash contains a navigation bar. In the top left, there are links to any of the other pages on the website, allowing for easy navigation between pages. The navigation bar will light up the coresponding section that you are currently in to remind you where you are. The nav bar also has dropdown menus and a text box that allows you to perform searches. When you are on the home page, clicking the search button on the nav bar will perform a profile search with the parameters from the nav bar. When you are on a page that is not the home page, clicking the search button will perform that page's respective search. When typing the username, you may also hit enter to perform the search button action.

### Home Page
---
When you first visit LoLFlash, you will be taken to the site's home page. The home page, much like the rest of the website opts for a more minimalist design. On the page you will find boxes and dropdowns that allow you to change search parameters. Once you have filled out those parameters, you can click on one of the boxes below to perform one of the site's three searches: Profile Search, History Search or Leagues Search. If you're looking for ideas, you can click the "Recent Searches" button to reveal the last 5 searches made by users on LoLFlash. These searches, stored in LoLFlash's internal database, can be clicked on the perform the search again. 

### Profile Page
---
Performing a search on the profile page will bring up some account statistics for the searched player. It will display the player's name, their account level, and their profile picture. Below shows win statistics for the player. In addition, this page will also show the player's current rank in the three major game types (Ranked Solo, Ranked Threes, and Ranked Fives). Lastly, this page displays the champions played in the last three games the player partook in.

### History Page
---
The History Search is the main functionality of LoLFlash. When you perform a History Search, the page will display the last 3 games fitting the parameters (See the API note at the bottom). Each game will be represented by a coloured row. In the upper section, it displays stats about the game, such as date played, match ID, and whether the searched player won the game or not (the colour of the row also shows the game result). In the row itself, you can see the champion played, and game stats such as items built and game performance. 

To view expanded stats for a game, click on the small table to expand that game. Expanding the game will show a larger table that has a ton more statstics, showing item builds and other statstics for each player, and aggregated team stats. The selected player will also have their section highlighted for quick viewing.

### Leagues Page
---
When you perform a search for a player, this page will display the information of the player in their current league. You can scroll to the highlighted row to quickly find the searched player's position. This page shows the Tier, Divison and title of the league, and all the league members and their emblems, LP and the status of their current series. 

### Examples
---
When trying out LoLFlash, why don't you look up some of our accounts?

Here are the developer's accounts plus some accounts of our friends. All accounts are on North America (Note the lack of recent games due to focus on studies ;) ):

* Akira - Ariman1 
* Jeremy - Megaman703

Assorted Friends:

* Armytle
* Stiles1001
* EhMaxxim
* Hlainel
* AFolcon

###### Note about the Riot API
When planning and envisioning the LoLFlash project, one of the goals was to allow users to lookup many games from their match history. Unfortunately, we ran into an issue with the Riot API which we used to grab user data. For each game we wanted to display, it would require multiple calls to the API, and the API currently uses a development key rather than a production key, which has a rate limit of 10 requests per 10 seconds. Because of this, we have had to scale back some of the functionality regarding displaying old matches, and performing too many searches within a short time frame will cause a 429 error (Rate limit reached). Obtaining a live key with higher rate limits to use rather than our single production key is not possible in this current timeframe.