// ==UserScript==
// @name         Steam - Auto Sort Cart
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  ...
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @match        https://store.steampowered.com/cart
// @match        https://store.steampowered.com/cart?*
// @match        https://store.steampowered.com/cart/*
// @updated      2023-11-22
// @version      1.0.0
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false */
'use strict';

$(function() {
	/*$('.cart_row').sort(function(a,b) {
		let $a = parseFloat($(a).find('.price:last-of-type').text().substring(1));
		let $b = parseFloat($(b).find('.price:last-of-type').text().substring(1));
		return +$a - +$b;
	}).appendTo(jQuery('.cart_item_list'));*/

$('div:contains("Remove")[tabindex=0]').parent().parent().parent().parent().parent().parent().filter(function(i) {return $(this).attr('class') == 'Panel Focusable'}).sort(function(a,b) {
		let $a = parseFloat($(a).find('._2WBvzE2CywKDLD0QTnbmUE').text().substring(1));
		let $b = parseFloat($(b).find('._2WBvzE2CywKDLD0QTnbmUE').text().substring(1));
	    console.log($(a).find('._2WBvzE2CywKDLD0QTnbmUE'));
		return +$a - +$b;
	}).appendTo($('._3SgHVt1Zp2MeobFUVwwJ2q'))
});
