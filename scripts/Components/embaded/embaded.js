;
if(typeof(undefined) == typeof(FW)) FW = {};
if(typeof(undefined) == typeof(FW.UI)) FW.UI = {};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components = {};

//显示网页插件
FW.define(undefined, undefined, 'scripts/Components/embaded/embaded', function(contain, id, opts){
	var
		embaded = new Widget('scripts/Components/embaded/embaded');

	var
		options = {
			name: '',
			close: true
		};

	for(var o in opts){
		if(options.hasOwnProperty(o)){
			options[o] = opts[o];
		}
	}

	var
		__container = contain ? contain : 'body'
		,__source_link = ''
		,__identify = id ? id : (new Date()).getTime();

	function init(){
		prepareDom();
		bindEvents();
	};

	function prepareDom(){
		var html = '<div class="embaded" id="embaded-'+__identify+'">'
				 +		'<iframe class="embaded_frame" id="embaded-frame-'+__identify+'" src=""></iframe>'
				 + '</div>';

		$(__container).append(html);
	};

	function bindEvents(){
		$('#embaded-frame-'+__identify).bind('load', function(ev){
			embaded.dispatch(this, 'onload');
		});
	};

	embaded.Show = function(url, name){
		__source_link = url;

		$('#embaded-frame-'+__identify).attr('src', url);
	};

	embaded.Clear = function(){
		$('#embaded-frame-'+__identify).html('').attr('src','');
	};
	
	init();
	return embaded;
});