// ==UserScript==
// @name         bato.to - Mark as Checked
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  ...
// @include      /^http:\/\/bato\.to\/(?:search.*)?$/
// @updated      2016-XX-XX
// @version      0.9.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/* jshint -W097, browser:true, devel:true, multistr:true */
/* global $:false, jQuery:false, GM_addStyle:false, GM_getValue, GM_setValue */
'use strict';

var markedSeries = JSON.parse(GM_getValue('marked') || '[]');
var pageSeries = $('.chapters_list > tbody > tr:not([id]):not([class]) > td:first-of-type > strong > a').map(function (i, e) {
	return $(e).attr('href');
});

//Mark each row.
markedSeries.forEach(function (e) {
	$('a[href="' + e + '"]').closest('tr').css('background', 'rgba(0,255,0,0.25)');
});

$('.maintitle, .ipsType_pagetitle').append(
	$('<a/>', { id: 'markchecked', style: 'font-size: 14px;', href: '#', text: ' | Mark all as checked' })
);
$('.maintitle, .ipsType_pagetitle').on('click', '#markchecked', function (e) {
	var json = JSON.stringify($.unique($.merge(markedSeries, pageSeries)));
	GM_setValue('marked', json);
	$('.chapters_list > tbody > tr:not([id]):not([class])').css('background', 'rgba(0,255,0,0.25)');
});
