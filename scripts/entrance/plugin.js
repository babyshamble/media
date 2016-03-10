;
if(typeof(undefined) == typeof(FW)) FW={};

/*
 *	exports: 		Widget
 *	parameters: 	deps:依赖的模块名数组;
 *	wonder:  		前端插件模板
 *	topic: 			模块注册模型框架基类
 */
(function(global){
	var Widget = function(name){
		this.__module_name = name;
		this.core = FW.Core;
		this.__ready_state = 0;
	};

	var proto = Widget.prototype;

	proto.listen = function(to, cb, events){
		events = !events ? 'all' : events;
		this.core.callback.register(
				this.__module_name,
				to,
				cb,
				events
			);
	};

	proto.dispatch = function(target, events, paras){
		this.core.callback.base(target, events, this.__module_name, paras);
	};

	global.Widget = Widget;
})(this);