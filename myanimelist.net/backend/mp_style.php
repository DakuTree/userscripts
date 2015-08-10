<?php
	/* This script generates custom CSS for myanimelist.net
	 * Despite MAL allowing custom CSS, it has terrible HTML for it (lack of id/classes in useful places etc). This gets around this by creating the CSS on page load.
	 */

	header("Content-type: text/css; charset: UTF-8");
	header("Cache-Control: max-age=0, no-cache, no-store, must-revalidate"); #Make sure file isn't cached
	header("Expires: Wed, 01 Jan 1995 12:00:00 GMT");

	$ref = ((!empty($_SERVER['HTTP_REFERER'])) ?
		(substr($ref, 0, 23) !== 'http://myanimelist.net/' ?
			$_SERVER['HTTP_REFERER']
		:
			die("/* Bad URL */")
		)
	:
		die("/*No referer?*/")
	);

	//MAL has this issue where it encodes certain characters in it's custom CSS. This fixes issues that causes
	foreach($_GET as $key => $field) { unset($_GET[$key]); $_GET[str_replace('amp;', '', $key)] = $field; }

	$css = "";

	/*
	 * This gives users the ability to hide things on their list which contain the "hideme" tag.
	 * This does some questionable things to make work, but it does work.
	 * This is not possible in the current CSS spec (nor using the horrible classes/IDs that MAL provides.
	 * It however, "will" be possible if the :has/subject selector makes it into the fast profile of CSS Selectors Level 4 - http://dev.w3.org/csswg/selectors4/
	 */
	if(!isset($_GET['nohide'])){
		include('simple_html_dom.php'); /* http://simplehtmldom.sourceforge.net/ | May require editting to a higher MAX_FILE_SIZE (2500000). */

		$html = file_get_html($ref); // Loading the page twice isn't really the best idea, but there isn't any other option to make this work sadly...

		$i = 0;
		$hidecss = "";
		foreach($html->find('div#list_surround > table') as $element){
			$i++;
			if(strpos($element->plaintext, 'hideme') !== false) {
				$hidecss .= "#list_surround > table:nth-of-type($i), ";
			}
		}
		$hidecss = rtrim($hidecss, ", ");
		if(!empty($hidecss)){$hidecss .= " { display: none; }\n";}
		$css .= $hidecss;
	}

	/*
	 * This generates CSS which changes the score with the score set with mal_precise.
	 * This allows users without the userscript to view said scores.
	 */
	$fontsize = $_GET['fontsize'] ?: "9px";
	if($userid = ($_GET['userid'] || false) && ctype_digit(strval($userid))){
		$listtype = substr($ref, 23, 5);
		$sid = ($listtype == "anime" ? "scoreval" : "score");

		include "config.php";
		$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $mp_dbname);

		$result = $mysqli->query("SELECT * FROM {$listtype}list WHERE user_id = $userid"); //Shouldn't need to prepare this as user can't change this data..
		while($row = mysqli_fetch_array($result)){
			if($row['score_precise'] !== "0.0") {
				$css .= "#{$sid}{$row['db_id']} { font-size: 0; content: '{$row['score_precise']}'; }\n"; //We include content here as a way to access the precise score with JS
				$css .= "#{$sid}{$row['db_id']}:after { content: '{$row['score_precise']}'; font-size: {$fontsize}; }\n";
			}
		}
		$mysqli->close();
	}

	print $css."\n";
	print "/* $ref */";
