// ==UserScript==
// @name         MyAnimeList - Old Header Links
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Re-adds the old header profile & list links after MAL decided to move them.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      http://myanimelist.net/*
// @exclude      http://myanimelist.net/animelist/*
// @exclude      http://myanimelist.net/mangalist/*
// @updated      2016-01-29
// @version      1.0.4
// ==/UserScript==
/* jshint -W097 */
/* global $:false, jQuery:false */
'use strict';

if($('.btn-signup').length === 0) {
	//Re-add list links.
	var amLinks = $('.header-list-button[title=List] + .arrow_box a[href*="list/"]').map(function(){
		return $(this).attr("href");
	}).get();
	var animeLink = amLinks[0];
	var mangaLink = amLinks[1];

	['Anime', 'Manga'].forEach(function(type) {
		$('#nav > li:contains("'+type+'") > ul').prepend(
			$('<li/>').append(
				$('<a/>', {href: (type == 'Anime' ? animeLink : mangaLink), text: type+' List'})
			)
		);
	});


	//Re-add profile tab + links
	var profileLinks = $('.header-profile-link + .arrow_box a[href*="/"]');

	$('#nav').prepend(
		$('<li/>', {class: 'small'}).append( //<li>
			$('<a/>', {href: $(profileLinks[0]).attr('href'), /*class: 'non-link',*/ text: 'Profile'})).append(
			$('<ul/>', {class: 'wider', style: 'display: none;'}).append( //<ul>
				$('<li/>').append(
					$(profileLinks[1]) //Friends
				)
			).append(
				$('<li/>').append(
					$(profileLinks[2]) //Clubs
				)
			).append(
				$('<li/>').append(
					$(profileLinks[3]) //Blog Posts
				)
			).append(
				$('<li/>').append(
					$(profileLinks[4]) //Reviews
				)
			).append(
				$('<li/>').append(
					$(profileLinks[5]) //Reccomendations
				)
			).append(
				$('<li/>').append(
					$(profileLinks[6]) //Account Settings
				)
			)
		)
	);
	$('#nav li:contains("Profile")').hover(function() {
		$(this).toggleClass('hover');
		$(this).find('> ul').toggle();
	});
}