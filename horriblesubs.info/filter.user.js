// ==UserScript==
// @name         HorribleSubs - Filter Series
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Allows you to filter series on the HorribleSubs release list.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/horriblesubs\.info($|\/.*$)$/
// @updated      2017-09-13
// @version      1.0.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false, add_ep_click_event, GM_addStyle */
'use strict';

const filtered = [
	'hitorijime-my-hero',
	'detective-conan',
	'hina-logi-from-luck-logic',
	'bonobono',
	'100-pascal-sensei',
	'pripri-chii-chan',
	'action-heroine-cheer-fruits',
	'nobunaga-no-shinobi',
	'cardfight-vanguard-g-next',
	'folktales-from-japan-s2',
	'heybot',
	'yu-gi-oh-vrains'
];

$(function() {
	GM_addStyle(".filtered {display: none;}");

	//Add filter toggle
	$('#search').prepend(
		$('<div/>', {id: 'filter-container', style: 'display: inline-block; font-weight: 400; position: absolute; left: 0; top: 6px;'}).append(
			$('<input/>', {type: 'checkbox', id: 'filter'}).change(function() {
				if(this.checked) {
					$('.filtered').addClass('filtered-show').removeClass('filtered');
				} else {
					$('.filtered-show').removeClass('filtered-show').addClass('filtered');
				}
			})
		).append(
			$('<label/>', {text: 'Show Filtered', style: 'vertical-align: bottom;'})
		)
	);

	//Refresh link.
	$('.refreshlink').replaceWith($('.refreshlink').clone()); //Reset events, since .off() doesn't appear to work here.
	$('.refreshlink').on('click', '.refreshbutton', function(e) {
		e.preventDefault();

        $.ajax({
            url: '/lib/latest.php',
            success: function(response) {
                $('.latest').fadeOut(function () {
					let html       = $(response);

					html.filter('.release-info').each(function(i, e) {
						console.log(e);
						let ele    = $(e);
							console.log(ele);
						let stub   = ele.find('.rls-label').parent().attr('id').match(/^(.*?)-\w+$/)[1].replace('--', '-').replace(/-*$/, '')/*,
						    extras = ele.nextUntil('table')*/;
						if($.inArray(stub, filtered) !== -1) {
							console.log(`Stub matched (${stub})`);
							ele.addClass('filtered');
							// html.splice(html.index(e), 1 + extras.length);
						} else {
							console.log(`Stub NOT matched (${stub})`);
						}
					});

                    $('.latest').html(html).fadeIn();

                    add_ep_click_event();
                });
                $('.morebox').html('<a href="#" style="display: block;" class="morebutton" id="0">Show more</a>');
                $('.refreshlink a').html('<i class="dashicons dashicons-update" title="Refresh"></i>');
            }
        });
    });
	$('refreshbutton').click(); //FIXME: We should just handle the original load event on our own.
});
