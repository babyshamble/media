
if(typeof(undefined) == typeof(FW)) FW={};
if(typeof(undefined) == typeof(FW.keyboard)) FW.keyboard={};

FW.define(undefined, undefined , 'scripts/keyboard', function(){
	var
		keyboard = new Framework('scripts/keyboard');

	var timer,
		ticker,
		keyAccess = true;
	
	function tick() {
		if (ticker) {
			clearInterval(ticker);
		}
		ticker = setInterval(function() {
			keyAccess = true;
		}, 100);
	};

	keyboard.init = function(){
		tick();

		$(document).off('keydown').on('keydown', function(ev){
			var e = window.event || ev;
			var key = ev.which || ev.keyCode;

			if (!keyAccess) {
				return;
			}

			keyAccess = false;

			if(timer){
				clearTimeout(timer);				
			}

			timer = setTimeout(function() {
				// 左
				if (ev.keyCode == 37) {
					// 返回 shift
					if (ev.keyCode == 37 && ev.shiftKey) {
						$('#help-back').trigger('click');
						return;
					}

					// 语速慢 
					if (ev.keyCode == 37 && ev.ctrlKey) {
						var dom = $('#volspeed-down-text');
						dom.trigger('click');
						return;
					}

					// navigation
					if (FW.Configure.runtime.webkind == 'navigation' && FW.Configure.runtime.navigationDomReady){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.navigation-cata-focus').prev();
							if (dom && dom.length!= 0) {
								dom.trigger('click');
								FW.Sound.clickReader(dom.text());
							}
						}
					}

					// column
					if (FW.Configure.runtime.webkind == 'column' && FW.Configure.runtime.columnDomReady){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.fmovie-main-e-foucs').prev();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());
								}
							}	
					}

					// tmovie
					if (FW.Configure.runtime.webkind == 'tsite' || FW.Configure.runtime.webkind == 'toffice' || FW.Configure.runtime.webkind == 'tnews' && FW.Configure.runtime.tmovieDomReady){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.tmovie-main-e-foucs').prev();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());
								}
							}
					}

					// 下篇文章
					if (FW.Configure.runtime.webkind == 'art' || FW.Configure.runtime.webkind == 'sart'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('#art-prev');
							dom.trigger('click');
						}
					}
				} 

				// 右
				if (ev.keyCode == 39) {
					
					// 帮助页
					if (ev.keyCode == 39 && ev.shiftKey) {
						var dom = $('#help-introduction');
						dom.trigger('click');
						return;
					}

					// 语速快 ctrl
					if (ev.keyCode == 39 && ev.ctrlKey) {
						$('#volspeed-up-text').trigger('click');
						return;
					}

					// navigation
					if (FW.Configure.runtime.webkind == 'navigation' && FW.Configure.runtime.navigationDomReady) {
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.navigation-cata-focus').next();
							if (dom && dom.length!= 0) {
								dom.trigger('click');
								FW.Sound.clickReader(dom.text());
							}
						}
					}

					// column
					if (FW.Configure.runtime.webkind == 'column' && FW.Configure.runtime.columnDomReady){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.fmovie-main-e-foucs').next();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());
								}
							}
					}

					// tmovie
					if (FW.Configure.runtime.webkind == 'tsite' || FW.Configure.runtime.webkind == 'toffice' || FW.Configure.runtime.webkind == 'tnews' && FW.Configure.runtime.tmovieDomReady){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.tmovie-main-e-foucs').next();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());
								}
							}
					}

					// 上篇文章
					if (FW.Configure.runtime.webkind == 'art' || FW.Configure.runtime.webkind == 'sart'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('#art-next');
							dom.trigger('click');
						}
					}

				}

				// 上
				if (ev.keyCode == 38) {
					// 打开关闭声音
					if (ev.keyCode == 38 && ev.shiftKey) {
						var dom = $('#help-vol');
						dom.trigger('click');
						return;
					}

					// 声音大
					if (ev.keyCode == 38 && ev.ctrlKey) {
						var dom = $('#volsize-up-text');
						dom.trigger('click');
						return;
					}

					// navigation
					if (FW.Configure.runtime.webkind == 'navigation' && FW.Configure.runtime.navigationDomReady) {
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.navigation-list-focus').prev();
							if (dom && dom.length!= 0) {
								$('#navigation-list li').removeClass('navigation-list-focus');
								dom.addClass('navigation-list-focus');
								FW.Sound.clickReader(dom.text());
							}
						}
					}

					// column
					if (FW.Configure.runtime.webkind == 'column' && FW.Configure.runtime.columnDomReady){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.fmovie-cata-e-foucs').prev();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());		
								}
							}
					}

					// tmovie
					if (FW.Configure.runtime.webkind == 'tsite' || FW.Configure.runtime.webkind == 'toffice' || FW.Configure.runtime.webkind == 'tnews'){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.tmovie-cata-e-foucs').prev();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());	
								}
							}
					}

					// list
					if (FW.Configure.runtime.webkind == 'list'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.list-main-e-foucs').prev();
							if (dom && dom.length!= 0) {
								dom.trigger('click');	
								FW.Sound.clickReader(dom.text());
							}
						}
					}

					// art
					if (FW.Configure.runtime.webkind == 'art' || FW.Configure.runtime.webkind == 'sart'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.art-chapter-foucs').prev();
							if (dom && dom.length!= 0) {
								dom.trigger('click');
							}
						}
					}

					// introductionDomReady
					if (FW.Configure.runtime.introductionDomReady){ 
						var dom = $('.reader-foucs').prev();
						if (dom && dom.length!= 0) {
							dom.trigger('click');	
						}
					}
				}

				// 下
				if (ev.keyCode == 40) {
					// 打开关闭设置
					if (ev.keyCode == 40 && ev.shiftKey) {
						var dom = $('#help-set');
						dom.trigger('click');
						return;
					}

					//  声音小
					if (ev.keyCode == 40 && ev.ctrlKey) {
						var dom = $('#volsize-down-text');
						dom.trigger('click');
						return;
					}

					// navigation
					if (FW.Configure.runtime.webkind == 'navigation' && FW.Configure.runtime.navigationDomReady) {
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.navigation-list-focus').next();
							if (dom && dom.length!= 0) {
								$('#navigation-list li').removeClass('navigation-list-focus');
								dom.addClass('navigation-list-focus');
								FW.Sound.clickReader(dom.text());	
							}
						}
					}

					// column
					if (FW.Configure.runtime.webkind == 'column' && FW.Configure.runtime.columnDomReady){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.fmovie-cata-e-foucs').next();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());
								}
							}
					}

					// list
					if (FW.Configure.runtime.webkind == 'list'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.list-main-e-foucs').next();
							if (dom && dom.length!= 0) {
								dom.trigger('click');	
								FW.Sound.clickReader(dom.text());
							}
						}
					}

					// art
					if (FW.Configure.runtime.webkind == 'art' || FW.Configure.runtime.webkind == 'sart'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.art-chapter-foucs').next();
							if (dom && dom.length!= 0) {
								dom.trigger('click');
							}
						}
					}

					// tmovie
					if (FW.Configure.runtime.webkind == 'tsite' || FW.Configure.runtime.webkind == 'toffice' || FW.Configure.runtime.webkind == 'tnews'){
							if (!FW.Configure.runtime.introductionDomReady) {
								var dom = $('.tmovie-cata-e-foucs').next();
								if (dom && dom.length!= 0) {
									dom.trigger('click');
									FW.Sound.clickReader(dom.text());
								}
							}
					}

					// introductionDomReady
					if (FW.Configure.runtime.introductionDomReady){ 
						var dom = $('.reader-foucs').next();
						if (dom && dom.length!= 0) {
							dom.trigger('click');	
						}
					}
				}	

				// 空格 或 回车 打开
				if (ev.keyCode == 32 || ev.keyCode == 13) {
					// navigation
					if (FW.Configure.runtime.webkind == 'navigation' && FW.Configure.runtime.navigationDomReady){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.navigation-list-focus');
							dom.trigger('click');
							FW.Sound.clickReader(dom.text());
						}
					}

					// column
					if (FW.Configure.runtime.webkind == 'column' && FW.Configure.runtime.columnDomReady){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.fmovie-main-e-foucs');
							dom.trigger('click');
							FW.Sound.clickReader(dom.text());
						}
					}

					// tmovie
					if (FW.Configure.runtime.webkind == 'tsite' || FW.Configure.runtime.webkind == 'toffice' && FW.Configure.runtime.tmovieDomReady){
						if (!FW.Configure.runtime.introductionDomReady) { 
							var dom = $('.tmovie-main-e-foucs');
							dom.trigger('click');
							FW.Sound.clickReader(dom.text());
						}
					}

					// list
					if (FW.Configure.runtime.webkind == 'list'){
						if (!FW.Configure.runtime.introductionDomReady) {
							var dom = $('.list-main-e-foucs');
							dom.trigger('click');
						}
					}

					// art
					if (FW.Configure.runtime.webkind == 'nart' || FW.Configure.runtime.webkind == 'oart' || FW.Configure.runtime.webkind == 'sart'){
						if (!FW.Configure.runtime.introductionDomReady) {
							
						}
					}

				}

			}, 100);
		});
	};

	return keyboard;
});
