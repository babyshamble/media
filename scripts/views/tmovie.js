;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, ['scripts/Components/loading/loading','scripts/Components/move/move'], 'scripts/views/tmovie', function(){
	var
		tmovie = new Framework('scripts/views/tmovie');

	var
		isInited = false
		,lastRenderedCataid = -1
		,lastRenderedMainid = -1
		,cataClickMaskId = -1
		,time = false
		,itemWidth = 400
		,itemHeight = 310
		,spacing = 40;

	var move = undefined, loading = undefined;

	tmovie.init = function(){
		if(isInited) return;
		isInited = true;

		move = FW.require('scripts/Components/move/move')();

		loading = FW.require('scripts/Components/loading/loading')();
		loading.Init('#tmovie');

		prepareDom();
	};

	function prepareDom(){
		var html = '<div id="tmovie-cont">'
				 +		'<div id="tmovie-cata">'
				 +			'<div id="tmovie-cata-up"></div>'
				 +			'<ul id="tmovie-cata-move" ></ul>'
				 +			'<div id="tmovie-cata-down"></div>'
				 +		'</div>'
				 +		'<div id="tmovie-main">'
				 +			'<div id="tmovie-main-left"></div>'
				 +			'<ul id="tmovie-main-move" ></ul>'
				 +			'<div id="tmovie-main-right"></div>'
				 +		'</div>'
				 + '</div>';

		$('#tmovie').append(html);
	}

	tmovie.show = function(){
		$('#tmovie').fadeIn(300);
		$('#tmovie').removeClass('fadeOutRight');
		$('#tmovie').addClass('animated fadeInRight');		
	};

	tmovie.hide = function(){
		$('#tmovie').fadeOut(300);
		$('#tmovie').removeClass('fadeInRight');
		$('#tmovie').addClass('fadeOutRight');		
	};

	tmovie.getfocus = function(wk, a, b, c, d){	
		if(lastRenderedCataid == c && wk == 'tsite' || wk == 'slist') {
			return;
		}
	
		// if(lastRenderedCataid == c && !d && wk == 'toffice') {
		// 	return; 
		// }
		
		if(lastRenderedCataid == c && lastRenderedMainid == d && wk == 'toffice')  {
			return;
		}

		if(lastRenderedMainid == d && wk == 'olist')  {
			return;
		}

		// bindEvents();
		lastRenderedCataid = c;
		lastRenderedMainid = d;
		FW.Configure.runtime.tmovieDomReady = false;

		$('#tmovie-main-move').html('');
		$('#tmovie-cata-move').html('');

		switch(wk){
			case 'sart':
			case 'slist':
			case 'tsite':
				refineSiteData(b, c, tranSiteData);
				break;
			case 'oart':
			case 'olist':
			case 'toffice':
				refineOfficeData(c, d, tranOfficeData);
				break;
		}
	};

	function renderCata(data) {
		$('#tmovie-cata-move').html('');
		for (var i in data) {
			var html =  '<li class="tmovie-cata-e pointer_reader" did="'+data[i].id+'">'
					 +		data[i].name
					 +  '</li>'
			$('#tmovie-cata-move').append(html);
		}
		cataClick();
		cataFoucs();

		move.tmove($('#tmovie-cata-move'),'80', $('.tmovie-cata-e-foucs'));
		FW.Sound.resetPointerReader();
	};	

	function renderMain(data) {
		var index = 0, mf = 0;

		$('#tmovie-main-move').html('');
		$('#tmovie-main-move').css({left:0});

		for (var i in data) {
			mf = mainItemLeftOffset(index++);
			var html =  '<li class="tmovie-main-e pointer_reader" did="'+data[i].id+'" style = "left:'+mf+'px;">'
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
			$('#tmovie-main-move').append(html);
		}
		mainClick();
		mainFoucs();
		FW.Sound.resetPointerReader();

		FW.Configure.runtime.tmovieDomReady = true;
	};

	function mainItemLeftOffset (index) {
		return index * (itemWidth + spacing);
	}

/*********************各种click***********************/
	function cataClick () {
		$('#tmovie-cata-move').off('click', 'li').on('click', 'li',function() {
			var did = $(this).attr('did');
			if (did == cataClickMaskId) return;
			cataClickMaskId = did;
			switch(FW.Configure.runtime.webkind){
			case 'tsite':
				location.hash = '#/tsite/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + FW.Configure.runtime.pm.b
					  + '/'
					  + did;
				break;
			case 'toffice':
				location.hash = '#/toffice/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + FW.Configure.runtime.pm.b
					  + '/'
					  + FW.Configure.runtime.pm.c
					  + '/'
					  + did;
				break;
			}

			$('#tmovie-main-move').animate({left :'0'}).hide();
			$('#tmovie-main-move').fadeIn(100);				
			
			cataMoveRemind($(this));
		});	
	};

	function mainClick () {
		$('#tmovie-main-move').off('click', 'li').on('click', 'li', function() {
			if ($(this).hasClass('tmovie-main-e-foucs')) {
				var did = $(this).attr('did');
				switch(FW.Configure.runtime.webkind){
				case 'tsite':
					location.hash = '#/slist/'
						  + FW.Configure.runtime.pm.a
						  + '/'
						  + FW.Configure.runtime.pm.b
						  + '/'
						  + FW.Configure.runtime.pm.c
						  + '/'
						  + did;
					break;
				case 'toffice':
					location.hash = '#/oart/'
						  + FW.Configure.runtime.pm.a
						  + '/'
						  + FW.Configure.runtime.pm.b
						  + '/'
						  + FW.Configure.runtime.pm.c
						  + '/'
						  + FW.Configure.runtime.pm.d
						  + '/'
						  + did;
					break;
				}
			}

			move.lmove($('#tmovie-main-move'), $(this));
			mainFoucs($(this));
			mainMoveRemind($(this));
		});	
	}

	function bindEvents(){
		$('#help-back').off('click').on('click', function() {
			tmovie.hide();
			switch(FW.Configure.runtime.webkind){
			case 'tsite':
				location.hash = '#/site/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + FW.Configure.runtime.pm.b;
				break;
			case 'toffice':
				location.hash = '#/office/'
					  + FW.Configure.runtime.pm.a
					  + '/'
					  + FW.Configure.runtime.pm.b;
				break;
			}
			return;
		});
	};

	function cataFoucs(b) {
		$('#tmovie-cata-move').find('li').each(function() {
			var did = $(this).attr('did');
			switch(FW.Configure.runtime.webkind){
			case 'tsite':
			case 'slist':
			case 'sart':
				if (did == FW.Configure.runtime.pm.c) {
				$(this).addClass('tmovie-cata-e-foucs');
				}
				break;
			case 'toffice':
			case 'olist':
			case 'oart':
				if (did == FW.Configure.runtime.pm.d) {
				$(this).addClass('tmovie-cata-e-foucs');
				}
				break;
			}		
		});
	};

	function mainFoucs(cont) {
		var target = cont ? cont : $('.tmovie-main-e:eq(0)');
		var mf = mainItemLeftOffset(target.index());
		var index = $('.tmovie-main-e-foucs:eq(0)').index();

		$('.tmovie-main-e-foucs').removeClass('tmovie-main-e-foucs').css({
				top : '0',
				left: (index * (itemWidth + spacing)) + 'px',
				width: itemWidth,
				height: itemHeight,
				fontSize: '52px'
			}
		);

		target.addClass('tmovie-main-e-foucs').css({
			top : '-20px',
			left: (mf - 20) + 'px',
			width: (itemWidth + spacing) + 'px',
			height: (itemHeight + spacing) + 'px',
			fontSize: '60px'
		});
	}

	/*********************点击时的箭头提醒***********************/
	function cataMoveRemind (target) {
		var num = $('#tmovie-cata-move li').length - 1,
			index = target.index();

		if (index == 0) {
			downShining();
		} else if (index == num) {
			upShining();
		} else {
			upShining();
			downShining();
		} 
	};

	function mainMoveRemind (target) {
		var num = $('#tmovie-main-move li').length - 1,
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
		$('#tmovie-cata-down').fadeIn(300);
		$('#tmovie-cata-down').fadeOut(300);
	};

	function upShining () {
		$('#tmovie-cata-up').fadeIn(300);
		$('#tmovie-cata-up').fadeOut(300);
	};

	function leftShining () {
		$('#tmovie-main-left').fadeIn(300);
		$('#tmovie-main-left').fadeOut(300);
	};

	function rightShining () {
		$('#tmovie-main-right').fadeIn(300);
		$('#tmovie-main-right').fadeOut(300);
	};
/*****************优化数据****************/
	
	function refineSiteData(b, c, callback) {
		var ct, mt;

		loading.Begin();

		time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Datamap.Site.loadCates().then(function(res){
			if(!res || !res.success || !res.data)
			return;
			FW.Configure.runtime.site = res;
			callback(FW.Configure.runtime.site);
		});
	
		FW.Datamap.Site.loadMap(c).then(function(res){
			if(!res || !res.success || !res.data) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);	
			}

			mt = res.data;
			renderMain(mt);
		});
	};

	function tranSiteData(res) {
		var ct = res.data;
		for(var m in ct){
			ct = ct[m].metro;
			break;
		}
		
		ct = ct[FW.Configure.runtime.pm.b].grids;
		renderCata(ct);
	};

	function refineOfficeData(c, d, callback) {
		loading.Begin();

		time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Datamap.Office.loadList(c, null, null, null).then(function(res){
			if(!res || !res.success || !res.data) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);	
			}

			FW.Configure.runtime.officeMore = res;
			callback(FW.Configure.runtime.officeMore);
		});	
	};

	function tranOfficeData(res) {
		var ct = res.data,
			rdedata = [],
			mt, id, smalltypes;
	
		for (var i in ct) {
			smalltypes = ct[i].smalltypes;
			ct = ct[i].child;
			break;
		}
		
		switch(smalltypes){
			case '1503':
				for (var i in ct) {
					if (ct[i].smalltypes == '1503.001' || ct[i].smalltypes == '1503.002') {
						for (var d in ct[i].child) {
							rdedata[ct[i].child[d].id] = ct[i].child[d];
						}
					}
				}

				ct = rdedata;
				for (var i in ct) {
					id = ct[i].id;
					break;
				}
			break;
			default:
				for (var i in ct) {
					id = ct[i].id;
					break;
				}
			break;
		}

		if (FW.Configure.runtime.pm.d == -1 || !FW.Configure.runtime.pm.d) {
			if (id) {
				location.hash = '#/toffice/'
			  + FW.Configure.runtime.pm.a
			  + '/'
			  + FW.Configure.runtime.pm.b
			  + '/'
			  + FW.Configure.runtime.pm.c
			  + '/'
			  + id;
			}
		} else {
			mt = ct[FW.Configure.runtime.pm.d].data;
			renderCata(ct);
			renderMain(mt);
		}
	};

	return tmovie;
});