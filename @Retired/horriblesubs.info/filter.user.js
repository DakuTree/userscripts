// ==UserScript==
// @name         HorribleSubs - Filter Series
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Allows you to filter series on the HorribleSubs release list.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/horriblesubs\.info($|\/.*$)$/
// @updated      2018-07-02
// @version      1.2.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false, add_ep_click_event, GM_addStyle, GM_getValue, GM_setValue */
'use strict';

$(function() {
	GM_addStyle(`
		.filtered {display: none;}
		.filter-link {
			line-height: inherit;
			cursor: pointer;

			padding: 5px 20px 5px 20px;
			float: left;
		}
	`);

	//Add filter toggle
	//FIXME
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
			$('<label/>', {'for': 'filter', text: 'Show Filtered', style: 'vertical-align: bottom;'})
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
						let ele    = $(e),
						    stub   = ele.find('.rls-label').parent().attr('id').match(/^(.*?)-\w+$/)[1].replace('--', '-').replace(/-*$/, '')/*,
						    extras = ele.nextUntil('table')*/;

						let tr = ele.find('tr > .rls-label');
						tr.prepend(
							'<span class="dashicons dashicons-no filter-link"></span>'
						);
						if($.inArray(stub, window.filtered) !== -1) {
							console.log(`Stub matched (${stub})`);
							if($('#filter').is(':checked')) {
								ele.addClass('filtered-show');
							} else {
								ele.addClass('filtered');
							}
							// html.splice(html.index(e), 1 + extras.length);
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

	$('.index-container').on('click', '.filter-link', function(e) {
		e.preventDefault();

		let li   = $(this).closest('li'),
		    stub = $(li).find('> a').attr('href').replace(/^\/shows\/(.*?)#.*?$/, '$1');

		console.log(`Filtering "${stub}"`);
		window.filtered.push(stub);
		GM_setValue('filtered', window.filtered);

		filterReleases();
    });
	//More link
	//TODO

	//Load event
	//TODO
	
	function filterReleases(addFilterLink = false) {
		$('.latest-releases > ul > li').each(function() {
			if(addFilterLink) { $(this)/*.find('> a')*/.prepend('<span class="dashicons dashicons-no filter-link"></span>'); }

			let stub = $(this).find('> a').attr('href').replace(/^\/shows\/(.*?)#.*?$/, '$1');
			if($.inArray(stub, window.filtered) !== -1) {
				console.log(`Stub matched (${stub})`);

				$(this).addClass('filtered');
			}
		});
		// if($.inArray(stub, window.filtered) !== -1) {
	}

	function main() {
		window.filtered = GM_getValue('filtered') || [];
		console.log(window.filtered);

		// $('.refreshbutton').click(); //FIXME: We should just handle the original load event on our own.
		var checkExist = setInterval(function() {
			if ($('.latest-releases').length) {
				filterReleases(true);
				clearInterval(checkExist);
			}
		}, 500); // check every 100ms
	}
	main();
});
