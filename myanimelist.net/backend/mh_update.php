<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header('Content-Type: application/json');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	date_default_timezone_set('UTC');

	foreach($_POST as $key => $field) { $_POST[$key] = ($field ?: NULL); } //Set undefined > NULL

	if(empty($_POST['userid']) || empty($_POST['db_id']) || empty($_POST['type']) || empty($_POST['title']) || empty($_POST['status']) || empty($_POST['addup'])) die(json_encode(array('error' => 'Missing Parameter(s).')));
	if(!ctype_digit($_POST['userid']) || !ctype_digit($_POST['db_id']) || !in_array($_POST['type'], array('anime', 'manga')) || !in_array($_POST['status'], array('Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch', 'Reading', 'Plan to Read')) || !in_array($_POST['addup'], array('Add', 'Update'))) die(json_encode(array('error' => 'Incorrect Parameter(s).')));
	list($userid, $db_id, $type, $title, $status, $score, $addup) = array((int) $_POST['userid'], (int) $_POST['db_id'], $_POST['type'], (string) $_POST['title'], $_POST['status'], $_POST['score'], $_POST['addup']);

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mh_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mh_dbname); //Connect to MySQL Server

	try {
		if($type == 'anime'){
			list($ep_watched, $ep_count) = array(($_POST['ep_watched'] ?: NULL), ($_POST['ep_count'] ?: NULL));
			// if(($ep_watched !== NULL && !ctype_digit($ep_watched)) || ($ep_count !== NULL && !ctype_digit($ep_count))) die(json_encode(array('error' => 'Incorrect Parameter(s).')));
			if($stmt = $mysqli->prepare("INSERT INTO anime (userid, db_id, title, status, score, ep_watched, ep_count, addup) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")){
				if(!$stmt->bind_param("iisssiis", $userid, $db_id, $title, $status, $score, $ep_watched, $ep_count, $addup)){ throw new Exception("Binding parameters failed: ({$stmt->errno}) ".$stmt->error); }
				if(!$stmt->execute()){ throw new Exception("Execute failed: ({$stmt->errno}) ".$stmt->error); }
				$stmt->close();
			}else{
				throw new Exception("Prepare failed: ({$mysqli->errno})".$mysqli->error);
			}
		}
		elseif($type == 'manga'){
			list($ch_read, $ch_count, $vol_read, $vol_count) = array(($_POST['ch_read'] ?: NULL), ($_POST['ch_count'] ?: NULL), ($_POST['vol_read'] || NULL), ($_POST['vol_count'] ?: NULL));
			// if(($ch_read !== NULL && !ctype_digit($ch_read)) || ($ch_count !== NULL && !ctype_digit($ep_count)) || ($vol_read !== NULL && !ctype_digit($vol_read)) || ($vol_count !== NULL && !ctype_digit($vol_count))) die(json_encode(array('error' => 'Incorrect Parameter(s).')));

			if($stmt = $mysqli->prepare("INSERT INTO manga (userid, db_id, title, status, score, ch_read, ch_count, vol_read, vol_count, addup) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")){
				$stmt->bind_param("iisssiiiis", $userid, $db_id, $title, $status, $score, $ch_read, $ch_count, $vol_read, $vol_count, $addup) or print("Binding parameters failed: ({$stmt->errno}) {$stmt->error}");
				if(!$stmt->execute()){ throw new Exception("Execute failed: ({$stmt->errno}) ".$stmt->error); }
				$stmt->close();
			}else{
				throw new Exception("Prepare failed: ({$mysqli->errno})".$mysqli->error);
			}
		}
	}
	catch(Exception $e){
		$json['error'] = $e->getMessage();
		echo json_encode($json);
	}
	$mysqli->close();
?>
