if(typeof(undefined) == typeof(FW)) FW = {};
if(typeof(undefined) == typeof(FW.UI)) FW.UI = {};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components = {};

//以memo为包含的数据展示区
FW.define(undefined, ['scripts/Components/memo/memo'], 'scripts/Components/delayering/main', function(contain, data, opts){
	var 
		options = {
			'adapter': false
			,'sizing':{
				'on': true,
				'base': undefined,		//-1基于容器宽度定义width；1基于容器高度定义width
				'width': 500,
				'height': undefined
			}
			,'rows': 5
			,'columns': 5
			,'row_blank': '6'
			,'col_blank': '6'
			,'data': { 
				'id': '100',
				'name': '市税务局',
				'data': null
			},
			'itemClick': undefined
		};

	for(var o in opts){ 
		if(options.hasOwnProperty(o)){ 
			options[o] = opts[o];
		}
	}

	var 
		user_defined_template = {
			'1,1':[
					['1,1']
			],
			'1,2':[
					['1,1','1,1'],
					['1,2']
			],
			'2,1':[
					['1,1','1,1'],
					['2,1']
			],
			'2,2':[
					['1,1','1,1','1,1','1,1'],
					['2,1','1,1','1,1'],
					['2,1','2,1'],
					['1,2','1,1','1,1'],
					['1,1','1,1','1,2'],
					['1,2','1,2'],
					['2,2']
			],
			'2,3':[
					['1,1','1,1','1,1','1,1','1,1','1,1']
			],
			'3,2':[
					['3,2'],
					['2,2','1,2'],
					['1,1','1,1', '1,2','1,1','1,1'],
					['2,2','1,1','1,1'],
					['1,2','2,1','2,1'],
					['1,2','1,2','1,1','1,1']
			],
			'3,3':[
					['1,2','2,1','1,2','1,1','1,1','1,1'],
					['1,2','1,1','1,1','1,2','1,2','1,1'],
					['1,1','1,2','1,1','1,2','1,1','1,2'],
					['1,1','1,1','2,1','1,2','1,2','1,1']
			],
			'3,4':[
					['2,2','1,2','1,1','1,1','1,2','1,2'],
					['1,2','1,1','1,1','2,2','1,1','1,1','1,2']
			],
			'4,4':[
					['2,2','1,2','1,1','1,1','1,2','1,2','1,1','1,1','1,1','1,1'],
					['1,2','2,2','1,1','1,1','1,1','1,1','1,2','1,2','1,1','1,1'],
					['2,2','1,2','1,1','1,1','1,2','1,2','1,1','1,1','1,1','1,1'],
					['1,2','1,1','1,1','1,1','1,2','1,1','1,1','1,1','1,2','1,2','1,1','1,1'],
					['1,2','1,1','1,1','1,1','1,1','1,2','1,1','1,2','1,1','1,2','1,1','1,1']			
			],
			'5,5':[
					['2,2','2,2','1,1', '1,1', '1,2','2,2','1,2','1,1','1,1','1,1','1,1','1,2','1,1']
			],
			'3,8':[
				['2,2','1,2','1,2','1,1','1,1','1,1','1,1','2,2','1,1','1,1','1,2','1,2','1,2']
			]
		};

	var 
		__container = contain ? contain : 'body'
		,__container_height = 0		//容器高度
		,__container_width = 0		//容器宽度
		,__meta_height = 0			//memo块高度
		,__meta_width = 0			//memo块宽度
		,__meta_row_blank = 0		//行间距
		,__meta_col_blank = 0		//列间距
		,__blocks = {};		//所有块插件

	var 
		instance = this
		,rows_columns = ''
		,currentTemplateIndex = 0
		,currentTemplate = []
		,currentTemplateLoacation = 0
		,identity = 0		//时间戳作为id的唯一标识
		,delayering_pages_container_height = 0;

	var
		$delayering_container = undefined
		,$delayering_pages_container = undefined
		,$delayering_scroll = undefined
		,delayering_name = undefined;

	var
		delayering = new Widget('scripts/Components/delayering/main');

	options.data = data;

	init();

	function init(){ 
		//if(contain) __container = contain;

		//options.data.data = data ? data : datadd.data;
		//.data = data;
		identity = (new Date()).getTime();//options.data.id;

		prepareDom();
	
		if(options.sizing.on){
			switch(options.sizing.base){
				case -1:
					options.sizing.width = $(__container).width();
					break;
				case 1:
					options.sizing.width = $(__container).height();
					break;
				default:
					break;
			}
			__container_width = options.sizing.width ? options.sizing.width : $delayering_pages_container.width();
			__container_height = options.sizing.height ? options.sizing.height : $delayering_pages_container.height();
		}
		else{
			__container_width = $delayering_pages_container.width();
			__container_height = $delayering_pages_container.height();			
		}

		// if(!options.sizing.on && __container_height <= 450) options.rows = 2;
		// else if(options.sizing.on && __container_height <= 480){
		// 	options.rows = options.rows > 3 ? 3 : options.rows;
		// 	options.columns = options.columns > 3 ? 3 : options.columns;
		// }

		computeMeta();

		if(options.adapter){
			options.rows = options.rows > 5 ? 5 : options.rows;
			options.rows = options.rows < 1 ? 1 : options.rows;
			options.columns = options.columns > 8 ? 8 : options.columns;
			options.columns = options.columns < 1 ? 1 : options.columns;			
		}

		rows_columns = options.rows+','+options.columns;
	};

	delayering.Show = function(){
		createInnerDom();
		bindEvents();

		delayering.listen('scripts/views/navigation/navigation', pageChange, 'pageing');
	};

	var colorIndex = 0;
	//随机色
	function randomColor(){
		//var i = Math.floor(Math.random()*6);
		colorIndex = colorIndex > 9 ? 0 : colorIndex;
		var cl = 'memo_rd_color'+colorIndex;
		colorIndex++;
		return cl;
	};

	function bindEvents(){ 
		$('#delayering-scroll-' + identity +'>.delayering_scroll_element').bind('click', function(ev, istrigger){ 
			var index = $(this).attr('did');
			if(index){ 
				$('#delayering-scroll-' + identity +'>.delayering_scroll_focus').removeClass('delayering_scroll_focus');
				$(this).addClass('delayering_scroll_focus');

				$delayering_pages_container.stop().animate({left: '-' + index * (__container_width) + 'px'}, 600);
				delayering.dispatch(this, 'paging', index);
			}
		});
	};

	function pageChange(target, from, events, paras){
		var select = '#delayering-scroll-' + identity +'>.delayering_scroll_focus';
		console.log(paras);
		if($(select).length == 1){
			var index = $(select).attr('did');
			index = parseInt(index);
			index += paras;
			if(index >=0 && index <$('#delayering-scroll-' + identity +'>.delayering_scroll_element').length){
				$('#delayering-scroll-' + identity +'>.delayering_scroll_element').each(function(){
					if($(this).attr('did') == index){
						$(this).trigger('click');
					}
				});
			}
		}
	};

	//生成当前块的style值
	function createStyle(newpage){
		var style = undefined, canbe = false;

		if(user_defined_template.hasOwnProperty(rows_columns)){
			if(!currentTemplate || currentTemplate.length == 0 || newpage){
				var len = user_defined_template[rows_columns].length;
				currentTemplateLoacation = currentTemplateLoacation < 0 ? 0 : currentTemplateLoacation;
				currentTemplateLoacation = currentTemplateLoacation >= len ? 0 : currentTemplateLoacation;
				currentTemplate = user_defined_template[rows_columns][currentTemplateLoacation];
			}

			currentTemplateIndex = newpage ? 0 : currentTemplateIndex;
			if(currentTemplateIndex >= currentTemplate.length){
				canbe = true;	//要翻页了
				currentTemplateIndex = 0;
			}
			else{
				style = currentTemplate[currentTemplateIndex];
				currentTemplateIndex++;
			}
		}

		return [canbe, style];
	};

	//创建内部动态dom
	function createInnerDom(){
		var pageIndex = 0;
		var $currentPage = undefined;

		//生成第一页
		var html = createPage(pageIndex);

		$delayering_pages_container.append(html[0]);
		$currentPage = $('#' + html[1]);

		var dataArray = object2Array(options.data.data);

		var bg_color = randomColor();

		var matrix = createMatrix(options.rows, options.columns);
		var newpage = false;

		for(var d=0; d<dataArray.length;){
			/*if(FW.Helper.computeObjectLength(dataArray[d].data) <= 0){
				d++;
				continue;
			}*/
			if(d==0) newpage = true;
			if(options.adapter){
				var style = createStyle(newpage);
				if(style[0] == true){
					matrix = resetMatrix(matrix);
					var html = createPage(++pageIndex);
					$delayering_pages_container.append(html[0]);
					$currentPage = $('#' + html[1]);
					newpage = true;
					currentTemplateLoacation++;
					continue;
				}			

				dataArray[d].style = style[1];	
			}

			var checkin = checkinMatrix(matrix, dataArray[d].style);
			if(checkin[0] == false){
				matrix = resetMatrix(matrix);
				var html = createPage(++pageIndex);
				$delayering_pages_container.append(html[0]);
				$currentPage = $('#' + html[1]);
				newpage = true;
				options.adapter && currentTemplateLoacation++;
			}
			else{
				newpage = false;
				matrix = checkin[1];
				var x = checkin[2][0];
				var y = checkin[2][1];
				var b = checkin[3];

				var left = y == 0 ? 0 : (y*__meta_col_blank + y*__meta_width);
				var top = x == 0 ? 0 : (x*__meta_row_blank + x*__meta_height);
				var width = (b[1] - 1)*__meta_col_blank + b[1]*__meta_width;
				var height= (b[0] - 1)*__meta_row_blank + b[0]*__meta_height;

				//创建memo块所在容器
				var html = createBlock(left, top, width, height, pageIndex, dataArray[d].id);
				$currentPage.append(html[0]);

				//debugger

				var memo = FW.require('scripts/Components/memo/memo')({ 
					'topic': dataArray[d].name,
					'id': dataArray[d].id,
					'bg_color': randomColor(),
					'itemClick': options.itemClick,
					'width': width,
					'height': height
				});

				//console.log('style:'+dataArray[d].style+' width:'+width+' height:'+height);

				var first = undefined;
				for(var da in dataArray[d].data){
					first = dataArray[d].data[da];
					break;
				}

				if(dataArray[d].style == '1,1' && (!first['imgs']) || first['imgs'].length == 0){
					first['effect'] = 1;
				}
				else if(first['imgs'] && first['imgs'].length > 0){
					first['effect'] = 3;
				}

				var fake = dataArray[d].data;
				memo.Init('#' + html[1], fake);
				memo.Show();

				__blocks[dataArray[d].id] = memo;	//将memo保存
				d++;
			}
		}

		if(pageIndex > 0){ 	//翻页
			for(var i=0; i<=pageIndex; i++){
				var inner = '';
				if(i == 0) inner += '<span class="delayering_scroll_focus';
				else inner += '<span class="';
				inner += ' delayering_scroll_element"';
				inner += ' did="' + i;
				inner += '"></span>';

				$delayering_scroll.append(inner);
			}

			$delayering_scroll.css('margin-left', '-' + $delayering_scroll.width()/2 + 'px' );
			$delayering_scroll.css('display', 'block');
		}

		delayering.dispatch(this, 'pageLoaded', pageIndex+1);
	};

	//这是一个二维数组矩阵
	//style='m,n'表示m行n列，在matrix中找到不是1的点，开始匹配，如果m行n列找到全不等于1的，则表示能放入到matrix中；
	//否则表示放不进去，翻页=true。
	function checkinMatrix(matrix, style){ 
		var row = style && style.indexOf(',') > 0 ? parseInt(style.split(',')[0]) : 1;
		var col = style && style.indexOf(',') > 0 ? parseInt(style.split(',')[1]) : 1;

		row = row > options.rows ? options.rows : row;
		col = col > options.columns ? options.columns : col;

		var x,y,canbe=false;

		for(var i=0; i<=options.rows-row; i++){ 
			for(var j=0; j<=options.columns-col; j++){ 
				if(matrix[i][j] == 0){
					var ilegal = false;
					for(var h=i; h<i+row; h++){ 
						for(var v=j; v<j+col; v++){ 
							if(matrix[h][v] == 1){ 
								ilegal = true;			//不能放进去
								break;
							}
						}
						if(ilegal)
							break;
					}

					//能放进来
					if(!ilegal){ 
						x=i; y=j; canbe=true;
						for(var h=i; h<i+row; h++){ 
							for(var v=j; v<j+col; v++){ 
								matrix[h][v] = 1;		//将新占用的部分在matrix中标1
							}
						}
						break;
					}
				}
			}

			if(canbe) break;
		}

		//[能/否放入  处理后的matrix  放入的起点坐标  放入的行列数]
		return [canbe, matrix, [x,y], [row, col]];
	};

	//创建一个m行n列的二维数组
	function createMatrix(m,n){ 
		var matrix = [];

		for(var i=0; i<m; i++){ 
			matrix[i] = [];
			for(var j=0; j<n; j++){ 
				matrix[i][j] = 0;
			}
		}

		return matrix;
	};

	//重置matrix
	function resetMatrix(matrix){ 
		for(var i=0; i<matrix.length; i++){ 
			for(var j=0; j<matrix[i].length; j++){ 
				matrix[i][j] = 0;
			}
		}
		return matrix;
	};

	function object2Array(obj){ 
		var arr = [];

		for(var o in obj){ 
			arr.push(obj[o]);
		}

		return arr;
	};

	//创建一个块
	function createBlock(left, top, width, height, page, id){
		var selfid = 'delayering-block-' + identity + '-' + page + '-' + id;
		var html =	'<div class="delayering_block" id="' + selfid + '" '
				 +	' style="left: ' + left + 'px;'
				 +	' top: ' + top + 'px;'
				 +	' width: ' + width + 'px;'
				 +	' height: ' + height + 'px;"'
				 +	'></div>';

		return [html, selfid];
	};

	//创建一个新页
	function createPage(pageIndex){
		var selfid =  'delayering-page-' + identity + '-' + pageIndex;
		var html =	'<div class="delayering_page ' + (pageIndex == 0 ? '' : '') + '" id="' + selfid + '" '
				 +	' style="width: ' + __container_width + 'px;'
				 +	' height: ' + delayering_pages_container_height + 'px;'
				 +	' left: ' + (__container_width * pageIndex) + 'px;"'
				 +	'></div>';
		return [html, selfid];
	};

	//根据offset（占满列）计算left值
	function computeOffsetLeft(offset){
		var left = 0;
		if(offset <= 0){ 
			left = 0;
		}
		else{ 
			left = (2*offset - 1)*__meta_col_blank + offset * 2 *__meta_width;
		}
		return left;
	};

	//根据offset（占满行）计算top值
	function computeOffsetTop(offset){ 
		var top = 0;

		if(offset <= 0){ 
			top = 0;
		}
		else{ 
			top = (2* offset - 1)*__meta_row_blank + 2*offset * __meta_height;
		}

		return top;
	};

	function prepareDom(){ 
		var html =	'<div class="delayering_container" id="delayering-container-' + identity + '">'
				 +		'<div class="delayering_name" id="delayering-name-' + identity + '"></div>'
				 +		'<div class="delayering_pages_container" id="delayering-page-container-' + identity +'"></div>'
				 +		'<div class="delayering_scroll_container" id="delayering-scroll-' + identity + '"></div>'
				 +	'</div>';

		$(__container).append(html);
		$delayering_container = $('#delayering-container-' + identity);
		$delayering_pages_container = $('#delayering-page-container-' + identity);
		$delayering_scroll = $('#delayering-scroll-' + identity);
		$delayering_name = $('#delayering-name-' + identity);

		delayering_pages_container_height = $delayering_pages_container.height();

		$delayering_name.text(options.data.name);
	};

	//计算memo块容器的宽和高、行间距和列间距
	function computeMeta(){
		__meta_row_blank = options.row_blank.indexOf('%') >= 0 ? __container_height * options.row_blank : options.row_blank;
		__meta_col_blank = options.col_blank.indexOf('%') >= 0 ? __container_width * options.col_blank : options.col_blank;

		__meta_row_blank = parseInt(__meta_row_blank);
		__meta_col_blank = parseInt(__meta_col_blank);

		__meta_width = (__container_width - __meta_col_blank - (options.columns - 1) * __meta_col_blank)/options.columns;
		__meta_height = (__container_height - __meta_row_blank - (options.rows - 1) * __meta_row_blank)/options.rows;
	};

	//m x n 大小，元块为1x1
	function computeBlock(m, n){ 
		var rect =[0, 0];

		rect[0] = (m-1)*__meta_col_blank + m*__meta_width;
		rect[1] = (n-1)*__meta_row_blank + n*__meta_height;

		return rect;
	};

	return delayering;
});