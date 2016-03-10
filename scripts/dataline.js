;

/*
 * @theme: smartnet_movie cms data request
 */
 (function(global){
 	var
 		self = undefined
 		,timeoutDelay = 8000
 		,ajaxTimeouts = {};

 	var Datarequest = function(){
 		self = this;
 	};

 	var proto = Datarequest.prototype;

 	proto.request = function(prefix, rst, callback, ckey){
 		if(!ckey){
 			ckey = Math.ceil((new Date()).getMilliseconds()*(Math.random()*100)*17/Math.ceil((Math.random()*10+1)));
 		}

 		if(!ajaxTimeouts[ckey]){
 			ajaxTimeouts[ckey] = setTimeout(function(){
 				clearTimeout(ajaxTimeouts[ckey]);
 				ajaxTimeouts[ckey] = 0;
 				delete ajaxTimeouts[ckey];

 				if(callback){
 					callback(null, 'error: data request time out!');
 				}
 			}, timeoutDelay);
 		}

 		var link = prefix;
 		for(var r in rst){
 			if(rst[r]){
 				link += '/' + rst[r];
 			}
 		}
 
 		$.ajax({
 			async: true,
 			url: link,
 			type: 'GET',
 			datatype: 'jsonp',
 			timeout: timeoutDelay,
 			ckey: ckey,
 			success: function(result){
 				if(ajaxTimeouts[ckey]){
 					clearTimeout(ajaxTimeouts[ckey]);
 					ajaxTimeouts[ckey] = 0;
 					delete ajaxTimeouts[ckey];

 					if(Object.prototype.toString.call(result) === '[object String]'){
 						callback($.parseJSON(result), '');
 					}
 					else{
 						callback(result, !result ? 'error: data request failed!' : '');
 					}
 				}
 				else{
 					callback(null, 'error: data request time out!');
 				}
 			}
 		});
 	};


 	proto.load_cate = function(link, sys, id, callback){
 		if(!callback){
 			throw 'necessary parameter undefined at ' + arguments.callee;
 		}

 		var pt = {};

 		if (id) {
 			if(typeof(id) != typeof(undefined)){
	 			pt['url'] = sys + '-cate-' + id + '.html';
 			}
 		} else {
 			if(typeof(id) == typeof(undefined)){
	 			pt['url'] = sys + '-cate.html';
 			}
 		}
 		

 		self.request.apply(self, [link, pt, callback]);
 	};

 	proto.load_parent = function(link, sys, id, callback){
 		if(!callback){
 			throw 'necessary parameter undefined at ' + arguments.callee;
 		}

 		var pt = {};

 		if(typeof(id) != typeof(undefined)){
 			pt['url'] = sys + '-parent-' + id + '.html';
 		}

 		self.request.apply(self, [link, pt, callback]);
 	};

 	proto.load_grand = function(link, sys, id, callback){
 		if(!callback){
 			throw 'necessary parameter undefined at ' + arguments.callee;
 		}

 		var pt = {};

 		if(typeof(id) != typeof(undefined)){
 			pt['url'] = sys + '-grand-' + id + '.html';
 		}

 		self.request.apply(self, [link, pt, callback]);
 	};
 	
 	proto.load_loadunknown = function(link, sys, id, callback){
 		if(!callback){
 			throw 'necessary parameter undefined at ' + arguments.callee;
 		}

 		var pt = {};

 		if(typeof(id) != typeof(undefined)){
 			pt['url'] = sys + '-unknown-' + id + '-1' + '.html';
 		}

 		self.request.apply(self, [link, pt, callback]);
 	};
 	
 	proto.load_list = function(link, sys, id, offset, pagecount, callback){
 		if(!callback){
 			throw 'necessary parameter undefined at ' + arguments.callee;
 		}

 		var pt = {};

 		if(typeof(id) != typeof(undefined)){
 			pt['url'] = sys + '-more-' + id + '-' + offset + '-' + pagecount + '.html';
 		}

 		self.request.apply(self, [link, pt, callback]);
 	};

 	proto.load_article = function(link, sys, id, callback){
 		if(!callback){
 			throw 'necessary parameter undefined at ' + arguments.callee;
 		}

 		var pt = {};

 		if(typeof(id) != typeof(undefined)){
 			pt['url'] = sys + '-art-' + id + '.html';
 		}

 		self.request.apply(self, [link, pt, callback]);
 	};

 	global.Datarequest = Datarequest;
 })(this);

/*
 * @theme: smartnet_movie cms data interface
 */

 (function(global){
 	var
 		dq_cfg = {
 			'depend': 'http://192.168.1.251/spt/index.php/api',
 			'parent': 'http://192.168.1.251/spt/index.php/api',
 			'list': 'http://192.168.1.251/spt/index.php/api',
 			'article': 'http://192.168.1.251/spt/index.php/api'
 		};
 	var 
 		self = undefined
 		,dq = undefined;

 	var Dataface = function(){
 		self = this;
 		dq = new Datarequest();
 	};

 	var proto = Dataface.prototype;

 	proto.depend = function(sys, id){
 		return $.Deferred(function(dfd){
	 		dq.load_cate(dq_cfg['depend'], sys, id, function(data, err){
	 			dfd.resolve(data, err);
	 		});
 		}).promise();
 	};

 	proto.parent = function(sys, id){
 		return $.Deferred(function(dfd){
 			dq.load_parent(dq_cfg['parent'], sys, id, function(data, err){
 				dfd.resolve(data, err);
 			});
 		}).promise();
 	};

 	proto.grand = function(sys, id){
 		return $.Deferred(function(dfd){
 			dq.load_grand(dq_cfg['parent'], sys, id, function(data, err){
 				dfd.resolve(data, err);
 			});
 		}).promise();
 	};

 	proto.loadunknown = function(sys, id){
 		return $.Deferred(function(dfd){
 			dq.load_loadunknown(dq_cfg['parent'], sys, id, function(data, err){
 				dfd.resolve(data, err);
 			});
 		}).promise();
 	};

 	proto.list = function(sys, id, offset, page){
 		return $.Deferred(function(dfd){
 			dq.load_list(dq_cfg['list'], sys, id, offset, page, function(data, err){
 				dfd.resolve(data, err);
 			});
 		}).promise();
 	};

 	proto.article = function(sys, id){
 		return $.Deferred(function(dfd){
 			dq.load_article(dq_cfg['article'], sys, id, function(data, err){
 				dfd.resolve(data, err);
 			});
 		}).promise();
 	}

 	global.Dataface = Dataface;
 })(this);

;
if(typeof(FW) == typeof(undefined)) FW = {};
if(typeof(FW.Dataline) == typeof(undefined)) FW.Dataline = {};

FW.Dataline.Configure = {
	baseurl: ''
};

FW.Dataline.Datapool = function(){
	var
		config = FW.Dataline.Configure,
		dataface = new window.Dataface();

	this.LoadDepend = function(sys, id){
		return $.Deferred(function(dfd){
			dataface.depend(sys, id).then(function(data, err){
				dfd.resolve(data, err);
			});
		}).promise();
	};

	this.LoadList = function(sys, id, page, count){
		return $.Deferred(function(dfd){
			dataface.list(sys, id, page, count).then(function(data, err){
				dfd.resolve(data, err);
			});
		}).promise();
	};

	this.LoadArticle = function(sys, id){
		return $.Deferred(function(dfd){
			dataface.article(sys, id).then(function(data, err){
				dfd.resolve(data, err);
			});
		}).promise();
	};

	this.LoadParent = function(sys, id){
		return $.Deferred(function(dfd){
			dataface.parent(sys, id).then(function(data, err){
				dfd.resolve(data, err);
			});
		}).promise();		
	};

	this.LoadGrand = function(sys, id){
		return $.Deferred(function(dfd){
			dataface.grand(sys, id).then(function(data, err){
				dfd.resolve(data, err);
			});
		}).promise();		
	};

	this.LoadUnknown = function(sys, id){
		return $.Deferred(function(dfd){
			dataface.loadunknown(sys, id).then(function(data, err){
				dfd.resolve(data, err);
			});
		}).promise();		
	};

	function request(){

	};
};