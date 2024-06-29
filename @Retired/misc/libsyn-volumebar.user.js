// ==UserScript==
// @name         LibSyn - Add Volume Slider
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  This adds a volume slider to the LibSyn player.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^.*\/\/html5-player\.libsyn\.com\/embed\/episode\/id\/.*$/
// @updated      2016-04-10
// @version      1.0.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==
/* jshint -W097 */
/* global $:false, jQuery:false */
'use strict';

$('body').append(
	$('<input/>', {
		type  : 'range',
		min   : '0.0',
		max   : '1.0',
		step  : '0.02',
		value : '0.8',
		style : 'z-index: 50; position: absolute; bottom: 47px; display: block; width: 99%;',
		id    : 'audio-slider'
	})
);

$('#audio-slider').on("input", function() {
	$('audio').get(0).volume = this.value;
});
