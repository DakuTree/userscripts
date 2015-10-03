// ==UserScript==
// @name         E(x)-Hentai One-Click DL
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Enables one-click DL archive downloading (GP/Credits are still required). Supports E-Hentai & EXHentai.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(g\.e-|ex)hentai\.org\/g\/.*$/
// @updated      2015-10-03
// @version      1.1.0
// ==/UserScript==

/******SETTINGS******/
var showCostPopup = false; // set to true to show a confirm popup including the cost of the gallery (this is still ignored if you have free gallery downloads via donation)
/********************/

var a  = document.getElementsByClassName('g2')[0].getElementsByTagName('a')[0]; // "Archive Download" link
var xs = a.getAttributeNode('onclick').nodeValue.split('?')[1].split("'")[0]; //  Grab arg from onclick attr
a.removeAttribute('onclick'); // Remove default onclick

a.addEventListener('click', function() {
	var downloadGallery = true;

	if(showCostPopup) {
		var http_cost = new XMLHttpRequest();
		http_cost.open("GET", location.origin+'/archiver.php?'+xs, false);
		http_cost.onreadystatechange = function() {
			if(http_cost.readyState == 4 && http_cost.status == 200) {
				var match_cost = http_cost.responseText.match(/Download Cost:\s+(.*)/);

				//If gallery has a download cost, and is not free, ask the user if they want to DL the gallery via a confirm popup.
				if(match_cost && match_cost[1].replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi,'').trim() !== "Free!"){
					var cost = match_cost[1].replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi,'').trim();
					downloadGallery = confirm("This gallery is not free.\nThe cost is: "+cost+".\nAre you sure you want to DL?");
				}
			}
		}
		http_cost.send();
	}

	if(downloadGallery) {
		var http   = new XMLHttpRequest(),
		var params = "dlcheck=Download Archive";
		http.open("POST", location.origin+'/archiver.php?'+xs, true);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				if(http.responseText.indexOf("Please wait...") !== -1){ //Check if pop-up opened.
					var match = /<a href="(http.*?)"/g.exec(http.responseText);
					window.location.href = match[1] + "?start=1";
				}
			}
		}
		http.send(params);
	}

	return false
}, false);
