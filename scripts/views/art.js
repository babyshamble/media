;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, ['scripts/Components/loading/loading'], 'scripts/views/art', function(){
	var
		art = new Framework('scripts/views/art');

	var
		isInited = false
		,lastRenderedArtid = -1
		,cataClickMaskId = -1
		,listDomReady = false
		,TRANSFORMER = /<p[^>]*>|<\/p[^>]*>|<strong[^>]*>|<\/strong[^>]*>|<font[^>]*>|<\/font[^>]*>|<div[^>]*>|<\/div[^>]*>|<br[^>]*>|<span[^>]*>|<\/span[^>]*>|<table[^>]*>|<\/table[^>]*>|<tbody[^>]*>|<\/tbody[^>]*>|<td[^>]*>|<\/td[^>]*>|<tr[^>]*>|<\/tr[^>]*>|\n/g // 用于分割段落
        ,SECTENCE = /。|，|？|！|；|,|:|!/g; // 用于分句
  
    var 
    	time = undefined, loading = undefined;

	function init(){
		if(isInited) return;
		isInited = true;

		loading = FW.require('scripts/Components/loading/loading')();
		loading.Init('#art');

		prepareDom();
	};

	function prepareDom(){
		var html = '<div id="art-cont">'
		 		 +		'<div id="art-prev"></div>'
		 		 +		'<div id="art-next"></div>'
		 		 +		'<div id="art-stop"></div>'
				 +		'<div id="art-main">'
				 +			'<div id="art-main-move"></div>'
				 +		'</div>'
				 + '</div>'
				 +	'<div id="art-title">'
				 +		'<div id="art-title-img"></div>'
				 +		'<div id="art-title-text"></div>'
				 +	'</div>';

		$('#art').append(html);
	};

	function perpareArtShow() {
		FW.Configure.runtime.artDomReady = true;	
		$('#help').children().not('#help-back').hide();
		$('#help-back').show();

		$('#art').fadeIn(300);
		$('#art').removeClass('fadeOutRight');
		$('#art').addClass('animated fadeInRight');
		artBack();
	};

	art.show = function(){
		perpareArtShow();
		
		if(lastRenderedArtid == FW.Configure.runtime.pm.c) return;
		lastRenderedArtid = FW.Configure.runtime.pm.c;

		$('#art-main-move').html('');
		$('#art-title-text').html('');
		refineArtData();
	};


	art.hide = function(){
		art.Stop();
		$('#art').fadeOut(300);
		$('#art').removeClass('fadeInRight');
		$('#art').addClass('fadeOutRight');
		FW.Configure.runtime.artDomReady = false;
	};

	function renderMain (data) {
		$('#art-main-move').html('');
		chapters = [];
		// data.unshift ({
		// 			type: 'text',
		// 			value: '上下切换段落左右切换正文'
		// 		  });

		for (var i = 0; i < data.length; i++) {
            if (data[i] != undefined && data[i].type == 'text') {
            	var text = '<p class="art-main-p">'
            	var sentence = data[i].value.split(SECTENCE);
            	var symbols = data[i].value.match(SECTENCE);
            	symbols = !symbols ? [] : symbols;

            	var st = [], inner = '', j = 0;
        		
        		for (j = 0; j < symbols.length && j< sentence.length; j++) {
        			sentence[j] = sentence[j].replace(/\s+/ig, '');

        			if (sentence[j] != '') {
    					inner += '<span class="art-main-span">' + sentence[j] + '</span>';
    					st.push(sentence[j]);
    					inner += symbols[j];
        			}
        		}

        		for (;j < sentence.length; j++) {
        			sentence[j] = sentence[j].replace(/\s+/ig, '');
        			if (sentence[j] != '') {
        				inner += '<span class="art-main-span">' + sentence[j] + '</span>';
    					st.push(sentence[j]);
        			}
        		}

        		text += inner;
        		text += '</p>';

        		if (st && st.length > 0) {
        			$('#art-main-move').append(text);
                	chapters.push(st);
        		}
            }
        }

        // $('.art-main-p').eq(0)
        // 				.css({'visibility': 'hidden',
	    			// 		  'width': '1px', 
	    			// 		  'height' : '1px'
	    			// 		});
      	mainClick();
      	changeArtClick();
     	art.Start();
	};

	function renderCata (data) {
		$('#art-title-text').html('');
		
		var html =  '<p title="'+data+'">'
				 +		data
				 +  '</p>'
		$('#art-title-text').append(html);
	};

/*****************优化数据****************/
	function refineArtData(id) {
		var ct = undefined, mt = [], cache = undefined,
			re = /\s+/g;
		
		loading.Begin();
		time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Dataline.LoadArticle(FW.Configure.runtime.pm.a, FW.Configure.runtime.pm.c).then(function(res){
			if(!res.data || !res.success){
				return;
			} else {
				loading.Stop();
				clearTimeout(time);	
			}

			FW.Configure.runtime.art = res;
			ct = res.data;
			
			if(!ct.art || ct.art.length == 0) return;
			cache = ct.art;

        	cache = cache.replace(/(&gt;)/ig,">").replace(/(&lt;)/ig,"<").replace(/(&nbsp;)/ig,"").replace(/(&rdquo;)/ig,"");
        	cache = cache.split(TRANSFORMER);
        	for (var i in cache) {
        		if (cache[i] != '') {
        			cache[i] = cache[i].replace(/(&ldquo;)/ig,"").replace(/<\s*img[^<>]*>/ig,"");
        			mt.push(cache[i]);
        		}
        	}
        	
        	getChapters(mt);
			renderCata(ct.name);
		});
	};

	function getChapters(e) {
		var 
            cache = [], g, str, length, pt = 60, num;

        for (var i=0; i<e.length; i++) {
	    	e[i] = e[i].replace(/\s+/ig, '');
	        length = e[i].length;
	        num = Math.ceil(length / pt);

	    	if (e[i].length > pt) {
	    		for (g=0; g< num; g++) {
	                str = e[i].substr(g*pt, pt);
	                if (str.length == 1 && SECTENCE.test(str)) {
	                    cache[cache.length-1]+str;
	                } else {
	                    cache.push({type: 'text', value: str});
	                }
	            }
	    	} else {
	    		cache.push({type: 'text', value: e[i]});
	    	}
        }

        renderMain(cache);
	};

	var 
        PAGENUM = 0,
        LISTCOUNT = 10,
        artID;

	function findCurrentArtId(type) {
		var	artIdMask = false;
			artID = undefined;

		FW.Dataline.LoadList(FW.Configure.runtime.pm.a, FW.Configure.runtime.pm.b, PAGENUM, LISTCOUNT).then(function(res){
			if (!res.success || !res.data) return;

			for (var i in res.data) {
				if (type == 'next') { 
					if (artIdMask) {
						artID = res.data[i].id;
						if (artID) {
							location.hash = '#/art/' + FW.Configure.runtime.pm.a + '/' + FW.Configure.runtime.pm.b + '/' + artID;
						}
						return;
					}

					if (res.data[i].id == FW.Configure.runtime.pm.c) {
						artIdMask = true;
					}	
				} else if (type == 'prev') { 
					if (res.data[i].id == FW.Configure.runtime.pm.c) {
						artIdMask = true;
						if (artID) {
							location.hash = '#/art/' + FW.Configure.runtime.pm.a + '/' + FW.Configure.runtime.pm.b + '/' + artID;
						}
						return;
					}	

					if (!artIdMask) {
						artID = res.data[i].id;
					}
				}
			}
		});
	};

	function artMove() {
    	var top = 0, height = 0, i=0;
		var index = $('.art-chapter-foucs').index();
		if (index == 0) {
			top = 0;
		} else {
			for (i=0; i< index; i++) {
				height = $('.art-main-p:eq('+i+')').height();
				top += height;
			}
		}
		
		$('#art-cont').animate({scrollTop: top}, 500);
    };

   	/*********************各种click***********************/
	function changeArtClick() {
		$('#art-prev').off('click').on('click', function() {
			art.Stop();
			switch(FW.Configure.runtime.webkind){
				case 'art':
					findCurrentArtId('prev');
					break;
				case 'sart':
					break;
			};
		});

		$('#art-next').off('click').on('click', function() {
			art.Stop();
			switch(FW.Configure.runtime.webkind){
				case 'art':
					findCurrentArtId('next');
				break;
				case 'sart':
				break;
			};
		});
		
		$('#art-stop').off('click').on('click', function() {
			art.Stop();
		});
	};

	function mainClick() {
		$('.art-main-p').off('click').on('click', function() {
			art.Pause();

			$('.art-main-p').removeClass('art-chapter-foucs');
			$(this).addClass('art-chapter-foucs');
			$('.art-main-span').removeClass('art-sentence-foucs');
			$(this).find('span').eq(0).addClass('art-sentence-foucs');
			chapterId = $(this).index();
			sentenceId = 0;
			artMove();
			art.Start();
		});
	};

	function artBack() {
		$('#help-back').off('click').on('click', function() {
			if (FW.Configure.runtime.webkind == 'art') {
				art.hide();
				location.hash = '#/' + 'list/' + FW.Configure.runtime.pm.a + '/' + FW.Configure.runtime.pm.b;
				return;
			}
		});
	};

	/*********************阅读部分*************************/ 
	var	
	    YRAPI = YX.Read,
		chapters = [],
	    chaptersLength,
	    chapterId = 0,
	    sentenceId = 0,
	    artcomplete = false,
	    artpointer = undefined;

    art.Start = function () {
    	YRAPI.Stop();
		FW.Configure.runtime.continueRead = true;
   		readArticleFromChapter();
    };

    art.Stop = function() {
    	if (artpointer) {
    		clearTimeout(artpointer);
    		artpointer = undefined;
    	}

        chaptersLength;
	    chapterId = 0;
	    sentenceId = 0;
	    artcomplete = false;

        $('#art-cont').scrollTop(0);
        FW.Configure.runtime.continueRead = false;
       
        YRAPI.UnContinueRead();
        YRAPI.Stop();
    };

    art.Pause = function() {
    	if (artpointer) {
    		clearTimeout(artpointer);
    		artpointer = undefined;
    	}

        YRAPI.UnContinueRead();
        YRAPI.Stop();
    };

    function readArticleFromChapter() {
    	var currentChapter, nextChapter;
        chaptersLength = chapters.length - 1;

      	currentChapter = chapters[chapterId][sentenceId];

        if (chapterId > chaptersLength) {
           	nextChapter = null;
        }
        else {
        	if (sentenceId >= chapters[chapterId].length -1) {
        		if (chapterId >= chaptersLength) {
        			nextChapter = null;
        		}
        		else {
        			nextChapter = chapters[chapterId+1][0];
        		}
        	} else {
        		nextChapter = chapters[chapterId][sentenceId+1];
        	}
        }
       	
       	currentSentenceFoucs(currentChapter);
       	artMove();

       	// console.log(currentChapter);
       	// console.log(nextChapter);
 		if (!FW.Configure.runtime.introductionDomReady) {
        	YRAPI.ContinueRead(currentChapter, nextChapter, null, SetCurrentReadingIndex,true, null);
 		}

 		if (nextChapter) {
 			var sp = currentChapter.length > 20 ? (currentChapter.length / 2 * 1000) : currentChapter.length;
 			sp = sp <= 5 ? 5 : sp;
 			startFix(sp*1000);
 		} else {
 			if (artpointer) {
 				clearTimeout(artpointer);
 				artpointer = undefined;
 			}
 			artcomplete = true;
 		}
    };

    function startFix(sp) {
    	artpointer = setTimeout(function() {
    		SetCurrentReadingIndex();
    	}, sp);
    };

    function SetCurrentReadingIndex() {
    	if (artpointer) {
    		clearTimeout(artpointer);
    		artpointer = undefined;
    	}

        if (chapterId <= chaptersLength) {
        	if (sentenceId >= chapters[chapterId].length - 1) {
        		 chapterId++;
        		 sentenceId = 0;
        		 if (chapterId > chaptersLength) {
        		 	SetCurrentReadingIndex();
        		 	return;
        		 }

        	} else {
        		sentenceId++;
        	}	
        }
        else {
            chapterId = 0;
            art.Stop();
            return;
        }

        readArticleFromChapter();
    };

    function currentSentenceFoucs () {
    	var 
    		p = $($('.art-main-p')[chapterId]),
    		span = $($('.art-main-p')[chapterId]).find('span').eq(sentenceId);
      	
    	$('.art-main-p').removeClass('art-chapter-foucs');	
        p.addClass('art-chapter-foucs');

       	$('.art-main-span').removeClass('art-sentence-foucs');	
       	span.addClass('art-sentence-foucs');
    };

    init();

	return art;
});