;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, ['scripts/Components/loading/loading'], 'scripts/views/list', function(){
	var
		list = new Framework('scripts/views/list');

	var
		isInited = false
		,lastRenderedListid = -1;
	
	var loading = undefined;

	function init() {
		if(isInited) return;
		isInited = true;
		prepareDom();
		bindEvents();

		loading = FW.require('scripts/Components/loading/loading')();
		loading.Init('#list');
	};

	function prepareDom() {
		var html = '<div id="list-cont">'
				+		'<div id="list-main">'
				+			'<ul id="list-main-move" >'
				+				'<div id="list-more">加载更多</div>'
				+			'</ul>'
				+		'</div>'
				+ '</div>';

		$('#list').html(html);
	};

	function prepareListShow() {
		$('#help').children().not('#help-back').hide();
		$('#help-back').show();
		
		$('#list').fadeIn(300);
		$('#list').removeClass('fadeOutRight');
		$('#list').addClass('animated fadeInRight');
		listBack();
	};

	list.show = function(){
		prepareListShow();
		if (lastRenderedListid == FW.Configure.runtime.pm.b) return;
		lastRenderedListid = FW.Configure.runtime.pm.b;
		
		$('#list-more').show();
		renderList();
	};

	list.hide = function(){
		$('#list').fadeOut(300);
		$('#list').removeClass('fadeInRight');
		$('#list').addClass('fadeOutRight');
		$('#list').scrollTop(0);
	};

	var 
        PAGENUM = 0,
        LISTCOUNT = 10;

	function renderList (data) {
		loading.Begin();
		var time = setTimeout(function() {
            loading.Stop();
        }, 8000);

		FW.Dataline.LoadList(FW.Configure.runtime.pm.a, FW.Configure.runtime.pm.b, PAGENUM, LISTCOUNT).then(function(res){
			$('#list-main-move').children().not('#list-more').remove();
			if (!res.success || !res.data) {
				return;
			} else {
				loading.Stop();
				clearTimeout(time);

				var data = res.data;
				PAGENUM = 0;
       			LISTCOUNT = 10;

				createList(data);
				listFoucs();
			}
		});
	};

	function createList(data) {
		for (var i in data) {
			var html = '<li class="list-main-e pointer_reader" did="'+data[i].id+'">'
					 +	'·'+	data[i].name
				     + '</li>';

			$('#list-more').before(html);
		}

		listClick();
		FW.Sound.resetPointerReader();
	};

/********************* click && Foucs ***********************/
	function listFoucs() {
		$('.list-main-e').removeClass('list-main-e-foucs');
		if (FW.Configure.runtime.pm.e && FW.Configure.runtime.pm.e != -1) {
			$('#list-main-move').find('li').each(function() {
				var did = $(this).attr('did');
				if (did == FW.Configure.runtime.pm.e) {
					$(this).addClass('list-main-e-foucs');
				}
			});
		} else {
			$('.list-main-e:eq(0)').addClass('list-main-e-foucs');
		}		
	};

	function listClick() {
		$('#list-main-move').off('click', 'li').on('click', 'li', function() {
			var did = $(this).attr('did');

			if ($(this).hasClass('list-main-e-foucs')) {
				var id = $(this).attr('did');
				location.hash = '#/' + 'art/' + FW.Configure.runtime.pm.a + '/' + FW.Configure.runtime.pm.b + '/' + id;
						return;
			}
			else {
				$('.list-main-e').removeClass('list-main-e-foucs');
				$(this).addClass('list-main-e-foucs');
				listMove();		
			}
		});
	};
	
	function listBack() {
		$('#help-back').off('click').on('click', function() {
			if (FW.Configure.runtime.webkind == 'list') {
				list.hide();
				location.hash = '#/' + 'column/' + FW.Configure.runtime.pm.a + '/' + FW.Configure.runtime.pm.b;
				return;
			}
		});
	};

	function listMove() {
		var top = 0;
		var index = $('.list-main-e-foucs').index();
		for (var i=0; i< index; i++) {
			var height = $('.list-main-e:eq('+i+')').height();
			top += height;
		}
		
		$('#list').animate({scrollTop: top}, 500);
	};

	function bindEvents() {
		$('#list-more').off('click').on('click', function() {
			FW.Dataline.LoadList(FW.Configure.runtime.pm.a, FW.Configure.runtime.pm.b, ++PAGENUM, LISTCOUNT).then(function(res){
                if (!res.success || !res.data) {
                	$('#list-more').hide();
                	return;
                } else {
                	createList(res.data);
                }
            });
		});
	};

	init();

	return list;
});