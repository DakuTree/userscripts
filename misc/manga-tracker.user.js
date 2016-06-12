// ==UserScript==
// @name         Manga Tracker
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  A WIP cross-site manga tracker.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/localhost\/tracker\/.*$/
// @include      /^http:\/\/mangafox.me\/manga\/.*$/
// @updated      2016-XX-XX
// @version      0.0.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false, GM_addStyle:false */
'use strict';

var config = {}; //TODO: GET OPTIONS FROM LOCALSTORAGE, SET THESE VIA SITE?, NAG USER IF NOT SET OPTIONS.

if($.isEmptyObject(config)) {
	//Config is loaded, do stuff.

	switch(location.hostname) {
		case 'localhost':
			setupTrackerSite();
			break;

		case 'mangafox.me':
			$(function() {
				if((location.pathname.split('/').length - 1) <= 3) {
					//Manga Page
					var title = $('title').text().split(" Manga - Read ")[0];

					//CHECK: Do we even need this page???
				} else {
					//Chapter Page
					var title = $('#series strong:last > a').text().split(' Manga')[0];
					var count = $('#top_bar .prev_page + div').text().trim().replace(/^[\s\S]*of ([0-9]+)$/, '$1');

					var root_url = location.href.replace(/^(.*\/)(?:[0-9]+\.html)?$/, '$1');

					$('#viewer').css('background', 'none').css('border', '0');
					$('.prev_page').parent().remove(); //No need to have prev/next page controls since everything is loaded on a single page.
					$('#top_chapter_list, #bottom_chapter_list').css('width', '100%');

					//FIX Chapter Dropdown (if broken)
					if($('#top_chapter_list').val() === null) {
						var segments = window.location.pathname.split( '/' ),
						    volume   = segments[3],
							chapter  = segments[4];
						var chapterTitle = $('.read_img img:first').attr('alt').replace(/^.*[0-9]+: (.*?) at MangaFox.me$/, '$1');
						$('#top_chapter_list').append($('<option/>', {value: volume+'/'+chapter, text: 'Vol '+volume.substr(1) + ' Ch ' + chapter.substr(1) + ': '+chapterTitle}));
						$('#top_chapter_list').val(volume+'/'+chapter);
						//We need to re-add it, since the above one is added prior to the page JS populating the chapter list.
						$('#top_chapter_list').change(function(){
							$('#top_chapter_list').append($('<option/>', {value: volume+'/'+chapter, text: 'Vol '+volume.substr(1) + ' Ch ' + chapter.substr(1) + ': '+chapterTitle}));
							$('#top_chapter_list').val(volume+'/'+chapter);
						});
					}

					$('#viewer > .read_img').remove();
					GM_addStyle('\
						#viewer > .read_img { background: none; }\
						#viewer > .read_img  img { border: 5px solid #a9a9a9; /*background: #FFF repeat-y;*/ background: url("http://mangafox.me/media/loading.gif") no-repeat center; min-height: 300px;}\
						.pageNumber { border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-collapse: collapse; background-color: black; color: white; height: 18px; font-size: 12px; font-family: Verdana; font-weight: bold; position: relative; bottom: 17px; width: 50px; text-align: center; opacity: 0.75; border-width: 2px; border-style: solid; border-color: white; border-radius: 16px !important; margin: 0px auto !important; padding: 0px !important; border-spacing: 0px !important;\
						.pageNumber .number { border-collapse: collapse; text-align: center; display: table-cell; width: 50px; height: 18px; vertical-align: middle; border-spacing: 0px !important; padding: 0px !important; margin: 0px !important;\
					');

					for(var x=1; x<count; x++) {
						//Create the elements where the pages will go, so they stay in order even if the $.get doesn't load in order.
						if(x == 1) {
							$('<div/>', {id: 'page-'+x, class: 'read_img'}).prependTo($('#viewer'));
						} else {
							$('<div/>', {id: 'page-'+x, class: 'read_img'}).insertAfter($('#viewer > .read_img:last'));
						}
						$.ajax({
							url: root_url + x+'.html',
							type: 'GET',
							page: x,
							//async: false,
							success: function(data) {
								var image = data.replace(/^[\s\S]*(<div class="read_img">[\s\S]*<\/div>)[\s\S]*<div id="MarketGid[\s\S]*$/, '$1').replace(/href="[0-9]+.html"/, 'href="#"').replace(/onclick="return enlarge\(\)"/, 'onclick="return false;"'); //Just get the element we want to avoid extra loading.
								var pageN = $('<div/>', {class: 'pageNumber'});
								pageN.append($('<div/>', {class: 'number', text: this.page}));

								$('#page-'+this.page).replaceWith(image.replace(/<\/div>$/, pageN.prop('outerHTML')+'</div>'));
							}
						});
					}
				}
			});
			break;

		default:
			//TODO: Instead of using case, check against online JSON for valid websites?
			break;
	}
}

function setupTrackerSite() {
	$('#userscript-check').removeClass('not-loaded').addClass('loaded').text('Userscript is loaded.');

	//Replace URLs, setup options, yadda yadda
}

