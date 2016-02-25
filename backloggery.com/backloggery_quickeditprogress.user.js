// ==UserScript==
// @name         Backloggery - Quick Edit Progress Note
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds an inline way to edit progress notes from the profile page.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(?:www\.)?backloggery\.com\/(?:.(?!\.php))+$/
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @updated      2016-02-25
// @version      1.0.2
// ==/UserScript==

var stealthSave = true;

$(function() {
	//To avoid breaking things, we're tweaking some stuff.
	GM_addStyle("\
		.npgame { padding: 5px 0 2px 0 !important; }\
		.npgame > div:nth-of-type(3) { width: 44px !important; }\
		.npgame > div:nth-of-type(5) { width: 420px !important; }\
		.npgame .note { float: left; width: 395px; }\
		.npgame .editDiv { position: relative; width: 420px; }\
	");

	$(/* Game Progress Notes */'.npgame > div:nth-of-type(5)').each(function() {
		var textDiv      = $(this);
		var progressText = $(this).text().trim();

		/** MOVE PROGRESS TEXT TO SPAN **/
		$(this).text(''); //Remove inline text
		$('<span/>', {
			class: 'note',
			text: progressText
		}).appendTo($(this));

		/** CREATE TEXTAREA STUFF **/
		var div = $('<div/>', {class: 'editDiv', style: 'display: none;'});

		$('<textarea/>', {
			text: $(this).parent().attr('data-text') || $(this).text().trim(),
			style: 'width: 420px; margin: 0; padding: 1px 0 0 2px; border-radius: 1px; border: 0;resize: none;'
		}).appendTo(div);

		var save = $('<a/>', {
			text: 'Save',
			href: '#',
			style: 'position: absolute; right: 46px; bottom: 3px; z-index: 15; color: darkgreen'
		})
		$(save).click(function() {
			var newText   = $(textDiv).find('+ div > textarea').val().trim();
			var updateURL = $(textDiv).parent().find('a[href*=update]').attr('href');

			$.get(updateURL, function(data) {
				var form = $(data.replace(/[\s\S]*<form/, '<form').replace(/<\/form>[\s\S]*/, '</form>'));
				$(form).find('[name=note]').val(newText);

				$.post(updateURL, $(form).serialize() + '&submit' + (!stealthSave ? '1=Save' : '2=Stealth+Save'));
			});

			$(textDiv).find('> span').text(newText);

			$(textDiv).toggle();
			$(textDiv).find('+ div').toggle();

			return false;
		});
		$(save).appendTo(div);

		var cancel = $('<a/>', {
			text: 'Cancel',
			href: '#',
			style: 'position: absolute; right: 3px; bottom: 3px; z-index: 15; color: darkred'
		});
		$(cancel).click(function() {
			$(textDiv).toggle();
			$(textDiv).find('+ div').toggle();

			return false;
		});
		$(cancel).appendTo(div);

		$(div).insertAfter($(this));

		/** CREATE EDIT LINK **/
		var a = $('<a/>', {href: '#', text: 'Edit', style: 'float: right; font-size: 10px; color: lightgray; display: none'});
		$(a).click(function() {
			$(textDiv).toggle();
			$(textDiv).find('+ div').toggle();

			$(textDiv).find('+ div > textarea').focus();

			return false;
		});
		$(this).append(a);

		/** ONLY SHOW EDIT LINK ON HOVER **/
		$(this).parent().hover(function() {
			$(a).fadeIn("fast");
		}, function() {
			$(a).fadeOut("fast");
		});
	});
});
