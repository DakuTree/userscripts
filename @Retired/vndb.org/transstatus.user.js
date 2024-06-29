// ==UserScript==
// @name         VNDB - Show Translation Status in Wishlist
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds an icon to each game on your wishlist to show translation status.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/vndb\.org\/u[0-9]+\/wish(?:$|\?.*$)/
// @updated      2016-03-31
// @version      1.0.1
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//This is <not> perfect, mainly due to some games having multiple versions, or being split into parts etcetc.

/** CONFIG **/
var lang = "English"; //Change to your own language.
/** CONFIG-END **/

//http://stackoverflow.com/a/14645827
(function(old){$.fn.attr=function(){if(arguments.length===0){if(this.length===0){return null;} var obj={};$.each(this[0].attributes,function(){if(this.specified){obj[this.name]=this.value;}});return obj;} return old.apply(this,arguments);};})($.fn.attr);

var unsafeWindow = this['unsafeWindow'] || window;
if($('.menubox a:contains("My Wishlist")').attr('href') == location.pathname) {
	//User is logged in, and on their own user page. Grab translation status.

	$('.wishlist tbody > tr a').each(function() {
		var row = $(this);

		$(row).prepend(grabTransInfo($(row).attr('href')));
	});
}

function grabTransInfo(url) {
	var unsafeWindow = this['unsafeWindow'] || window;

	var id = url.replace(/[^0-9]/g, "");

	var game, status;
	if(unsafeWindow.localStorage.getItem(id)) {
		var local_game = JSON.parse(unsafeWindow.localStorage.getItem(id));
		if(new Date().getTime() > local_game['timestamp']) {
			//expired, get new
			unsafeWindow.localStorage.removeItem(id);
		}else{
			//do nothing
			game = local_game;

			status = $('<abbr/>', game['element']);
		}
	}

	if(!game) {
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			success: function(data) {
				var e = $(data).find('.lang:contains("'+lang+'")')
							   .first() //Gets rid of dupes.
							   .nextUntil('.lang') // Get everything until next language
							   .filter(':not(:contains("TBA"))') //Except TBA releases
							   .filter(':not(:contains("Ch."))') //Avoid seperate chapters (This wil help more than it hurts)
							   .filter(':not(:contains("Trial Edition"))') //No Trials
							   .filter(':not(:contains("Episode"))') //Or single episodes
							   .filter(function() {
								   return ! /ep[0-9]+/i.test($(this).text())
							   })
							   .last(); //Only get last release, since it is probably the closest we have to a "final" release.

				if($(e).length > 0) {
					status = $(e).find('.tc3 abbr').last().clone();
				} else {
					status = $('<abbr/>', {class: 'icons rttrial', title: 'No translation', text: "\xa0"});
				}

				var expireTime = (14 * 24 * 60 * 60 * 1000); //2 weeks expire
				unsafeWindow.localStorage.setItem(id, JSON.stringify(
					{'element': $(status).attr(), 'timestamp': (new Date().getTime() + expireTime)}
				));
			}
		});
	}

	return status;
}
