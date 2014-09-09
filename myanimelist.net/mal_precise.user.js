// ==UserScript==
// @name         MyAnimeList - Precise Scores
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  Enables you to set scores with one decimal place (9.6, 8.5, 7.4 etc.) on MAL.
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)(list)?\/.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/panel\.php\?go\=(edit|add).*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/editlist\.php\?type\=(anime|manga).*$/
// @updated      2014-09-09
// @version      2.0.0
// ==/UserScript==

var backend = "http://codeanimu.net/userscripts/myanimelist.net/backend/";
var fontsize = "9px"; //Change this if you are using a non-standard font-size (This font-size only applies to scores you have just changed).

$(document).ready(function() {
	var dev = false; //Enable if you want some dev stuff
	if(dev == true){
		if(jQuery.fn.jquery !== '1.8.1'){
			alert('jQuery mismatch!\nRunning '+jQuery.fn.jquery+'.\nExpected 1.8.1.');
		}
		window.onerror = function(msg, url, linenumber) {
			alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
			error = true;
			return true;
		}
	}
	var userid = (document.cookie.match('(^|; )Y=([^;]*)')||0)[2],
	    type;

	if(/myanimelist\.net\/(anime|manga)\/[0-9]+/.test(self.location.href) || /myanimelist\.net\/(anime|manga)\.php\?id\=.*/.test(self.location.href)){
		if(userid == 0) return false;
		type = self.location.pathname.split('/')[1].split('.')[0];

		if(type == 'manga') return false; //TODO: MAL is shit. Read why at bottom of script.
		var db_id = $('[name="aid"], [name="mid"]').val();

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

		//Modify precise score if exists
		$.getJSON(backend+"mp_index.php", {userid: userid, type: type, db_id: db_id}, function(data) {
			$(select).val(data['score_precise'].toString().split(".")[1]);
			$(select).insertAfter('#myinfo_score');
			$('#myinfo_score').after(' . ');
			$('#myinfo_score').css('padding', '1px 0px 1px 0px');
		}).error(function(jqXHR, textStatus, errorThrown) {
			if(dev == true){
				alert("Error: "+textStatus+"\nIncoming Text: "+jqXHR.responseText);
			}
		});

		$('[name=myinfo_submit]').click(function(){
			if($('#myinfo_score').val() !== 0){
				update_pscores(db_id, $('#myinfo_score').val()+'.'+$('#precise_score').val(), false);
			}
		});
	}
	else if(/myanimelist\.net\/(anime|manga)list\/.*/.test(self.location.href)){
		userid = $('#listUserId').val(),
		type = $('#listType').val();

		//If custom CSS isn't loaded then use AJAX instead.
		if(/mal_css\/style\.php.*userid/.test($('style').eq(1).text()) === false){ 
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
		if(userid == 0) return false;
		type = $('#animeid, #mangaid').attr('id').substr(0, 5);

		if(type == 'manga') return false; //TODO: MAL is shit. Read why at bottom of script.

		$('<select/>', {id: 'precise_score', class: 'inputtext', style: 'padding: 1px 0px 1px 0px'}).append(
			$('<option/>', {value: '0', selected: true, text: '0'})).append(
			$('<option/>', {value: '1', text: '1'})).append(
			$('<option/>', {value: '2', text: '2'})).append(
			$('<option/>', {value: '3', text: '3'})).append(
			$('<option/>', {value: '4', text: '4'})).append(
			$('<option/>', {value: '5', text: '5'})).append(
			$('<option/>', {value: '6', text: '6'})).append(
			$('<option/>', {value: '7', text: '7'})).append(
			$('<option/>', {value: '8', text: '8'})).append(
			$('<option/>', {value: '9', text: '9'}))
			.insertAfter('select[name=score]');
		$('select[name=score]').after(' . ');

		$.getJSON(backend+"mp_index.php", {userid: userid, type: type, db_id: db_id}, function(data) {
			$('#precise_score').val(data['score_precise'].split(".")[1]);
		}).error(function(jqXHR, textStatus, errorThrown) {
			if(dev == true){
				alert("Error: "+textStatus+"\nIncoming Text: "+jqXHR.responseText);
			}
		});

		$('input[type=button]').click(function(){
			update_pscores(
				$('#animeid, #mangaid').val(),
				$('#myinfo_score').val()+'.'+$('#precise_score').val(),
				false
			);
		});
	}

	function update_pscores(db_id, score, list){
		list = list || false;
		var newScore = Number(score);
		if (isNaN(newScore) || (newScore>10) || (newScore<0)){
			alert('Invalid score value, must be between 1 and 10');
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
					$('<style/>').attr('rel', 'stylesheet').attr('type', 'text/css')
						.text("\
							#"+am[type][2]+db_id+" { font-size: 0; }\
							#"+am[type][2]+db_id+":after { content: '"+preciseScore+"'; font-size: "+fontsize+"; }\
						").appendTo('head');

					$.get(backend+"mp_update.php", {user_id: userid, type: type, 'db_id': db_id, score_precise: preciseScore});
				});
			}else{
				$.get(backend+"mp_update.php", {user_id: userid, type: type, 'db_id': db_id, score_precise: preciseScore});
			}
		}
	}
});