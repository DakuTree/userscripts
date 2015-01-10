// ==UserScript==
// @name         MyAnimeList - MiscTweaks
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Various small tweaks to MAL
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga|people|character)(\/|\.php\?id\=).*$/
// @updated      2014-10-04
// @version      1.0.0
// ==/UserScript==

var tcheck =  $('#horiznav_nav a:contains("Details")').attr('href').replace(/^.*myanimelist.net\//, '').replace(/^\//, '').split('/'),
	type   = (tcheck[0] == "anime" ? 0 : (tcheck[0] == "manga" ? 1 : (tcheck[0] == "character" ? 2 : (tcheck[0] == "people" ? 6 : 0)))),
	id     = tcheck[1];

/* Change search to current page type */
$('#topSearchValue').val((idtype[1] == "anime" ? 0 : (idtype[1] == "manga" ? 1 : (idtype[1] == "character" ? 2 : (idtype[1] == "people" ? 6 : 0)))));