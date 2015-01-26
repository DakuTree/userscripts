# userscripts
This repoistory contains various userscripts I have created for various sites with the simple goal of "making life easier" in one way or another.  
All of these were built to work with Chrome+Tampermonkey. There may be problems when not run under these.

### myanimelist.net
MAL is a great anime/manga list site, but I've always had a few issues with how limiting some of the features are. The below scripts try to remove those limits (Mostly using off-site databases).  
Although it should be obvious, users without the said userscript will not be able to view added info.

#### mal_favourites
This adds a "exfavourites" option to MAL. These favourites are not limited to the usual 5 anime/manga/people & 10 characters that MAL is limited to.  
These show below the MAL favourites and are highlighted.

#### mal_history
This replaces MALs history with one that uses my own DB. It also logs changes to stuff such as score etc.  
This was made due to MALs history being absolute shit. It has two major problems: Newly added series aren't logged & /history/ only lasts a month.

#### mal_precise
This allows scores to be set to one decimal place (8.5 etc.).   
This has been requested multiple times on MAL and said it wouldn't be implemented. This was my answer to that.

#### mal_misctweaks
This is intended to be a dump for small tweaks to MAL.   
Currently the only tweak currently added is one that defaults the search to whatever the current page is (so if you are on /manga/, it defaults to manga)

### e-hentai.org
E-Hentai is an excellent source for hentai. It has a near-perfect system for hosting/downloading/viewing hentai manga/doujins.  
Unlike MAL, EH isn't broken, but it has a few personal annoyances which I just had to fix.  
It may be worth noting that this is what I guess could be considered an adult site. Take from that what you will.

#### ehquickdl
This userscript was built prior to EH implementing it's own one-click DL system, and acted as an easy way to mass-DL stuff without annoyances.    
The reason this still exists is due to EH's own version not being a true "oneclick" system (as it still generates the pop-up). 

#### ehcomsearch
This userscript was built after I was kinda sick of the amount of vertical space EH took up.    
This compacts the search into the topbar/header, and turns it into a dropdown navbar.

### rememberthemilk.com
RememberTheMilk is a TODO list site. It isn't anywhere near-perfect, but it's still the closest thing to what I'd like.

#### rtm_randomize
This userscript adds a small button to the TODO list page which randomizes the current list.

### backloggery.com
Backloggery is a great site for managing what games I own, want to play, am currently playing and so on.    
It lacks a few features which could be considered neccessary though. Any scripts which appear here look to fix that.

#### backloggery_misctweaks
This is intended to be a dump for small tweaks to Backloggery.   
Currently the only tweak this adds is one that sorts any game with the [on-hold] tag to the bottom of the list (with it's own header)

## Misc
If you want, you can also grab my userscripts from [GreasyFork](https://greasyfork.org/users/2392-daku).  
If you find any issues, please submit an issue to the repo or send me an email.
