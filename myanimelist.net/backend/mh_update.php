<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header('Content-Type: application/json');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	date_default_timezone_set('UTC');

	foreach($_POST as $key => $field) { $_POST[$key] = ($field ?: NULL); } //Set undefined > NULL

	if(empty($_POST['userid']) || empty($_POST['db_id']) || empty($_POST['type']) || empty($_POST['title']) || empty($_POST['status']) || empty($_POST['addup'])) die('Missing Parameter(s).');
	if(!ctype_digit($_POST['userid']) || !ctype_digit($_POST['db_id']) || !in_array($_POST['type'], array('anime', 'manga')) || !in_array($_POST['status'], array('Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch', 'Reading', 'Plan to Read')) || !is_numeric($_POST['score']) || !in_array($_POST['addup'], array('Add', 'Update'))) die('Incorrect Parameter(s).');
	list($userid, $db_id, $type, $title, $status, $score, $addup) = array((int) $_POST['userid'], (int) $_POST['db_id'], $_POST['type'], (string) $_POST['title'], $_POST['status'], $_POST['score'], $_POST['addup']);

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mh_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mh_dbname); //Connect to MySQL Server

	if($type == 'anime'){
		// if(!isset($_POST['ep_watched']) || !isset($_POST['ep_count'])) die('Missing Parameter(s).');
		// if(!ctype_digit($_POST['ep_watched']) || !ctype_digit($_POST['ep_count'])) die('Incorrect Parameter(s).');
		if($stmt = $mysqli->prepare("INSERT INTO anime (userid, db_id, title, status, score, ep_watched, ep_count, addup) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")){
			$stmt->bind_param("iisssiis", $userid, $db_id, $title, $status, $score, $_POST['ep_watched'], $_POST['ep_count'], $addup) or print("Binding parameters failed: ({$stmt->errno}) {$stmt->error}");
			$stmt->execute() or print("Execute failed: (".$stmt->errno.") ".$stmt->error);
			$stmt->close();
		}else{
		    echo "Prepare failed: (".$mysqli->errno.") ".$mysqli->error;
		}
	}
	elseif($type == 'manga'){
		// if(!isset($_POST['ch_read']) || !isset($_POST['ch_count']) || !isset($_POST['vol_read']) || !isset($_POST['vol_count'])) die('Missing Parameter(s).');
		// if(!ctype_digit($_POST['ch_read']) || !ctype_digit($_POST['ch_count']) || !ctype_digit($_POST['vol_read']) || !ctype_digit($_POST['vol_count'])) die('Incorrect Parameter(s).');
		if($stmt = $mysqli->prepare("INSERT INTO manga (userid, db_id, title, status, score, ch_read, ch_count, vol_read, vol_count, addup) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")){
			$stmt->bind_param("iisssiiiis", $userid, $db_id, $title, $status, $score, $_POST['ch_read'], $_POST['ch_count'], $_POST['vol_read'], $_POST['vol_count'], $addup) or print("Binding parameters failed: ({$stmt->errno}) {$stmt->error}");
			$stmt->execute() or print("Execute failed: (".$stmt->errno.") ".$stmt->error);
			$stmt->close();
		}else{
		    echo "Prepare failed: (".$mysqli->errno.") ".$mysqli->error;
		}
	}

	$mysqli->close();

	/* FIX anime/manga type checking */
?>
