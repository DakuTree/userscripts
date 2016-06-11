<?php
	header('Access-Control-Allow-Origin: http://myanimelist.net');
	header('Content-Type: application/json');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	date_default_timezone_set('UTC');

	if(empty($_GET['userid']) || empty($_GET['type']) || empty($_GET['page'])) die(json_encode(array('error' => 'Missing Parameter(s).')));
	if(!ctype_digit($_GET['userid']) || !in_array($_GET['type'], array('all', 'anime', 'manga')) || !ctype_digit($_GET['page'])) die(json_encode(array('error' => 'Incorrect Parameter(s).')));
	list($userid, $type, $offset) = array((int) $_GET['userid'], $_GET['type'], (((int) $_GET['page'] - 1) * 50));

	include "config.php"; //Contains $dbhost / $dbuser / $dbpass / $mp_dbname
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mh_dbname); //Connect to MySQL Server

	list($json, $x) = array(array(), 0);
	try {
		if(!$mysqli->query('SET @@session.time_zone="+00:00"')){ throw new Exception("Timezone change failed"); }
		$query = "";
		if($type == 'all'){
			$query = 'SELECT type, db_id, title, status, score, chep_digested, chep_count, vol_read, vol_count, addup, sub.timestamp FROM (
			              SELECT "anime" AS type, anime.userid, anime.db_id, anime.title, anime.status, anime.score, anime.ep_watched AS chep_digested, anime.ep_count AS chep_count, NULL AS vol_read, NULL AS vol_count, anime.addup, anime.timestamp FROM anime
			              UNION
			              SELECT "manga" AS type, manga.userid, manga.db_id, manga.title, manga.status, manga.score, manga.ch_read AS chep_digested, manga.ch_count AS chep_count, manga.vol_read, manga.vol_count, manga.addup, manga.timestamp FROM manga
			          ) sub
					  WHERE sub.userid = ?
			          ORDER BY timestamp DESC
			          LIMIT 50 OFFSET ?';
		}
		elseif($type == 'anime'){
			$query = 'SELECT "anime" AS type, db_id, title, status, score, ep_watched AS chep_digested, ep_count AS chep_count, NULL AS vol_read, NULL AS vol_count, addup, anime.timestamp
			          FROM anime
					  WHERE userid = ?
			          ORDER BY timestamp DESC
			          LIMIT 50 OFFSET ?';
		}
		elseif($type == 'manga'){
			$query = 'SELECT "manga" AS type, db_id, title, status, score, ch_read AS chep_digested, ch_count AS chep_count, vol_read, vol_count, addup, manga.timestamp
			          FROM manga
					  WHERE userid = ?
			          ORDER BY timestamp DESC
			          LIMIT 50 OFFSET ?';
		}

		if($stmt = $mysqli->prepare($query)){
			if(!$stmt->bind_param("ii", $userid, $offset)){ throw new Exception("Binding parameters failed: ({$stmt->errno}) ".$stmt->error); }
			if(!$stmt->execute()){ throw new Exception("Execute failed: ({$stmt->errno}) ".$stmt->error); }

			$meta = $stmt->result_metadata();
			$bindVarsArray = array();
			while($column = $meta->fetch_field()) {
				$bindVarsArray[] = &$results[$column->name];
			}
			call_user_func_array(array($stmt, 'bind_result'), $bindVarsArray);

			while($stmt->fetch()) {
				$row = array();
				foreach($bindVarsArray as $key => $value){ $row[$key] = $value; }

				$json[] = $row;
			}

			$stmt->close();
		}else{
			throw new Exception("Prepare failed: ({$mysqli->errno})".$mysqli->error);
		}
	}
	catch(Exception $e){
		$json['error'] = $e->getMessage();
		echo json_encode($json);
		die();
	}

	$mysqli->close();

	if(!empty($_GET['force']) & $_GET['force'] == 'html'){
		//This is shitty but it works.
		header('Content-Type: text/html; charset=utf-8');
		echo "
			<html>
			<head>
				<style type='text/css'>table { width: 100%; }</style>
			</head>
			<body>
				<!-- We should probably have a next/prev link here, but too lazy -->
				<table>
					<tr>
						<td>Type</td>
						<td>DB ID</td>
						<td>Title</td>
						<td>Status</td>
						<td>Score</td>
						<td>Ch/Ep Digested</td>
						<td>Ch/Ep Count</td>
						<td>Vol Read</td>
						<td>Vol Count</td>
						<td>Add/Update</td>
						<td>Timestamp UTC</td>
					</tr>";
		foreach($json as $row){
			echo "
				<tr>
					<td>{$row[0]}</td>
					<td>{$row[1]}</td>
					<td>{$row[2]}</td>
					<td>{$row[3]}</td>
					<td>{$row[4]}</td>
					<td>{$row[5]}</td>
					<td>{$row[6]}</td>
					<td>{$row[7]}</td>
					<td>{$row[8]}</td>
					<td>{$row[9]}</td>
					<td>{$row[10]}</td>
				</tr>";
		}
		echo "
				</table>
			</body>
			</html>";
	}else{
		echo json_encode($json);
	}
?>
