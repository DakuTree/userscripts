// ==UserScript==
// @name         Backloggery - NP Extra Status
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @include      /^http[s]?:\/\/(www\.)?backloggery\.com\/.*$/
// @updated      2015-01-08
// @version      1.1.0
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
