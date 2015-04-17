// ==UserScript==
// @name         MyAnimeList - Infinite History
// @namespace    https://github.com/DakuTree/userscripts
// @author       Daku (admin@codeanimu.net)
// @description  MAL history which lasts forever. View on /history/ page.
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)(list)?\/.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/panel\.php\?go\=(edit|add).*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/editlist\.php\?type\=(anime|manga).*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/history\/.*$/
// @updated      2015-04-17
// @version      2.1.0
// @run-at       document-idle
// ==/UserScript==

var backend = "http://codeanimu.net/userscripts/myanimelist.net/backend/";
var dev = false; //Enable if you want some dev stuff

$(document).ready(function() {
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

	var userid = (document.cookie.match('(^|; )(A|Y)=([^;]*)')||0)[3] || find_userid() || 0,
	    type;
	if(userid == 0){ dev_alert('userid = 0'); return false; }

	if(/myanimelist\.net\/history\/.*/.test(self.location.href)){
		dev_log('history page matched');

		type = self.location.pathname.split('/')[3] || 'all';

		$('#content > div > table > tbody').empty(); //empty current list
		$('#horiznav_nav > ul').append(
			$('<li/>').append(
				$('<a/>', {text: 'Offsite MAL History', href: backend+'mh_index.php?'+$.param({userid: userid, type: type, page: 1, force: 'html'})})
			)
		)

		get_history(type, 1);

		$('<a/>', {text: 'Show more..', href: '#', id: 'history_link', 'style': 'display: block; text-align: center;', 'data-curpage': 1}).insertAfter('#content > div > table')
		$('#history_link').click(function(e){
			var nextpage = parseInt($(this).attr('data-curpage')) + 1;
			$(this).attr('data-curpage', nextpage);

			$('<tr/>').append(
				$('<td/>', {colspan: '3'}).append(
					$('<div/>', {'class': 'normal_header', 'style': 'border-width: 0; margin: 15px 0 0 0;'}).append(
						document.createTextNode('Page: '+nextpage))))
				.appendTo('#content > div > table > tbody');
			get_history(type, nextpage);
			e.preventDefault();
		});
	}

	if(/myanimelist\.net\/(anime|manga)\/[0-9]+/.test(self.location.href) || /myanimelist\.net\/(anime|manga)\.php\?id\=.*/.test(self.location.href)){
		$('[name=myinfo_submit]').click(function(){
			submit_history({
				type: self.location.pathname.split('/')[1].split('.')[0], addup: $('[name=myinfo_submit]').val(),
				db_id: $('[name="aid"], [name="mid"]').attr('value'),
				title: $('#contentWrapper > h1:first-of-type').contents().filter(function() { return this.nodeType == Node.TEXT_NODE; }).text().trim(),
				status: $('#myinfo_status option:selected').text().trim(),
				score: get_score(1, null) || null,
				//anime
				ep_watched: $('#myinfo_watchedeps').val() || null,
				ep_count: $('#curEps').text() || null,
				//manga
				ch_read: $('#myinfo_chapters').val() || null,
				ch_count: $('#totalChaps').text() || null,
				vol_read: $('#myinfo_volumes').val() || null,
				vol_count: $('#totalVols').text() || null
			});
		});
	}
	else if(/myanimelist\.net\/(anime|manga)list\/.*/.test(self.location.href)){
		//We can't bind to form submit here since most of these inputs use bind events.
		$('input').keypress(function(e) {
			var key =  e.keyCode || e.which;
			if (key == 13){
				handle_input($(this).closest('tr'));
			}else{
				return true;
			}
		});
		$('input[type="button"]').click(function(e) {
			handle_input($(this).closest('tr'));
		});

		//+1 episode/chapter/volume
		$('tr a:contains("+")').click(function(e) {
			var new_cve = parseInt($(this).parent().find('span').text()) + 1;
			if(isNaN(new_cve)) new_cve = 1;
			$(this).parent().find('input[type=text]').val(new_cve);
			handle_input($(this).closest('tr'));
		});
	}
	else if(/myanimelist\.net\/panel\.php\?go\=(edit|add).*/.test(self.location.href) || /myanimelist\.net\/editlist\.php\?type\=(anime|manga).*/.test(self.location.href)){
		$('input[type=button][value^=Add], input[type=button][value^=Update]').click(function(){
			submit_history({
				type: $('#animeid, #mangaid').attr('id').substr(0, 5), addup: $('#contentWrapper > h1').text().trim(),
				id: $('#animeid, #mangaid').val(),
				title: $('strong').text().trim(),
				status: $('#status option:selected').text().trim(),
				score: get_score(3, null) || null,
				//anime
				ep_watched: $('#completedEpsID').val() || null,
				ep_count: $('#totalEpisodes').text() || null,
				//manga
				ch_read: $('#chap_read').val() || null,
				ch_count: $('#total_chap').text() || null,
				vol_read: $('#vol_read').val() || null,
				vol_count: $('#totalVol').text() || null
			});
		});
	}

	function handle_input(row){
		submit_history({
			type: $('#listType').attr('value'), addup: 'Update',
			db_id: $(row).find('[id^=tagLinks]').attr('id').replace( /\D+/g, ''),
			title: $(row).find('.animetitle').text(), //This is labeled "animetitle" on both anime & manga lists.
			status: $('.header_title').text().trim(), //TODO: This may be mismatched with the /anime/ pages, check this.
			score: get_score(2, row) || null,
			//anime
			ep_watched: $(row).find('input[id^=epID]').val() || $(row).find('span[id^=output]').text() || null,
			ep_count: $(row).find('[id^=epText] > a').contents().filter(function() { return this.nodeType == Node.TEXT_NODE; }).text().trim().split('/')[1],
			//manga
			ch_read: $(row).find('input[id^=chaptext]').val() || $(row).find('span[id^=chap]').text() || null,
			ch_count: $(row).find('span[id^=chap]').parent().contents().filter(function() { return this.nodeType == Node.TEXT_NODE; }).text().trim().split('/')[1],
			vol_read: $(row).find('input[id^=voltext]').val() || $(row).find('span[id^=vol]').text() || null,
			vol_count: $(row).find('span[id^=vol]').parent().contents().filter(function() { return this.nodeType == Node.TEXT_NODE; }).text().trim().split('/')[1]
		});
	}

	function submit_history(info){
		info['userid'] = userid;
		//To avoid duplicate code, we clean this all here...
		['score', 'ep_watched', 'ep_count', 'ch_read', 'ch_count', 'vol_read', 'vol_count'].forEach(function(e){
			info[e] = (info[e] === '-' || info[e] === '?' ? null : info[e]);
			if(e == 'ep_count' || e == 'ch_read' || e == 'vol_read'){ info[e] = (info[e] == 0 ? null : info[e]); }
		});

		console.log("Attempting to update history...");
		$.post(backend+'mh_update.php', info, function(data){
			if(data){ handle_error(JSON.parse(data['error'])['error']); }
		});
	}

	function get_score(type, row){
		var score = null,
		    loaded = (this['unsafeWindow'] || window)['loaded_ps'];

		if(type == 1){
			score = (loaded ? $('#myinfo_score').val()+'.'+$('#precise_score').val() : $('#myinfo_score').val());
		}
		else if(type == 2){
			score = $(row).find('input[id^=score]').val(); //Set score from input value
			if(loaded && !score){ score = $(row).find('span[id^=score]').css('content').replace(/('|")/g, ''); }
			score = (score || $(row).find('span[id^=score]').parent().text());
		}
		else if(type == 3){
			score = (loaded ? $('select[name=score]').val()+'.'+$('#precise_score').val() : $('select[name=score]').val());
		}

		return +score || null;
	}

	function get_history(type, page){
		$.getJSON(backend+'mh_index.php', {userid: userid, type: type, page: page}, function(data){
			if(data['error']){ handle_error(data['error']); }

			var dateobj = {};
			$.each(data, function(k, v){
				var date  = new Date(v[10]+' UTC'),
					ymg   = (date.getFullYear().toString())+'/'+(('0' + (date.getMonth()+1)).slice(-2))+'/'+(('0'+date.getDate()).slice(-2));

				//Date is changed to local timezone above by appending UTC, make sure string is changed to show that.
				v[10] = ymg+' '+(('0' + (date.getHours())).slice(-2))+':'+(('0' + (date.getHours())).slice(-2))+':'+(('0' + (date.getSeconds())).slice(-2));

				dateobj[ymg] = (dateobj[ymg] || []);
				dateobj[ymg].push(v);
			});

			$.each(dateobj, function(subheader, rows){
				$('<tr/>').append(
					$('<td/>', {colspan: '3'}).append(
						$('<div/>', {'class': 'normal_header'}).append(
							document.createTextNode(subheader+' ')).append(
							$('<span/>', {'style': 'font-weight: normal;'}).append(
								$('<small/>', {text: '('+rows.length+')'})))))
				.appendTo('#content > div > table > tbody');
				$.each(rows, function(key, row){
					//row[0] = type
					//row[1] = db_id
					//row[2] = title
					//row[3] = status
					//row[4] = score
					//row[5] = chep_digested
					//row[6] = chep_count
					//row[7] = vol_read
					//row[8] = vol_count
					//row[9] = addup
					//row[10] = timestamp

					//TYPE: (STATUS) - (TITLE) (ep|ch). (CHEP_DIGESTED)/(CHEP_COUNT) {|| vol. (VOL_READ)/(VOL_COUNT)} (TIMESTAMP)
					$('<tr/>').append(
						$('<td/>', {'class': 'borderClass'}).append(
							document.createTextNode(row[3]))).append(
						$('<td/>', {'class': 'borderClass'}).append(
							$('<a/>', {href: '/'+row[0]+'/'+row[1], text: row[2]})).append(
							document.createTextNode(' '+(row[0] == 'anime' ? 'ep':'ch')+'. ')).append(
								$('<strong/>', {text: (row[5]||'?')+'/'+(row[6]||'?')})).append(
							(row[0] == 'anime' ? '' : ($(document.createTextNode(' || vol. ')).after(
								$('<strong/>', {text: (row[7]||'?')+'/'+(row[8]||'?')})))))).append(
						$('<td/>', {'class': 'borderClass', align: 'right', text: row[10]}))
					.appendTo('#content > div > table > tbody');
				});
			});
		});
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
			$.get('http://myanimelist.net/panel.php', function(data) {
				userName = data.match(/\/profile\/(.*?)"/)[1];
				console.log(userName);
				if(userName) {
					//2.2: Check profile for userID. It may be possible for the userID to still not exist.
					$.get('http://myanimelist.net/profile/'+userName, function(data) {
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

	function handle_error(error){
		console.error('ERROR (MH): '+error);
		if(dev){ alert('ERROR (MH): '+error); }
	}

	function dev_log(text) { if(dev == true){ console.log('DEV: '+text); } }
	function dev_alert(text) { if(dev == true){ alert('DEV: '+text); } }
});
