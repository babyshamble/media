;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, ['scripts/keyboard'
					 , 'scripts/views/introduction'
					 ,'scripts/views/art'
					 ,'scripts/views/set'] , 'scripts/views/help', function(){
	var
		help = new Framework('scripts/views/help');
	
	var isInited = false;

	var	
		introduction = undefined,
        keyboard = undefined,
        art = undefined
        set = undefined;

	help.init = function () { 
		if(isInited) return;
		isInited = true;

		keyboard = FW.require('scripts/keyboard')();
		keyboard.init();

		art = FW.require('scripts/views/art')();
		art.init();

		set = FW.require('scripts/views/set')();
		set.init();

		introduction = FW.require('scripts/views/introduction')();
		introduction.init();

		prepareDom();
		clickEvents();
	};

	function prepareDom () {
		var html = '<div id="help-back"></div>'
				 + '<div id="help-back-float">返回到上一步，请按shift再加左键</div>'
				 + '<div id="help-introduction"></div>'
				 + '<div id="help-introduction-float">打开或关闭帮助，请按shift再加右键</div>'
				 + '<div id="help-set"></div>'
				 + '<div id="help-set-float">打开或关闭设置，请按shift再加下键</div>'
				 + '<div id="help-vol-off"></div>'
				 + '<div id="help-vol-float">打开或关闭声音，请按shift再加上键</div>'
				 + '<div id="help-desk"></div>';
		
		$('#help').append(html);
	};


	function clickEvents () {
		$('#help-introduction').off('click').on('click', function() {
			$('#art-stop').trigger('click');
			var mask = $('#introduction').css('display');
			if (mask == 'none') {
				set.hide();
				introduction.show();
			} else if (mask == 'block') {
				introduction.hide();
			}
			keyboard.reader('帮助');
		});

		$('#help-introduction').off('mouseenter').on('mouseenter', function() {
			$('#help-introduction-float').fadeIn();
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-introduction-float').fadeOut();
		});	

		$('#help-set').off('click').on('click', function() {
			var mask = $('#set').css('display');
			if (mask == 'none') {
				set.show();
				introduction.hide();
			} else if (mask == 'block') {
				set.hide();
			}
			keyboard.reader('设置');
		});

		$('#help-set').off('mouseenter').on('mouseenter', function() {
			$('#help-set-float').fadeIn();
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-set-float').fadeOut();
		});	

		$('#help-vol-off').off('click').on('click', function() {
			if (FW.Configure.setting.volSwitch) {
				YX.Read.SetVolume(0);
				FW.Configure.setting.volSwitch = false;
				$(this).addClass('help-vol-foucs');
			} else if (!FW.Configure.setting.volSwitch){
				YX.Read.SetVolume(50);
				FW.Configure.setting.volSwitch = true;
				$(this).removeClass('help-vol-foucs');
			}
		});

		$('#help-vol-off').off('mouseenter').on('mouseenter', function() {
			$('#help-vol-float').fadeIn();		
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-vol-float').fadeOut();
		});	

		$('#help-set').off('mouseenter').on('mouseenter', function() {
			$('#help-set-float').fadeIn();
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-set-float').fadeOut();
		});

		$('#help-back').off('mouseenter').on('mouseenter', function() {
			$('#help-back-float').fadeIn();
		}).off('mouseleave').on('mouseleave', function() {
			$('#help-back-float').fadeOut();
		});	
	};

	return help;
});
