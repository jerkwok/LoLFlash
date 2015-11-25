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
            
            if ($numRows > 5){
                $delete = $conn->prepare('DELETE FROM `recent` LIMIT 1');
                $delete->execute();
            }
            
            $id = $conn->lastInsertId();                    
            $conn = null;
            
        } catch (PDOException $e) {
            echo $e->getMessage();
        };


?>