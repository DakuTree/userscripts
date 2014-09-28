// ==UserScript==
// @name         MyAnimeList - Infinite History
// @namespace    https://github.com/DakuTree/various/tree/master/experiments/mal
// @author       Daku (admin@codeanimu.net)
// @description  Infinite History
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)(list)?\/.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=.*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/panel\.php\?go\=(edit|add).*$/
// @include      /^http[s]?:\/\/myanimelist\.net\/editlist\.php\?type\=(anime|manga).*$/
// @updated      2014-08-24
// @version      1.0.3
// ==/UserScript==

/* MAL is running jQuery 1.8.1 */
//TODO: Make work with multiple people
//TODO: Make work with precise scores (This would also require making precise scores work on the below pages.
//TODO: Make work on edit popup on list pages.
//TODO: properly return error if cannot insert

// var ajax = "http://codeanimu.net/mal/";
var ajax = "http://192.168.0.5/mal/history.php";
run_script();

function run_script(){
	var userid = (document.cookie.match('(^|; )Y=([^;]*)')||0)[2];
	if(userid == 0) return false; //TODO: Alert user?

	if(/myanimelist\.net\/(anime|manga)\/[0-9]+/.test(self.location.href) || /myanimelist\.net\/(anime|manga)\.php\?id\=.*/.test(self.location.href)){
		$('[name=myinfo_submit]').click(function(){
			submit_history({
				type: self.location.pathname.split('/')[1].split('.')[0], addup: $('[name=myinfo_submit]').val(),
				db_id: $('[name="aid"], [name="mid"]').attr('value'),
				title: $('#contentWrapper > h1:first-of-type').contents().filter(function() { return this.nodeType == Node.TEXT_NODE; }).text().trim(),
				status: $('#myinfo_status option:selected').text(),
				score: $('#myinfo_score option:selected').text().replace( /\D+/g, '') || null,
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
	}else if(/myanimelist\.net\/(anime|manga)list\/.*/.test(self.location.href)){
		//TODO: Does this work with the edit popup?

		//We can't bind to form submit here since most of these inputs use bind events.
		$('input').bind("keypress", function(e) {
			var key =  e.keyCode || e.which;
			if (key == 13){
				handle_input($(this).closest('tr'));
			}else{
				return true;
			}
		});
		$('input[type="button"]').bind("click", function(e) {
			handle_input($(this).closest('tr'));
		});

		$('tr a:contains("+")').bind("click", function(e) {
			var newscore = parseInt($(this).parent().find('span').text()) + 1;
			if(isNaN(newscore)) newscore = 1;
			$(this).parent().find('input[type=text]').val(newscore);
			handle_input($(this).closest('tr'));
		});
	}else if(/myanimelist\.net\/panel\.php\?go\=(edit|add).*/.test(self.location.href) || /myanimelist\.net\/editlist\.php\?type\=(anime|manga).*/.test(self.location.href)){
		$('input[type=button][value^=Add], input[type=button][value^=Update]').click(function(){
			submit_history({
				type: $('#animeid, #mangaid').attr('id').substr(0, 5), addup: $('#contentWrapper > h1').text().trim(),
				id: $('#animeid, #mangaid').val(),
				title: $('strong').text().trim(),
				status: $('#status option:selected').text().trim(),
				score: $('[name=score] option:selected').text().replace( /\D+/g, '') || null,
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
}

function handle_input(row){
	submit_history({
		type: $('#listType').attr('value'), addup: 'Update',
		db_id: $(row).find('[id^=tagLinks]').attr('id').replace( /\D+/g, ''),
		title: $(row).find('.animetitle').text(), //This is labeled "animetitle" on both anime & manga lists.
		status: $('.header_title').text().trim(), //TODO: This may be mismatched with the /anime/ pages, check this.
		score: $(row).find('input[id^=score]').val() || $(row).find('span[id^=score]').text() || null, //FIXME: Won't work with precise scores..
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
	//To avoid duplicate code, we clean this all here...
	['score', 'ep_watched', 'ep_count', 'ch_read', 'ch_count', 'vol_read', 'vol_count'].forEach(function(e){
		info[e] = (info[e] === '-' || info[e] === '?' ? null : info[e]);
		if(e == 'ep_count' || e == 'ch_read' || e == 'vol_read'){ info[e] = (info[e] == 0 ? null : info[e]); }
	});

	console.log("Attempting to update...");
	$.post(ajax, info, function(data){
		if(data){
			console.log("STUFF HAPPENED: "+data);
			alert(data);
		}
	});
}
