// ==UserScript==
// @name         CardMarket -  Export Wants
// @description  Displays a textarea containing an importable list of everything in your wants list.
// @author       Daku (admin@codeanimu.net)
// @namespace    https://github.com/DakuTree/userscripts
// @homepage     https://github.com/DakuTree/userscripts
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @icon         https://www.cardmarket.com/favicon.ico
// @match        https://www.cardmarket.com/en/Magic/Wants/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @version      1.0.1
// ==/UserScript==

/* jshint -W097, browser:true, devel:true */
'use strict';

let cards = [];
$('#WantsListTable tbody > tr').each((i, e) => {
	let $row = $(e);
	let amount = $row.find('.amount').text();
	let name = $row.find('.name').text();
	let set = $row.find('.expansion [data-original-title]').attr('data-original-title');

	let fullName = `${amount}x ${name}`;
	if (set) {
		fullName += ` (${set})`;
	}
	cards.push(fullName);
});

let cardList = cards.join('\n');
$('<textarea/>', { 'class': 'form-control', 'height': '256px', 'readonly': true, text: cardList }).insertAfter('#WantsListTable +');
