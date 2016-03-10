;
if(typeof(undefined) == typeof(FW)) FW={};

FW.define(undefined, undefined, 'scripts/Components/slider/slider', function(opts){
	var
		options = {
			'id': 0
			,'position': 0			//位置：0-横向 1-竖向
			,'step': 0				//动作：0-像素 1-分步
			,'chapter': true		//分段：在step==1时，控制显示分段
			,'callback': undefined	//移动回调函数
			,'target': undefined	//绑定的对象
			,'attribute': 0			//绑定的定位属性: 1-top, 2-left, 3-margin-top, 4-marigin-left
			,'correction': 0
		};

	for(var o in opts){
		if(options.hasOwnProperty(o)){
			options[o] = opts[o];
		}
	}

	var
		__container = 'body'
		,__width = 0
		,__height = 0
		,__bar_width = 0
		,__bar_height = 0
		,__ori_left = 0
		,__ori_top = 0;

	var
		sticking = false
		,stickPosition = {
			'x': undefined,
			'y': undefined
		}
		,delayPointer = undefined;

	var
		slider = new Widget('scripts/Components/slider/slider');

	slider.init = function(contain){
		if(contain) __container = contain;
		if(options.id == 0){
			options.id = (new Date()).getMilliseconds()*Math.ceil(Math.random()*100);
		}

		__width = $(__container).width();
		__height = $(__container).height();

		prepareDom();
		fix();
		bindEvents();
	};

	slider.show = function(){
		
	};

	function prepareDom(){
		var html = '<div id="slider-'+options.id+'" class="slider">'
				 + 		'<div class="slider_body">'
				 +			'<div class="slider_bar"></div>'
				 +			'<ul class="slider_chapters"></ul>'
				 +		'</div>'
				 +		'<span class="slider_block" id="slider-block-'+options.id+'"></span>'
				 + '</div>';

		$(__container).append(html);
	};

	function fix(){
		var min = 4, base = 0.1;
		if(options.position == 0){
			$('#slider-block-'+options.id).css({
				'min-width': min+'px',
				'width': (__width*base)+'px',
				'height': '100%',
				'top': '0',
				'left': '0'
			});

			var bw = $('#slider-block-'+options.id).width();

			$('#slider-'+options.id+'>.slider_body').css({
				'left': (bw/2)+'px',
				'top': '0',
				'height': '100%',
				'right': (bw/2)+'px'
			});
		}
		else if(options.position == 1){
			$('#slider-block-'+options.id).css({
				'min-height': min+'px',
				'height': (__height*base)+'px',
				'width': '100%',
				'left': '0',
				'top': '0'
			});

			var bh = $('#slider-block-'+options.id).height();

			$('#slider-'+options.id+'>.slider_body').css({
				'top': (bh/2)+'px',
				'left': '0',
				'width': '100%',
				'bottom': (bh/2)+'px'
			});		
		}

		__bar_width = $('#slider-'+options.id+'>.slider_body').width();
		__bar_height = $('#slider-'+options.id+'>.slider_body').height();
	};

	function compute(ev){
		var change = '0';
		var cp = 0;
		if(options.position == 0){
			var dx = ev.clientX - stickPosition.x;
			var nx = $('#slider-block-'+options.id).position().left;

			if(nx >= 0 && nx <= __bar_width && (__ori_left+dx) >= 0 && (__ori_left+dx) <= __bar_width){
				$('#slider-block-'+options.id).css({
					'left': (__ori_left+dx)+'px'
				});
			}

			change = (nx/__bar_width);
		}
		else if(options.position == 1){
			var dy = ev.clientY - stickPosition.y;
			var ny = $('#slider-block-'+options.id).position().top;

			if(ny >= 0 && ny <= __bar_height && (__ori_top+dy) >= 0 && (__ori_top+dy) <= __bar_height){
				$('#slider-block-'+options.id).css({
					'top': (__ori_top+dy)+'px'
				});
			}

			change = (ny/__bar_height);
		}

		if(options.target && $(options.target).length == 1 && options.attribute){
			var ps;

			switch(options.attribute){
				case 1:
					cp = $(options.target).height();
					ps = change*(cp - options.correction);
					$(options.target).css({
						'top': '-'+ps+'px'
					});	
					break;
				case 2:
					cp = $(options.target).width();
					ps = change*(cp - options.correction);
					$(options.target).css({
						'left': '-'+ps+'px'
					});	
					break;
				case 3:
					cp = $(options.target).height();
					ps = change*(cp - options.correction);
					$(options.target).css({
						'margin-top': '-'+ps+'px'
					});	
					break;
				case 4:
					cp = $(options.target).width();
					ps = change*(cp - options.correction);
					$(options.target).css({
						'margin-left': '-'+ps+'px'
					});	
					break;
			}
		}

		if(options.callback){
			options.callback(change);
		}
	};

	function reset(){
		stickPosition.x = undefined;
		stickPosition.y = undefined;

		__ori_left = 0;
		__ori_top = 0;
	};

	function bindEvents(){
		$(document).bind('mousemove', function(ev){
			if(sticking){
				compute(ev);
			}
		}).bind('mouseup', function(ev){
			sticking = false;
			reset();
		});

		$('#slider-block-'+options.id).unbind('mousedown').bind('mousedown', function(ev){
			if(!sticking){
				sticking = true;

				stickPosition.x = ev.clientX;
				stickPosition.y = ev.clientY;

				__ori_left = $('#slider-block-'+options.id).position().left;
				__ori_top = $('#slider-block-'+options.id).position().top;
			}
		}).unbind('mouseup').bind('mouseup', function(ev){
			sticking = false;
			reset();
		});

		$(__container).bind('mouseenter', function(ev){

		}).bind('mouseleave', function(ev){

		});

		$('#slider-'+options.id+' .slider_bar').bind('click', function(ev){
			__ori_left = $('#slider-block-'+options.id).position().left;
			__ori_top = $('#slider-block-'+options.id).position().top;

			
		});
	};

	return slider;
});