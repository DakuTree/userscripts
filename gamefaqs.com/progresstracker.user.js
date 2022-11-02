// ==UserScript==
// @name         GameFAQ - Progress Tracker
// @description  Adds radio buttons to each line in FAQs.
// @author       Daku (admin@codeanimu.net)
// @namespace    https://github.com/DakuTree/userscripts
// @homepage     https://github.com/DakuTree/userscripts
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @icon         https://www.gamefaqs.com/favicon.ico
// @match        https://www.gamefaqs.com/*/*/faqs/*/*
// @version      1.0.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==

/* jshint -W097, browser:true, devel:true */
'use strict';

$(function () {
	$("[id^='faqspan']").html(function (_, html) {
		let lines = html.split(/\n/g),
			new_html = '';

		lines.forEach(function (line) {
			if (!(/^$/.test(line))) {
				new_html += $('<span/>').append(
					$('<input/>', { type: 'radio', name: 'marked' })
				).append(
					$('<span/>', { text: line })
				).html() + "\n";
				console.log(line);
			} else {
				new_html += "\n";
			}
		});
		return new_html;
	});
});
