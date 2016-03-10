
if(typeof undefined === typeof YX) YX = {};
if(typeof undefined === typeof YX.Ui) YX.Ui = {};
if(typeof undefined === typeof YX.Ui.Components) YX.Ui.Components = {};

YX.Ui.Components.Errors = function(){
	var instance = this;
	var $pannel = undefined;
	var closeCallback = undefined;

	this.Init = function(container){
		$pannel = $('#' + container);

		prepareDom();
		bindEvents();
	};

	this.Show = function(err, closeHandler){
		$('#components-errors').css({'display': 'block'});

		if(err){ 
			$('#components-errors-abstract').text(err);
		}

		runRunRun();

		if(closeHandler){ 
			closeCallback = closeHandler;
		}

	};

	function runRunRun(){ 
		$('#components-errors-clouds-1').animate({left:"-100px", opacity: "0"}, 15000, "linear");

		$('#components-errors-clouds-2').animate({left:"-100px", opacity: "0"}, 18000, "linear");

		$('#components-errors-clouds-3').animate({left:"105%", opacity: "0"}, 14000, "linear");

		$('#components-errors-rocket').animate({left:"70%", top: "5%", width: "32px", height: "32px", opacity: "0"}, 5000, "linear");
	};

	function prepareDom(){ 
		if($pannel.length <= 0) $pannel = $('body');

		
		var html = 	'<div id="components-errors">'
				 +		'<div id="components-errors-clouds">'
				 +			'<div id="components-errors-clouds-1" class="components_errors_cloudsx64"></div>'
				 +			'<div id="components-errors-clouds-2" class="components_errors_cloudsx128"></div>'
				 +			'<div id="components-errors-clouds-3" class="components_errors_cloudsx128"></div>'
				 +			'<div id="components-errors-rocket" class="components_errors_rocketx128"></div>'
				 +		'</div>'
				 +		'<div id="components-errors-text">'
				 +			'<h1>出错了啊哦o(╯□╰)o，可能原因是：</h1>'
				 +			'<p id="components-errors-abstract">404 website not found</p>'
				 +			'<h2 style="padding-top:24px;">那么</h2>'
				 +			'<p style="padding-top:16px;">请点击'
				 +				'<a href="#" id="components-errors-return">这里</a>'
				 +			'返回(233333)</p>'
				 +		'</div>'
				 +	'</div>';
		$pannel.append(html);
		/*var html = 	'<div id="components-errors">'
				 +		'<div id="components-errors-clouds">'
				 +			'<div id="components-errors-clouds-1" class="components_errors_cloudsx64"></div>'
				 +			'<div id="components-errors-clouds-2" class="components_errors_cloudsx128"></div>'
				 +			'<div id="components-errors-clouds-3" class="components_errors_cloudsx128"></div>'
				 +			'<div id="components-errors-rocket" class="components_errors_rocketx128"></div>'
				 +		'</div>'
				 +		'<div id="components-errors-text">'
				 +		'</div>'
				 +	'</div>';


		
		var words = '提示：使用 CSS 最大的好处是，如果把 CSS 代码存放到外部样式表中，那么站点会更易于维护。通过编辑单一的文件，就可以改变所有页面的布局。如需学习更多有关 CSS 的知识，请访问我们的 CSS 教程。提示：使用 CSS 最大的好处是，如果把 CSS 代码存放到外部样式表中，那么站点会更易于维护。通过编辑单一的文件，就可以改变所有页面的布局。如需学习更多有关 CSS 的知识，请访问我们的 CSS 教程。'
		var fsize = 12;
		var lineheight = 14;
		var numberTotal = Math.floor($('#components-errors-text').width() / 12);
		var numberH = Math.floor($('#components-errors-text').height() / 14);

		words = words.substring(0, numberH * numberTotal);

		$('#components-errors-text').append(words);*/
	};

	function bindEvents(){ 
		$('#components-errors-return').bind('click', function(ev, istrigger, ispress, outtrigger){
			if(!closeCallback){ 
				
			}
			else{
				ev.preventDefault();
				closeCallback();
			}

			$('#components-errors').css({'display': 'none'});
		});
	};
};