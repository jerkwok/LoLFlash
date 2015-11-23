<?php
	$url = $_POST["data"];
	

	$data = file_get_contents($url);
	$jsondata = json_decode($data);


	echo $jsondata;
?>