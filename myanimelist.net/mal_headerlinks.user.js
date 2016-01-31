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
// @updated      2016-01-31
// @version      1.0.6
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
	var newAlerts    = parseInt($('.header-message > .has-unread').attr('data-unread') || 0) + parseInt($('.header-notification > .has-unread').attr('data-unread') || 0) + parseInt($('.fl-r.link-count').text().replace(/\(|\)/g, '') || 0);

	$('#nav').prepend(
		$('<li/>', {class: (!newAlerts ? 'small' : '')}).append( //<li>
			$('<a/>', {href: $(profileLinks[0]).attr('href'), /*class: 'non-link',*/ text: 'Profile' + (newAlerts ? " ["+newAlerts.toString()+"]" : "")})).append(
			$('<ul/>', {class: 'wider', style: 'display: none;'}).append( //<ul>
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/panel.php', text: 'My Panel'}) //Panel
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/mymessages.php', text: 'Messages' + ($('.header-message > .has-unread').length ? " ["+$('.header-message > .has-unread').attr('data-unread')+"]" : "")}) //Messages
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/notifications', text: 'Notifications' + ($('.header-notification > .has-unread').length ? " ["+$('.header-notification > .has-unread').attr('data-unread')+"]" : "")}) //Notifications
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/myfriends.php', text: 'Friends' + ($('.fl-r.link-count').length ? " ["+$('.fl-r.link-count').text().replace(/\(|\)/g, '')+"]" : "")}) //Friends
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/clubs.php?action=myclubs', text: 'Clubs'}) //Clubs
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/blog/DakuTree', text: 'Blog Posts'}) //Blog Posts
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/myreviews.php', text: 'Reviews'}) //Reviews
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/myrecommendations.php', text: 'Reccomendations'}) //Reccomendations
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/editprofile.php?go=myoptions', text: 'Account Settings'}) //Account Settings
				)
			).append(
				$('<li/>').append(
					$('<a/>', {href: 'http://myanimelist.net/logout.php', text: 'Logout'}) //Logout
				)
			)
		)
	);
	$('#nav li:contains("Profile")').hover(function() {
		$(this).toggleClass('hover');
		$(this).find('> ul').toggle();
	});
}