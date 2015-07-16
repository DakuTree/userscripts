// ==UserScript==
// @name         Backloggery - NP Extra Statuses
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds ability to filter "Now Playing" games under "On-Hold" & "Plan to Play".
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(?:www\.)?backloggery\.com\/(?:.(?!\.php))+$/
// @updated      2015-05-30
// @version      1.1.2
// ==/UserScript==

var categories = {
	"on-hold": "On-Hold",
	"to-play": "Plan to Play" //FIXME: This feels like shitty wording.
};

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

	/** SCRIPT **/
	$.each(categories, function(key, value) {
		var elements = $('.npgame:containsNC(\['+key+'\])');
		if(elements.length > 0){
			$('#intro').append($('<h1/>', {text: value, style: 'margin-top: 12px;'})); //Add header

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
});
