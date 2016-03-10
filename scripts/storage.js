;
if(typeof(undefined) == typeof(FW)) FW={};

//所有对象以字符串存储，|分隔
FW.Storage = function(op){
	var
		options = {
			type: 'localStorage'
		};

	var
		storage = window.localStorage;

	this.set = function(key, value, append){
		value = append ? (this.get(key) + '|' + value) : value;
		storage.setItem(key, value);
	};

	this.get = function(key){
		if(!key) return '';

		return storage.getItem(key);
	};

	this.erase = function(key){
		storage.removeItem(key);
	};

	this.clear = function(){
		for(var i=0; i<storage.length;){
			storage.removeItem(storage.key(i));
		}
	};

	this.fuzzy = function(f){
		var data = {};
		for(var i=0; i<storage.length; i++){
			var key = storage.key(i);
			if(key.indexOf(f) >= 0){
				var temp = {};
				temp = JSON.parse(this.get(key));
				data[key] = temp;
			}
		}

		return data;
	};
};