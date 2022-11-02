// ==UserScript==
// @name         twitch.tv - Following page conditional filtering
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Allows you to filter streamson your following page by conditional statements. Uses Regex.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https?:\/\/www.twitch.tv\/.*$/
// @updated      2019-02-11
// @version      0.0.1
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at       document-init
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
/* global $:false, jQuery:false, LocationBar */

const IGNORED_CASTERS = [];
const IGNORED_GAMES = ["Escape From Tarkov", "League of Legends"];

const FAVOURITE_CASTERS = [];

function filter_videos() {
	console.log("FILTERING");
	let videoElements = $("main .tw-tower > div.tw-mg-b-2");
	videoElements.each((i, videoElement) => {
		let $baseElement = $(videoElement);
		let $videoElement = $baseElement.find("> div > div");
		console.log($videoElement);
		let meta1 = $videoElement.find("> div:nth-of-type(0)"),
			meta2 = $videoElement.find("> div:nth-of-type(2)");

		let video = {};
		video["title"] = meta2.find("h3[title]").text();
		video["game"] = meta2.find('a[data-a-target="preview-card-game-link"]').text();
		video["caster"] = meta2.find('a[data-a-target="preview-card-channel-link"]').text();

		if (IGNORED_CASTERS.includes(video["caster"]) || IGNORED_GAMES.includes(video["game"])) {
			$baseElement.hide();
		}
		if (FAVOURITE_CASTERS.includes(video["caster"])) {
			$baseElement.css("background", "rgba(0, 160, 42, 0.5)").show();
		}
		console.log(video);
	});
}

$(function () {
	let lastURL = "",
		bodyList = document.querySelector("body"),
		observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (lastURL != location.pathname) {
					lastURL = location.pathname;
					switch (location.pathname) {
						case "/directory/following/videos":
							setTimeout(filter_videos, 1500);
							break;
						default:
							break;
					}
				}
			});
		});

	var config = {
		childList: true,
		subtree: true
	};

	observer.observe(bodyList, config);
});
