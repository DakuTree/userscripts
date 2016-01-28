// ==UserScript==
// @name         MyAnimeList - MiscTweaks
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Various small tweaks to MAL
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga|people|character)(\/|\.php\?(id|q)\=).*$/
// @updated      2015-11-17
// @version      1.1.2
// ==/UserScript==

/* Change search to current page type */
var type = location.href.match(/^http[s]?:\/\/myanimelist\.net\/(anime|manga|people|character)(\/|\.php).*$/)[1];
$('#topSearchValue').val(type);

/* Note type of series in related block */
//TODO: This needs support for novels
$('.anime_detail_related_anime a').each(function() {
	$(this).text(
		$(this).text() + " ("+$(this).attr('href').match(/(anime|manga)/)[0].replace(/^(.)/, function(e){return e.toUpperCase(); })+")"
	);
});
