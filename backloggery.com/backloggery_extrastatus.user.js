// ==UserScript==
// @name         Backloggery - NP Extra Status
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds functionality which allows users to categorize their "now playing" games.
// @include      /^http[s]?:\/\/(www\.)?backloggery\.com\/.*$/
// @updated      2015-05-30
// @version      0.0.1
// ==/UserScript==

// {
	var elements = $('.npgame:contains(\[on-hold\])');
	if(elements){
		$('#intro').append($('<h1/>', {text: 'On-Hold', style: 'margin-top: 10px;'}));
		$(elements).each(function(){
			var a = $(this),
				b = $(a).next();

			$(a, b).appendTo('#intro');
		});
	}
// }
