// ==UserScript==
// @name         NovelUpdates - Sort by New Releases
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Shifts any new series you haven't caught up to the top of your reading list.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/www\.novelupdates\.com\/reading-list/.*$/
// @updated      2016-04-24
// @version      1.0.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false */
'use strict';

$(function() {
	$('table[id="myTable read"] > tbody').prepend($('img[src*=updateicon]').closest('tr'));
});
