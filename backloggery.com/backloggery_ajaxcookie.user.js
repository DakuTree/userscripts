// ==UserScript==
// @name         Backloggery - AJAX Cookie of Fortune
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Makes the cookie of fortune use AJAX rather than go to a seperate page.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/(www\.)?backloggery\.com\/random\.php\?user\=.*$/
// @grant        GM_addStyle
// @updated      2014-08-26
// @version      1.0.0
// ==/UserScript==

GM_addStyle('\
	#fortune {position: relative; top: -46px; left: 292px;}\
	#content-wide > section > div > img {margin-bottom: -45px;}');

$('form[name=cookie]').submit(function(e){
	$.post($(this).attr('action'), $(this).serializeObject(), function(data){
		var html = data.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/g, '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
		$('#content-wide > section > div').html($('<div>'+html+'</div>').find('#content-wide > section > div').html());
	});

	e.preventDefault();
});

//http://stackoverflow.com/a/1186309/1168377
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};