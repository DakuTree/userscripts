<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header('Cache-Control: max-age=0, no-cache, no-store, must-revalidate'); #Make sure file isn't cached
	header('Expires: Wed, 01 Jan 1995 12:00:00 GMT');

	if(empty($_GET['userid']) || empty($_GET['type_id']) || empty($_GET['name']) || empty($_GET['preview_url'])) {
		$missingParams = "Missing Params: ";
		if(empty($_GET['userid'])) {
			$missingParams .= "userid ";
		}
		if(empty($_GET['type_id'])) {
			$missingParams .= "type_id ";
		}
		if(empty($_GET['name'])) {
			$missingParams .= "name ";
		}
		if(empty($_GET['preview_url'])) {
			$missingParams .= "preview_url ";
		}
		die($missingParams);
	}
	if(!ctype_digit($_GET['userid']) || !in_array($_GET['type'], array(0, 1, 2, 6)) || !ctype_digit($_GET['type_id'])) die('Incorrect Parameter(s).');
	list($userid, $type, $type_id, $name, $preview_url) = array((int) $_GET['userid'], (int) $_GET['type'], (int) $_GET['type_id'], $_GET['name'], 'http://'.$_GET['preview_url']);

	$series_title = $series_url = "";
	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mf_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mf_dbname); //Connect to MySQL Server

	if(!empty($_GET['series_title']) && !empty($_GET['series_url'])){
		$series_title = $_GET['series_title'];
		$series_url = 'http://'.$_GET['series_url'];
	}

	$check = "Added to";
	if($stmt = $mysqli->prepare("INSERT INTO favourites (user_id, type, type_id) VALUES (?, ?, ?)")){
		$stmt->bind_param("iii", $userid, $type, $type_id) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
		$stmt->execute() or ($stmt->affected_rows == -1 ? "" : print("Execute failed: (".$stmt->errno.") ". $stmt->error));
		$row_count = $stmt->affected_rows; //Bug: I would just use insert_id here, but any time it's used it breaks things
		$stmt->close();

		if($row_count == '-1'){
			if($stmt = $mysqli->prepare("DELETE FROM favourites WHERE user_id = ? AND type = ? AND type_id = ?")){
				$stmt->bind_param("iii", $userid, $type, $type_id) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
				$stmt->execute() or print("Execute failed: (".$stmt->errno.") ". $stmt->error);
				$stmt->close();

				$check = "Removed from";
			}else{
				echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
			}
		}
	}else{
		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
	}

	if($stmt = $mysqli->prepare("INSERT IGNORE series (type, type_id, name, preview_url, series_title, series_url) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE preview_url = values(preview_url)")){
		$stmt->bind_param("iissss", $type, $type_id, $name, $preview_url, $series_title, $series_url) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
		$stmt->execute() or print("Execute failed: (".$stmt->errno.") ". $stmt->error);
		$stmt->close();
	}else{
		echo "Prepare failed: ({$mysqli->errno}) ".$mysqli->error;
	}

	$mysqli->close();

	print "$check ExFavorites";
?>
