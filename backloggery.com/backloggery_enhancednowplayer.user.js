// ==UserScript==
// @name         Backloggery - Enhanced Now Playing List
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Enhances the "Now Playing" list. Adds seperate categories, custom sorting, genre filtering & quick description editting.
// @icon         https://backloggery.com/favicon.ico
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(?:www\.)?backloggery\.com\/(?:.(?!\.php))+$/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @updated      2018-XX-XX
// @version      3.0.0
// @grant        GM_addStyle
// ==/UserScript==
"use strict";

//Case insensitive :contains || via: https://gist.github.com/jbcappell/2648373
$.extend($.expr[":"], {
	containsNC: function (elem, i, match, array) {
		return (
			(elem.textContent || elem.innerText || "")
				.toLowerCase()
				.indexOf((match[3] || "").toLowerCase()) >= 0
		);
	},
});

//https://github.com/padolsey-archive/jquery.fn/blob/master/sortElements/jquery.sortElements.js
jQuery.fn.sortElements = (function () {
	var sort = [].sort;
	return function (comparator, getSortable) {
		getSortable =
			getSortable ||
			function () {
				return this;
			};
		var placements = this.map(function () {
			var sortElement = getSortable.call(this),
				parentNode = sortElement.parentNode,
				nextSibling = parentNode.insertBefore(
					document.createTextNode(""),
					sortElement.nextSibling
				);
			return function () {
				if (parentNode === this) {
					throw new Error(
						"You can't sort elements if any one is a descendant of another."
					);
				}
				parentNode.insertBefore(this, nextSibling);
				parentNode.removeChild(nextSibling);
			};
		});
		return sort.call(this, comparator).each(function (i) {
			placements[i].call(getSortable.call(this));
		});
	};
})();

var stealthSave = true; //FIXME: This should be a user option?

class Userscript {
	constructor() {
		let _class = this;

		// These are base categories and are not meant to be manually editted.
		this.defaultCategories = {
			start: {
				"now-playing": {
					title: "Now Playing",
					description: "",
				},
			},
			end: {
				"on-hold": {
					title: "On-Hold",
					description: "",
				},
				"to-play": {
					title: "Plan to Play",
					description: "",
				},
			},
		};
		this.userCategories = this.getUserCategories();

		this.categories = $.extend(
			this.defaultCategories.start,
			this.userCategories,
			this.defaultCategories.end
		);
	}

	getUserCategories() {
		let categoryMatch = $("#note")
				.text()
				.match(/==NPES-START==([\s\S]+)==NPES-END==/),
			categories = {};
		if (categoryMatch) {
			try {
				let categoriesTMP = JSON.parse(categoryMatch[1]);

				Object.entries(categoriesTMP).forEach(([tag, data]) => {
					let invalid = true;
					if (
						!tag.match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]+$/)
					) {
						console.warn(
							`User category tag contains invalid characters: ${tag}`
						);
					} else if (
						!data.title.match(
							/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]+$/
						)
					) {
						console.warn(
							`User title contains invalid characters: ${data.title}`
						);
					} else if (
						!data.description.match(
							/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]*$/
						)
					) {
						console.warn(
							`User description contains invalid characters: ${data.description}`
						);
					} else {
						invalid = false;
					}
					if (invalid) {
						throw "Invalid userdata";
					}
				});
				categories = categoriesTMP;
			} catch (e) {
				console.error(e);
				alert("User Config contains bad data!"); //FIXME
			}
		}
		return categories;
	}

	addStyles() {
		GM_addStyle(`
			.es-category-container > h1 {
				margin-top: 12px;
				margin-bottom: 3px;
			}
			.es-category-container:first-of-type > h1 {
				margin-top: 3px;
			}
			.hd-desc {
				display: block;
			}
			.es-category-games {
				margin-top: 5px;
			}
			.es-scroll {
				overflow-y: auto;
				max-height: 285px;
				overflow-x: hidden;
			}

			.filterContainer {
				margin-top: 2px;
				padding: 1px 6px;
			}
			.filterContainer button {
				border: 2px outset buttonface;
				padding: 0px 4px;
			}
			.filterContainer button.filterOn {
				background-color: #42EA42;
			}
			.filterContainer button.filterOff {
				background-color: red;
			}
			.filterContainer button:not(:last-of-type) {
				margin-right: 4px;
			}

			.npgame {
				padding: 5px 0 2px 0 !important;
			}
			.npgame > div:nth-of-type(3) {
				width: 44px !important;
			}
			.npgame > div:nth-of-type(5) {
				width: 420px !important;
			}
			.npgame .note {
				float: left;
				width: 395px;
			}
			.npgame .editProgress {
				position: relative;
				width: 420px;
			}
			.npgame .editProgress textarea {
				width: 420px;
				margin: 0;
				padding: 1px 0 0 2px;
				border-radius: 1px;
				border: 0;
				resize: none;
			}
			.npgame .editProgress_save {
				position: absolute;
				right: 46px;
				bottom: 3px;
				z-index: 15;
				color: darkgreen !important;
			}
			.npgame .editProgress_cancel {
				position: absolute;
				right: 3px;
				bottom: 3px;
				z-index: 15;
				color: darkred !important;
			}
			.npgame .editProgress_edit {
				display: none;
				float: right;
				font-size: 10px;
				color: lightgray !important;
			}
		`);
	}

	generateList() {
		let listData = this.getListData(),
			intro = $("#intro");

		let $categoriesContainer = $("<div/>", {
			class: "es-categories-container",
		});

		let categoryData = {};
		listData.games.forEach(($game) => {
			let gameData = $game.data();

			if (!categoryData.hasOwnProperty(gameData.category)) {
				categoryData[gameData.category] = [];
			}
			categoryData[gameData.category].push($game);
		});

		let orderedCategories = Object.keys(this.categories).filter(
			(k) => k in categoryData
		);
		orderedCategories.forEach((categoryStub) => {
			let categoryMetadata = this.categories[categoryStub],
				$categoryContainer = $("<div/>", {
					class: "es-category-container",
				});

			$categoryContainer.append(
				$("<h1/>", { text: categoryMetadata.title })
			);
			if (categoryMetadata.description.length > 0) {
				$categoryContainer.append(
					$("<span/>", {
						class: "hd-desc",
						text: categoryMetadata.description,
					})
				);
			}

			let $categoryGames = $("<div/>", { class: "es-category-games" });
			if (categoryMetadata.scroll) {
				$categoryGames.addClass("es-scroll");
			}
			if (categoryMetadata.maxHeight) {
				$categoryGames.css(
					"max-height",
					parseInt(categoryMetadata.maxHeight)
				);
			}

			categoryData[categoryStub].forEach(($game) => {
				// Omit metatags.
				$game.find("span.note").text(function () {
					//Check: Is there a better way to do this regex? Lots of duplication here..
					let re = new RegExp(
						"(?:^[\\s]*\\[" +
							categoryStub +
							"\\][\\s]*|[\\s]*\\[" +
							categoryStub +
							"\\][\\s]*$)",
						"i"
					);
					//TODO: Remove priority after we add prio icon.
					// var re = new RegExp('(?:^[\\s]*\\[p\\:[0-9]+\\][\\s]*|[\\s]*\\[p\\:[0-9]+\\][\\s]*$)','i');
					return $(this).text().replace(re, "");
				});

				$categoryGames.append($game);
			});
			$categoryContainer.append($categoryGames);

			$categoriesContainer.append($categoryContainer);
		});

		this.setupQuickEditProgressEvents();

		intro.empty().append(listData.banner).append($categoriesContainer);

		this.sortGames();

		this.generateFilters();
	}
	getListData() {
		let _class = this,
			listData = {
				banner: $("#intro > a").detach(),
				games: [],
			};

		$(".npgame").each(function () {
			let $game = $(this),
				$info = $game.find("+ .npinfo"),
				$game_container = $("<div/>", { class: "es-game" });

			_class.addQuickEditProgress($game); //FIXME: Should this be here?

			let metadata = _class.parseMetadata($game);

			$game_container.append($game.detach()).append($info.detach());

			Object.entries(metadata).forEach(([option, value]) => {
				$game_container.attr(`data-${option}`, value);
			});

			listData.games.push($game_container);
		});

		return listData;
	}
	parseMetadata($game) {
		let metatags = (
				$game
					.find(".note")
					.text()
					.trim()
					.match(/\[.*?\]/g) || []
			).map((e) => {
				return e.replace(/[\[|\]]/g, "");
			}),
			userMetadata = {},
			defaultMetadata = {
				category: "now-playing",
				priority: -1,
				genre: "UNKNOWN",
			};

		metatags.forEach((metatag) => {
			switch (metatag) {
				case (metatag.match(/^p:[0-9]+$/) || {}).input:
					// Priority
					if (!userMetadata.hasOwnProperty("priority")) {
						userMetadata.priority = parseInt(
							metatag.match(/^p:([0-9]+)$/)[1]
						);
					} else {
						console.warn("Priority already set.");
					}
					break;

				case (metatag.match(/^g:[a-zA-Z0-9-_]+$/) || {}).input:
					// Genre
					//TODO: Support multiple genres. Make them work like tags?
					if (!userMetadata.hasOwnProperty("genre")) {
						userMetadata.genre =
							metatag.match(/^g:([a-zA-Z0-9-_]+)$/)[1];
					} else {
						console.warn("Genre already set.");
					}
					break;

				default:
					// Not using a metatag, assume category.
					if (this.categories.hasOwnProperty(metatag)) {
						if (!userMetadata.hasOwnProperty("category")) {
							userMetadata.category = metatag;
						} else {
							console.warn("Category already set.");
						}
					}
					break;
			}
		});

		return $.extend(defaultMetadata, userMetadata);
	}

	generateFilters() {
		$(".es-category-container").each(function () {
			let $categoryContainer = $(this);

			let genres = {};
			$categoryContainer
				.find("> .es-category-games > .es-game")
				.each((i, game) => {
					let $game = $(game),
						genre = $game.attr("data-genre");
					if (genres.hasOwnProperty(genre)) {
						genres[genre] += 1;
					} else {
						genres[genre] = 1;
					}

					/*$game.find('span.note').text(function() {
					let re = new RegExp('(?:^[\\s]*\\[g\\:'+genre+'\\][\\s]*|[\\s]*\\[g\\:'+genre+'\\][\\s]*$)','i');
					return $(this).text().replace(re, '');
				});*/
				});

			let $filterContainer = $("<div/>", { class: "filterContainer" });

			Object.entries(genres).forEach(([genre, count]) => {
				let $genreButton = $("<button/>", {
					type: "button",
					"data-genre": genre,
					class: "genreButton",
					text: `${genre} (${count})`,
				});

				$filterContainer.append($genreButton);
			});

			$filterContainer.insertBefore(
				$categoryContainer.find("> .es-category-games")
			);
		});

		$("#intro").on("click", ".filterContainer > .genreButton", function () {
			let $button = $(this),
				genre = $button.attr("data-genre"),
				$games = $button
					.closest(".es-category-container")
					.find(`> .es-category-games > .es-game`),
				$filteredGames = $games.filter(`[data-genre="${genre}"]`),
				$notFilteredGames = $games.filter(
					`:not([data-genre="${genre}"])`
				);

			$games.show();
			if ($button.hasClass("filterOn")) {
				// Disabled
				$button.removeClass("filterOn");
			} /* else if($button.hasClass('filterOff')) {
				// Default
				$button.removeClass('filterOff');
				$filteredGames.show();
			}*/ else {
				// Enabled
				$button.parent().find(".filterOn").removeClass("filterOn");
				$button.addClass("filterOn");

				$notFilteredGames.hide();
			}
		});
	}

	sortGames() {
		$(".es-category-games").each(function () {
			$(this)
				.find(".es-game")
				.sortElements(function (a, b) {
					let $a = $(a),
						$b = $(b);

					let $a_game = $(a).find("> .npgame"),
						$b_game = $(b).find("> .npgame");

					let a_platform = $a_game.find("> div:eq(2)").text().trim(),
						b_platform = $b_game.find("> div:eq(2)").text().trim(),
						a_priority = $a.attr("data-priority"),
						b_priority = $b.attr("data-priority");

					//Sort by priority first
					if (a_priority > b_priority) {
						return -1;
					} else if (a_priority < b_priority) {
						return 1;
					} else {
						//Then sort by platform.
						if (a_platform > a_platform) {
							return 1;
						} else if (a_platform < b_platform) {
							return -1;
						} else {
							//Then sort by title.
							let a_title = $a_game
									.find("> div:eq(3)")
									.text()
									.trim(),
								b_title = $b_game
									.find("> div:eq(3)")
									.text()
									.trim();

							return a_title > b_title
								? 1
								: a_title < b_title
								? -1
								: 0;
						}
					}
				});
		});
	}

	addQuickEditProgress($game) {
		//TODO: We shouldn't do this on other peoples pages.
		let $progress = $game.find("> div:nth-of-type(5)"),
			progressText = $progress.text().trim();

		// Move progress info to <span> element
		$progress
			.text("") // Remove inline text
			.append($("<span/>", { class: "note", text: progressText }));

		// Generate and append required elements.
		let $textarea = $("<div/>", {
				class: "editProgress",
				style: "display: none;",
			})
				.append($("<textarea/>", { text: progressText }))
				.append(
					$("<a/>", {
						class: "editProgress_save",
						href: "#",
						text: "Save",
					})
				)
				.append(
					$("<a/>", {
						class: "editProgress_cancel",
						href: "#",
						text: "Cancel",
					})
				),
			$editLink = $("<a/>", {
				class: "editProgress_edit",
				href: "#",
				text: "Edit",
			});

		$textarea.insertAfter($progress);
		$progress.append($editLink);
	}
	setupQuickEditProgressEvents() {
		// Setup events.
		$("#intro")
			.on("click", ".npgame .editProgress_save", function (e) {
				e.preventDefault();

				let $progress = $(this).closest("div").prev();

				let newText = $progress.find("+ div > textarea").val().trim(),
					updateURL = $progress
						.parent()
						.find("a[href*=update]")
						.attr("href");

				//TODO: Check if there is more efficent way of doing this?
				$.get(updateURL, (data) => {
					//TODO: We should show a loading thing until it updated.
					let $form = $(
						data
							.replace(/[\s\S]*<form/, "<form")
							.replace(/<\/form>[\s\S]*/, "</form>")
					);

					$form.find("[name=note]").val(newText);

					$.post(
						updateURL,
						$form.serialize() +
							"&submit" +
							(!stealthSave ? "1=Save" : "2=Stealth+Save")
					);
				});

				$progress.find("> span").text(newText);
				$progress.toggle();
				$progress.find("+ div").toggle();
			})
			.on("click", ".npgame .editProgress_cancel", function (e) {
				e.preventDefault();

				let $progress = $(this).closest("div").prev();

				$progress.toggle();
				$progress.find("+ div").toggle();
			})
			.on("click", ".npgame .editProgress_edit", function (e) {
				e.preventDefault();

				let $progress = $(this).closest("div");

				$progress.toggle();
				$progress.find("+ div").toggle();

				$progress.find("+ div > textarea").focus();
			})
			.on("mouseenter mouseleave", ".npgame", function (e) {
				switch (e.type) {
					case "mouseenter":
						$(this).find(".editProgress_edit").fadeIn("fast");
						break;
					case "mouseleave":
						$(this).find(".editProgress_edit").fadeOut("fast");
						break;
				}
			});
	}

	start() {
		this.addStyles();

		this.generateList();
	}
}
let App = new Userscript();
App.start();
