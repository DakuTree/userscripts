// ==UserScript==
// @name         MyAnimeList - Precise Scores
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Enables you to set scores with one decimal place (9.6, 8.5, 7.4 etc.) on MAL.
// @homepageURL  https://github.com/DakuTree/userscripts
// @supportURL   https://github.com/DakuTree/userscripts/issues
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)(list)?\/.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/panel\.php\?go\=(edit|add).*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/editlist\.php\?type\=(anime|manga).*$/
// @updated      2016-08-24
// @version      2.2.6
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.1/jquery.min.js
// ==/UserScript==

var backend = "https://codeanimu.net/userscripts/myanimelist.net/backend/";
var fontsize = "9px"; //Change this if you are using a non-standard font-size (This font-size only applies to scores you have just changed).
var dev = false; //Enable if you want some dev stuff

$(document).ready(function() {
	if(dev === true){
		if(jQuery.fn.jquery !== '2.2.1'){
			alert('jQuery mismatch!\nRunning '+jQuery.fn.jquery+'.\nExpected 2.2.1.');
		}
		window.onerror = function(msg, url, linenumber) {
			alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
			error = true;
			return true;
		};
	}

	var userid = (document.cookie.match('(^|; )(A|Y)=([^;]*)')||0)[3] || find_userid() || 0,
	    type;

	if(/myanimelist\.net\/(anime|manga)\/[0-9]+/.test(self.location.href) || /myanimelist\.net\/(anime|manga)\.php\?id\=.*/.test(self.location.href)){
		if(userid === 0) return false;
		type = self.location.pathname.split('/')[1].split('.')[0];

		//Create precise scores select
		var select = $('<select/>', {id: 'precise_score', class: 'inputtext', style: 'padding: 1px 0px 1px 0px'}).append(
						$('<option/>', {value: '0', selected: true, text: '0'})).append(
						$('<option/>', {value: '1', text: '1'})).append(
						$('<option/>', {value: '2', text: '2'})).append(
						$('<option/>', {value: '3', text: '3'})).append(
						$('<option/>', {value: '4', text: '4'})).append(
						$('<option/>', {value: '5', text: '5'})).append(
						$('<option/>', {value: '6', text: '6'})).append(
						$('<option/>', {value: '7', text: '7'})).append(
						$('<option/>', {value: '8', text: '8'})).append(
						$('<option/>', {value: '9', text: '9'}));

		var db_id = $('[name="aid"]').val() || $('[name="mid"]').val() || ((db_id = $('#addtolist a[href^="/panel.php?go=editmanga&id="]').attr('href')) ? db_id.match(/id=([0-9]+)$/)[1] : null); //Manga uses a different ID due to MAL being shit.
		if(db_id){
			//db_id should be set on 3/4 possible pages (anime add/update & manga update)

			//Check if series is already on list, if so update precise score
			if($('input[name=myinfo_submit]').val() == 'Update' || $('input[name=myinfo_submit]').val() == 'Submit'){
				$.getJSON(backend+"mp_index.php", {userid: userid, type: type, db_id: db_id}, function(data) {
					$(select).val(data['score_precise'].toString().split(".")[1] || "0");
				}).error(function(jqXHR, textStatus, errorThrown) {
					if(dev === true){
						alert("Error: "+textStatus+"\nIncoming Text: "+jqXHR.responseText);
					}
				});
			}
			$(select).insertAfter('#myinfo_score');
			$('#myinfo_score').after(' . ');
			$('#myinfo_score').css('padding', '1px 0px 1px 0px');

			$('[name=myinfo_submit]').click(function(){
				if($('#myinfo_score').val() !== 0){
					update_pscores(db_id, $('#myinfo_score').val()+'.'+$('#precise_score').val(), false);
				}
			});
		}else{
			//To make manga precise scores work properly with lists, we need to use a seperate id
			//Sadly this isn't set unless the actual has been already added to your own list
			//This means we need to jump through some hoops.

			$(select).insertAfter('#myinfo_score');
			$('#myinfo_score').after(' . ');
			$('#myinfo_score').css('padding', '1px 0px 1px 0px');

			$('[name=myinfo_submit]').attr('onclick', null);
			$('[name=myinfo_submit]').click(function(){
				$.post("/includes/ajax.inc.php?t=49", {mid: $('#myinfo_manga_id').val(), score: $('#myinfo_score').val(), status: $('#myinfo_status').val(), chapters: $('#myinfo_chapters').val(), volumes: $('#myinfo_volumes').val()},function(data) {
					$("#myinfoDisplay").html('');
					$("#addtolist").html(data);

					db_id = ((db_id = $(data.responseText).attr('href')) ? db_id.match(/id=([0-9]+)$/)[1] : null);
					if(typeof $('#myinfo_score').val() != 'undefined' && $('#myinfo_score').val() !== '0'){
						update_pscores(db_id, $('#myinfo_score').val()+'.'+$('#precise_score').val(), false);
					}
				});
			});
		}
	}
	else if(/myanimelist\.net\/(anime|manga)list\/.*/.test(self.location.href)){
		userid = $('#listUserId').val();
		type = $('#listType').val();

		//If custom CSS isn't loaded then use AJAX instead.
		if(/mal_style\/style\.php.*userid/.test($('style').eq(1).text()) === false){
			$.getJSON(backend+"mp_index.php", {userid: userid, type: type}, function(data) {
				$.each(data, function(){
					$('#score' + (type == "anime" ? "val" : "") + $(this)[0]['db_id']).text($(this)[0]['score_precise']);
				});
			});
		}

		$('input[type="button"]').click(function(e){
			e.preventDefault();
			update_pscores(
				$(this).closest('div').find('input[type=text]').attr('id').substr(9),
				$(this).closest('div').find('input[type=text]').val(),
				true
			);
		});

		$('input[id^="scoretext"]').bind("keypress", function(e) {
			var key =  e.keyCode || e.which;
			if (key == 13){
				update_pscores(
					$(this).attr('id').substr(9),
					$(this).val(),
					true
				);
			}else{
				return true;
			}
		});
	}
	else if(/myanimelist\.net\/panel\.php\?go\=(edit|add).*/.test(self.location.href) || /myanimelist\.net\/editlist\.php\?type\=(anime|manga).*/.test(self.location.href)){
		if(userid === 0) return false;
		type = $('#animeid, #mangaid').attr('id').substr(0, 5);

		//Create precise scores select
		var select = $('<select/>', {id: 'precise_score', class: 'inputtext', style: 'padding: 1px 0px 1px 0px'}).append(
						$('<option/>', {value: '0', selected: true, text: '0'})).append(
						$('<option/>', {value: '1', text: '1'})).append(
						$('<option/>', {value: '2', text: '2'})).append(
						$('<option/>', {value: '3', text: '3'})).append(
						$('<option/>', {value: '4', text: '4'})).append(
						$('<option/>', {value: '5', text: '5'})).append(
						$('<option/>', {value: '6', text: '6'})).append(
						$('<option/>', {value: '7', text: '7'})).append(
						$('<option/>', {value: '8', text: '8'})).append(
						$('<option/>', {value: '9', text: '9'}));

		var db_id = $('#animeid').val() || ((db_id = $('input[name=entry_id]').val()) !== "0" ? db_id : null) || null;
		if(db_id){
			//db_id should be set on 3/4 possible pages (anime add/update & manga update)
			if($('input[type=button][value^=Add], input[type=button][value^=Update]').val().split(" ")[0] == "Update"){
				//Modify precise score if exists
				$.getJSON(backend+"mp_index.php", {userid: userid, type: type, 'db_id': db_id}, function(data) {
					$(select).val(data['score_precise'].toString().split(".")[1]);
					$(select).insertAfter('select[name=score]');
					$('select[name=score]').after(' . ');
					$('select[name=score]').css('padding', '1px 0px 1px 0px');
				}).error(function(jqXHR, textStatus, errorThrown) {
					if(dev === true){
						alert("Error: "+textStatus+"\nIncoming Text: "+jqXHR.responseText);
					}
				});
			}
			$(select).insertAfter('select[name=score]');
			$('select[name=score]').after(' . ');
			$('select[name=score]').css('padding', '1px 0px 1px 0px');

			$('input[type=button][value^=Add], input[type=button][value^=Update]').click(function(){
				if($('form[name$=Form] select[name=status]').val() !== '0' && $('select[name=score]').val() !== '0'){
					update_pscores(db_id, parseInt($('select[name=score]').val())+'.'+$('#precise_score').val(), false);
				}
			});
		}else{
			$(select).insertAfter('select[name=score]');
			$('select[name=score]').after(' . ');
			$('select[name=score]').css('padding', '1px 0px 1px 0px');

			$('form[name=mangaForm] input[name=submitIt]').val(1);

			$('input[type=button][value^=Add]').attr('onclick', null);
			$('input[type=button][value^=Add]').click(function(){
				if($('form[name=mangaForm] select[name=status]').val() !== '0'){
					$.post(location.href, $('form[name=mangaForm]').serialize(), function(d){
						console.log(d);
						//Unlike the /manga/ page, we can't simply check the return data for the entry_id
						//Instead we need to send a second AJAX request. This is why I hate MAL.
						$.get("https://myanimelist.net/manga.php", {id: $('#mangaid').val()}, function(data){
							db_id = ((db_id = data.match(/panel\.php\?go=editmanga&id=([0-9]+)/)) ? db_id[1] : null);
							if(typeof $('#myinfo_score').val() != 'undefined' && $('#myinfo_score').val() !== '0'){
								update_pscores(db_id, parseInt($('select[name=score]').val())+'.'+$('#precise_score').val(), false);
							}
							location.href = 'https://myanimelist.net/manga/'+$('#mangaid').val();
						});
					});
				}else{
					alert("You must select a status (watching, completed, etc...) for this series.");
				}
			});
		}
	}

	function update_pscores(db_id, score, list){
		list = list || false;
		var newScore = Number(score);
		if (isNaN(newScore) || (newScore>10) || (newScore<0)){
			alert('Invalid score value, must be between 0 and 10 || '+newScore);
			return false;
		}else{
			var preciseScore = newScore.toFixed(1);
			var roundScore = Math.floor(newScore); //We use .floor here rather than .round as to avoid rounding up. As, for example, a 9.5+ should never equal a 10.

			if(list){
				var am = {'anime': ['63', 'id', 'scoreval'], 'manga': ['33', 'mid', 'score']};
				var pobj = {'score': roundScore};
				pobj[am[type][1]] = am[type][2];
				$.post("/includes/ajax.inc.php?t="+am[type][0], pobj, function(data){
					$('#scoretext'+db_id).attr('value', '');
					//This feels extremely ugly, but it has to be done so it plays nice with the custom MAL_Precise CSS.
					//We include content twice as a way to make it accessible via another JS script (since we can't access :after)
					$('<style/>').attr('rel', 'stylesheet').attr('type', 'text/css')
						.text("\
							#"+am[type][2]+db_id+" { font-size: 0; content: '"+preciseScore+"'; }\
							#"+am[type][2]+db_id+":after { content: '"+preciseScore+"'; font-size: "+fontsize+"; }\
						").appendTo('head');

					$.get(backend+"mp_update.php", {userid: userid, type: type, 'db_id': db_id, score_precise: preciseScore});
				});
			}else{
				$.get(backend+"mp_update.php", {userid: userid, type: type, 'db_id': db_id, score_precise: preciseScore});
			}
		}
	}

	function find_userid() {
		var userid,
		    unsafeWindow = this['unsafeWindow'] || window;

		//#1: Check localStorage to see if userid is already set?
		//    Also if expired, delete localStorage.
		if(unsafeWindow.localStorage.getItem('userid')) {
			var userid_data = JSON.parse(unsafeWindow.localStorage.getItem('userid'));
			if(new Date().getTime() > userid_data['timestamp']) {
				unsafeWindow.localStorage.removeItem('userid');
				console.log('localstorage found userid but has expired');
			}else{
				userid = userid_data['userid'];
				console.log('localstorage found userid');
			}
		}

		if(!userid) {
			//#2: localstorage does not exists, manually try and find userid

			//#2.1: Check if user is online, and if so, get username.
			var userName;
			$.get('https://myanimelist.net/panel.php', function(data) {
				userName = data.match(/\/profile\/(.*?)"/)[1];
				console.log(userName);
				if(userName) {
					//2.2: Check profile for userID. It may be possible for the userID to still not exist.
					$.get('https://myanimelist.net/profile/'+userName, function(data) {
						//since we're using an old version of jQuery, parsing the HTML is painful, so we're doing it the hacky way.
						userid = data.match(/name="profileMemId" value="([0-9]+)"/)[1];
						if(userid) {
							var expireTime = (14 * 24 * 60 * 60 * 1000); //2 weeks expire
							unsafeWindow.localStorage.setItem('userid', JSON.stringify({'userid': userid, 'timestamp': (new Date().getTime() + expireTime)}));
							console.log('userid found');
						}
					});
				}else{
					//User is not online, alert them?
				}
			});
		}

		return userid;
	}
});