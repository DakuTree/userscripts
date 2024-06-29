<?php
	header('Access-Control-Allow-Origin: https://www.mangaupdates.com');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	if(empty($_GET['id'])) die('Missing Parameter(s).');
	if(!ctype_digit($_GET['id'])) die('Incorrect Parameter(s).');
	$idMAL = (int) $_GET['id'];

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mf_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname); //Connect to MySQL Server

	$json = array();

	//Check if we already know the MangaUpdates ID.
	if($stmt = $mysqli->prepare("SELECT * FROM ids WHERE id_mal = ?")){
		$stmt->bind_param("i", $idMAL) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
		$stmt->execute() or print("Execute failed: ({$stmt->errno}) ".$stmt->error);

		$stmt->bind_result($r_idMAL, $r_idMU);
		while ($stmt->fetch()) {
			$json['id_mal'] = $r_idMAL;
			$json['id_mu']  = $r_idMU;
		}

		$stmt->close();
	} else {
		echo "Prepare failed: ({".$mysqli->errno."}) ".$mysqli->error;
	}
	if(empty($json['id_mal'])) {
		//We don't know the ID, grab it from MAL
		$html = file_get_contents("http://myanimelist.net/manga/".$idMAL);
		preg_match('/http:\/\/www\.mangaupdates\.com\/series\.html\?id\=([0-9]+)/', $html, $matches);
		if(!empty($matches)) {
			if($stmt = $mysqli->prepare("INSERT INTO ids (id_mal, id_mu) VALUES (?, ?)")){
				$stmt->bind_param("ii", $idMAL, $matches[1]) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
				$stmt->execute() or ($stmt->affected_rows == -1 ? "" : print("Execute failed: (".$stmt->errno.") ". $stmt->error));
				$row_count = $stmt->affected_rows; //Bug: I would just use insert_id here, but any time it's used it breaks things
				$stmt->close();

				$json['id_mal'] = $idMAL;
				$json['id_mu']  = (int) $matches[1];
			} else {
				$json['error'] = 'FAILEDINSERT';
			}
		} else {
			$json['error']  = 'NOID';
		}
	}

	$mysqli->close();

	echo json_encode($json);
?>
