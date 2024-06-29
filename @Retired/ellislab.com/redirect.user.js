// ==UserScript==
// @name         Redirect Ellislab CI userguide.
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Because being #1 on search results despite no longer owning CI is a bad thing.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^https:\/\/ellislab\.com\/codeigniter\/user-guide/.*$/
// @updated      2016-05-23
// @version      1.0.0
// @run-at       document-start
// ==/UserScript==
/* jshint -W097, browser:true, devel:true */
'use strict';

var url = location.href.substr(44);
window.location.replace('https://www.codeigniter.com/userguide3/'+url);