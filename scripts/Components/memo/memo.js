if(typeof(undefined) == typeof(FW)) FW = {};
if(typeof(undefined) == typeof(FW.UI)) FW.UI = {};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components = {};

 //1:显示名称
 //2:显示图片
 //3:图文并茂
 //7:框中列表显示
 //8:框中方格显示
 //9:框中图片轮播

// 便签式展现
FW.define(undefined, undefined, 'scripts/Components/memo/memo', function(opts){
	var
		options = { 
			'bg_color': undefined	//自定义颜色，可能是列表
			,'topic': '办事服务'	//内容主题
			,'opacity': 1			//透明度
			,'data': undefined		//数据
			,'display': 'block'		//
			,'id': '1024'
			,'scroll': 0 			//0 在里面，1在外面，-1自动判断
			,'itemClick': undefined
			,'width': undefined
			,'height': undefined
		};

	var
		identity = 1
		,__container = 'body'
		,hasIntroFixed = false		//是否有图文形式
		,pointerListsOuter = undefined	//list的div在mouserout时，生成一个setTimeout
		,__container_height = 0
		,__container_width = 0
		,__context_fontsize = 14		//简介字体大小
		,__context_lineheight = 20;		//简介行间距

	var
		$memo_container = undefined
		,$memo_main = undefined
		,$memo_header = undefined
		,$memo_scroll = undefined
		,$memo_container_main = undefined;

	var
		memo = new Widget('scripts/Components/memo/memo');

	var
		fixedTimeoutPointer = undefined
		,fixedInTimeoutPointer = undefined;

	for(var o in opts){ 
		if(options.hasOwnProperty(o)){ 
			options[o] = opts[o];
		}
	}

	memo.Init = function(contain, d){ 
		if(!d) options.data = datame;
		else options.data = d;
		identity = (new Date()).getTime();//options.id ? options.id : (new Date()).getTime();

		if(contain) __container = contain;
		__container_width = options.width ? options.width : $(__container).width();
		__container_height = options.height ? options.height : $(__container).height();

		if(__container_height < 150 || __container_width < 150){
			__context_lineheight = 18;
			__context_fontsize = 12;
		}

		prepareDom();
	};

	memo.Show = function(){
		createInnerDom();
		bindEvents();
	};

	function prepareDom(){
		var memo_switch_container_ul_height = FW.Helper.computeObjectLength(options.data)*__container_width;
		var html =	'<div class="memo_container" id="memo-container-' + identity + '">'
				 +		'<div class="memo_container_header solid_top2bottom" id="memo-container-header-' + identity + '"></div>'
				 +		'<div class="memo_container_main" id="memo-container-main-' + identity + '"><ul class="memo_switch_container" style="width: '+memo_switch_container_ul_height+'px;"></ul></div>'
				 +		'<div class="memo_container_scroll" id="memo-container-scroll-' + identity+ '"></div>'
				 +	'</div>';

		$(__container).append(html);

		$memo_container = $('#memo-container-' + identity);
		$memo_container.css({ 
				'opacity': options.opacity
		});

		$memo_main = $('#memo-container-main-' + identity + '>ul');
		$memo_container_main = $('#memo-container-main-' + identity);
		$memo_header = $('#memo-container-header-' + identity);
		$memo_scroll = $('#memo-container-scroll-' + identity);
	};

	function bindEvents(){
		//memo自带翻页
		$('#memo-container-scroll-' + identity + '>.memo_scroll_element').bind('click', function(ev, istrigger){ 
			var index = $(this).attr('did');
			if(index){ 
				$('#memo-container-scroll-' + identity + '>.memo_scroll_focus').removeClass('memo_scroll_focus');
				$(this).addClass('memo_scroll_focus');
				
				$memo_main.animate({left: '-' + index * $memo_container_main.width() + 'px'}, 600);
			}
		});

		//列表mouseover动态生成翻页按钮
		$('.memo_container_main_p_list').bind('mouseenter', function(ev){
			if(!$(this).is('.memo_container_main_p_list_focus') && !$(this).is('.memo_container_main_p_list_focus_son')){
				$(this).addClass('memo_container_main_p_list_focus');
				var father = $(this).attr('id');
				var fatherHeight = $(this).height();
				var pages = Math.ceil($('#'+father+'>ul').height()/fatherHeight);
				var html = '<div class="memo_inner_lists_scroll" id="'+father+'-'+'ghost"'
						 + ' style="height: '+pages*16+'px; margin-top: -'+(pages*16/2)+'px;">';
				
				var inner = '';
				for(var p=0; p<pages; p++){
					if(p == -1) inner += '<span class="memo_inner_lists_scroll_e_focus';
					else inner += '<span class="';
					inner += ' memo_inner_lists_scroll_e"';
					inner += ' did="' + p;
					inner += '"></span>';
				}
				html += inner;
				html += '</div>';

				$('#'+father).append(html);

				dynamicBind(father, ' .memo_inner_lists_scroll_e', 'click', dynamicListsScrollCallback);
				dynamicBind(father, ' .memo_inner_lists_scroll_e', 'mouseover', dynamicListsScrollOverCallback);
				dynamicBind(father, ' .memo_inner_lists_scroll_e', 'mouseout', dynamicListsScrollOuterCallback);
			}
		}).bind('mouseleave', function(ev){
			if($(this).is('.memo_container_main_p_list_focus') && !$(this).is('.memo_container_main_p_list_focus_son')){
				$(this).removeClass('memo_container_main_p_list_focus');
				var target = this;
				pointerListsOuter = setTimeout(function(){
					var father = $(target).attr('id');
					if(!$(target).is('.memo_container_main_p_list_focus')
						&& !$(target).is('.memo_container_main_p_list_focus_son')){						
						var $listScroll = $('#'+father+'>.memo_inner_lists_scroll');
						$listScroll.remove();
					}
					pointerListsOuter = undefined;
				},20);
			}
		});

		$('.memo_container_main_p_title').unbind('click').bind('click', function(ev){
			memo.dispatch(this, 'click');
		});

		$('.memo_container_main_p_context').unbind('click').bind('click', function(ev){
			memo.dispatch(this, 'click');
		});

		$('.memo_inner_blocks_b').unbind('click').bind('click', function(ev){
			memo.dispatch(this, 'click');
		});

		$('.memo_container_main_p_fixed').unbind('click').bind('click', function(ev){
			memo.dispatch(this, 'click');
		});

		$('.memo_container_main_p_list li').unbind('click').bind('click', function(ev){
			memo.dispatch(this, 'click');
		});
	};

	//function 

	//动态绑定的列表翻页mouseover事件
	function dynamicListsScrollOverCallback(ev, target){
		var father = $(target.parentElement.parentElement).attr('id');
		$('#'+father).addClass('memo_container_main_p_list_focus_son');
		$('#'+father).addClass('memo_container_main_p_list_focus');

		if(!$(target).is('.memo_container_main_p_list_son_focus')){
			$(target).addClass('memo_container_main_p_list_son_focus');
		}
		
		if(pointerListsOuter){
			clearTimeout(pointerListsOuter);
			pointerListsOuter = undefined;
		}
	};

	//动态绑定的列表翻页mouseout事件
	function dynamicListsScrollOuterCallback(ev, target){
		var father = $(target.parentElement.parentElement).attr('id');
		$('#'+father).removeClass('memo_container_main_p_list_focus_son');

		if($(target).is('.memo_container_main_p_list_son_focus')){
			$(target).removeClass('memo_container_main_p_list_son_focus');
		}
	};

	//动态绑定的列表翻页click事件
	function dynamicListsScrollCallback(ev, target){
		var father = $(target.parentElement.parentElement).attr('id');
		
		if(target && !$('#'+father+'>ul').is('.memo_lists_scrolling') && target.parentElement){
			var did = $(target).attr('did');
			var fatherHeight = $('#'+father).height();
			var offset_top = did*fatherHeight;
			$('#'+father+'>ul').addClass('memo_lists_scrolling');
			$('#'+father+'>ul').animate({'margin-top': '-'+offset_top+'px'}, 300, 'linear', function(){
				$(this).removeClass('memo_lists_scrolling');
			});

			//$('#'+$(target.parentElement).attr('id')+'>.memo_inner_lists_scroll_e_focus').removeClass('memo_inner_lists_scroll_e_focus');
			//$(target).addClass('memo_inner_lists_scroll_e_focus');
		}
	};

	//生成动态数据的dom
	function createInnerDom(){
		var index = 0, outerhtml = '';
		var innerHeight = $memo_container_main.height();
		var innerWidth = $memo_container_main.width();
		innerWidth = __container_width;
		innerHeight = __container_height;

		$memo_header.text(options.topic);

		for(var o in options.data){
			var style = options.data[o].effect ? options.data[o].effect : '2';
			style = style == 0 ? '1' : style;
			var html = '<li class="memo_switch_container_li ' + (index == 0 ? 'memo_swicth' : '') + '" style="width:' + innerWidth + 'px;">';
			var dynamic = [];

 //1:显示名称
 //2:标题+简介
 //3:图文并茂
 //5:自定义html
 //7:列表
 //8:方格

			switch(style.toString()){
				case '3':
					$memo_header.css('display', 'none');
					var inner = createFixed(index, options.data[o].id, options.data[o].imgs, options.data[o].name, options.data[o].url);
					html += inner[0];
					dynamic = inner[1];
					break;
				case '2':
					$memo_header.css('display', 'none');
					html += createContext(index, options.data[o].id, options.data[o].name, options.data[o].text, options.data[o].url);
					break;
				case '7':
					html += createList(index, options.data[o].id, FW.Helper.object2Array(options.data[o].data));
					break;
				case '1':
					html += createTitle(index, options.data[o].id, options.data[o].name, options.data[o].url);
					$memo_header.css('display', 'none');
					break;
				case '8':
					$memo_header.css('display', 'none');
					var inner = createBlocks(index, options.data[o].id, FW.Helper.object2Array(options.data[o].data), 2, 2);
					html += inner[0];
					dynamic = inner[1];	//blocks的翻页所需参数
					break;
				case '5':
					//$memo_header.css('display', 'none');
					//if(options.data[o].html) html += options.data[o].html
					html += createInnerHtml(index, options.data[o].id, options.data[o].html);
					break;
				default:
					break;
			}

			html += '</li>';

			if(html.length > 0){ 
				$memo_main.append(html);
			}

			if(style.toString() == '3'){
				var image = dynamic[2];//options.data[o].imgs;
				dynamicLoadImage(dynamic[0], image, dynamicLoadImageCallback);
				dynamicBindFixedEvents(dynamic[0]);
			}

			if(dynamic && dynamic.length > 2){
				//动态绑定blocks的翻页功能
				dynamicBind(dynamic[0], '>.'+dynamic[1], dynamic[2], dynamicBlocksScrollCallback);
			}

			index++;
		}

		if(index > 1){ 	//memo自带翻页
			for(var i=0; i<index; i++){
				var inner = '';
				if(i == 0) inner += '<span class="memo_scroll_focus';
				else inner += '<span class="'
				inner += ' memo_scroll_element"';
				inner += ' did="' + i
				inner += '"></span>';

				$memo_scroll.append(inner);
			}

			$memo_scroll.css('margin-left', '-' + $memo_scroll.width()/2 + 'px' );
			if(hasIntroFixed){ 
				$memo_scroll.css('bottom', '-16px');
			}
		}
	};

	//随机色
	function randomColor(){
		var i = Math.floor(Math.random()*6);
		return 'memo_rd_color'+i;
	};

	//异步加载图片
	function dynamicLoadImage(id, src, cb){
		var loader = new window.Image();

		//加载完成
		loader.onload = function(ev){
			var success = false;
			if(loader.naturalWidth && loader.naturalWidth > 0){
				success = true;
			}
			else if(loader.readyState){	//ie
				success = true;
			}

			cb(success, id, loader.src);
		};

		loader.onerror = function(ev){
			cb(false, id);
		};

		loader.onabort = function(ev){
			cb(false, id);
		};

		loader.src = src;
	};

	//异步加载图片成功回调函数
	function dynamicLoadImageCallback(success, id, src){
		if(success){
			$('#'+id).css({
				'background-image': 'url('+src+')',
				'background-size': 'cover'
			});			
		}
		else{
			$('#'+id).css({
				'background-image': 'url(images/failed.png)'
			});	
		}
	};

 //1:显示名称
 //2:标题+简介
 //3:图文并茂
 //5:自定义html
 //7:列表
 //8:方格

 	//自定义html
 	function createInnerHtml(index, id, inner){
 		var html = '';

		var innerHeight =__container_height;
		var innerWidth = __container_width;

		html =  '<div id="memo-container-main-p-' + index + '-' + id + '" did="' + id + '" class="memo_container_main_p memo_container_main_p_html ' + (options.bg_color ? options.bg_color : randomColor()) + '" ';
		html += ' style="width: ' + innerWidth + 'px;">';
		html += inner;
		html += '</div>';

		return html;
 	};

	//名称
	function createTitle(index, id, name, url){
		var html = '';
		url = !url ? '' : url;

		var innerHeight =__container_height;
		var innerWidth = __container_width;

		var fontSize = 15;
        var lineheight = 20;
		if(innerHeight > 200 && innerWidth > 150){
			fontSize = 24;
            lineheight = 30;
		}

		var showname = name;

		if(showname.length > 18){
			showname = showname.substring(0,15);
			showname += '..';
		}

		html =  '<div title="'+name+'" id="memo-container-main-p-' + index + '-' + id + '" did="' + id + '" class="pointer_reader memo_container_main_p memo_container_main_p_title ' + (options.bg_color ? options.bg_color : randomColor()) + '" ';
		html += ' style="width: ' + innerWidth + 'px;height:100%;" switch="'+escape(url)+'">';
		html += '<table cellspacing="0" cellspadding="0" style="height:100%;width:100%;"><tbody><tr><td align="center" vailing="middle" style="font-size:'+fontSize+'px;line-height:'+lineheight+'px;">' + showname + '</tr></tbody></table>';
		html += '</div>';

		return html;
	};

	//方块
	function createBlocks(index, id, list, rows, cols){
		var html = '';

		var innerHeight =__container_height;
		var innerWidth = __container_width;

		//debugger

		html =  '<div id="memo-container-main-p-' + index + '-' + id + '" did="' + id + '" class="pointer_reader memo_container_main_p memo_container_main_p_block ' + (options.bg_color ? options.bg_color : randomColor()) + '" ';
		html += ' style="width: ' + innerWidth + 'px;height:'+innerHeight+'px;">';

		var blank = 4;
		var blockWidth = (innerWidth - (rows - 1)*blank - 12)/rows;		//两侧上下
		var blockHeight = (innerHeight - (cols - 1)*blank - 12)/cols;
		var inner = '', blocksIndex=0;

		for(var i=0; list && i<list.length; ){
			var showList = list.slice(0, rows*cols);
			list.splice(0, rows*cols);
			inner +=	''
					  +		'<div class="memo_inner_blocks '+(blocksIndex==0?'memo_inner_blocks_show':'') + '" id="memo-inner-blocks-' + identity + '-' + id + '" did="' + id +'"'
					  +		'style="">';
				var color = randomColor();
				for(var s=0; showList && s<showList.length; s++){
					var url = !showList[s].url ? '' : showList[s].url;
					var offset_left = s%cols,  offset_top = Math.floor(s/rows);
					inner +=	'<div class="memo_inner_blocks_b '+color+'" id="memo-inner-blocks-b-'+identity+'-'+id+'-'+showList[s].id+'" did="'+id+'" switch="'+escape(url)+'" '
						  +		' style="width: '+blockWidth+'px; height: '+blockHeight+'px;'
						  +		' left: '+ (offset_left*(blank + blockWidth)) +'px; top: '+(offset_top*(blank+blockHeight)) + 'px;"'
						  +		' ><table cellspacing="0" cellspadding="0" style="height:100%;width:100%;"><tbody><tr><td style="vertical-align: middle;text-align: center;" align="center" vailing="middle">' + showList[s].name + '</tr></tbody></table></div>'
				}	  

				inner +=	'</div>'
					  +	'';

			blocksIndex++;
		}

		html += inner;

		if(blocksIndex > 1){
			var inner = '<div class="memo_inner_blocks_scroll" id="memo-inner-blocks-scroll-'+identity+'-'+index+'-'+id+'"';
			inner += ' style="width: ' + blocksIndex*16 + 'px;margin-left: -' + blocksIndex*16/2 +'px;">'
			for(var i=0; i<blocksIndex; i++){
				if(i == 0) inner += '<span class="memo_inner_blocks_scroll_e_focus';
				else inner += '<span class="';
				inner += ' memo_inner_blocks_scroll_e"';
				inner += ' did="' + i;
				inner += '"></span>';
			}
			inner += '</div>';
			html += inner;
		}

		html += '</div>';

		return [html, ['memo-inner-blocks-scroll-'+identity+'-'+index+'-'+id, 'memo_inner_blocks_scroll_e', 'click']];
	};

	//动态绑定memo块中的一些事件
	//id：div的id、cl：'>.class','element'选中子项扩展、e：事件名、cb：回调函数(event,this)
	function dynamicBind(id, cl, e, cb){
		var selector = '#'+id;
		if(cl && cl.length > 0) selector += cl;

		$(selector).bind(e, function(ev){
			if(cb) cb(ev, this);
		});
	};

	function dynamicBindFixedEvents(id){
		$('#'+id).unbind('mouseover').bind('mouseover', function(ev){
			var target = this;
			if(fixedTimeoutPointer){
				clearTimeout(fixedTimeoutPointer);
				fixedTimeoutPointer = undefined;
			}
			fixedInTimeoutPointer = undefined;
			var selector = $(target).attr('id');
			fixedInTimeoutPointer = setTimeout(function(){
				$('#'+selector+'>.memo_container_main_p_fixed_topic').show();
			}, 200);
		}).unbind('mouseout').bind('mouseout', function(ev){
			if(fixedTimeoutPointer){
				clearTimeout(fixedTimeoutPointer);
				fixedTimeoutPointer = undefined;
			}
			var target = this;
			fixedTimeoutPointer = setTimeout(function(){
				$('#'+$(target).attr('id')+'>.memo_container_main_p_fixed_topic').hide();
			}, 200);
		});

		$('#'+id+'>.memo_container_main_p_fixed_topic').unbind('mouseout').bind('mouseout', function(ev){
			ev.stopPropagation();
			if(fixedInTimeoutPointer){
				clearTimeout(fixedInTimeoutPointer);
				fixedInTimeoutPointer = undefined;
			}
			var target = this;
			fixedTimeoutPointer = setTimeout(function(){
				$(target).hide();
			},200);
		}).bind('mouseover', function(ev){
			if(fixedTimeoutPointer){
				clearTimeout(fixedTimeoutPointer);
				fixedTimeoutPointer = undefined;
			}
		});
	};

	//动态绑定blocks的翻页回调
	function dynamicBlocksScrollCallback(ev, target){
		if(target.parentElement && target.parentElement.parentElement){
			var selector = $(target.parentElement.parentElement).attr('id');
			selector = '#'+selector;
			var offset = $(target).attr('did') ? $(target).attr('did') : 0;
			$(selector + '>.memo_inner_blocks').removeClass('memo_inner_blocks_show');

			$($(selector + '>.memo_inner_blocks')[offset]).css({'opacity': '0'});
			$($(selector + '>.memo_inner_blocks')[offset]).addClass('memo_inner_blocks_show');
			$($(selector + '>.memo_inner_blocks')[offset]).animate({opacity: '1'}, 300, 'linear', function(){
				
			});

			var parent = $(target.parentElement).attr('id');
			$('#'+parent+'>.memo_inner_blocks_scroll_e').removeClass('memo_inner_blocks_scroll_e_focus');
			$(target).addClass('memo_inner_blocks_scroll_e_focus');
		}
	};

	//图片
	function createBackimage(index, id, img, name){

	};

	//图文并茂
	// index: [0,..)
	function createFixed(index, id, img, name, url){ 
		var html = '';
		url = !url ? '' : url;

		if(!hasIntroFixed) hasIntroFixed = true;

		var innerHeight =__container_height;
		var innerWidth = __container_width;

		var imglinks = FW.Configure.filterImages(img);
		var image = imglinks.length > 0 ? imglinks[0] : '';

		html = '<div title="'+name+'" id="memo-container-main-p-' + index + '-' + id + '" did="' + id + '" class="memo_container_main_p memo_container_main_p_fixed ' + (options.bg_color ? options.bg_color : randomColor()) + '" ';
		html += ' style="background-image: url(images/loadingx16.gif); width: ' + innerWidth + 'px;" switch="'+escape(url)+'">';

		html += '<div class="pointer_reader memo_container_main_p_fixed_topic solid_left2right" style="width:'+__container_width+'px;">';
		html += '<table cellspacing="0" cellspadding="0" style="height:100%;width:100%;"><tbody><tr><td align="center" vailing="middle" style="font-size:14px;">' + name + '</tr></tbody></table>';
		html += '</div></div>';

		return [html, ['memo-container-main-p-' + index + '-' + id, 'memo_container_main_p_fixed', image]];
	};

	//标题简介
	function createContext(index, id, name, text, url){ 
		var html = '';
		url = !url ? '' : url;

		var innerHeight =__container_height;
		var innerWidth = __container_width;

		html =  '<div id="memo-container-main-p-' + index + '-' + id + '" did="' + id + '" class="memo_container_main_p memo_container_main_p_context ' + (options.bg_color ? options.bg_color : randomColor()) + '" switch="'+escape(url)+'" ';
		html += ' style="width: ' + innerWidth + 'px; height: '+innerHeight+'px;">';
		html += '<h3 class="pointer_reader ">' + name + '</h3>';

		var offset_h = innerHeight - 16 - 8*2 - 16;	//- father.top - padding*2 - father.bottom
		var offset_v = innerWidth - 8*2;
		var offset_words = Math.ceil(offset_v/12);	//一行有这么多字
		var lines = Math.floor(offset_h/16);		//最多这么多行
		lines = lines <= 0 ? 1 : lines;
		var tips = !text ? '' : text.substring(0, offset_words * lines);

		html += '<span style="font-size:'+__context_fontsize+'px;line-height:'+__context_lineheight+'px;" class="pointer_reader ">' + tips + '</span>';
		html += '</div>';

		return html;
	};

	//列表
	//列表的翻页功能在mouseover中动态计算
	function createList(index, id, list){
		var html = '';

		var innerHeight =__container_height;
		var innerWidth = __container_width;

		html =  '<div id="memo-container-main-p-' + index + '-' + id + '" did="' + id + '" class="memo_container_main_p memo_container_main_p_list memo_td_list" ';
		html += ' style="width: ' + innerWidth + 'px; height: '+innerHeight+'px;">';
		html += '<ul>';

		for(var i=0; i<list.length; i++){
			var url = list[i].url ? list[i].url : '';
			html += '<li class="pointer_reader " did="' + list[i].id + '" switch="'+escape(url)+'">' + list[i].name + '</li>';
		}

		html += '</ul></div>';

		return html;
	};

	return memo;
});