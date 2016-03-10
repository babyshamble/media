YX.Data.Cache=function(module)
{
	var instance=this;
	this.IsCache=false;
	this.Clear=function()
	{
		instance.Memory.Clear();
		instance.Local.Clear();
	};
	this.Get=function(key)
	{
		if(!instance.IsCache) return null;
		var data =instance.Local.Get(key);
		return data?data:instance.Memory.Get(key);
	};
	this.Set=function(key,val)
	{
		if(!instance.IsCache) return;
		instance.Memory.Set(key, val);
		instance.Local.Set(key, val);
	};
	this.Memory=
	{
		cache:{},
		Set:function(key,data)
		{
			this.cache[key]=data;
		},
		Get:function(key)
		{
			return this.cache[key]?this.cache[key]:null;
		},
		Clear:function()
		{
			this.cache={};
		}
	};
	this.Local=
	{
		Get:function(key)
		{
			var val= window.localStorage&&window.localStorage.getItem(key)?window.localStorage.getItem(key):null;
			if(val&&window.JSON){
				try{val=JSON.parse(val);}catch(e){}
			}
			return val;
		},
		Set:function(key,val)
		{
			if(window.JSON&&typeof(val)=="object") val=JSON.stringify(val);
			if(window.localStorage) window.localStorage.setItem(key,val);
		},
		Clear:function()
		{
			if(window.localStorage) window.localStorage.clear();
		}
		
	};
};