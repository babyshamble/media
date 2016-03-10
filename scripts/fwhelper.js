if(typeof(undefined) == typeof(FW)) FW = {};
		
FW.Helper ={ 
	object2Array: function(obj){
		var arr = [];
		switch(FW.Helper.checkTargetProperty(obj)){ 
			case 'object':
				for(var o in obj){ 
					arr.push(obj[o]);
				}
				break;
			case 'array':
				arr.concat(obj);
				break;
		}

		return arr;
	},

	array2Object: function(arr){ 
		var tempIndex = 0;
		var obj = undefined;
		switch(FW.Helper.checkTargetProperty(arr)){
			case 'object':
				obj = arr;
				break;
			case 'array':
				for(var i=0; i<arr.length; i++){
					if(arr[i].hasOwnProperty('id')) tempIndex = arr[i]['id'];
					else tempIndex = (new Date()).getTime();

					obj[tempIndex] = arr[i];
				}
				break;
		}

		return obj;
	},

	checkTargetProperty: function(tar){ 
		var type = undefined;
		switch(Object.prototype.toString.call(tar)){ 
			case '[object Object]':
				type = 'object';
				break;
			case '[object Array]':
				type = 'array';
				break;
			default:
				type = typeof(tar);
				break;
		}

		return type;
	},

	computeObjectLength: function(tar){
		var len = 0;
		switch(FW.Helper.checkTargetProperty(tar)){ 
			case 'object':
				for(var i in tar){ 
					len++;
				}
				break;
			case 'array':
				len = tar.length;
				break;
		}

		return len;
	},

	setCookie: function(key, value, effectiveTimes, p){
		var eff = effectiveTimes ? (new Date()).getDate()+effectiveTimes : 0;
		if(FW.Helper.checkCookie(key)) eraseCookie(key);
		document.cookie = key + '=' + escape(value) + (effectiveTimes ? (';espires=' + eff.toGMTString()) : '');
	},

	checkCookie: function(key){
		return FW.Helper.getCookie(key) != '';
	},

	getCookie: function(key){
		var cook = '';

		if(document.cookie.length > 0){
			var start = document.cookie.indexOf(key);
			if(start >= 0){
				start = start + key.length + 1;
				var end = document.cookie.indexOf(';', start);
				end = end == -1 ? end = document.cookie.length : end;
				cook = unescape(document.cookie.substring(start, end));
			}
		}

		return cook;
	},

	eraseCookie: function(key, path){
		if(FW.Helper.checkCookie(key)){
			var exp = new Date();
			exp.setTime(exp.getDate() - 100);
			document.cookie = key + '=' + FW.Helper.getCookie(key) + ';espires=' + exp.toGMTString();
		}
	}
};

FW.Sound = {
	init: function(){

	},
	prpointer: undefined,
	resetPointerReader: function(){
		$('.pointer_reader').off('mouseenter').on('mouseenter', function(ev){
				if (!FW.Configure.runtime.artDomReady) {
					if(FW.Sound.prpointer){
						clearTimeout(FW.Sound.setter);
						clearTimeout(FW.Sound.prpointer);
						clearTimeout(FW.Sound.clicker);
						YX.Read.UnPointerRead();
						FW.Sound.prpointer = undefined;
					}

					var tx = $(this).text();

					FW.Sound.prpointer = setTimeout(function(){
						YX.Read.PointerRead(tx);//播报指定内容，
					}, 100);
				}		
		}).off('mouseleave').on('mouseleave', function(ev){
			if (!FW.Configure.runtime.artDomReady) {
				if(FW.Sound.prpointer){
					clearTimeout(FW.Sound.prpointer);
					FW.Sound.prpointer = undefined;
				}

				if(YX && YX.Read){
					YX.Read.UnPointerRead();
				}
			}	
		});
	},
	setter: undefined,
	settingReader: function() {
		clearTimeout(FW.Sound.setter);
		clearTimeout(FW.Sound.prpointer);
		clearTimeout(FW.Sound.clicker);
		// YX.Read.UnPointerRead();
		// YX.Read.UnContinueRead();
		YX.Read.Stop();
		FW.Sound.setter = undefined;
		var tx = '上下切换栏目左右切换列表';

		FW.Sound.setter = setTimeout(function(){
			YX.Read.PointerRead(tx); // 播报指定内容，
		}, 100);
	},
	clicker: undefined,
	clickReader: function(tx) {
		clearTimeout(FW.Sound.setter);
		clearTimeout(FW.Sound.prpointer);
		clearTimeout(FW.Sound.clicker);
		// YX.Read.UnPointerRead();
		// YX.Read.UnContinueRead();
		YX.Read.Stop();

		clicker = setTimeout(function(){
			YX.Read.PointerRead(tx); // 播报指定内容，
		}, 100);
	}
};