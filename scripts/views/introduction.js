;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, undefined , 'scripts/views/introduction', function(){
	var
		introduction = new Framework('scripts/views/introduction');

	var isInited = false;

	var	
	    YRAPI = YX.Read,
		chapters = [],
	    chaptersLength,
	    chapterId = 0,
	    artcomplete = false,
	    artpointer = undefined;

	introduction.init = function () {
		if(isInited) return;
		isInited = true;
		prepareDom();
		clickEvents();
	};

	function prepareDom () {
		var html = '<div id="introduction-cont">'
				 +		'<div id="introduction-cont-move">'

				 + 			'<p class="introduction-item" id="introduction-title">系统说明</p>'

				 + 			'<p  class="introduction-item">大字幕影音系统通过提供鼠标、键盘和人机语音多种操作方式，简洁的交互界面，信息的大字幕和影音化。</p>'
				 + 			'<p  class="introduction-item">帮助严重视力障碍人群，阅读能力下降的老年人群，以及低文化人群无障碍获取信息和服务。</p>'
				 +			'<p  class="introduction-item">主要服务有信息服务、键盘操作和语音操作。</p>'
				 +			'<p  class="introduction-item">第一项：信息服务</p>'
			     +			'<p  class="introduction-item">一、资讯中心：为用户提供及时的中央人民政府及本系统最新、最热门的信息。</p>'
			     +			'<p  class="introduction-item">二、整体网站：用户可以在系统内可以便捷的完整浏览系统各网站网页信息。</p>'
				 +			'<p  class="introduction-item">三、办事服务：一站式办事大厅，用户可以方便得到政府各部门的办事服务。</p>'
				 +			'<p  class="introduction-item">第一项：键盘操作</p>'
				 +			'<p  class="introduction-item">浏览信息</p>'

				 +			'<p  class="introduction-item">操作上下左右键，是将焦点在屏幕当前信息的上下左右之间移动；</p>'

				 +			'<p  class="introduction-item">空格键是打开当前焦点的正文信息窗口，或关闭已打开的正文信息窗口；</p>'
				 +			'<p  class="introduction-item">功能快捷键</p>'
				 +			'<p  class="introduction-item">按shift加左键，返回到上一步。</p>'
				 +			'<p  class="introduction-item">按shift加下键，打开或关闭设置；</p>'
				 +			'<p  class="introduction-item">按shift加右键，打开或关闭帮助；</p>'
				 +			'<p  class="introduction-item">按shift加上键，打开或关闭声音；</p>'
				 +			'<p  class="introduction-item">按Ctrl加左键，语速减慢；</p>'
				 +			'<p  class="introduction-item">按Ctrl加右键，语速加快；</p>'
				 +			'<p  class="introduction-item">按Ctrl加上键，声音增高；</p>'
				 +			'<p  class="introduction-item">按Ctrl加下键，声音降低。</p>'
				 +			'<p  class="introduction-item">第二项：语音操作</p>'
				 +			'<p  class="introduction-item">常规操作命令如下：</p>'
				 +			'<p  class="introduction-item">登录系统：“我要上网”或“系统名称”；</p>'
				 +			'<p  class="introduction-item">退出系统：“我要休息”或“下次再见”；</p>'
				 +			'<p  class="introduction-item">操作焦点：命令上、下、左、右，鼠标焦点会根据命令进行相应的移动；打开和关闭：打开或关闭当前焦点的窗体。</p>'
				 +			'<p  class="introduction-item">提示：需要下载客户端，支持windows7以下操作系统，使用台式计算机的用户需安装麦克风。</p>'
				 + 		'</div>'
				 + '</div>';

		$('#introduction').append(html);

		$('.introduction-item').each(function(){
			var text = $(this).text();
			chapters.push(text);
		});

		chaptersLength = chapters.length - 1;
	};

	introduction.show = function () {
		$('#introduction').fadeIn(300);
		$('#introduction').removeClass('fadeOutRight');
		$('#introduction').addClass('animated fadeInRight');

		chaptersLength = chapters.length - 1;
		
		var timer = setTimeout(function() {
			readArticleFromChapter();
		}, 1000);
	
		FW.Configure.runtime.introductionDomReady = true;
	};

	introduction.hide = function () {
		$('#introduction').fadeOut(300);
		$('#introduction').removeClass('fadeInRight');
		$('#introduction').addClass('fadeOutRight');

		removeFoucsClass();	
		FW.Configure.runtime.introductionDomReady = false;
		introduction.stop();
	};

	introduction.stop = function() {
		if (artpointer) {
    		clearTimeout(artpointer);
    		artpointer = undefined;
    	}
    	
        chaptersLength = 0;
	    chapterId = 0;
	    artcomplete = false;
        YRAPI.UnContinueRead();
        YRAPI.Stop();
	}

	function clickEvents () {
		$('.introduction-item').off('click').on('click', function() {
			YRAPI.UnContinueRead();
        	YRAPI.Stop();

			removeFoucsClass();
			$(this).addClass('reader-foucs');
			chapterId = $(this).index();
			introductionItemMove();
			readArticleFromChapter();
		});
		
	};

	function removeFoucsClass() {
		$('#introduction-cont-move p').removeClass('reader-foucs');
	};

	function introductionItemMove () {
		var top = 0, height = 0, i=0;
		var index = $('.reader-foucs').index();

		if (index == 0) {
			top = 0;
		} else {
			for (i=0; i< index; i++) {
				height = $('.introduction-item:eq('+i+')').height() + 10;
				top += height;
			}
		}

		$('#introduction-cont').animate({scrollTop: top}, 500);
	};


/*********************阅读部分*************************/ 

	function readArticleFromChapter() {
		var
			currentChapter, nextChapter;

      	currentChapter = chapters[chapterId];

        if (chapterId > chaptersLength) {
           	nextChapter = null;
        }
        else {
        	nextChapter = chapters[chapterId+1];
        }
      
 		YRAPI.ContinueRead(currentChapter, nextChapter, null, SetCurrentReadingIndex,true, showFunc);
 		
 		currentSentenceFoucs(currentChapter);
 		introductionItemMove();

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

    function showFunc(text) {
    	// console.log(text);
    }

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

        if (chapterId < chaptersLength) {
        	chapterId++;	
        }
        else {
            chapterId = 0;
            YRAPI.UnContinueRead();
       		YRAPI.Stop();
            return;
        }

        readArticleFromChapter();
    };

    function currentSentenceFoucs () {
    	var 
    		p = $('.introduction-item:eq('+chapterId+')');
      	
    	$('.introduction-item').removeClass('reader-foucs');	
       	p.addClass('reader-foucs');
    };

	return introduction;
});
