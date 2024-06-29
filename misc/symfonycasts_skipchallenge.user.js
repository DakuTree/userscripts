// ==UserScript==
// @name         SymfonyCasts skip challenge
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  ...
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https:\/\/symfonycasts.com\/screencast\/.*?$/
// @updated      2021-09-01
// @version      1.0.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false */
'use strict';

let e = jQuery('.challenge-alert a:contains("Continue to the next")');
if (e.length > 0) {
	location.href = jQuery('.challenge-alert a:contains("Continue to the next")').attr('href')
}
