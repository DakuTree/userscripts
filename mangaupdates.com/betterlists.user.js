// ==UserScript==
// @name         MangaUpdates - Better Lists
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Improves the functionality of the 'My Lists' feature to something "usable".
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/www\.mangaupdates\.com\/mylist.html(\?.*)?$/
// @include      /^https?:\/\/www\.mangaupdates\.com\/series.html\?id=.*$/
// @include      /^https?:\/\/www\.mangaupdates\.com\/releases.html\?.*$/
// @updated      2016-04-28
// @version      1.2.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @require      https://github.com/eligrey/FileSaver.js/raw/62d219a0fac54b94cd4f230e7bfc55aa3f8dcfa4/FileSaver.min.js
// @require      https://github.com/imaya/zlib.js/raw/068df2dee15c18d38d9dff433538ef59bbbb55fe/bin/zlib_and_gzip.min.js
// @grant        GM_addStyle
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false, sendHTTPRequest:false, listUpdate:false, listUpdate2:false, GM_addStyle:false, saveAs:false, Zlib:false, Promise:false, addReading:false */
'use strict';

//Beware! Messy code ahead!
$(document).ready(function() {
	if(/mangaupdates\.com\/mylist.html(\?.*)?/.test(location.href)) {
		setupList();
		setupImport();
		setupExport();

	}
	else if(/mangaupdates\.com\/series.html\?id=.*/.test(location.href)) {
		setupSeries();
	}
	else if(/mangaupdates\.com\/releases.html\?.*/.test(location.href)) {
		var title = $('a[title="Series Info"]:eq(0)').text().trim();

		var googleBase64   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzklEQVR42oWSz0sUYRjH5xLkeur/CFkiUbYuJVjZTcEmwQ4FReQlQS/dgooOBkaKS+3FymqSCtGKsEL0IlhqrLrpKQLR2R+ssK7O7M776X13fdccRvYDX+bwvs/neZ93XsOPEOKE53lRmTUZdy+rMkNA2DgMICQ3xaiCkssmNUHF0wDCcciPviRzs5Nky2nscxEy1zvYfjOs1rRk6oBEd/bsDTLXTOym+sBke7vQqJEqM+vO6avtpY3JC6fIPRvA/TWPG18kFxskfaWV4t8/+AgbaiaAwvxjUq0N2M2NsmghaPig+xhUgjWA4mw9zliI/ItbVKciSCiBC1D4Vkth8ggi9ZH/OXsvhz93rB0tcPYFX0NlQXKiqqBn5KBgFWBr5jjpyWN8WOzjMO6+2y0J+iZ2tWBFCYYAfiw/5Lx1kUarnZ/2En4S6x7ND8onmE4UteCJAYQBnKLLpU+3Ofm6jYhl0r8wzNxmXMqWeRq3aHke5cz9LDdieYRAIb+izlDoX7m5ncIsSwJjvn/ERlbo7gOGRj1L9TwBHM/l1e9xOr/0Enlrlk5z+XM3saVR8oXK7N+Bo6rWL4lSBdVZFwcChNULk0nIOHtZURdWmtnHP3FG/Sbe5gXBAAAAAElFTkSuQmCC";
		var batotoBase64   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABVlBMVEUAAAAGNpoIOJsJOZsMO5wNPJ0OPJ0QPp4RP54UQ6AVQ6AWRKEXRaEYRqEZRqIaR6IbSKMcSaMdSqMfS6QhTaUiTaUjTqYkT6YlUKYmUKcnUacoUqcpU6grVaksVqktV6ouV6oxWqsyWqs1Xa02Xq05YK46Ya47Ya88Yq89Y68+ZLA/ZLBAZbFBZrFCZ7FDZ7JEaLJFabJGarNGa7NHa7RIbLRJbbRKbrVLbrVNcLZPcbZRc7dSdLhXeLlaertbe7tgf71igb5jgr5nhcBohcBqh8FriMFuisJvi8N1j8V3kcd8lciCmsuDm8uGns2OpNCSp9KXqtSbrtadsNenuNqqutuuvdy3xOC5x+K6yOC7yOK9y+PBzuTCzubL1enN1+jP2OrS2+zT3O3V3e3a4e7b4u7b4vDg5vLk6fPl6vTm6vTs8Pft8Pfy9fr09vr2+Pv6+/3///8UIKZHAAAAAXRSTlMAQObYZgAAAMFJREFUGBkFwdFSgzAQQNGbZQmBgmW0D774/z/m6DiO1UILJLCJ5zjo+74PLk3rvO0ZpR3GS6dahknIpSihe307K/y9k1M2RU/nF4Ax7vflMKFqBAAu3dhWCIW0wXqlegreIZjZD+DB+9AgFCs10FOiP3mEYtmxB2CoGo9AzoI+Cm4IogjFsuDS1w7PgJLNmmx+FFjMUPY9lcPXwO1jilRUjq24hvj5PV/npBxLLflxtW2bf6eEcsiUUxtcXNZ7jPwDJ6hj193JopcAAAAASUVORK5CYII=";
		var mangafoxBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEVKSkp7e3uEiimNkyWQlT2VmyGdpBydpRyutxOvtFi1t5y2t6K2wA62wQ7CxJXDyxjExbXEx5TGyZLH0gXMzbXP2wDP3ADQ0MnQ3ADR0czS0tLS3Qjg5Jvm64r3+d39/fX///+CcBPEAAAAe0lEQVQYGQXBwUoDQRAFwHo9g0QJehT8/4/zkkAUjWx2tq0SACDxcuqAvxOu02mMo6Wd29gUeVykxfVYFP2z7k3f1zcK7PCwUAQIQtkBjaasLwBQXrNBBgNT3vfPRS2eMDE/bjfJqmdMqLfzFg0KukUTTL9rsB0AAgDkHxyqL9natqplAAAAAElFTkSuQmCC";

		//Add Header
		$('table table table table table table tr:has(td.pad):has(td.text)').parent().find('tr:eq(0)').append(
			$('<td/>', {class: 'releasestitle', style: 'text-align: center; width: 40px'}).append(
				$('<b/>', {text: 'Links'})
			)
		);

		//Add Links
		$('table table table table table table tr:has(td.pad):has(td.text)').each(function() {
			var chapterN = $(this).find('td:nth-child(4)').text().trim();
			var groupName = $(this).find('td:nth-child(5)').text().trim();

			var searchString = 'manga '+encodeURIComponent(title) + ' ' + 'ch '+chapterN + ' ' + encodeURIComponent(groupName);

			$(this).append(
				$('<td/>', {style: 'text-align: right'}).append(
					$('<a/>', {href: 'https://www.google.com/search?q='+searchString, target: '_blank'}).append(
						$('<img/>', {src: googleBase64, style: 'width: 16px; height: 16px'})
					).append(
						$('<a/>', {href: 'http://bato.to/search?name='+encodeURIComponent(title)+'&name_cond=c', target: '_blank'}).append(
							$('<img/>', {src: batotoBase64, style: 'width: 16px; height: 16px'})
						)
					).append(
						$('<a/>', {href: 'http://mangafox.me/search.php?name_method=cw&name='+encodeURIComponent(title)+'&type=&author_method=cw&author=&artist_method=cw&artist=&genres%5BAction%5D=0&genres%5BAdult%5D=0&genres%5BAdventure%5D=0&genres%5BComedy%5D=0&genres%5BDoujinshi%5D=0&genres%5BDrama%5D=0&genres%5BEcchi%5D=0&genres%5BFantasy%5D=0&genres%5BGender+Bender%5D=0&genres%5BHarem%5D=0&genres%5BHistorical%5D=0&genres%5BHorror%5D=0&genres%5BJosei%5D=0&genres%5BMartial+Arts%5D=0&genres%5BMature%5D=0&genres%5BMecha%5D=0&genres%5BMystery%5D=0&genres%5BOne+Shot%5D=0&genres%5BPsychological%5D=0&genres%5BRomance%5D=0&genres%5BSchool+Life%5D=0&genres%5BSci-fi%5D=0&genres%5BSeinen%5D=0&genres%5BShoujo%5D=0&genres%5BShoujo+Ai%5D=0&genres%5BShounen%5D=0&genres%5BShounen+Ai%5D=0&genres%5BSlice+of+Life%5D=0&genres%5BSmut%5D=0&genres%5BSports%5D=0&genres%5BSupernatural%5D=0&genres%5BTragedy%5D=0&genres%5BWebtoons%5D=0&genres%5BYaoi%5D=0&genres%5BYuri%5D=0&released_method=eq&released=&rating_method=eq&rating=&is_completed=&advopts=1', target: '_blank'}).append(
							$('<img/>', {src: mangafoxBase64, style: 'width: 16px; height: 16px'})
						)
					)
				)
			);
		});


	}

	function checkComplete(id, latestChapter, ele) {
		var unsafeWindow = window;

		var manga;
		if(unsafeWindow.localStorage.getItem(id)) {
			var local_manga = JSON.parse(unsafeWindow.localStorage.getItem(id));
			if(latestChapter !== local_manga.latestChapter) {
				//chapter is different, get new data
				unsafeWindow.localStorage.removeItem(id);
			} else {
				//chapter is same, do nothing
				manga = local_manga;
			}
		}

		if(!manga) {
			$.ajax({
				url: 'https://www.mangaupdates.com/series.html?id='+id,
				//async: false,
				type: 'GET',
				success: function(data) {
					var complete = $(data).find('.sMember div:contains("Completely Scanlated?") + .sContent').text().trim() == 'Yes' ? 1 : 0;
					var title    = $(data).find('.releasestitle').text().trim();

					manga = {'title': title, 'complete': complete, 'latestChapter': latestChapter};
					unsafeWindow.localStorage.setItem(id, JSON.stringify(manga));

					markComplete(ele, manga.complete);
				}
			});
		} else {
			markComplete(ele, manga.complete);
		}
	}

	function markComplete(ele, complete) {
		if(complete === 1) {
			$(ele).find('td:nth-child(2)')
				.css('font-weight', 'bold')
				.attr('title', 'Series is complete & scanlated');
		}
	}

	function getInt(str) {
		return str.replace(/[^0-9]+/g, '');
	}

	function setupList() {
		//Use CSS to set row colors since we'll be moving them about.
		GM_addStyle("#list_table > tbody > tr:nth-child(odd):not(:nth-child(0)):not(:nth-child(1)) { background-color: #E4E7EB; }");
		$('.lrow.alt').removeClass('alt');

		//Temp remove rating / Average
		$('#list_table > tbody > tr > td:nth-of-type(5), #list_table > tbody > tr > th:nth-of-type(5)').remove();
		$('#list_table > tbody > tr > td:nth-of-type(4), #list_table > tbody > tr > th:nth-of-type(4)').remove();

		//Create "latest release" column header.
		$('#list_table > tbody > tr:eq(1) ').append(
			$('<th/>', {class: 'text', text: 'Latest Release', style: 'text-align: center'})
		);

		var firstRow = $('#list_table > tbody > tr:nth-child(3)');
		$('.lrow').each(function() {
			var id              = $(this).find('a:eq(0)').removeAttr('title').attr('href').replace(/^.*id=([0-9]+)$/, '$1');

			var colStatus = $(this).find('> td:nth-of-type(3)');
			var colLatest = $(this).find('> td:nth-of-type(4)');

			var currentChapterE = colStatus;
			var currentChapterN = currentChapterE.text().replace(/[^0-9]+/, '');
			var latestChapterE  = $(this).find('.newlist a').text(function() { return $(this).text().replace(/[^0-9a-zA-Z]*/g, ''); });  //FIXME: This probably doesn't work with .5 chapters
			var latestChapterN  = latestChapterE.text().replace(/[^0-9]+/, '') || currentChapterE.text();

			//If series is complete, make title bold.
			checkComplete(id, latestChapterN, this); //FIXME: The entire way this method works feels extremely bad. Remake.

			//Remove "Your Status" styling & set new styling.
			$(colStatus).removeClass().removeAttr('id').css('text-align', 'center');

			//Re-create your status column.
			$(colStatus).html(function() {
				var currentChapter = $(this).find('a:eq(2)').text().replace(/[^0-9]*/, ''); //FIXME: This probably doesn't work with .5 chapters
				return 'c'+currentChapter;
			});

			//
			$(colStatus).click(function(e) {
				if($(this).find('input').length === 0) {
					var chapterN = getInt($(this).text());

					var col = $(this);

					$(col).html('').append(
						$('<input/>', {type: 'text', id: 'ch_update', value: chapterN, style: 'text-align: center; width: 30px;'}).keypress(function(e) {
							var key = e.which;
							if(key == 13) { //enter
								sendHTTPRequest(function(){}, "ajax/chap_update.php?s="+id+"&set_c="+$(this).val());
								$(col).html('c'+$(this).val());

								return false;
							}
						})
					);
					$(col).find('input').focus();
					$(col).find('input')[0].setSelectionRange(99, 99); //Make sure focus is at end of string
				}
			});

			//Append latest chapter.
			$(this).append(
				$('<td/>', {class: 'text', style: 'text-align: center'}).append(
					(latestChapterE.length > 0 ? latestChapterE.css('font-weight', 'bold') : currentChapterE.text())
				)
			);

			//If latest chapter is different, append a link to update status to latest.
			if(latestChapterE.length > 0) {
				$(this).append(
					$('<td/>').append(
						$('<a/>', {
							href: '#',
							text: '@',
							title: 'I\'ve read the latest chapter!'
						}).click(function() {
							var parentRow = $(this).parent().parent();

							//Update chapter.
							sendHTTPRequest(function(){}, "ajax/chap_update.php?s="+id+"&set_c="+latestChapterN);

							//Update row info.
							$(parentRow).find('td:eq(2)').text(latestChapterE.text());
							$(parentRow).find('td:eq(3)').html(function() { return $(this).text(); } );
							$(parentRow).find('td:eq(4)').remove();

							return false;
						})
					)
				);

				//Move chapters with new chapters to top of list.
				firstRow.before(
					$(this)
				);
			}
		});
	}

	function setupExport() {
		$('a[title="Export this list"]').replaceWith(
			$('<a/>', {href: '#', title: 'JSON Export', text: 'JSON Export'}).click(function() {
				exportData();
				return false;
			})
		);
	}
	function exportData() {
		var mangaList = [];
		$('.lrow').each(function() {
			var manga = {
				id:             $(this).attr('id').substring(1),
				title:          $(this).find('> td:eq(1) u').text().trim(),
				currentChapter: $(this).find('> td:eq(2)').text().trim().substring(1)
			};
			mangaList.push(manga);
		});

		var blob = new Blob([JSON.stringify(mangaList, null, "\t")], {type: "application/json;charset=utf-8"});
		saveAs(blob, "MU-"+new Date().toJSON().slice(0,10)+".json");
	}

	function setupImport() {
		$('<input/>', {type: 'file', id: 'mal_input', text: 'MAL Import', width: '84px'})
			.change(function() { importMal(this); })
			.insertAfter('a[title="Export this list"]')
			.after($('<span/>', {id: 'import_status'}))
			.before("] | [MAL Import: "); //Re-add the closing bracket of JSON export

		//Avoid pushing file on options update.
		$('input[name=update_options]').submit(function() {
			$('#mal_input').remove();
		});

		//Allow space for reload link
		$('form[name=seriesForm] > .low_col1').css('width', '65%');
		$('form[name=seriesForm] > .low_col2').css('width', '35%');

		//Info block
		$('form[name=seriesForm] > .low_col1').append(
			$('<div/>', {id: 'info_block'}).append(
				$('<ul/>')
			)
		);
	}
	function importMal(input) {
		var files = input.files;
		if(files && files[0]) {
			var file = files[0];

			var xml;
			switch(file.name.match(/\..*$/)[0]) {
				case '.xml.gz':
					importMalGz(file);
					break;
				case '.xml':
					//Some people might have already extracted the .xml file.
					importMalXml(file);
					break;
				default:
					alert('"'+file.name+'" has an invalid ext');
					break;
			}
		}
	}
	function importMalXml(file) {
		var reader = new FileReader();
		reader.onload = function (e) {
			importMalXmlString(e.target.result);
		};
		reader.readAsText(file);
	}
	function importMalXmlString(xmlString) {
		var xmlObject    = $($.parseXML(xmlString)).find('myanimelist'),
			myInfo       = xmlObject.find('> myInfo'),
			manga        = xmlObject.find('> manga'),
			currentManga = $('tr[id^=r]').map(function() { return $(this).attr('id').substring(1); });

		manga = manga.filter(function() {
			return $(this).find('> my_status').text() == 'Reading';
		});

		var time = 750;
		manga.each(function(i) {
			var id             = $(this).find('manga_mangadb_id').text(),
				title          = $(this).find('manga_title').text(),
				currentChapter = $(this).find('my_read_chapters').text();

			setTimeout( function(){
				$.getJSON("https://codeanimu.net/userscripts/mangaupdates.com/backend/mu_index.php", {"id": id}, function(json) {
					if(!json.error) {
						if($.inArray(json.id_mu.toString(), currentManga) === -1) {
							sendHTTPRequest(function(){
								sendHTTPRequest(function(){}, "ajax/chap_update.php?s=" + json.id_mu + "&set_c=" + currentChapter);
							}, "ajax/list_update.php?s=" + json.id_mu + "&l=0");

							$('#info_block > ul').append(
								$('<li/>', {style: 'color: rgba(0, 255, 0, 0.70);'}).append('"').append(
									$('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
								).append('" has been added to your list')
							);
						} else {
							$('#info_block > ul').append(
								$('<li/>').append('"').append(
									$('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
								).append('" already exists in list')
							);
						}
					} else {
						$('#info_block > ul').append(
							$('<li/>', {style: 'color: rgba(255, 0, 0, 0.70);'}).append('"').append(
								$('<a/>', {href: 'http://myanimelist.net/manga/'+id, text: title, style: 'text-decoration: underline'})
							).append('" is missing a mangaupdates ID')
						);
					}
					$('#info_block > ul > li:last').get(0).scrollIntoView();

					$('#import_status').text(i+1 + '/' + manga.length + '  ');

					if(i === (manga.length - 1)) {
						$('#import_status').append(
							$('<a/>', {href: 'javascript: location.reload();', text: 'Reload', style: 'text-decoration: underline; color: red;'})
						);
					}
				});
			}, time);
			time += 750;
		});
	}
	function importMalGz(file) {
		var fileData = new Blob([file]);

		var promise = new Promise(function(resolve) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(fileData);
			reader.onload = function() {
				var arrayBuffer = reader.result;
				var bytes = new Uint8Array(arrayBuffer);
				resolve(bytes);
			};
		});
		promise.then(function(data) {
			var gunzip = new Zlib.Gunzip(data);
			var d = gunzip.decompress();

			var xml = "";
			_arrayBufferToString(d, function(xml) {
				importMalXmlString(xml);
			});
		}).catch(function(err) {
			console.log('Error: ', err);
			alert('ERROR: Unable to import file');
		});
	}

	function setupSeries() {
		var currentChapter = $('a[title="Increment Chapter"]').text().trim().replace(/[^0-9]+/g, '');
		var id = location.search.match(/id=([0-9]+)/)[1];

		$('#showList').html(function(){ return $(this).html().replace(/up to /, 'up to c.'); });

		$('<input/>', {type: 'text', value: currentChapter, style: 'width: 20px; text-align: center;'}).keypress(function(e) {
			var key = e.which;
			if(key == 13) { //enter
				sendHTTPRequest(function(){}, "ajax/chap_update.php?s="+id+"&set_c="+$(this).val());
				return false;
			}
		}).insertBefore('a[title="Increment Volume"]');

		//$('#showList').html(function(){ return $(this).html().replace(/(&nbsp;)+/g, '&nbsp;'); }); //FIXME: This breaks the keypress event.
		$('#showList a[title*="Increment"], #showList a[title*="Decrement"]').remove();

		//Make sure series is setup after it's added to reading list.
		$('a[href*="addReading"]').attr('href', '#').attr('id', 'add_reading');
		$('#add_reading').click(function() {
			sendHTTPRequest(function(r) {
				listUpdate(r);
				setupSeries();
			}, "ajax/list_update.php?s=" + id + "&l=0");
		});
	}

	/** http://stackoverflow.com/a/14078925/1168377 **/
	function _arrayBufferToString(buf, callback) {
		var bb = new Blob([new Uint8Array(buf)]);
		var f = new FileReader();
		f.onload = function(e) {
			callback(e.target.result);
		};
		f.readAsText(bb);
	}

});