// ==UserScript==
// @name         Backloggery - NP Extra Statuses
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Adds ability to filter "Now Playing" games under specific categories (on-hold, plan-to-play, etc.) & order them.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(?:www\.)?backloggery\.com\/(?:.(?!\.php))+$/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @updated      2018-07-03
// @version      2.1.0
// @grant        GM_addStyle
// ==/UserScript==

/*** OPTIONS ***/
const defaultCategories = {
	"start" : {
		//now-playing is used if none is specified.
		"now-playing" : {
			"description" : ""
		}
	},
	"end"   : {
		"on-hold" : {
			"title"       : "On-Hold",
			"description" : ""
		},
		"to-play" : {
			"title"       : "Plan to Play",
			"description" : ""
		}
	}
};

$(function() {
	GM_addStyle(`
		.hd-desc {
			display: block;
			margin-bottom: 5px;
		}
		.us-game-scroll {
			overflow-y: auto;
			max-height: 285px;
			overflow-x: hidden;
		}
	`);

	//Case insensitive :contains || via: https://gist.github.com/jbcappell/2648373
	$.extend($.expr[":"], {
		"containsNC": function(elem, i, match, array) {
			return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});
	//https://github.com/padolsey-archive/jquery.fn/blob/master/sortElements/jquery.sortElements.js
	jQuery.fn.sortElements=(function(){var sort=[].sort;return function(comparator,getSortable){getSortable=getSortable||function(){return this;};var placements=this.map(function(){var sortElement=getSortable.call(this),parentNode=sortElement.parentNode,nextSibling=parentNode.insertBefore(document.createTextNode(''),sortElement.nextSibling);return function(){if(parentNode===this){throw new Error("You can't sort elements if any one is a descendant of another.");} parentNode.insertBefore(this,nextSibling);parentNode.removeChild(nextSibling);};});return sort.call(this,comparator).each(function(i){placements[i].call(getSortable.call(this));});};})();

	/**** SCRIPT ****/
	let userCategories = getCategories();
	$.each($.extend(defaultCategories.start, userCategories, defaultCategories.end), function(tag, data) {
		let cateTitle       = data.title,
		    cateDescription = data.description,
			cateScroll      = data.scroll,
			cateMaxHeight   = data.maxHeight;

		//Validate data.
		if(!tag.match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]+$/)) {
			console.warn(`User category tag contains invalid characters: ${tag}`);
			return true;
		} else if(!cateTitle.match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]+$/)) {
			console.warn(`User title contains invalid characters: ${cateTitle}`);
			return true;
		} else if(!cateDescription.match(/^[a-zA-Z0-9-_\(\)\.\?\#\~\:\{\}\"\'\, ]*$/)) {
			console.warn(`User description contains invalid characters: ${cateDescription}`);
			return true;
		}

		//The now-playing already exists, however the user can add a description which we need to add to account for.
		if(tag === 'now-playing' && cateDescription) {
			let header = $('#intro h1:containsNC("Now Playing")');
			header.after(
				$('<span/>', {class: 'hd-desc', text: cateDescription})
			);
			header.attr('style', 'margin-bottom: 3px');

			return true;
		}

		//Check game list for series containing category.
		let games = $(`.npgame:containsNC([${tag}])`);
		if(games.length > 0){
			let intro = $('#intro');
			intro.append(
				$('<h1/>', {text: cateTitle, style: 'margin-top: 12px;'})
			);
			if(cateDescription.length > 0) {
				intro.append(
					$('<span/>', {class: 'hd-desc', text: cateDescription, style: 'margin-top: 3px;'})
				);
			}

			let games_container = $('<div/>', {class: 'es-games'});
			if(cateScroll) {
				games_container.addClass('us-game-scroll');
			}
			if(cateMaxHeight) {
				games_container.css('max-height', parseInt(cateMaxHeight));
			}

			$(games).each(function(){
				let game            = $(this),
					gameDescription = game.children(':eq(4)').text().trim(),
				    priority        = -1;

				game.parent().attr('data-text', gameDescription); //Keep the original description for editting purposes.


				//Check if game also has priority
				let pArr = gameDescription.match(/\[p\:([0-9]+)]/);
				if(pArr) {
					priority = parseInt(pArr[1]);
				}
				game.attr('data-priority', priority);
				//TODO: We should also add some form of icon.

				//Remove tags from visible description.
				$(game).children(':eq(4)').find('span').text(function() {
					//Check: Is there a better way to do this regex? Lots of duplication here..
					let re = new RegExp('(?:^[\\s]*\\['+tag+'\\][\\s]*|[\\s]*\\['+tag+'\\][\\s]*$)','i');
					//TODO: Remove priority after we add prio icon.
					// var re = new RegExp('(?:^[\\s]*\\[p\\:[0-9]+\\][\\s]*|[\\s]*\\[p\\:[0-9]+\\][\\s]*$)','i');
					return $(this).text().replace(re, '');
				});

				let game_info = $(game).next();
				let game_container = $('<div/>', {class: 'es-game'})
					.append(game)
					.append(game_info); //Backloggery stores the "more" data in the next div, which lacks proper IDs.

				$(game_container).appendTo(games_container);
			});
			$(games_container).appendTo('#intro');
		}
	});

	//Stick non-tagged games in divs.
	let games_container = $('<div/>', {class: 'es-games'});
	$('#intro > .npgame').each(function(){
		let game = $(this);

		let game_info = $(game).next();
		let game_container = $('<div/>', {class: 'es-game'})
			.append(game)
			.append(game_info); //Backloggery stores the "more" data in the next div, which lacks proper IDs.

		$(game_container).appendTo(games_container);
	});
	$(games_container).insertAfter($('#intro > h1:first-of-type + .hd-desc') || $('#intro > h1:first-of-type'));

	sortGames();

	/*****************************************/

	function getCategories() {
		let categoryMatch = $('#note').text().match(/==NPES-START==([\s\S]+)==NPES-END==/),
		    categories     = {};
		if(categoryMatch) {
			try {
				categories = JSON.parse(categoryMatch[1]);
			} catch (e) {
				console.error(e);
			}
		}
		return categories;
	}

	function sortGames() {
		$('.es-games').each(function() {
			$(this).find('.es-game').sortElements(function(a, b) {
				let a_game = $(a).find('> .npgame'),
				    b_game = $(b).find('> .npgame');

				let a_platform = a_game.find('> div:eq(2)').text().trim(),
				    b_platform = b_game.find('> div:eq(2)').text().trim(),
					a_priority = a_game.attr('data-priority'),
					b_priority = b_game.attr('data-priority');

				//Sort by priority first
				if(a_priority > b_priority) {
					return -1;
				} else if(a_priority < b_priority) {
					return 1;
				} else {
					//Then sort by platform.
					if(a_platform > a_platform) {
						return 1;
					} else if(a_platform < b_platform) {
						return -1;
					} else {
						//Then sort by title.
						let a_title = $(a_game).find('> div:eq(3)').text().trim(),
						    b_title = $(b_game).find('> div:eq(3)').text().trim();

						return (a_title > b_title) ? 1 : (a_title < b_title) ? -1 : 0;
					}
				}

			});
		});
	}
});
