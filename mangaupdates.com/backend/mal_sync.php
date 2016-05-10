<?php
	header('Access-Control-Allow-Origin: https://www.mangaupdates.com');
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");
	header('Content-Type: charset=utf-8');

	if(empty($_GET['time']) || empty($_GET['id'])) die('Missing Parameter(s).');
	if(!ctype_digit($_GET['time']) || !ctype_digit($_GET['id'])) die('Incorrect Parameter(s).');
	$exportTime = (int) $_GET['time'];
	$exportId   = (int) $_GET['id'];

	echo file_get_contents("http://myanimelist.net/export/download.php?time=".$exportTime."&t=manga&id=".$exportId);