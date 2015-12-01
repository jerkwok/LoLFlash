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

    try {
            $conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
            
            $results = $conn->query('SELECT * FROM `recent` WHERE 1');
            $results->setFetchMode(PDO::FETCH_ASSOC);

            while($row = $results->fetch()) {  
                echo $row['username'] . "," . $row['region'] . "," . $row['season'] . "," . $row['type'] . "<br />";
            }  
            $id = $conn->lastInsertId();                    
            $conn = null;
            
        } catch (PDOException $e) {
            echo $e->getMessage();
        };

?>