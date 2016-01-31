// ==UserScript==
// @name         Amazon - Hide delivered items from open orders
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Hides all delivered items from your open orders.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/www\.amazon\.(?:co(?:m|\.(?:uk|jp))|es|de|it|fr|ca|cn)\/gp\/(?:your-account|css)?\/?order-history.*orderFilter\=open.*$/
// @updated      2016-01-31
// @version      1.0.1
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// ==/UserScript==
/* jshint -W097 */
/* global $:false, jQuery:false */
'use strict';

//Hide delivered items.
$(/* Delivered items */'.shipment-is-delivered').add(
	$(/* Dispatched items */'.a-color-success:contains(Dispatched)').parents('.shipment')
).add(
	$(/* Irregular delivered items, but not marked as such */'.shipment:not(:has(.shipment-top-row))')
).hide();

//Generate link to show hidden items.
$('#controlsContainer').after(
	$('<div/>', {style: 'text-align: center'}).append(
		$('<a/>', {id: 'show-hidden', href: '#', text: 'Click to show delivered items'})
	)
);
$('body').on('click', 'a#show-hidden', function() {
	$('.shipment-is-delivered').add($('.a-color-success:contains(Dispatched)').parents('.shipment')).show();
	$(this).hide();
});