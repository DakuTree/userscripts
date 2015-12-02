// ==UserScript==
// @name         Backloggery - NP Extra Statuses
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds ability to filter "Now Playing" games under specific categories (on-hold, plan-to-play, etc.)
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(?:www\.)?backloggery\.com\/(?:.(?!\.php))+$/
// @updated      2015-12-02
// @version      1.2.0
// ==/UserScript==

var defaultCategories = {
	//now-playing is used if none is specified.
	"now-playing" : {
		"description" : ""
	}
};
var defaultCategoriesEnd = {
	"on-hold" : {
		"title"       : "On-Hold",
		"description" : ""
	},
	"to-play" : {
		"title"       : "Plan to Play",
		"description" : ""
	}
}
var dev = false; //Enable if you want some dev stuff.

$(document).ready(function() {
	if(dev == true){
		if(jQuery.fn.jquery !== '1.8.3') alert('jQuery mismatch!\nRunning '+jQuery.fn.jquery+'.\nExpected 1.8.3.');

		//https://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/
		window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
			alert('Error: '+errorMsg+'\n'
			     +'ScriptURL: '+url+'\n'
			     +'LineNumber: '+lineNumber+'\n'
			     +'Column: '+column+'\n'
			     +'StackTrace: '+errorObj);

			error = true;
			return true;
		}
	}

	//Case insensitive :contains || via: https://gist.github.com/jbcappell/2648373
	$.extend($.expr[":"], {
		"containsNC": function(elem, i, match, array) {
			return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});

	/**** SCRIPT ****/

	//Grab user settings
	var userCategoriesStr = $('#note').text().match(/==NPES-START==([\s\S]+)==NPES-END==/);
	var userCategories    = {};
	if(userCategoriesStr) {
		try {
			userCategories = JSON.parse(userCategoriesStr[1]);
		} catch (e) {
			console.error(e);
		}
	}

	$.each($.extend(defaultCategories, userCategories, defaultCategoriesEnd), function(key, value) {
		if(!key.match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]+$/)) {
			console.warn("User category key contains invalid characters: "+key);
			return true;
		} else if(!value['title'].match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]+$/)) {
			console.warn("User title contains invalid characters: "+value['title']);
			return true;
		} else if(!value['description'].match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]*$/)) {
			console.warn("User description contains invalid characters: "+value['description']);
			return true;
		}
		if(key == 'now-playing' && value['description']) {
			//the now-playing key is used for anything without a key.
			$('#intro h1:containsNC("Now Playing")').after(
				$('<span/>', {class: 'hd-desc', text: value['description']})
			);
			$('#intro h1:containsNC("Now Playing")').attr('style', 'margin-bottom:3px');
			return true;
		}

		var elements = $('.npgame:containsNC(\['+key+'\])');
		if(elements.length > 0){
			$('#intro').append(
				$('<h1/>', {text: value['title'], style: 'margin-top: 12px;' + (value['description'] ? ' margin-bottom: 3px;' : '')})
			).append(
				(value['description'].length > 0 ?
					$('<span/>', {class: 'hd-desc', text: value['description']}) :
					''
				)
			);

			//move elements containing key to bottom of list
			$(elements).each(function(){
				var a = $(this);

				//remove the tag from the description if at start or end. keep otherwise (to avoid problems)
				$(a).children(':eq(4)').text(function() {
					//Check: Is there a better way to do this regex? Lots of duplication here..
					var re = new RegExp('(?:^[\\s]*\\['+key+'\\][\\s]*|[\\s]*\\['+key+'\\][\\s]*$)','i');
					return $(this).text().replace(re, '');
				});

				var b = $(a).next();
				$(a).appendTo('#intro');
				$(b).appendTo('#intro');
			});
		}
	});
    $('<style/>').attr('rel', 'stylesheet').attr('type', 'text/css').text(".hd-desc {display: block; margin-bottom: 5px;}").appendTo('head');
});
