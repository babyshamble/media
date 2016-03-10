;
if(typeof(undefined) == typeof(FW)) FW = {};

FW.define(undefined, ['scripts/Components/loading/loading'
	,'scripts/Components/move/move'], 'scripts/views/column', function(){
	var
		column = new Component('scripts/views/column');
	
	var
		isInited = false,
		lastColumnFID = -1,
		runtimeData = undefined;

	var move = undefined, loading = undefined;

	var 
		itemWidth = 400
		,itemHeight = 310
		,spacing = 40
		,time = false
		,shiningTimer1 = false
		,shiningTimer2 = false;

	function init(){
		if(isInited) return;
		isInited = true;
		prepareDom();

		move = FW.require('scripts/Components/move/move')();
		loading = FW.require('scripts/Components/loading/loading')();
		loading.Init('#fmovie');
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
	};

	function perpareColumnShow() {
		FW.Configure.runtime.columnDomReady = false;

		$('#help').children().not('#help-back').hide();
		$('#help-back').show();
		$('#fmovie').fadeIn(300);
		$('#fmovie').removeClass('fadeOutRight');
		$('#fmovie').addClass('animated fadeInRight');
		columnBack();
	};

	column.show = function(args){
		perpareColumnShow();

		if (lastColumnFID == FW.Configure.runtime.pm.b) return;
		lastColumnFID = FW.Configure.runtime.pm.b;
		renderCata();
	};

	column.hide = function() {
		$('#fmovie').fadeOut(300);
		$('#fmovie').removeClass('fadeInRight');
		$('#fmovie').addClass('fadeOutRight');		
	};

	function renderCata() {
		loading.Begin();
		var time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Dataline.LoadUnknown(FW.Configure.runtime.pm.a, FW.Configure.runtime.pm.b).then(function(res){
			$('#fmovie-cata-move').html('');
			$('#fmovie-main-move').html('');
			
			if(!res.data || !res.success){
				return;
			} else {
				loading.Stop();
				clearTimeout(time);

				runtimeData = res.data;
				if (res.sortkey) var sort = res.sortkey.split(',');
				createCate(runtimeData, sort);
				renderMain();
			}
		});
	};
	
	function renderMain() {
		var 
			id = $('.fmovie-cata-e-foucs').attr('did'),
			end = runtimeData[id].end, 
			data = runtimeData[id].data;
			if (runtimeData[id].sortkey) var sort = runtimeData[id].sortkey.split(',');
			$('#fmovie-main-move').html('');


		switch(end){
			case 1: // 以栏目样式展现
					createColumn(data, sort);
				break;
			case 0: // 以列表样式展现
					createList(data);
				break;
		}

		mainFoucs();
		mainClick();
		FW.Sound.resetPointerReader();
		FW.Configure.runtime.columnDomReady = true;
	};

/**
*******************主体展现方式*********************
****主体有两种展现方式1. 栏目 2. 列表 
****根据end值判断
**/
	
	function createCate(data, sort) {
		$('#fmovie-cata-move').html('');
		if (sort) {
			for (var i=0; i<sort.length; i++) {
				var html = '<li class="fmovie-cata-e pointer_reader" did="'+data[sort[i]].id+'" end="'+data[sort[i]].end+'">'
					 	 +		data[sort[i]].name
					 	 +	'</li>'

				$('#fmovie-cata-move').append(html);
			}
		} else {
			for (var i in data) {
				var html =  '<li class="fmovie-cata-e pointer_reader" did="'+data[i].id+'" end="'+data[i].end+'">'
						 +		data[i].name
						 +  '</li>'
				$('#fmovie-cata-move').append(html);
			}
		}
		
		cateFoucs();
		move.tmove($('#fmovie-cata-move'),'80', $('.fmovie-cata-e-foucs'));	
		cateClick();
		FW.Sound.resetPointerReader();
	};

	function createColumn(data, sort) {
		var index = 0, mf = 0;
		move.lmove($('#fmovie-main-move'), $('.fmovie-main-e:eq(0)'));
		
		if (sort) {
			for (var i=0; i<sort.length; i++) {
				mf = mainItemLeftOffset(index++);
				var html = '<li class="fmovie-main-e pointer_reader" did="'+data[sort[i]].id+'" end=1 style="left:'+mf+'px;">'
						 +		'<table>'
						 +			'<tbody>'
						 +				'<tr>'
						 +					'<td>'
						 +						data[sort[i]].name
						 +					'</td>'
						 +				'</tr>'
						 +			'</tbody>'
						 +		'</table>'
						 +  '</li>'

				$('#fmovie-main-move').append(html);
			}
		} else {
			for (var i in data) {
				mf = mainItemLeftOffset(index++);
				var html =  '<li class="fmovie-main-e pointer_reader" did="'+data[i].id+'" end=1 style="left:'+mf+'px;">'
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
		}
	};

	function createList(data) {
		var index = 0, mf = 0;
		move.lmove($('#fmovie-main-move'), $('.fmovie-main-e:eq(0)'));

		var html = '<li class="fmovie-main-e pointer_reader" end=0 style = "left:'+mf+'px;" >'
					 +		'<table>'
					 +			'<tbody>'
					 +				'<tr>'
					 +					'<td>'
					 +						'点击进入列表'
					 +					'</td>'
					 +				'</tr>'
					 +			'</tbody>'
					 +		'</table>'
					 +  '</li>';

		$('#fmovie-main-move').append(html)
	};

/*
*****************************各种 click **  foucs *******************************/
	function cateFoucs(b) {
		$('#fmovie-cata-move').find('li').each(function() {
			var did = $(this).attr('did');
			if (did == FW.Configure.runtime.pm.b) {
				$(this).addClass('fmovie-cata-e-foucs');
			}
		});
	};

	function cateClick () {
		$('#fmovie-cata-move').off('click', 'li').on('click', 'li', function() {
			var did = $(this).attr('did');
			if (did == lastColumnFID) return;
			lastColumnFID = did;

			$('.fmovie-cata-e').removeClass('fmovie-cata-e-foucs');
			$(this).addClass('fmovie-cata-e-foucs');
		
			move.tmove($('#fmovie-cata-move'),'80', $('.fmovie-cata-e-foucs'));
			$('#fmovie-main-move').animate({left :'0px'}).hide();
			$('#fmovie-main-move').fadeIn(100);
			cataMoveRemind($(this));

			renderMain();
		});	
	};

	function  mainFoucs(cont) {
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
	};

	function mainItemLeftOffset (index) {
		return index * (itemWidth + spacing);
	};

	function mainClick() {
		$('#fmovie-main-move').off('click', 'li').on('click', 'li', function() {

			if ($(this).hasClass('fmovie-main-e-foucs')) {
				var 
					end = $(this).attr('end'),
					id = $(this).attr('did');
					if (id == lastColumnFID) return;

				if (end == '1') {
					location.hash = '#/' + 'column/' + FW.Configure.runtime.pm.a + '/' + id;
						return;
				} else if (end == '0') {
					location.hash = '#/' + 'list/' + FW.Configure.runtime.pm.a + '/' + lastColumnFID;
						return;
				}
			} 
			
			move.lmove($('#fmovie-main-move'), $(this));
			mainFoucs($(this));
			mainMoveRemind($(this));
		});
	};

	function columnBack() {
		$('#help-back').off('click').on('click', function() {
			if (FW.Configure.runtime.webkind != 'column') return;

			loading.Begin();
			var time = setTimeout(function() {
	            loading.Stop();
	        }, 8000);

			FW.Dataline.LoadGrand(FW.Configure.runtime.pm.a, FW.Configure.runtime.pm.b).then(function(res){
				if(!res.success){
					return;
				} else {
					loading.Stop();
					clearTimeout(time);

					if (!res.data) {
						column.hide();
						location.hash = '#/' + 'navigation/' + FW.Configure.runtime.pm.a;
						return;
					} else {						
						location.hash = '#/' + 'column/' + FW.Configure.runtime.pm.a + '/' + res.pid;
						return;		
					}
				}
			});
		});
	};

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
	};

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

	init();

	return column;
});