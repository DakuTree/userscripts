// ==UserScript==
// @name        Steam Wishlist - Kinguin Prices
// @description Kinguin Price Comparison
// @include     https://store.steampowered.com/wishlist/id/*/*
// @version     1.0.0
// @require     https://cdn.jsdelivr.net/npm/umbrellajs@3.1.0/umbrella.min.js
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// ==/UserScript==

let timer = setInterval(() => {
	if (u(".wishlist_row").length > 0) {
		let mutationObserver = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				mutation.addedNodes.forEach(function (
					currentValue,
					currentIndex,
					listObj
				) {
					if (currentValue.nodeType == Node.ELEMENT_NODE) {
						if (currentValue.className == "wishlist_row") {
							let $row = u(currentValue);
							let title = $row.find(".title").text();

							getKinguinPrices(title, (price) => {
								$row.find(".content").attr(
									"style",
									"background-color: darkblue"
								);
								let dEle = $row.find(".discount_final_price");
								dEle.text(dEle.text() + ` | ` + price);
							});
						}
					}
				});
			});
		});
		mutationObserver.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});

		clearInterval(timer);
	}
}, 250);

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
