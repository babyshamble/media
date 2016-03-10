;
if(typeof(undefined) == typeof(FW)) FW = {};

/*
 *	@theme: smartnet_movie controller
 *	@base on: CNIIL Web Framework Core & jquery 1.7.2
 *	@protocol: 
 *		  1.nothing but router dispatch function must be existed;
 *	@power:
 *		  1.dispatch router parameters;
 *		  2.keyboard events dispatcher;
 *	@powered by: luckqin/frez02@126.com
 *	@version: 1.0.0.1
 */
FW.define(undefined, 
		['scripts/views/navigation',
		 'scripts/views/column',
		 'scripts/views/list',
		 'scripts/views/art',
		 'scripts/keyboard'], 
		 'scripts/views/dispatcher', 
		 function(){
	var
		dispatcher = new Component('scripts/views/dispatcher');

	var 
		keyboard = undefined,
		navigation = undefined,
		column = undefined,
		list = undefined,
		art = undefined;

	function init(){
		navigation = FW.require('scripts/views/navigation')();
		column = FW.require('scripts/views/column')();
		list = FW.require('scripts/views/list')();
		art = FW.require('scripts/views/art')();
		keyboard = FW.require('scripts/keyboard')();
		keyboard.init();
	};

	init();

	dispatcher.Guidance = function(){
		if(dispatcher == this){
			throw "dispatcher function called Guidance can be used for apply only!";
			return;
		}

		var args = arguments;
		if(args.length <= 0){
			throw "arguments error caused by router what arguments length <= 0!";
			return;
		}

		FW.Configure.runtime.webkind = args[0];
		FW.Configure.runtime.pm.a = args[1]; // news affairs files
		FW.Configure.runtime.pm.b = args[2]; // clounm
		FW.Configure.runtime.pm.c = args[3]; // list
		FW.Configure.runtime.pm.d = args[4]; // art

		switch(args[0]){
			case 'navigation':
				navigation.show(args);
				break;
			case 'column':
				column.show(args);
				break;
			case 'list':
				list.show(args);
				break;
			case 'art':
				art.show(args);
				break;
			case 'error':
			default:
				break;
		}
		
		FW.Sound.resetPointerReader();
	};

	function bindKeyboardEvents(){
		$(document).keydown(function(e){

		});
	};

	return dispatcher;
});