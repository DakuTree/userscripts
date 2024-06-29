// ==UserScript==
// @name         Nyaa.se - Magnet Links
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds a magnet link button!
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https:\/\/(?:www|sukebei)\.nyaa\.se(?:\/.*)$/
// @updated      2016-11-18
// @version      1.0.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @resource     fontAwesome https://opensource.keycdn.com/fontawesome/4.6.3/font-awesome.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
/* jshint -W097, browser:true, devel:true, multistr:true */
/* global $:false, jQuery:false, GM_addStyle:false, GM_getResourceText:false */
'use strict';

GM_addStyle(GM_getResourceText("fontAwesome").replace(/\.\//g, 'https://opensource.keycdn.com/fontawesome/4.6.3/'));
GM_addStyle(`
.tlistdownload { text-align: center; }
.tlistdownload .fa { font-size: 15px; }
.tlistththree  { text-align: center; width: 35px; }
`);
/****** SCRIPT ******/
$('.tlistdownload').each(function(i, e) {
	var href = $(e).find('a').attr('href')+'&magnet=1';
	$(e).append(
		$('<a/>', {href: href, rel: 'nofollow'}).append(
			$('<i/>', {class: 'fa fa-magnet', style: 'color:red', 'aria-hidden': true})
		)
	);
});
