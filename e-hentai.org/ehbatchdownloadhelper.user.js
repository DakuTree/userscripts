// ==UserScript==
// @name         [WIP] E-Hentai - Batch Download Helper
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  A download helper. Mostly for my own usage, but may help others.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/(?:e-|ex)hentai\.org(\/[^g\/].*?|\/)?$/
// @updated      2017-XX-XX
// @version      1.0.0-alpha
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @resource     fontAwesome   https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @noframes
// @run-at       document-start
// ==/UserScript==

/******SETTINGS******/
const showCostPopup = true; // set to true to show a confirm popup including the cost of the gallery (this is still ignored if you have free gallery downloads via donation)
const averageDLSpeed = 10; // used to calculate TbS time (in seconds).
/********************/

GM_addStyle(GM_getResourceText('fontAwesome').replace(/\.\.\//g, 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/'));

function main() {
	//0: Add styles.
	//{
	GM_addStyle(`
		#batchDownloader {
			text-align: center;

			margin-top: 5px;
			padding: 5px;

			min-height: 40px;

			background-color: lightgrey;
			color: black;
			font-weight: bold;

			border-radius: 3px;
			border: 1px solid black;
		}

		.batchEnabled {
			background-color: #00B232 !important;
		}

		.batchSelected {
			background-color: rgba(255, 87, 34, 0.62) !important;
		}

		#batchResult {
			margin: 0 auto;
			width: 600px;
		}
		#batchResult a {
			color: black;
		}
		td.batchTD1 {
			text-align: left;
		}
		td.batchStatus {
			width: 15px;
		}
	`);
	//}
	//1: Generate everything at top of page.


	let batchElement = $('<div/>', { id: 'batchDownloader' }),
		navElement = $('<nav/>'),
		resultElement = $('<table/>', { id: 'batchResult' }),
		hideDLElement = $('<button/>', { text: 'Hide Downloaded' }),
		hideDupeElement = $('<button/>', { text: 'Hide Dupes' }),
		markElement = $('<button/>', { text: 'Start Marking' }),
		confirmElement = $('<button/>', { text: 'End Marking & Parse' }),
		queueElement = $('<button/>', { id: 'queueDL', text: 'Queue Downloads' }),
		queueTimeElement = $('<select/>', { id: 'queueDLTime' }).append(
			$('<option/>', { text: '10 seconds', value: '10' })).append(
				$('<option/>', { text: '30 seconds', value: '30', selected: true })).append(
					$('<option/>', { text: '60 seconds', value: '60' })).append(
						$('<option/>', { text: '120 seconds', value: '120' })
					),
		queueTimeExtraElement = $('<label/>', { id: 'queueDLTimeExtra', text: ' TbS: ', title: 'Add time by size of DL' }).append($('<input/>', { type: 'checkbox', checked: true }));

	hideDLElement.click(function () {
		$('.id1').each(function () {
			if ($(this).css('background-color') == 'rgba(25, 229, 255, 0.3)') {
				$(this).hide();
			}
		});
	});
	hideDupeElement.click(function () {
		$('.id1').each(function () {
			if ($(this).css('background-color') == 'rgba(25, 255, 89, 0.2)') {
				$(this).hide();
			}
		});
	});
	markElement.click(function () {
		unsafeWindow.clickbound = unsafeWindow.clickbound || false;
		if (unsafeWindow.clickbound === false) {
			$('body').addClass('batchEnabled');
			$('.id1 a[href*="/g/"]').click(function (e) {
				var c = $(this).closest('.id1');
				c.addClass('batchSelected');
				e.preventDefault();
			});
		} else {
			//This should never occur, as we have a seperate button to disable.
		}
	});
	confirmElement.click(function () {
		//Remove batch mode.
		if ($('body').hasClass('batchEnabled')) {
			$('body').removeClass('batchEnabled');
			$('.id1 a[href*="/g/"]').unbind('click');
		}

		//Attempt to parse selected series.
		resultElement.empty();
		let selected = {};
		$('.batchSelected').find('> .id2 > a').each(function () {
			let title = $(this).text().trim(),
				link = $(this).attr('href');

			selected[link] = title;

			resultElement.append(
				$('<tr/>').append(
					$('<td/>', { class: 'batchTD1' }).append(
						$('<a/>', { href: link, text: title })
					)
				).append(
					$('<td/>').append(
						$('<a/>', { class: 'batchDL', href: '#', text: 'Download' })
					)
				).append(
					$('<td/>', { class: 'batchStatus' }).append(
						$('<i/>', { class: 'fa fa-minus', 'aria-hidden': 'true' })
					)
				)
			);
		});
		console.log(selected);
	});
	batchElement.on('click', '.batchDL', function (e) {
		let tr = $(this).closest('tr'),
			link = tr.find('.batchTD1 > a').attr('href'),
			statusE = tr.find('.batchStatus');
		// console.log(link);

		$.get(link, function (data) {
			// console.log(data);
			let dlMatch = data.match('https:\/\/e-hentai\.org\/archiver\.php\\?(.*?)\''),
				sizeMatch = data.match('<td class="gdt1">File Size:<\/td><td class="gdt2">(.*?)<\/td>');
			if ((dlMatch && dlMatch.length > 0) && (sizeMatch && sizeMatch.length > 0)) {
				let dlLink = decode(dlMatch[1]);
				// filesize = sizetotime(sizeMatch[1]);

				//DO SOMETHING.
				//unsafeWindow.popUp(`https://e-hentai.org/archiver.php?${dlLink}`, 480, 320);
				download(dlLink, function (status) {
					switch (status) {
						case 0: //Unsuccessful.
							statusE.empty().append($('<i/>', { class: 'fa fa-times', 'aria-hidden': 'true' }));
							break;
						case 1: //Successful
							downloadTagList(link, data);
							statusE.empty().append($('<i/>', { class: 'fa fa-check', 'aria-hidden': 'true' }));
							updateDBDownloaded(link);

							$(`.id1 a[href="${link}`).closest('.id1')
								.removeAttr('batchSelected')
								.css('background-color', 'rgba(25, 229, 255, 0.3)');

							break;
						case 2:
							statusE.empty().append($('<i/>', { class: 'fa fa-question', 'aria-hidden': 'true' }));
							break;
					}
				});
			} else {
				alert('Can\'t grab download link OR size?');
			}
		});
		e.preventDefault();
	});

	queueElement.click(function () {
		let time = 0,
			queueTime = Number($('#queueDLTime').val()) * 1000;
		$('#batchResult > tr').each(function (i) {
			let _this = this;
			setTimeout(function () {
				$(_this).find('.batchDL').click();
			}, time);
			time += queueTime;
			// if($('#queueDLTimeExtra').is(':checked')) {
			//time += sizetotime(...);
			// }
		});
	});

	navElement.append(hideDLElement);
	navElement.append(hideDupeElement);
	navElement.append('<br/>');
	navElement.append(markElement);
	navElement.append(confirmElement);
	navElement.append('<br/>');
	navElement.append(queueElement);
	navElement.append(queueTimeElement);
	navElement.append(queueTimeExtraElement);

	batchElement.append(navElement);
	batchElement.append(resultElement);

	$('.ido').prepend(batchElement);
}

$(function () {
	main();
});

function download(xs, callback) {
	let downloadGallery = true,
		success = 0;

	if (showCostPopup) {
		$.ajax({
			url: `https://e-hentai.org/archiver.php?${xs}`,
			type: 'GET',
			async: false
		}).done(function (data) {
			let match_cost = data.match(/Download Cost:\s+(.*)/);

			//If gallery has a download cost, and is not free, ask the user if they want to DL the gallery via a confirm popup.
			if (match_cost && match_cost[1].replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi, '').trim() !== "Free!") {
				let cost = match_cost[1].replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi, '').trim(),
					costCheck = cost.split(' ');
				if (costCheck[1] == 'GP') {
					if (parseInt(costCheck[0]) < 5000) {
						downloadGallery = true;
					} else {
						console.log(costCheck[0]);
						downloadGallery = confirm("This gallery is not free.\nThe cost is: " + cost + ".\nAre you sure you want to DL?");
					}
				} else {
					console.log(costCheck);
					downloadGallery = confirm("This gallery is not free.\nThe cost is: " + cost + ".\nAre you sure you want to DL?");
				}
				// downloadGallery = false; //TODO: Handle this elsewhere.
			}
		}).fail(function () {
			//FAIL
		});
	}

	if (downloadGallery) {
		let dfd = $.Deferred();

		$.ajax({
			url: `https://e-hentai.org/archiver.php?${xs}`,
			type: 'POST',
			data: { dlcheck: 'Download Original Archive' },
			contentType: 'application/x-www-form-urlencoded',
			// async : false
		}).done(function (data) {
			if (data == 'Insufficient funds.') {
				alert('Insufficient funds.');
			}
			else if (data.indexOf("Please wait...") !== -1) { //Check if pop-up opened.
				let match = /<a href="(http.*?)"/g.exec(data);
				//FIXME: This causes hanging?
				success = 1;
				setTimeout(function () {
					window.location.assign(match[1] + "?start=1");
					// window.open(match[1] + "?start=1", '_blank');
				}, 1000);
			}
			else {
				//WTF?
				alert('Something went wrong?');
			}
		}).fail(function () {
			//FAIL
			alert('Download failed?');
			success = 0;
		}).always(function () {
			dfd.resolve();
		});

		dfd.done(() => {
			callback(success);
		});
	} else {
		callback(2); //Gallery was not free, and was cancelled
	}
}

function downloadTagList(src_url, data) {
	let page = $(data.replace(/^.*?(<body.*?<\/body>).*?$/, '$1'));

	let json = {
		"title": page.find('#gn').text(),
		"title_untranslated": page.find('#gj').text(),
		"type": page.find('#gmid .ic').attr('src').replace(/^.*?\/g\/c\/(.*?)\.[a-zA-Z]+$/, '$1'),
		"description": page.find('a[name=ulcomment]').closest('.c1').find('.c6').text(),
		"pagecount": page.find('.gdt1:contains("Length") + .gdt2').text().slice(0, -6),
		"source": src_url,
		"taglist": '',

		init: function () {
			this['ftaglist'] = '@:@notchecked source:' + this['source'] + ' type:' + this['type'] + ' ';
			return this;
		}
	}.init();

	page.find('#taglist div').each(function () {
		let tag = $(this).attr('id').substr(3);
		json.taglist += tag + ' ';
		if (/^(parody|character|group|artist):/.test(tag)) {
			json.ftaglist += tag + ' ';
		} else {
			json.ftaglist += tag.replace(/^(.*?):/, '') + ' ';
		}
	});
	json.taglist = json.taglist.trim();

	let final_filename = page.find('#gn').text().
		replace(/[\?]/g, " ").
		replace(/[\/]/g, " ").
		replace(/[\|]/g, " ").
		replace(/[\*]/g, " ").
		replace(/[\/]/g, " ").
		replace(/[\"]/g, "'"); //Rough attempt at fixing broken filenames
	//BUG: Browsers replace certain characters for file system reasons.

	//We delay the load for stupid browser bug reasons.
	setTimeout(function () {
		let encodedFilename = encodeURIComponent((final_filename.trim().substr(0, 250)) + ".json"),
			encodedJSON = encodeURIComponent(JSON.stringify(json, null, "\t"));
		downloadURL(`https://ftag.localhost/downloadFile.php?filename=${encodedFilename}&data=${encodedJSON}`);
	}, 500);
}

function updateDBDownloaded(src_url) {
	let url = "https://ftag.localhost/ex_list/srccheck_update.php?waiting=Y&source=" + src_url;
	$.get(url);
}

function downloadURL(url) {
	let iframe = $('<iframe/>', { id: 'hiddenDownloader', style: 'display: none', src: url });
	iframe.appendTo('body');
}

/*****************************/

function decode(text) {
	var e = document.createElement('textarea');
	e.innerHTML = text;
	return e.value;
}

function sizetotime(sizeText) {
	let arr = sizeText.split(' '),
		size = parseFloat(arr[0]),
		time = 0;
	switch (arr[1]) {
		case 'KB':
			//do nothing
			break;
		case 'MB':
			time = Math.ceil((size / averageDLSpeed) * 1000);
			break;
		case 'GB':
			time = Math.ceil(((size * 1024) / averageDLSpeed) * 1000);
			break;
		default:
			time = 10000;
			console.log('Time size is wrong?');
	}
	return time;
}

/* TODO
	* Clicking again should remove from list!
	* When a download finishes it should auto-mark as downloaded, as to allow clearing.
	* Some form of history (probably stored via localStorage), as to know what downloaded after DL hiccups.
	* Make the "time by size" function actually work.
	* Show some form of timer to the next DL
*/

//OLD NOTES
//2: Have a button that when clicked will turn on a mode similar to EH-Dupe. Also have a button to return to normal.
//2.2: After clicking it will generate a list with the titles/links of each selected series. The list will also scrape the download link.

//3: The list would then add a few more things. "Artist/Group Check" & "Download All".
//3.2: Still not unsure sure how to about getting the artist/group series. Yeah we can easily filter stuff, but we need to be able to properly check if we need it or not.
//     * More often than not the related stuff is just dupes.
//     * You also have the case where the new thing is a book, but there isn't anything else new, but series need to be checked if they need to be removed.
//     * There is also the case of conflicts occuring if two series in the batch are from the same artist/group.
//     * Another issue is two series in a batch being actual dupes.
//     *
