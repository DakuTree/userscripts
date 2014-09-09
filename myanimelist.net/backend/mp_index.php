<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	if(empty($_GET['userid']) || empty($_GET['type'])) die('Missing Parameter(s).');
	if(!ctype_digit($_GET['userid']) || !in_array($_GET['type'], array('anime', 'manga'))) die('Incorrect Parameter(s).');
	list($userid, $type) = array((int) $_GET['userid'], $_GET['type']."list");

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname); //Connect to MySQL Server

	list($json, $x) = array(array(), 0);
	if($_GET['db_id']){
		if($stmt = $mysqli->prepare("SELECT db_id, score_precise FROM $type WHERE user_id = ? AND db_id = ?")){
			if(!$stmt->bind_param("ii", $userid, $_GET['db_id'])){
				echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			if(!$stmt->execute()){
				echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
			}

			$stmt->bind_result($db_id, $score_precise);
			$stmt->fetch();
			$json['db_id']         = $db_id;
			$json['score_precise'] = $score_precise;

			$stmt->close();
		}else{
		    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}
	}else{
		if($stmt = $mysqli->prepare("SELECT db_id, score_precise FROM $type WHERE user_id = ?")){
			if(!$stmt->bind_param("i", $userid)){
				echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			if(!$stmt->execute()){
				echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
			}

			$result = $stmt->get_result();
			$stmt->bind_result($db_id, $score_precise);
			while ($row = $result->fetch_assoc()) {
				$json[$x]['db_id'] = $row['db_id'];
				$json[$x]['score_precise'] = $row['score_precise'];
				$x++;
			}

			$stmt->close();
		}else{
		    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
		}
	}

	$mysqli->close();

	echo json_encode($json);
?>
