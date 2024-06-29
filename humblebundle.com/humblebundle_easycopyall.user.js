// ==UserScript==
// @name         HumbleBundle - Easy Copy All
// @description  Displays an input to easily copy all keys on the page.
// @author       Daku (admin@codeanimu.net)
// @namespace    https://github.com/DakuTree/userscripts
// @homepage     https://github.com/DakuTree/userscripts
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @icon         https://www.humblebundle.com/g/favicon.ico
// @match        https://www.humblebundle.com/downloads?key=*
// @version      1.0.0
// @run-at       document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://gist.github.com/PizzaBrandon/5709010/raw/e539a6f16c10465eb948b9ef6b0fe1d4c17a7c3e/jquery.waituntilexists.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

$(document).ready(function() {
	waitForElm('.keyfield-value').then((elm) => {
		let $this = $(elm).parents('.key-container');
		$this.after(
			$('<textarea/>', {text: $.map($('.keyfield-value'), function(e) { return $(e).text(); }).join("\n")})
		);
	});
});
