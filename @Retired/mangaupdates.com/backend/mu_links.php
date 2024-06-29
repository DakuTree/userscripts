<?php
	header('Access-Control-Allow-Origin: https://www.mangaupdates.com');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	if(empty($_POST['json_ids'])) die('Missing Parameter(s).');
	$jsonIDList = json_decode($_POST['json_ids'], TRUE);
	if(is_null($jsonIDList)) die('Invalid JSON');
	$idList = array_map('intval', $jsonIDList); //Security

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mf_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname); //Connect to MySQL Server

	$json = array();
	

	//Check if we already know the MangaUpdates ID.
	if($stmt = $mysqli->prepare("SELECT * FROM ids WHERE id_mu = ?")){
		foreach($idList as $id) {
			$stmt->bind_param("i", $id) or print("Binding parameters failed: ({$stmt->errno}) ".$stmt->error);
			$stmt->execute() or print("Execute failed: ({$stmt->errno}) ".$stmt->error);

			$stmt->bind_result($r_idMAL, $r_idMU);
			while ($stmt->fetch()) {
				$json[$r_idMU] = $r_idMAL;
			}
		}

		$stmt->close();
	} else {
		echo "Prepare failed: ({".$mysqli->errno."}) ".$mysqli->error;
	}

	$mysqli->close();

	echo json_encode($json);
?>
