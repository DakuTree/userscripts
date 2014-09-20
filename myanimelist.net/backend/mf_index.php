<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	if(empty($_GET['userid'])) die('Missing Parameter(s).');
	if(!ctype_digit($_GET['userid'])) die('Incorrect Parameter(s).');
	$userid = (int) $_GET['userid'];

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mf_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mf_dbname); //Connect to MySQL Server

	list($json, $x) = array(array(), 0);
	if($stmt = $mysqli->prepare("
				SELECT f.type, f.type_id, s.name, s.preview_url, s.series_title, s.series_url
				FROM favourites f
				LEFT JOIN series s ON f.type_id = s.type_id AND f.type = s.type
				WHERE user_id = ?")){

		$stmt->bind_param("i", $userid) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
		$stmt->execute() or print("Execute failed: ({$stmt->errno}) ".$stmt->error);

		$stmt->bind_result($r_type, $r_type_id, $r_name, $r_preview_url, $r_series_title, $r_series_url);
		while ($stmt->fetch()) {
			$json[$x]['type'] = $r_type;
			$json[$x]['type_id'] = $r_type_id;
			$json[$x]['name'] = $r_name;
			$json[$x]['preview_url'] = $r_preview_url;
			$json[$x]['series_title'] = $r_series_title;
			$json[$x]['series_url'] = $r_series_url;
			$x++;
		}

		$stmt->close();
	}else{
		echo "Prepare failed: ({. $mysqli->errno}) ".$mysqli->error;
	}
	
	$mysqli->close();

	echo json_encode($json);
?>
