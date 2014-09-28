<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	foreach($_POST as $key => $field) { $_POST[$key] = ($field ?: NULL); }

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname); //Connect to MySQL Server

	if($_POST['type'] == 'anime'){
		if($stmt = $mysqli->prepare("INSERT INTO anime (db_id, title, status, score, ep_watched, ep_count, addup) VALUES (?, ?, ?, ?, ?, ?, ?)")){
			if(!$stmt->bind_param("isssiis", $_POST['db_id'], $_POST['title'], $_POST['status'], $_POST['score'], $_POST['ep_watched'], $_POST['ep_count'], $_POST['addup'])){
				echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			if(!$stmt->execute()){
				echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			$stmt->close();
		}else{
		    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}
	}elseif($_POST['type'] == 'manga'){
		if($stmt = $mysqli->prepare("INSERT INTO manga (db_id, title, status, score, ch_read, ch_count, vol_read, vol_count, addup) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")){
			if(!$stmt->bind_param("isssiiiis", $_POST['db_id'], $_POST['title'], $_POST['status'], $_POST['score'], $_POST['ch_read'], $_POST['ch_count'], $_POST['vol_read'], $_POST['vol_count'], $_POST['addup'])){
				echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			if(!$stmt->execute()){
				echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			$stmt->close();
		}else{
		    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}
	}

	$mysqli->close();
?>
