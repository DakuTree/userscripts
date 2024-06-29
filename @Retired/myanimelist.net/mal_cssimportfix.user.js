// ==UserScript==
// @name         MyAnimeList - CSS Import Fix
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Re-enables use of @import in list CSS. (Minor tweaking required)
// @icon         https://myanimelist.net/favicon.ico
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)list\/.*$/
// @updated      2018-07-20
// @version      1.0.0
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @noframes
// @run-at       document-start
// ==/UserScript==
'use strict';
/* global $, jQuery */

$('style:contains("@import url ")').html(function(i, css) {
	// Use valid url() format.
	css = css.replace('@import url ', '@import url');

	// Unescape quotes.
	css = css.replace(/&(?:quot|#039);/g, '"');

	// Remove import nag. (We would just .remove() it, but it doesn't exist on pageload)
	css = css + '.initialize-tutorial.warning { display: none !important; }';

	return css;
});
