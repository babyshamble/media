if(typeof(undefined) == typeof(FW)) FW={};
if(typeof(undefined) == typeof(FW.Frame)) FW.Frame={};

//入口
//功能：1、前期配置、数据准备；2、兼容性处理；3、各项初始化；4、路由初始化和调度
//		5、开放API方法集合；
FW.define(undefined, ['scripts/views/dispatcher'], 'scripts/frame', function(){
	var
		main = new Framework('scripts/frame');
	var
		dispatcher = undefined;

	function init(){
		FW.Ready.init();				//前期数据配置准备、兼容性处理
		FW.Configure.init();			//全局配置初始化
		FW.Dataline.Datapool();
		FW.Sound.settingReader();
		
		dispatcher = FW.require('scripts/views/dispatcher')();
		director();	//全部准备好后，初始化路由
		YX.Read.SetVolume(50);	
	};

	function director(){
		FW.Configure.runtime.router = new FW.Router();

		FW.Configure.runtime.router.configure({
		    strict: false,
		    on: function() {
		    },
		    notfound: function() {
		        
		    },
		    indefinite: function(){
		    	var args = arguments;
		    	if(dispatcher){
		    		dispatcher.Guidance.apply(undefined, args);
		    	}
		    }
		}, 1);	//指定为indefinite方式回调

		FW.Configure.runtime.router.init('/navigation');
	};

	if(typeof(YX) == typeof(undefined)) YX={};
	if(typeof(YX.API) == typeof(undefined)) YX.API={};

    //改变背景色
    window.YX.API.ChangeBackColor = function(color){
    };

    //切换到本系统的通知
    window.YX.API.Switch2u = function(){
        // if (window.top !== window.self) {
        //     var color = window.top.YX.Frame.GetThemeColor();
        //     window.YX.API.ChangeBackColor(color);
            
        //     var mode = window.top.YX.Event.Site.GetSiteMode();
        //     if(mode && mode.length > 0){
        //     	window.YX.API.ChangeMode(mode);
        //     }
        // }
    };

	init();

	return main;
});

//程序入口启动，即所有的一切，从这里开始。
(function(){
	var main = FW.require('scripts/frame')();
}).call(this);