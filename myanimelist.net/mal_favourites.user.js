// ==UserScript==
// @name         MyAnimeList - Extended Favourites
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds the ability to have more favourites than the current limit allows.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga|people|character|profile)(\/|\.php\?id\=).*$/
// @updated      2015-04-17
// @version      2.1.0
// ==/UserScript==

var backend = "http://codeanimu.net/userscripts/myanimelist.net/backend/";
var dev = false; //Enable if you want some dev stuff

$(document).ready(function() {
	if(dev == true){
		if(jQuery.fn.jquery !== '1.8.1'){
			alert('jQuery mismatch!\nRunning '+jQuery.fn.jquery+'.\nExpected 1.8.1.');
		}
		window.onerror = function(msg, url, linenumber) {
			alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
			error = true;
			return true;
		}
	}

	var userid = (document.cookie.match('(^|; )(A|Y)=([^;]*)')||0)[3] || find_userid() || 0,
	    type;

	if(/myanimelist\.net\/(profile)\/.*$/.test(self.location.href)){
		var profileID = $('[name=profileMemId]').val(); //Profile ID is different than userid
		$.getJSON(backend+"mf_index.php", {userid: profileID}, function(data) {
			var anime      = $('.profile_leftcell .normal_header:contains("Favorite Anime")').next('table').find('tbody'),
			    manga      = $('.profile_leftcell .normal_header:contains("Favorite Manga")').next('table').find('tbody'),
			    characters = $('.profile_leftcell .normal_header:contains("Favorite Characters")').next('table').find('tbody'),
			    people     = $('.profile_leftcell .normal_header:contains("Favorite People")').next('table').find('tbody');

			$.each(data, function(){
				var type = $(this)[0]['type'];
				type = (type == 0 ? "anime" : (type == 1 ? "manga" : (type == 2 ? "character" : (type == 6 ? "people" : null))))
				var type_id      = $(this)[0]['type_id'],
				    name         = $(this)[0]['name'];
				    url          = 'http://myanimelist.net/'+type+'/'+type_id;
				    preview_url  = $(this)[0]['preview_url'];
				    series_title = $(this)[0]['series_title'];
				    series_url   = $(this)[0]['series_url'];

				$('<tr/>', {style: 'background-color: #D5E4FF'}).append(
					$('<td/>', {valign: 'top', width: 25, class: 'borderClass'}).append(
						$('<div/>', {class: 'picSurround'}).append(
							$('<a/>', {href: 'http://myanimelist.net/'+type+'/'+type_id}).append(
								$('<img/>', {src: preview_url, border: 0, alt: name}))))
				).append(
					$('<td/>', {valign: 'top', class: 'borderClass'}).append(
						$('<a/>', {href: url, text: name})).append(
						(type == "character" ? $('<div/>', {style: 'padding-top:2px;'}).append($('<a/>', {href: series_url, class: 'lightLink', text: series_title})) : ""))
				).appendTo($('.profile_leftcell .normal_header:contains("Favorite '+type.substr(0, 1).toUpperCase()+type.substr(1)+'")').next('table').find('tbody'));
			});
		});
	}
	else if(/myanimelist\.net\/(anime|manga|character|people)\/[0-9]+/.test(self.location.href) || /myanimelist\.net\/(anime|manga|character|people)\.php\?id\=.*/.test(self.location.href)){
		if(userid == 0) return false;

		var tcheck =  $('#horiznav_nav a:contains("Details")').attr('href').replace(/^.*myanimelist.net\//, '').replace(/^\//, '').split('/'),
			type   = (tcheck[0] == "anime" ? 0 : (tcheck[0] == "manga" ? 1 : (tcheck[0] == "character" ? 2 : (tcheck[0] == "people" ? 6 : 0)))),
			id     = tcheck[1];

		$('#profileRows a:contains("Favorites")').after(
			$('<a/>', {href: 'javascript:void(0);', style: 'font-weight: normal;'}).append(
				$('<span/>', {id: 'favOutputExtended', text: 'Add/Remove ExFavorites'})
			)
		);

		$('#favOutputExtended').click(function(){
			var name = $('#contentWrapper > h1:eq(0)').text().replace(/^Ranked #[0-9]+/, '').trim(),
			    thumbURL = $('tbody tr:eq(0) div:eq(0) img').attr('src');
			thumbURL = (type == 2 ? thumbURL.replace('.jpg', 't.jpg') : thumbURL.replace('.jpg', 'v.jpg'));

			var params = {
				userid: userid,
				type: type,
				type_id: id,
				name: name,
				preview_url: thumbURL.replace('http://', '')
			};

			if(type == 2){
				var series = $('#content > table > tbody > tr > td:eq(0) .normal_header ~ table tr td:eq(1) a:eq(0)').first();
				params = $.extend(params, {series_title: series.text(), series_url: series.attr('href').replace('http://', '')});
			}
			$.get(backend+"mf_update.php", params, function(data){
				$('#favOutputExtended').html(data);
			});
		});
	}

	function find_userid() {
		var userid,
		    unsafeWindow = this['unsafeWindow'] || window;

		//#1: Check localStorage to see if userid is already set?
		//    Also if expired, delete localStorage.
		if(unsafeWindow.localStorage.getItem('userid')) {
			var userid_data = JSON.parse(unsafeWindow.localStorage.getItem('userid'));
			if(new Date().getTime() > userid_data['timestamp']) {
				unsafeWindow.localStorage.removeItem('userid');
				console.log('localstorage found userid but has expired');
			}else{
				userid = userid_data['userid'];
				console.log('localstorage found userid');
			}
		}

		if(!userid) {
			//#2: localstorage does not exists, manually try and find userid

			//#2.1: Check if user is online, and if so, get username.
			var userName;
			$.get('http://myanimelist.net/panel.php', function(data1) {
				userName = data1.match(/\/profile\/(.*?)"/)[1];
				console.log(userName);
				if(userName) {
					//2.2: Check profile for userID. It may be possible for the userID to still not exist.
					$.get('http://myanimelist.net/profile/'+userName, function(data2) {
						//since we're using an old version of jQuery, parsing the HTML is painful, so we're doing it the hacky way.
						userid = data2.match(/name="profileMemId" value="([0-9]+)"/)[1];
						if(userid) {
							var expireTime = (14 * 24 * 60 * 60 * 1000); //2 weeks expire
							unsafeWindow.localStorage.setItem('userid', JSON.stringify({'userid': userid, 'timestamp': (new Date().getTime() + expireTime)}));
							console.log('userid found');
						}
					});
				}else{
					//User is not online, alert them?
				}
			});
		}

		return userid;
	}
});
