;
if(typeof(undefined) == typeof(FW)) FW = {};

FW.define(undefined,
	['scripts/Components/loading/loading'
	, 'scripts/views/introduction'
	, 'scripts/views/set'
	, 'scripts/keyboard'], 'scripts/views/navigation', function(){
	var
		navigation = new Component('scripts/views/navigation');
	
	var
		isInited = false,
		lastNaviFID = -1,
		runtimeData = undefined;

	var 
		loading = undefined,
		keyboard = undefined,  
		introduction = undefined, 
		set = undefined;

	function init(){
		if(isInited) return;
		isInited = true;
		prepareDom();

		introduction = FW.require('scripts/views/introduction')();
		introduction.init();

		set = FW.require('scripts/views/set')();
		set.init();

		keyboard = FW.require('scripts/keyboard')();
		keyboard.init();

		loading = FW.require('scripts/Components/loading/loading')();
		loading.Init('#navigation-limit');

		helpClick();
	};

	function prepareDom(){
		var html = '<div id="navigation-logo">'
				 + '</div>'
				 + '<div id="navigation-limit" class="clearfix">'
				 +     '<ul id="navigation-cata">'
				 +			'<li class="pointer_reader" index="1" sys="news">资讯联播</li>'
				 +			'<li class="pointer_reader" index="2" sys="sites">整体网站</li>'
				 +			'<li class="pointer_reader" index="3" sys="affairs">办事服务</li>'
				 +			'<li class="pointer_reader" index="3" sys="files">文件服务</li>'
				 + 	   '</ul>'
				 +	   '<ul id="navigation-list">'
				 +     '</ul>'
				 + '</div>';

		$('#navigation').append(html);
	};

	navigation.show = function(args){
		if (lastNaviFID == FW.Configure.runtime.pm.a) return;
		lastNaviFID = FW.Configure.runtime.pm.a;

		FW.Configure.runtime.navigationDomReady = false;
		if (!FW.Configure.runtime.pm.a) {
			FW.Configure.runtime.pm.a = 'news';
			location.hash = '#/' + 'navigation/' + FW.Configure.runtime.pm.a;
			return;
		} else {
			cataFoucs();
			renderList();
		}
	};

	function renderList() {
		loading.Begin();
		var time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Dataline.LoadDepend(FW.Configure.runtime.pm.a).then(function(res){
			if (!res.success || !res.data) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);
				runtimeData = res;
			}

			var 
				data = res.data,
				offset = $('.navigation-cata-focus').index() * $('.navigation-cata-focus').width();
				if (res.sortkey) var sort = res.sortkey.split(',');
			
			$('#navigation-list').html('');

			if (sort) {
				for (var i=0; i<sort.length; i++) {
					var html = '<li id="'+data[sort[i]].id+'" class="pointer_reader">'
						 	 +		data[sort[i]].name
						 	 +	'</li>'

					$('#navigation-list').append(html);
				}
			} else {
				for (var i in data) {
					var html = '<li id="'+data[i].id+'" class="pointer_reader">'
						 	 +		data[i].name
						 	 +	'</li>'

					$('#navigation-list').append(html);
				}
			}

			$('#navigation-list').animate({
				'left': offset + 'px'
			}, 300);

			$('#navigation-list').find('li').eq(0).addClass('navigation-list-focus');

			cateClick();
			listClick();

			FW.Configure.runtime.navigationDomReady = true;
			FW.Sound.resetPointerReader();
		});
	};

	function cateClick() {
		$('#navigation-cata').find('li').off('click').on('click', function() {
			FW.Configure.runtime.pm.a = $(this).attr('sys');
			location.hash = '#/' + 'navigation/' + FW.Configure.runtime.pm.a;
				return;
		});
	};

	function cataFoucs() {
		$('#navigation-cata').find('li').removeClass('navigation-cata-focus');
		$('#navigation-cata').find('li').each(function(){		
			if($(this).attr('sys') == FW.Configure.runtime.pm.a){
				$(this).addClass('navigation-cata-focus');
			}
		});
	};

	function listClick() {
		$('#navigation-list').find('li').off('click').on('click', function() {
			$('#navigation-list').find('li').removeClass('navigation-list-focus');
			$(this).addClass('navigation-list-focus');
			
			var id = $(this).attr('id');
			location.hash = '#/' + 'column/' + FW.Configure.runtime.pm.a + '/' + id;
				return;
		});
	};

	/***************侧边设置栏****************/
	function helpClick() {
		$('#help-introduction').off('click').on('click', function() {
			$('#art-stop').trigger('click');
			var mask = $('#introduction').css('display');
			if (mask == 'none') {
				set.hide();
				introduction.show();
			} else if (mask == 'block') {
				introduction.hide();
			}
		});

		$('#help-set').off('click').on('click', function() {
			$('#art-stop').trigger('click');
			var mask = $('#set').css('display');
			if (mask == 'none') {
				set.show();
				introduction.hide();
			} else if (mask == 'block') {
				set.hide();
			}
		});

		$('#help-vol').off('click').on('click', function() {
			if (FW.Configure.setting.volSwitch) {
				YX.Read.SetVolume(0);
				FW.Configure.setting.volSwitch = false;
				$(this).css({'background-position': '0 -256px'});

			} else if (!FW.Configure.setting.volSwitch){

				YX.Read.SetVolume(50);
				FW.Configure.setting.volSwitch = true;
				$(this).removeClass('help-vol-foucs');
				$(this).css({'background-position': '0 -194px'});
			}
		});

		$('#help-introduction').off('mouseenter').on('mouseenter', function() {
			$('#help-introduction-float').fadeIn();
			FW.Sound.clickReader('帮助');
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-introduction-float').fadeOut();
		});

		$('#help-vol').off('mouseenter').on('mouseenter', function() {
			$('#help-vol-float').fadeIn();
			FW.Sound.clickReader('声音');	
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-vol-float').fadeOut();
		});	

		$('#help-set').off('mouseenter').on('mouseenter', function() {
			$('#help-set-float').fadeIn();
			FW.Sound.clickReader('设置');
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-set-float').fadeOut();
		});

		$('#help-back').off('mouseenter').on('mouseenter', function() {
			$('#help-back-float').fadeIn();
			FW.Sound.clickReader('返回');
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-back-float').fadeOut();
		});

		$('#help-desk').off('mouseenter').on('mouseenter', function() {
			$('#help-desk-float').fadeIn();
			FW.Sound.clickReader('下载客户端');
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-desk-float').fadeOut();
		});
	};

	init();

	return navigation;
});