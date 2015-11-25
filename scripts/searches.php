<?php
$dbname = 'recent';
$dbuser = 'csci3230u';
$dbpass = 'csci';
$dbhost = 'localhost';

    // echo "complete"
    try {
            $conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
            
            $stmt = $conn->prepare('INSERT INTO recent(username,region,season,type) VALUES(:un, :rg, :sn, :ty)');
            
            $stmt->bindValue(":un", $_POST["username"]);
            echo  $_POST["username"];
            $stmt->bindValue(":rg", $_POST["region"]);
            $stmt->bindValue(":sn", $_POST["season"]);
            $stmt->bindValue(":ty", $_POST["type"]);
            $stmt->execute();
            
            $results = $conn->query('SELECT * FROM `recent` WHERE 1');
            $results->setFetchMode(PDO::FETCH_ASSOC);
            $numRows = $results->rowCount();
            echo $numRows . "</br>";
            
            //check if there are more than 5 rows 
            if ($numRows > 5){
                // $top = $conn->query('SELECT * FROM `recent` LIMIT 1');
                // $top->setFetchMode(PDO::FETCH_ASSOC);
                $delete = $conn->prepare('DELETE FROM `recent` LIMIT 1');
                $delete->execute();
                $results = $conn->query('SELECT * FROM `recent` WHERE 1');
                $results->setFetchMode(PDO::FETCH_ASSOC);
            }

            while($row = $results->fetch()) {  
                echo $row['username'] . " " . $row['region'] . " " . $row['season'] . " " . $row['type'] . "<br />";
            }  

            $id = $conn->lastInsertId();                    

            $conn = null;
            // if ($numRows < 1) {
            //     echo "Ahhhhhhhhhh!";
            //     die();
            // } else {
            //     echo "user inserted successfully";
            // }
            
        } catch (PDOException $e) {
            echo $e->getMessage();
        };


?>