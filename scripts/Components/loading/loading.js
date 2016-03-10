if(typeof(undefined) == typeof(FW)) FW = {};
if(typeof(undefined) == typeof(FW.UI)) FW.UI = {};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components = {};

FW.define(undefined, undefined, 'scripts/Components/loading/loading', function(){
	var
		instance = this,
		currentIndex = 0,
		currentPointer = undefined,
		identity = 0,
		isStop = false;

	var
		__container = 'body',
		__circle_time_ = 6,
		__single_time_ = 1;

	var
		loading = new Widget('scripts/Components/loading/loading');

	loading.Init = function(contain){
		if(contain) __container = contain;
		identity = (new Date()).getMilliseconds()*Math.ceil(Math.random()*12)*Math.ceil(Math.random()*100);

		prepareDom();
	};

	function prepareDom(){
		var html =	'<div class="load_loading" id="load-loading-'+identity+'" style="display:none;">'
				 +	'<div class="load_loading_container" style="display:none;">'
				 +		'<span class="load_loading_span" style="left:0;"></span>'
				 +		'<span class="load_loading_span" style="left:16px;"></span>'
				 +		'<span class="load_loading_span" style="left:32px;"></span>'
				 +		'<span class="load_loading_span" style="left:48px;"></span>'
				 +		'<span class="load_loading_span" style="left:64px;"></span>'
				 +	'</div>'
				 +	'<div id="loading-gif"></div>'
				 +	'</div>';

		$(__container).append(html);
	};

	function reset(){
		var len = $('.load_loading_container>span').length;
		for(var i=0; i<len; i++){
			$($('.load_loading_container>span')[i]).css({'left': i*16 + 'px'});
		}
	};

	function slide(){
		if(isStop) return;

		if(currentIndex < 0){
			currentIndex = $('.load_loading_container>span').length - 1;
			reset();
		}

		if(currentIndex >= $('.load_loading_container>span').length){
			currentIndex = $('.load_loading_container>span').length - 1;
			reset();
		}

		var cur = $($('.load_loading_container>span')[currentIndex]).position().left;
		cur += 32;
		$($('.load_loading_container>span')[currentIndex]).animate({left: cur+"px"}, 500, 'linear', function(){
			currentIndex--;
			currentPointer = setTimeout(slide, 500);
		});
	};

	loading.Begin = function(){
		isStop=false;
		$('#load-loading-'+identity).css({'display': 'block'});
	};
	
	loading.Stop = function(){
		isStop = true;

		if(currentPointer){
			clearTimeout(currentPointer);
			currentPointer = undefined;
		}

		$('#load-loading-'+identity).css({'display': 'none'});
	};

	loading.Clear = function(){
		$('#load-loading-'+identity).remove();
	};

	return loading;
});