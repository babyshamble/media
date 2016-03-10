;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, 
	['scripts/Components/loading/loading'
	,'scripts/Components/move/move'], 'scripts/views/fmovie', function(){
	var
		fmovie = new Framework('scripts/views/fmovie');

	var
		isInited = false
		,lastRenderedFmovieid = -1
		,cataClickMaskId = -1
		,itemWidth = 400
		,itemHeight = 310
		,spacing = 40
		,time = false
		,shiningTimer1 = false
		,shiningTimer2 = false;


	var move = undefined, loading = undefined;

	fmovie.init = function(){
		if(isInited) return;
		isInited = true;

		move = FW.require('scripts/Components/move/move')();

		loading = FW.require('scripts/Components/loading/loading')();
		loading.Init('#fmovie');
		
		prepareDom();
	};

	function prepareDom(){
		var html = '<div id="fmovie-cont">'
				+		'<div id="fmovie-cata">'
				+			'<div id="fmovie-cata-up"></div>'
				+			'<ul id="fmovie-cata-move" ></ul>'
				+			'<div id="fmovie-cata-down"></div>'
				+		'</div>'
				+		'<div id="fmovie-main">'
				+			'<div id="fmovie-main-left"></div>'
				+			'<ul id="fmovie-main-move" ></ul>'
				+			'<div id="fmovie-main-right"></div>'
				+		'</div>'
				+ '</div>';

		$('#fmovie').append(html);
	}

	fmovie.show = function(){
		$('#help').children().not('#help-back').hide();
		$('#help-back').show();
		$('#fmovie').fadeIn(300);
		$('#fmovie').removeClass('fadeOutRight');
		$('#fmovie').addClass('animated fadeInRight');		
	};

	fmovie.hide = function(){
		$('#fmovie').fadeOut(300);
		$('#fmovie').removeClass('fadeInRight');
		$('#fmovie').addClass('fadeOutRight');		
	};

	fmovie.getfocus = function(wk, a, b){
		if(lastRenderedFmovieid == b) return;
		
		// bindEvents();
		lastRenderedFmovieid = b;
		FW.Configure.runtime.fmovieDomReady = false;
 		
 		$('#fmovie-cata-move').html('');
 		$('#fmovie-main-move').html('');
 		
		switch(wk){
			case 'nart':
			case 'news':
				refineNewData(b, tranNewData);
				break;
			case 'sart':
			case 'slist':
			case 'tsite':
			case 'site':
				refineSiteData(b, tranSiteData);
				break;
			case 'oart':
			case 'olist':
			case 'toffice':
			case 'office':
				refineOfficeData(b, tranOfficeData);
				break;
		}
	};

	function renderCata(data) {
		$('#fmovie-cata-move').html('');
		for (var i in data) {
			var html =  '<li class="fmovie-cata-e pointer_reader" did="'+data[i].id+'">'
					 +		data[i].name
					 +  '</li>'
			$('#fmovie-cata-move').append(html);
		}
		cataClick();
		cataFoucs();

		move.tmove($('#fmovie-cata-move'),'80', $('.fmovie-cata-e-foucs'));	
		FW.Sound.resetPointerReader();
	};	

	function renderMain(data) {
		var index = 0, mf = 0;

		$('#fmovie-main-move').html('');
		$('#fmovie-main-move').css({left:0});

		for (var i in data) {
			mf = mainItemLeftOffset(index++);
			var html =  '<li class="fmovie-main-e pointer_reader" did="'+data[i].id+'" style = "left:'+mf+'px;">'
					 +		'<table>'
					 +			'<tbody>'
					 +				'<tr>'
					 +					'<td>'
					 +						data[i].name
					 +					'</td>'
					 +				'</tr>'
					 +			'</tbody>'
					 +		'</table>'
					 +  '</li>'
			$('#fmovie-main-move').append(html);
		}

		mainClick();
		mainFoucs();
		FW.Sound.resetPointerReader();
		FW.Configure.runtime.fmovieDomReady = true;
	};

	function mainItemLeftOffset (index) {
		return index * (itemWidth + spacing);
	}
/*********************各种click***********************/
	function cataClick () {
		$('#fmovie-cata-move').off('click', 'li').on('click', 'li', function() {
			var did = $(this).attr('did');
			if (did == cataClickMaskId) return;
			cataClickMaskId = did;

			switch(FW.Configure.runtime.webkind){
			case 'news':
				location.hash = '#/news/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + did;
				break;
			case 'site':
				location.hash = '#/site/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + did;
				break;
			case 'office':
				location.hash = '#/office/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + did;
				break;
			}

			$('#fmovie-main-move').animate({left :'0px'}).hide();
			$('#fmovie-main-move').fadeIn(100);

			cataMoveRemind($(this));
		});	
	};

	function mainClick () {
		$('#fmovie-main-move').off('click', 'li').on('click', 'li', function() {
			if ($(this).hasClass('fmovie-main-e-foucs')) {
				var did = $(this).attr('did');
				switch(FW.Configure.runtime.webkind){
				case 'news':
					location.hash = '#/nart/'
						  + FW.Configure.runtime.pm.a
						  + '/'
						  + FW.Configure.runtime.pm.b
						  + '/'
						  + did;
					break;
				case 'site':
					location.hash = '#/tsite/'
						  + FW.Configure.runtime.pm.a
						  + '/'
						  + FW.Configure.runtime.pm.b
						  + '/'
						  + did;
					break;
				case 'office':
					location.hash = '#/toffice/'
						  + FW.Configure.runtime.pm.a
						  + '/'
						  + FW.Configure.runtime.pm.b
						  + '/'
						  + did;
					break;
				}
			}
		
			move.lmove($('#fmovie-main-move'), $(this));
			mainFoucs($(this));
			mainMoveRemind($(this));
		});
	}

	function bindEvents(){
		$('#help-back').off('click').on('click', function() {
			location.hash = '#/navigation/' + FW.Configure.runtime.pm.a;
			fmovie.hide();
			return;
		});
	};

	function cataFoucs(b) {
		$('#fmovie-cata-move').find('li').each(function() {
			var did = $(this).attr('did');
			if (did == lastRenderedFmovieid) {
				$(this).addClass('fmovie-cata-e-foucs');
			}
		});
	};

	function mainFoucs(cont) {
		var target = cont ? cont : $('.fmovie-main-e:eq(0)');
		var mf = mainItemLeftOffset(target.index());
		var index = $('.fmovie-main-e-foucs:eq(0)').index();

		$('.fmovie-main-e-foucs').removeClass('fmovie-main-e-foucs').css({
				top : '0',
				left: (index * (itemWidth + spacing)) + 'px',
				width: itemWidth,
				height: itemHeight,
				fontSize: '52px'
			}
		);

		target.addClass('fmovie-main-e-foucs').css({
			top : '-20px',
			left: (mf - 20) + 'px',
			width: (itemWidth + spacing) + 'px',
			height: (itemHeight + spacing) + 'px',
			fontSize: '60px'
		});
	}

/*********************点击时的箭头提醒***********************/
	function cataMoveRemind (target) {
		var num = $('#fmovie-cata-move li').length - 1,
			index = target.index();

		if (index == 0) {
			upShining();	
		} else if (index == num) {
			downShining();
		} else {
			upShining();
			downShining();
		} 
	};

	function mainMoveRemind (target) {
		var num = $('#fmovie-main-move li').length - 1,
			index = target.index();

		if (index == 0) {
			rightShining();
		} else if (index == num) {
			leftShining();
		} else {
			leftShining();
			rightShining();
		} 
	}

	function downShining () {
		$('#fmovie-cata-down').fadeIn(300);
		$('#fmovie-cata-down').fadeOut(300);
	};

	function upShining () {
		$('#fmovie-cata-up').fadeIn(300);
		$('#fmovie-cata-up').fadeOut(300);
	};

	function leftShining () {
		$('#fmovie-main-left').fadeIn(300);
		$('#fmovie-main-left').fadeOut(300);
	};

	function rightShining () {
		$('#fmovie-main-right').fadeIn(300);
		$('#fmovie-main-right').fadeOut(300);
	};

/*****************优化数据****************/
	function refineNewData(b, callback) {
		var ct, mt;

		loading.Begin();

		time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Datamap.News.loadCates().then(function(res){
			if(!res || !res.success || !res.data)
				return;

			FW.Configure.runtime.news = res;
			ct = callback(FW.Configure.runtime.news);
			renderCata(ct);
		});
				
		FW.Datamap.News.loadMore(b).then(function(res){
			if(!res) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);	
			}

			FW.Configure.runtime.newsMore = res;

			for (var d in res) {
				var mt = res[d];
				break;
			}
			renderMain(mt);
		});
	};

	function tranNewData(res) {
		var ct = res.data;
		for(var m in ct){
			ct = ct[m].metro;
			break;
		}
		return ct;
	};

	function refineSiteData(b, callback) {
		var ct, mt;

		loading.Begin();

		time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Datamap.Site.loadCates().then(function(res){
			if(!res || !res.success || !res.data) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);	
			}

			FW.Configure.runtime.site = res;
			callback(FW.Configure.runtime.site);
		});	
	};

	function tranSiteData(res) {
		var ct = res.data;
		for(var m in ct){
			ct = ct[m].metro;
			renderCata(ct);
			break;
		}
		
		var mt = ct[lastRenderedFmovieid].grids;
		renderMain(mt);
	};

	function refineOfficeData(b, callback) {
		var ct, mt;
		
		loading.Begin();

		time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Datamap.Office.loadCates().then(function(res){
			if(!res || !res.success || !res.data) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);	
			}

			FW.Configure.runtime.office = res;
			callback(FW.Configure.runtime.office);
		});
	};

	function tranOfficeData(res) {
		var ct = res.data;
		for (var i in ct) {
			ct = ct[i].child;
			renderCata(ct);
			break;
		}
		
		var mt = ct[lastRenderedFmovieid].child;
		FW.Configure.runtime.ochild = mt;
		renderMain(mt);
	};

	return fmovie;
});