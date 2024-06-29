// ==UserScript==
// @name         MyAnimeList - Latest Chapters
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Checks MangaUpdates for the latest chapters and marks updates on your list.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      http://myanimelist.net/mangalist/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @updated      2016-04-23
// @version      1.0.0
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false */
'use strict';

//TODO: This should just check against the mangaupdates reading list?

$(document).ready(function() {
	//Only load if user logged in, and is same as list
	if($('a[href*="login.php"]').length === 0 && (location.pathname.substring(11) === $('a[href*="/profile/"]').attr('href').substring(9))) {
		$('.animetitle:eq(0)').each(function() {
			var parentRow = $('.animetitle:eq(0)').parent().parent();
			var currentChapter = $(parentRow).find('> td:eq(3) span').text().trim();

			var malLink = $(this).attr('href');
			$.get(malLink, function(data) {
				var muLink = $(data).find('a[href*="mangaupdates.com"]');
				if(muLink.length) {
					$.get($(muLink).attr('href'), function(data2) {
						var latestChapter = $(data2).find('div.sCat:contains("Latest Release(s)") + .sContent').text().match(/c\.([0-9]+)/)[1];
					});
				} else {
					console.log('NO MU FOR: '+malLink);
				}
			});
		});
	}
});
