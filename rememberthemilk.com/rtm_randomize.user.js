// ==UserScript==
// @name         RTM - Randomize List
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @include      /^http[s]?:\/\/www\.rememberthemilk\.com\/home\/.*$/
// @updated      2015-01-01
// @version      1.0.0
// ==/UserScript==

function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

function main(){
	jQuery(document).ready(function($) {
		(function($){$.fn.shuffleRows=function(){return this.each(function(){var main=$(/table/i.test(this.tagName)?this.tBodies[0]:this);var firstElem=[],counter=0;main.children().each(function(){firstElem.push(this.firstChild);});main.shuffle();main.children().each(function(){this.insertBefore(firstElem[counter++],this.firstChild);});});}
		$.fn.shuffle=function(){return this.each(function(){var items=$(this).children();return(items.length)?$(this).html($.shuffle(items)):this;});}
		$.shuffle=function(arr){for(var j,x,i=arr.length;i;j=parseInt(Math.random()*i),x=arr[--i],arr[i]=arr[j],arr[j]=x);return arr;}})(jQuery);

		$('#tasksToolbox').after($('<a/>', {id: 'randomize', href: '#', text: 'Randomize List', style: 'position: relative; top: -47px; left: 342px'}));
		$('#randomize').click(function(){$('#tasks table').shuffleRows();});
	});
}

if (typeof window.jQuery  === "undefined") {
	addJQuery(main); //@require doesn't work, so load JQuery then load the scripy
} else {
	main(); //@require works, so just load the script
}
