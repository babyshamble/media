YX.Data.Util=function(module)
{
	var instance=this;
	this.DecodeUrl = function(str)
	{
		if(!str) return "";
		return unescape(str);
	};
	this.EncodeUrl=function(str)
	{
		return str?escape(str):"";
	};
	this.Serialize=function(obj)
	{
	    switch(obj.constructor){  
	        case Object:
	            var str = "{";
	            for(var o in obj){str += o + ":" + this.Serialize(obj[o]) +",";}  
	            if(str.substr(str.length-1) == ",")str = str.substr(0,str.length -1);  
	            return str + "}";  
	            break;  
	        case Array:              
	            var str = "[";  
	            for(var o in obj){str += this.Serialize(obj[o]) +",";}  
	            if(str.substr(str.length-1) == ",") str = str.substr(0,str.length -1);
	            return str + "]";break;
	        case Boolean:return "\"" + obj.toString() + "\"";break;  
	        case Date:return "\"" + obj.toString() + "\"";break;
	        case Function:break;
	        case Number:return "\"" + obj.toString() + "\"";break; 
	        case String:return "\"" + obj.toString() + "\"";break;      
	    }  
	};
};