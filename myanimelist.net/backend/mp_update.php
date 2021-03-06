<?php
	header('Access-Control-Allow-Origin: https://myanimelist.net');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	if(empty($_GET['db_id']) || empty($_GET['score_precise']) || empty($_GET['userid']) || empty($_GET['type'])) die('Missing Parameter(s).');
	if(!ctype_digit($_GET['db_id']) || !is_numeric($_GET['score_precise']) || !ctype_digit($_GET['userid']) || !in_array($_GET['type'], array('anime', 'manga'))) die('Incorrect Parameter(s).');
	list($dbid, $score, $userid, $type) = array((int) $_GET['db_id'], $_GET['score_precise'], (int) $_GET['userid'], $_GET['type']."list");

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mp_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mp_dbname); //Connect to MySQL Server

	if($stmt = $mysqli->prepare("INSERT INTO $type (db_id, score_precise, user_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE score_precise = values(score_precise)")){
		$stmt->bind_param("idi", $dbid, $score, $userid) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
		$stmt->execute() or print("Execute failed: (".$stmt->errno.") ". $stmt->error);
		$stmt->close();
	}else{
		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
	}

	$mysqli->close();
?>
