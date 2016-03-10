if(typeof(FW) == typeof(undefined)) FW={};
if(typeof(FW.UI) == typeof(undefined)) FW.UI={};
if(typeof(FW.UI.Components) == typeof(undefined)) FW.UI.Components={};

var datat = {
		'id': '104',
		'name': '北京发今年首个高温橙色预警 局地将超过40℃',
		'text': '据北京市预警中心消息，北京市气象台12日5时55分升级发布高温橙色预警信号，预计12日至13日，本市平原地区最高气温将达38℃至39℃，局地将超过40℃。请注意防暑降温，节水节电。北京市气象台今天6时天气预报，未来三天白天最高气温将在34℃以上，之后将继续升高。（中国气象网）',
		'pic': 'http://img1.gtimg.com/news/pics/hv1/22/25/1878/122123347.jpg',
		'from': '首都之窗',
		'time': '2015-6-9',
		'url': 'http://img1.gtimg.com/news/pics/hv1/22/25/1878/122123347.htm'
};


FW.define(undefined, undefined, 'scripts/Components/tips/tips', function(opts){
	var
		options={
			htmlType: true,		//保留HTML标记
			show: 1,			//0:左右；1:上下
			events:{
				click: undefined,
				mouseover: undefined,
				mouseout: undefined
			}
		};

	for(var o in opts){
		if(options.hasOwnProperty(o)){
			options[o] = opts[o];
		}
	}

	var
		__container = 'body',
		__container_id = undefined;

	var
		identity = (new Date()).getTime(),
		data = undefined,
		TRANSFORM_CLEAR = /<[^<>]*>/g;

	var 
		embaded = new Widget('scripts/Components/tips/tips');

	embaded.Init = function(contain){
		if(contain) __container = contain;
	};

	function prepareDom(){
		var html = '<div id="tips-container-'+identity+'" did="'+identity+'" class="tips_container">'
				 +		'<p class="tips_from"></p>'
				 + '</div>';

		$(__container).append(html);
		__container_id = 'tips-container-'+identity;
	};

	function bindEvents(){
		$('#'+__container_id).bind('click', function(ev){
			if(options.events.click){
				options.events.click(this);
			}
		}).bind('mouseover', function(ev){
			if(!$(this).is('.tips_container_overing')){
				$(this).addClass('tips_container_overing');
				if(options.events.mouseover){
					options.events.mouseover(data.id, this);
				}
			}
		}).bind('mouseout', function(ev){
			if($(this).is('.tips_container_overing')){
				$(this).removeClass('tips_container_overing');
				if(options.events.mouseout){
					options.events.mouseout(data.id, this);
				}
			}
		});
	};

	embaded.Show = function(d){
		data = d;
		if(!data) data = datat;

		if(data.id) identity = data.id;
		else identity = (new Date()).getTime()*(Math.floor(Math.random()*10) + 1);

		prepareDom();
		
		if(!options.htmlType){
			data.text.replace(TRANSFORM_CLEAR, "");
		}

		analysis();

		bindEvents();
	};

	function analysis(){
		var html = '', isFixed = false;
		data.pic = data.pic && data.pic.length > 0 ? data.pic : undefined;
		if(data.pic && data.pic.length > 0){
			var inner = fixed(data.id, data.pic);
			html += inner[0];
			isFixed = true;
		}

		var outer = base(isFixed, data.id, data.name, (isFixed ? data.text.substring(0,50)+'...' : data.text), data.url, data.time);
		html += outer[0];

		$('#'+__container_id).append(html);
		$('#'+__container_id).attr('title', data.text);

		if(data.from && data.from.length > 0){
			$('#'+__container_id + '>p').text(data.from);
			$('#'+__container_id + '>p').show();
			$('#'+__container_id + '>p').css({
				'margin-top': ($(__container).height()*0.8)+'px',
				'margin-left': ($(__container).width() - 60)+'px'
			});
		}
	};

	function base(fixed, id, name, text, url, time){
		time = !time ? '' : time;
		var cl = fixed ? 'tips_items_text_'+options.show : 'tips_items';
		var html = '<div id="tips-item-text-'+identity+'-'+id+'" class="'+cl+'">'
				 +		'<p class="pointer_reader tips_items_name_'+options.show+'">'+name+'</p>'
				 +		'<p class="pointer_reader tips_items_tip_'+options.show+' '+(fixed?'disabled':'')+'">'+(text && text.length > 0 ? text : '暂无简介')+'</p>'
				 +		'<span class="tips_items_source">'
				 +			'<p class="tips_items_source_time_'+options.show+'">'+time+'</p>'
				 +		'</span>'
				 + '</div>';

		return [html, 'tips-item-text-'+identity+'-'+id];
	};

	function fixed(id, img){
		var imglink = FW.Configure.filterImages(img);
		var html = '<div id="tips-item-image-'+identity+'-'+id+'" class="tips_items tips_items_img_'+options.show+'" '
				 + ' style="background-image:url('+imglink+'); "'
				 + '></div>';

		return [html, 'tips-item-image-'+identity+'-'+id];
	};

	return embaded;
});