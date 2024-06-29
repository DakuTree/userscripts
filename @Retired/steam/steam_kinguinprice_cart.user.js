// ==UserScript==
// @name        Steam Wishlist - Kinguin Prices (Cart Edition)
// @description Kinguin Price Comparison
// @include     https://store.steampowered.com/cart/*
// @version     1.0.0
// @require     https://cdn.jsdelivr.net/npm/umbrellajs@3.1.0/umbrella.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function getKinguinPrices(name, callback) {
	let searchUrl =
		`https://gateway.kinguin.net/library/api/v1/products/search?platforms=2&active=1&hideUnavailable=0&page=0&size=25&sort=bestseller.total,DESC&visible=1&phrase=cd%20key%20` +
		encodeURI(name.replace(/[\W_]+/g, " ").trim());

	console.log(searchUrl);
	var req = GM_xmlhttpRequest({
		url: searchUrl,
		method: "GET",
		onload: function (response) {
			let data = JSON.parse(response.responseText);

			console.log(data);
			if (data["_embedded"]["products"].length > 0) {
				callback(
					data["_embedded"]["products"][0]["price"]["calculated"]
				);
			}
		},
	});
}

u(".cart_item_desc > a").each(function(node, i) {
	let $title = u(node);
	let $row   = $title.closest('.cart_item');
	console.log($title);
	let title = $title.text();
	console.log(title);
	getKinguinPrices(title, (price) => {
		$row.attr(
			"style",
			"background-color: darkblue"
		);
		let dEle = $row.find("[class=price]");
		dEle.text(dEle.text() + ` | ` + price);
	});
});
