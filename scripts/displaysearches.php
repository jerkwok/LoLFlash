<?php
$dbname = 'recent';
$dbuser = 'csci3230u';
$dbpass = 'csci';
$dbhost = 'localhost';

    // echo "complete"
    try {
            $conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
            
            $results = $conn->query('SELECT * FROM `recent` WHERE 1');
            $results->setFetchMode(PDO::FETCH_ASSOC);
            //check if there are more than 5 rows 

            while($row = $results->fetch()) {  
                echo $row['username'] . "," . $row['region'] . "," . $row['season'] . "," . $row['type'] . "<br />";
            }  

            $id = $conn->lastInsertId();                    
            $conn = null;
            
        } catch (PDOException $e) {
            echo $e->getMessage();
        };


?>