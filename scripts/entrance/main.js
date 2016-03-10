;
if(typeof(undefined) == typeof(FW)) FW={};

/*
 * @theme: CNIIL Web Framework Core
 * @power: 
 * 		  1.module require;
 *		  2.inner communication dispatcher;
 *		  3.registed module manager;
 *		  4.web data controller(tbc.);
 * 		  5.web pagebox request which based on apollo php framework;
 * @author: luckqin/frez02@126.com
 * @version: 2.0.0.1 alpha
 */

FW.Core = {
	callback:{
		modules: {
			// 'memo': {
			// 	'click': {
			// 		'navigation': undefined,
			// 		'delayering': undefined
			// 	}
			// }
		},
		base: function(target, kind, mod, paras){			//自定义事件（消息）分发
			var mod = !mod ? $(target).attr('register') : mod;
			if(this.modules[mod] && this.modules[mod][kind]){
				for(var k in this.modules[mod][kind]){
					var func = this.modules[mod][kind][k];
					if(func && Object.prototype.toString.call(func) == '[object Function]'){
						func(target, mod, kind, paras);
					}
				}
			}
		},
		register: function(from, to, cb, events){				//自定义事件（消息）回调注册
			if(!this.modules[to]){
				this.modules[to] = {};
			}

			if(!this.modules[to][events]){
				this.modules[to][events] = {};
			}

			//这里注册监听的对象可以还没被加载
			this.modules[to][events][from] = cb;
		}
	},
	dictionary: {
		modules: {		//模块异步加载字典
			// 'scripts/views/navigation/navigation': true,
			// 'scripts/Components/loading/loading': true
		},
		require: function(mods){
			if(Object.prototype.toString.call(mods) != '[object Array]') return false;

			for(var i=0; i<mods.length; i++){
				this.require_once(mods[i]);
			}
		},
		require_once: function(mod){
			var name = url = mod + '.js';
			if(this.modules[mod]) return true;
			$.ajax({
				type:'GET'
				,url: url
				,async: false
				,dataType: 'script'
			});
			FW.Core.dictionary.modules[mod] = true;
		}
	}
};

FW.libaray = {
	base: {},
	push: function(name, router){
		if(!this.find(name)){
			this.base[name] = router;
		}
	},
	find: function(name){
		return this.base.hasOwnProperty(name);
	},
	pull: function(name){
		if(this.find(name)){
			return this.base[name];
		}
		else{
			return undefined;
		}
	}
};

FW.define = function(dirs, deps, name, router){
	function register(dirs, deps){
		FW.Core.dictionary.require(deps);
	};
	register(dirs, deps);
	FW.libaray.push(name, router);
};

FW.require = function(name){
	return FW.libaray.pull(name);
};
