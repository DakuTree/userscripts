// ==UserScript==
// @name         E(x)-Hentai CompactSearch
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Compacts the search into the topbar, saving vertical space. Supports E-Hentai & EXHentai.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(g\.e-|ex)hentai\.org\/.*$/
// @grant        GM_addStyle
// @updated      2015-11-01
// @version      2.0.8
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

//TODO: Make new topbar appear alongside DOM (instead of loading a second or so after).
//Use Stylish
GM_addStyle("#toppane, #nb {display: none !important;}"); //Hide elements before load
var domain = (location.host.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/) || [])[1].replace('-', '');

function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

function main(){
	jQuery(document).ready(function($){
		//Get/set default settings
		//This seems to be stored in the uconfig cookie, but it seems to be somewhat encrypted.
		var unsafeWindow = this['unsafeWindow'] || window;
		var v = new Object();
		if($('form input[id*="f_"], #searchbox input[name="f_search"]').length > 0){
			$('form input[id*="f_"], input[name="f_search"]').each(function(){ v[$(this).attr('name')] = $(this).attr('value')});
			console.log($('html'));
			unsafeWindow.localStorage.setItem('s', JSON.stringify(v));
		}else{
			v = JSON.parse(unsafeWindow.localStorage.getItem('s'));
			v['f_search'] = "Search Keywords"; //Show default text on non-search pages.
			
		}

		var colors = {
			ehentai:  ['#E3E0D1', '#EDEBDF', '#5C0D11', '#9B4E03', '#F2EFDF', '#5C0D11', '#5C0D11'],
			exhentai: ['#34353b', '#4f535b', '#000000', '#43464e', '#43464e', '#f1f1f1', '#f1f1f1']
		};

		var color1 = colors[domain][0],
		    color2 = colors[domain][1],
		    color3 = colors[domain][2], //borders, also main text color
		    color4 = colors[domain][3],
		    color5 = colors[domain][4], //search focus background
		    color6 = colors[domain][5], //text
		    color7 = colors[domain][6]; //text:hover:focus

		$('#toppane').remove();
		$('<style/>').attr('rel', 'stylesheet').attr('type', 'text/css') //{
			.text("\
					.ido {padding-top: 0 !important;}\
					#navwrap {width: 90%; min-width: 975px; height: 24px; margin: auto; z-index: 99; position: relative; background-color: "+color2+"; border: 1px solid "+color3+"; margin-bottom: 10px;}\
					.navbar {height: 24px; padding: 0; margin: 0; position: absolute; width: 100%;}\
					.navbar li {height: 24px; width: 150px; float: left; text-align: center; list-style: none; font: normal bold 12px/1.2em Arial, Verdana, Helvetica; padding: 0; margin: 0; background-color: "+color2+";}\
					.navbar li a {padding: 5px 0; text-decoration: none; color: "+color6+"; display: block; border-right: 1px solid "+color3+";}\
					.navbar li a:hover {background-color: "+color1+";}\
					.navbar li ul {display: none; height: auto; margin: 0; margin-left: -1px; padding: 0; border-top: 1px solid "+color3+"; border-left: 1px solid "+color3+"; border-right: 1px solid "+color3+"; border-bottom: 1px solid "+color3+";}\
					.navbar li:hover ul {display: block;}\
					.navbar li ul {background-color: "+color2+";}\
					.navbar li:last-child ul {margin-top: 2px; margin-right: -1px;}\
					.navbar li ul a {border-right: 0;}\
					.navbar li ul a:not(:first-child) {border-top: 1px solid "+color3+"}\
					.navbar li ul a:hover {background-color: "+color1+";}\
					.navbar li form {margin-top: 0;}\
					.navbar li form input {margin-right: 1px;}\
					.navbar li form ul {font-weight: normal;}\
					.navbar .nopm a {text-decoration: underline; font-size: 8pt; display: inline; border: 0 !important;}\
					.navbar .nopm a:hover {background-color: transparent;}\n\
					.navbar input.stdinput {width: 349px; background-color: "+color1+"; color: "+color6+"; padding: 1px 3px 2px 3px; border: 1px solid "+color3+";}\
					@-moz-document url-prefix() { .navbar input.stdinput {padding: 1px 3px 1px 3px !important;} }\
					.navbar input.stdinput {width: 349px; background-color: "+color1+"; color: "+color6+"; padding: 1px 3px 2px 3px; border: 1px solid "+color3+";}\
					.navbar .stdinput:enabled:hover, .navbar .stdinput:enabled:focus {color: "+color7+"; background: "+color5+";}\
					.navbar .stdinput, .stdbtn {margin: auto;}\
					.navbar .stdbtn {height: 19px !important; padding: 0px 6px; margin: 3px 1px 0px 1px; background-color: "+color1+"; color: "+color6+";}\
					.navbar .stdbtn:hover {border: 2px outset "+color3+";}\
					.navbar .stdbtn:enabled:hover, .navbar .stdbtn:enabled:active, .navbar .stdbtn:enabled:focus {color: "+color7+"; background: "+color5+"; border: 2px outset "+color3+";}\
					.navbar table.itc {border-spacing: 1px; padding-top: 1px; padding-bottom: 1px;}\
					.navbar table.itc td {padding: 0;}\
					.navbar #fill {width: calc(100% - 450px - 507px - 16px);}\
					.navbar table.itss {margin: 0; width: calc(100% - 28px); font-size:11px; margin-left: 28px;}\
					.navbar table.itss td.ic2 {width: 45%}\
					.navbar #fsdiv {font-size: 11px; font-weight: normal;}\
			").appendTo('head'); //}

		var nav2 = $('<div/>', {id: 'navwrap'});
		var nav = $('<ul/>', {class: 'navbar'}).appendTo(nav2);
		$('<li/>').append( //{
			$('<a/>', {text: "Front Page", href: location.origin})).append(
				$('<ul/>').append(
					$('<a/>', {text: "News", href: 'http://e-hentai.org/'})).append(
					$('<a/>', {text: "Forums", href: 'http://forums.e-hentai.org/'})).append(
					$('<a/>', {text: "Wiki", href: 'http://ehwiki.org/wiki/Category:E-Hentai_Galleries'})).append(
					$('<a/>', {text: "Torrents", href: location.origin+'/torrents.php'})).append(
					$('<a/>', {text: "Bounties", href: 'http://g.e-hentai.org/bounty.php'})).append(
					$('<a/>', {text: "Toplists", href: 'http://g.e-hentai.org/toplist.php'}))).appendTo(nav);
		$('<li/>').append(
			$('<a/>', {text: "My Home", href: 'http://g.e-hentai.org/home.php'})).append(
				$('<ul/>').append(
					$('<a/>', {text: "Favorites", href: location.origin+'/favorites.php'})).append(
					$('<a/>', {text: "Maintain Galleries", href: 'http://ul.'+location.hostname.replace(/^g\./, '')+'/manage.php'})).append(
					$('<a/>', {text: "Upload Gallery", href: 'http://ul.'+location.hostname.replace(/^g\./, '')+'/manage.php?act=new'})).append(
					$('<a/>', {text: "Options", href: location.origin+'/uconfig.php'}))).appendTo(nav);
		$('<li/>').append(
			$('<a/>', {text: "HentaiVerse", href: 'http://hentaiverse.org/', onclick: "popUp('http://hentaiverse.org/',1250,720); return false"})).appendTo(nav);
		$('<li/>', {id: 'fill', style: "border-right: 1px solid "+color3+";"}).appendTo(nav);
		$('<li/>', {style: "border-right: 1px solid "+color3+"; width: 15px !important; min-width: 15px; max-width: 15px;"}).append(
            $('<a/>', {href: '#', text: '#', id: 'addenglish', style: 'border-right: 0'})).appendTo(nav);
		$('<li/>', {style: "width: 506px !important; min-width: 506px; max-width: 506px;"}).append(
			$('<form/>', {action: "http://"+location.hostname, method: "GET"}).append(
				$('<div/>').append(
				$('<input/>', {type: "text", name: "f_search", value: v["f_search"], class: "stdinput", onfocus: "if(this.value=='Search Keywords') this.value = '';", size: "50", maxlength: "200"})).append(
				$('<input/>', {type: "submit", name: "f_apply", value: "Apply Filter", class: "stdbtn", style: "width: 70px"})).append(
				$('<input/>', {type: "submit", name: "f_clear", value: "Clear Filter", class: "stdbtn", style: "width: 70px", onclick: "top.location.href='http://g.e-hentai.org/'; return false"}))).append(
					$('<ul/>').append(
						$('<table/>', {class: "itc"}).append(
							$('<tr/>').append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_doujinshi", value: v["f_doujinshi"], id: "f_doujinshi"})).append(
									$('<img/>', {id: "f_doujinshi_img", src: "http://ehgt.org/g/c/doujinshi"+ (v["f_doujinshi"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "doujinshi", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_manga", value: v["f_manga"], id: "f_manga"})).append(
									$('<img/>', {id: "f_manga_img", src: "http://ehgt.org/g/c/manga"+ (v["f_manga"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "mangat", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_artistcg", value: v["f_artistcg"], id: "f_artistcg"})).append(
									$('<img/>', {id: "f_artistcg_img", src: "http://ehgt.org/g/c/artistcg"+ (v["f_artistcg"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "artistcg", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_gamecg", value: v["f_gamecg"], id: "f_gamecg"})).append(
									$('<img/>', {id: "f_gamecg_img", src: "http://ehgt.org/g/c/gamecg"+ (v["f_gamecg"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "gamecg", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_western", value: v["f_western"], id: "f_western"})).append(
									$('<img/>', {id: "f_western_img", src: "http://ehgt.org/g/c/western"+ (v["f_western"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "western", style: "cursor:pointer"})))).append(
							$('<tr/>').append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_non-h", value: v["f_non-h"], id: "f_non-h"})).append(
									$('<img/>', {id: "f_non-h_img", src: "http://ehgt.org/g/c/non-h"+ (v["f_non-h"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "non-h", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_imageset", value: v["f_imageset"], id: "f_imageset"})).append(
									$('<img/>', {id: "f_imageset_img", src: "http://ehgt.org/g/c/imageset"+ (v["f_imageset"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "imageset", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_cosplay", value: v["f_cosplay"], id: "f_cosplay"})).append(
									$('<img/>', {id: "f_cosplay_img", src: "http://ehgt.org/g/c/cosplay"+ (v["f_cosplay"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "cosplay", style: "cursor:pointer",}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_asianporn", value: v["f_asianporn"], id: "f_asianporn"})).append(
									$('<img/>', {id: "f_asianporn_img", src: "http://ehgt.org/g/c/asianporn"+ (v["f_asianporn"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "asianporn", style: "cursor:pointer"}))).append(
								$('<td/>').append(
									$('<input/>', {type: "hidden", name: "f_misc", value: v["f_misc"], id: "f_misc"})).append(
									$('<img/>', {id: "f_misc_img", src: "http://ehgt.org/g/c/misc"+ (v["f_misc"] == 1 ? "" : "_d") + ".png", class: "ic", alt: "misc", style: "cursor:pointer"}))))).append(
						$('<div/>').append(
							$('<p/>', {class: "nopm", style: "margin-top:2px;"}).append(
								$('<a/>', {href: "#", rel: "nofollow", id: "show_ao", text: "Show Advanced Options", style: "margin-right:5px;"})).append(
								$('<a/>', {href: "#", rel: "nofollow", id: "show_fs", text: "Show File Search", style: "margin-left:5px;", disabled: 'disabled'}))).append(
							$('<div/>', {id: 'advdiv', style: 'display: none;'}))))).append(
					$('<ul/>', {style: 'margin-top: -1px;'}).append(
						$('<div/>', {id: 'fsdiv', style: 'display: none;'}))
		).appendTo(nav); //}

		//$('#nb').replaceWith(nav2);
		$('body').prepend(nav2);

		$('#navwrap').on('click', '.nopm > a', function(e){
			var id = ($(this).attr('id') == 'show_ao' ? 'advdiv' : 'fsdiv');

			if($('#'+id).css('display') == 'none'){
				if(id == 'advdiv'){
					$('#'+id).append(
						$('<input/>', {type: 'hidden', id: 'advsearch', name: 'advsearch', value: '1'})).append(
						$('<table/>', {class: 'itss'}).append(
							$('<tbody/>').append(
								$('<tr/>').append(
									$('<td/>', {class: 'ic4'}).append(
										$('<input/>', {id: 'adv11', type: 'checkbox', name: 'f_sname', checked: 'checked'})).append(
										$('<label/>', {for: 'adv11', text: 'Search Gallery Name'}))).append(
									$('<td/>', {class: 'ic4'}).append(
										$('<input/>', {id: 'adv12', type: 'checkbox', name: 'f_stags', checked: 'checked'})).append(
										$('<label/>', {for: 'adv12', text: 'Search Gallery Tags'}))).append(
									$('<td/>', {class: 'ic2'}).append(
										$('<input/>', {id: 'adv13', type: 'checkbox', name: 'f_sdesc', colspan: '2'})).append(
										$('<label/>', {for: 'adv13', text: 'Search Gallery Description'})))).append(
								$('<tr/>').append(
									$('<td/>', {class: 'ic2', colspan: '2'}).append(
										$('<input/>', {id: 'adv15', type: 'checkbox', name: 'f_storr'})).append(
										$('<label/>', {for: 'adv15', text: 'Search Torrent Filenames'}))).append(
									$('<td/>', {class: 'ic2', colspan: '2'}).append(
										$('<input/>', {id: 'adv16', type: 'checkbox', name: 'f_sto'})).append(
										$('<label/>', {for: 'adv16', text: 'Only Show Galleries With Torrents'})))).append(
								$('<tr/>').append(
									$('<td/>', {class: 'ic2', colspan: '2'}).append(
										$('<input/>', {id: 'adv21', type: 'checkbox', name: 'f_sdt1'})).append(
										$('<label/>', {for: 'adv21', text: 'Search Low-Power Tags'}))).append(
									$('<td/>', {class: 'ic2', colspan: '2'}).append(
										$('<input/>', {id: 'adv22', type: 'checkbox', name: 'f_sdt2'})).append(
										$('<label/>', {for: 'adv22', text: 'Search Downvoted Tags'})))).append(
								$('<tr/>').append(
									$('<td/>', {class: 'ic2', colspan: '2'}).append(
										$('<input/>', {id: 'adv31', type: 'checkbox', name: 'f_sh'})).append(
										$('<label/>', {for: 'adv31', text: 'Show Expunged Galleries'}))).append(
									$('<td/>', {class: 'ic2', colspan: '2'}).append(
										$('<input/>', {id: 'adv32', type: 'checkbox', name: 'f_sr'})).append(
										$('<label/>', {for: 'adv32', text: 'Minimum Rating: '})).append(
										$('<select/>', {id: 'adv42', class: 'stdinput imr', name: 'f_srdd'}).append(
											$('<option/>', {value: '2', text: '2 stars'})).append(
											$('<option/>', {value: '3', text: '3 stars'})).append(
											$('<option/>', {value: '4', text: '4 stars'})).append(
											$('<option/>', {value: '5', text: '5 stars'}))))
					)));
				}
				else if(id == 'fsdiv'){
					$('#'+id).append(
						$('<form/>', {action: 'http://ul.'+location.hostname.replace(/^g\./, '')+'/image_lookup.php', method: 'post', enctype: 'multipart/form-data'}).append(
							$('<div/>').append(
								$('<p/>', {text: 'If you want to combine a file search with a category/keyword search, upload the file first.', style: 'font-weight: bold;'})).append(
								$('<p/>', {text: 'Select a file to upload, then hit File Search. All public galleries containing this exact file will be displayed.'})).append(
								$('<div/>').append(
									$('<input/>', {type: 'file', name: 'sfile', size: '40', style: 'font-size:8pt;'})).append(
									$('<input/>', {type: 'submit', name: 'f_sfile', value: 'File Search', style: 'font-size:8pt;'}))).append(
								$('<p/>', {text: 'For color images, the system can also perform a similarity lookup to find resampled images.'})).append(
								$('<table/>', {class: 'itsf'}).append(
									$('<tbody/>').append(
										$('<tr/>').append(
											$('<td/>', {class: 'ic3'}).append(
												$('<input/>', {id: 'fs_similiar', type: 'checkbox', name: 'fs_similar', checked: 'checked'})).append(
												$('<label/>', {for: 'fs_similar', text: 'Use Similarity Scan'}))).append(
											$('<td/>', {class: 'ic3'}).append(
												$('<input/>', {id: 'fs_covers', type: 'checkbox', name: 'fs_covers'})).append(
												$('<label/>', {for: 'fs_covers', text: 'Only Search Covers'}))).append(
											$('<td/>', {class: 'ic3'}).append(
												$('<input/>', {id: 'fs_exp', type: 'checkbox', name: 'fs_exp'})).append(
												$('<label/>', {for: 'fs_exp', text: 'Show Expunged'}))))))));
				}

				$(this).text(function(){
					return $(this).text().replace("Show", "Hide");
				});
			}else{
				$('#'+id).empty();
				$(this).text(function(){
					return $(this).text().replace("Hide", "Show");
				});
			}
			$('#'+id).toggle();

			e.preventDefault();
		});

		$('#addenglish').on('click', function(e){
			$('input[name="f_search"]').val(function(i, v){
				return v.replace(/(.*)/, 'english'+(v == 'Search Keywords' || v == '' ? '' : ' "$1"'));
			});
		});
		//TODO: Possibly use jQuery slide?

		//This is "more or less" the in built "toggle_category" function.
		//Sadly that doesn't get loaded on gallery pages, so we use this instead.
		$('body').on('click', 'img[id^=f_]', function(){
			var e = $(this), //img
			    d = $(e).prev(), //input
			    c = parseInt($(d).val()),
			    a = "http://ehgt.org/g/c/";

			if(c){
				$(d).val(0);
				$(e).attr('src', $(e).attr('src').replace('.png', '_d.png'));
			}else{
				$(d).val(1);
				$(e).attr('src', $(e).attr('src').replace('_d.png', '.png'));
			}
		});
	});
}

if(typeof window.jQuery  === "undefined"){
	addJQuery(main); //@require doesn't work, so load JQuery then load the script
}
else{
	main(); //@require works, so just load the script
}
