<?php
/*
 * Final Project for Web Development CSCI 3230U: LoL Flash
 *
 * Copyright (C) 2015, <Akira Aida 100526064, Jeremy Kwok 100341977>
 * All rights reserved.
 * 
 */
$dbname = 'recent';
$dbuser = 'csci3230u';
$dbpass = 'csci';
$dbhost = 'localhost';

    // echo "complete"
    try {
            $conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
            
            //$checker = $conn->prepare('SELECT username FROM recent WHERE username = :un AND region = :rg AND season = :sn AND type = :ty ');
            $checker = $conn->prepare('SELECT * FROM `recent`');
            $checker->bindValue(":un", $_POST["username"]);
            $checker->bindValue(":rg", $_POST["region"]);
            $checker->bindValue(":sn", $_POST["season"]);
            $checker->bindValue(":ty", $_POST["type"]);
            $checker->setFetchMode(PDO::FETCH_ASSOC);
            $row = $checker->fetch();
            // $checkerRows = $checker->rowCount();

            echo $row['username'];
            // echo $checkerRows;
            // if ($checkerRows > 0){
            //     $message = "duplicate";
            //     echo "<script type='text/javascript'>alert('$message');</script>"; 
            // }

            $stmt = $conn->prepare('INSERT INTO recent(username,region,season,type) VALUES(:un, :rg, :sn, :ty)');
            
            $stmt->bindValue(":un", $_POST["username"]);
            $stmt->bindValue(":rg", $_POST["region"]);
            $stmt->bindValue(":sn", $_POST["season"]);
            $stmt->bindValue(":ty", $_POST["type"]);
            $stmt->execute();
            
            $results = $conn->query('SELECT * FROM `recent` WHERE 1');
            $results->setFetchMode(PDO::FETCH_ASSOC);
            $numRows = $results->rowCount();
            
            if ($numRows > 5){
                $delete = $conn->prepare('DELETE FROM `recent` LIMIT 1');
                $delete->execute();
            }
            echo "inserted";
            
            $id = $conn->lastInsertId();                    
            $conn = null;
            
        } catch (PDOException $e) {
            echo $e->getMessage();
        };


?>