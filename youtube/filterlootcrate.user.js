// ==UserScript==
// @name         Youtube - Filter Lootcrate videos from Subscriptions
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Because adblock isn't enough.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/www\.youtube\.(?:[\.a-z]+)\/feed\/subscriptions$/
// @updated      2016-04-24
// @version      1.0.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false */
'use strict';

$(document).ready(function() {
	$('.yt-uix-tile-link:contains("LootCrate")').each(function() {
		var row = $(this).closest('.section-list > li');

		var menu = $(row).find('.menu-container');
		if($(menu).html()) {
			//Menu exists, move it to avoid it being removed entirely.
			$(row).find('+ li .menu-container').replaceWith(menu);
		}
		$(row).remove();
	});
});