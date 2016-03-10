;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, undefined , 'scripts/views/set', function(){
	var
		set = new Framework('scripts/views/set');
	
	var isInited = false,
		theme = new FW.Theme();

	var
        YRAPI = YX.Read;

	set.init = function () { 
		if(isInited) return;
		isInited = true;
		prepareDom();
		clickEvents();
	};

	set.show = function () {
		$('#set').fadeIn(300);
		$('#set').removeClass('fadeOutRight');
		$('#set').addClass('animated fadeInRight');
		FW.Configure.runtime.setDomReady = true;
	};

	set.hide = function () {
		$('#set').fadeOut(300);
		$('#set').removeClass('fadeInRight');
		$('#set').addClass('fadeOutRight');
		FW.Configure.runtime.setDomReady = false;
	};

	function prepareDom () {
		var 
			html = '<div id="set-cont">'
				 + 		'<div id="volspeed">'
				 +       	'<div id="volspeed-main">'
				 +				'<div id="volspeed-down" class="clearfix">'
				 +					'<div class="vol-main-cont">'
				 +						'<div id="volspeed-down-text" class="pointer_reader">语速减慢</div>'
				 +						'<div id="volspeed-down-img"></div>'
				 +					'</div>'
		         +					'<div class="vol-key-right pointer_reader">Ctrl+左方向键</div>'
				 +				'</div>'

				 +				'<div id="volspeed-up" class="clearfix">'
				 +					'<div class="vol-main-cont">'
				 +						'<div id="volspeed-up-text" class="pointer_reader">语速加快</div>'
				 +						'<div id="volspeed-up-img">  </div>'
				 +					'</div>'
		         +					'<div class="vol-key-left pointer_reader">Ctrl+右方向键</div>'		
				 +				'</div>'
				 +			'</div>'
				 +		'</div>'

				 + 		'<div id="volsize">' 
				 +       	'<div id="volsize-main">'
				 +				'<div id="volsize-down" class="clearfix">'
				 +					'<div class="vol-main-cont">'
				 +						'<div id="volsize-down-text" class="pointer_reader">声音降低</div>'	
				 +						'<div id="volsize-down-img"></div>'
				 +					'</div>'
		         +					'<div class="vol-key-right pointer_reader">Ctrl+下方向键</div>'		
				 +				'</div>'
				 +				'<div id="volsize-up" class="clearfix">'
				 +					'<div class="vol-main-cont">'
				 +						'<div id="volsize-up-text" class="pointer_reader">声音增高</div>'
				 +						'<div id="volsize-up-img"></div>'
				 +					'</div>'
		         +					'<div class="vol-key-left pointer_reader">Ctrl+上方向键</div>'		
				 +				'</div>'
				 +			'</div>'
				 +		'</div>'
				 + 		'<div id="theme">' 
				 +       	'<div id="theme-main">'
				 +				'<div id="theme-white-cont">'
				 +					'<div id="theme-white" class="theme-foucs"></div>'
				 +					'<div id="theme-white-text">主题白</div>'
				 +				'</div>'
				 +				'<div id="theme-red-cont">'
				 +					'<div id="theme-red"></div>'
				 +					'<div id="theme-red-text">主题红</div>'
				 +				'</div>'
				 +				'<div id="theme-yellow-cont">'
				 +					'<div id="theme-yellow"></div>'
				 +					'<div id="theme-yellow-text">主题黄</div>'
				 +				'</div>'
				 + 			'</div>'
				 + 		'</div>' 
				 + '</div>';

		$('#set').append(html);
	};


	function clickEvents () {
		$('#volsize-up-text').off('click').on('click', function() {
			FW.Configure.setting.vol++;
			FW.Configure.setting.vol = FW.Configure.setting.vol > 9 ? 9 : FW.Configure.setting.vol;
			set.SetVolume(FW.Configure.setting.vol);
			
			if (FW.Configure.setting.vol == 9) {
				FW.Sound.clickReader('声音最大');
			} else {
				FW.Sound.clickReader('声音放大');
			}
		});

		$('#volsize-down-text').off('click').on('click', function() {
			FW.Configure.setting.vol--;
			FW.Configure.setting.vol = FW.Configure.setting.vol < 1 ? 1 : FW.Configure.setting.vol;
			set.SetVolume(FW.Configure.setting.vol);

			if (FW.Configure.setting.vol == 1) {
				FW.Sound.clickReader('声音最低');
			} else {
				FW.Sound.clickReader('声音降低');
			}
		});

		$('#volspeed-up-text').off('click').on('click', function() {
			FW.Configure.setting.speed++;
			FW.Configure.setting.speed = FW.Configure.setting.speed > 1 ? 1 : FW.Configure.setting.speed;
			set.SetSpeed(FW.Configure.setting.speed);

			if (FW.Configure.setting.speed == 1) {
				FW.Sound.clickReader('语速最快');
			} else {
				FW.Sound.clickReader('语速变快');
			}
		});

		$('#volspeed-down-text').off('click').on('click', function() {
			FW.Configure.setting.speed--;
			FW.Configure.setting.speed = FW.Configure.setting.speed < -1 ? -1 : FW.Configure.setting.speed;
			set.SetSpeed(FW.Configure.setting.speed);

			if (FW.Configure.setting.speed == -1) {
				FW.Sound.clickReader('语速最慢');
			} else {
				FW.Sound.clickReader('语速变慢');
			}
		});

		$('#volspeed-up-img').off('click').on('click', function() {
			$('#volspeed-up-text').trigger('click');
		});

		$('#volspeed-down-img').off('click').on('click', function() {
			$('#volspeed-down-text').trigger('click');
		});

		$('#volsize-up-img').off('click').on('click', function() {
			$('#volsize-up-text').trigger('click');
		});

		$('#volsize-down-img').off('click').on('click', function() {
			$('#volsize-down-text').trigger('click');
		});

		// 主题
		$('#theme-white').off('click').on('click', function() {
			$('#theme-main').find('div').removeClass('theme-foucs');
			$(this).addClass('theme-foucs');
			theme.release('re-red', 'background-color');
			theme.release('re-yellow', 'background-color');
		});

		$('#theme-red').off('click').on('click', function() {
			$('#theme-main').find('div').removeClass('theme-foucs');
			$(this).addClass('theme-foucs');
			theme.release('re-red', 'background-color');
			theme.release('re-yellow', 'background-color');
			theme.apply('re-red', 'background-color', 'styles/re-red.css');
		});

		$('#theme-yellow').off('click').on('click', function() {
			$('#theme-main').find('div').removeClass('theme-foucs');
			$(this).addClass('theme-foucs');
			theme.release('re-red', 'background-color');
			theme.release('re-yellow', 'background-color');
			theme.apply('re-yellow', 'background-color', 'styles/re-yellow.css');
		});

		$('#theme-white').off('mouseenter').on('mouseenter', function() {
			YX.Read.PointerRead('主题白');
		}).off('mouseleave').on('mouseleave', function() {
			YX.Read.Stop();
		});

		$('#theme-red').off('mouseenter').on('mouseenter', function() {
			YX.Read.PointerRead('主题红');
		}).off('mouseleave').on('mouseleave', function() {
			YX.Read.Stop();
		});

		$('#theme-yellow').off('mouseenter').on('mouseenter', function() {
			YX.Read.PointerRead('主题黄');
		}).off('mouseleave').on('mouseleave', function() {
			YX.Read.Stop();
		});	
	};

	set.SetVolume = function(val) {
        val *= 10;
        YRAPI.SetVolume(val);
    };

    set.SetSpeed = function(speed) {
        YRAPI.SetSpeed(speed);
    };

	return set;
});
