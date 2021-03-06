;
if(typeof(undefined) == typeof(FW)) FW={};

/*
 *	exports: 		Components
 *	parameters: 	deps:依赖的模块名数组;
 *	wonder:  		前端组件基类
 *	topic: 			模块注册模型框架基类
 */
(function(global){
	var Component = function(name){
		this.__module_name = name;
		this.__ready_state = 0;

		this.core = FW.Core;
	};

	var proto = Component.prototype;

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

	global.Component = Component;
})(this);

/*
 *	exports: 		Framework
 *	parameters: 	deps:依赖的模块名数组;
 *	wonder:  		前端页面模板
 *	topic: 			模块注册模型框架基类
 */
(function(global){
	var Framework = function(name){
		this.__module_name = name;
		this.__ready_state = 0;

		this.core = FW.Core;
	};

	var proto = Framework.prototype;

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

	global.Framework = Framework;
})(this);

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