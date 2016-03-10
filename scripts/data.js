;
if(typeof(undefined) == typeof(FW)) FW={};

//框架数据获取
FW.Datamap = {
	magic: new YX.Data(),
	News: {	//资讯的数据调用接口
		isCateResolved: false,
		resolvedCateData: undefined,
		loadCates: function(force){
			return $.Deferred(function(dfd){
				if(FW.Datamap.News.isCateResolved){
					dfd.resolve(FW.Datamap.News.resolvedCateData);
					return;
				}

	    		FW.Datamap.magic.Cate(null, null, function(res, err) {
	                if (!res) {
	                    dfd.reject('ESERVERFAIL');
	                    return;
	                }

	                if ('true' !== res.success || !res.data) {
	                    dfd.reject('ENOTREADY');
	                    return;
	                }

	                FW.Datamap.News.loadCates.isCateResolved = true;
	                FW.Datamap.News.loadCates.resolvedCateData = res;

	                dfd.resolve(res);
	            }, 'ncate');
	    	}).promise();
		},
		loadArt: function(artId){
			return $.Deferred(function(dfd){
				FW.Datamap.magic.Art(artId, function(res, err){ 
	    			var result = [{'success':false}, artId];

	    			if(res && res.success == 'true'){
	    				var current = {
		                    		id:null,
		                    		name:null,
		                    		url:null,
		                    		text:null,
		                    		table:null,
		                    		time:null,
		                    		from:null,
		                    		proxy:null
		                    		};

		                current.id = res.data.id;
		                current.name = res.data.name;
		                current.url = res.data.url;
		                current.text = unescape(res.data.art);
		                current.proxy = res.proxy;

		                result[0]['success'] = true;
		                result[0][current.id] = current;
	    			}
	    			else{
	    				dfd.reject('ESERVERFAIL');
	    			}

	    			dfd.resolve(result);
	    		}, 'nart');
			}).promise();
		},
		lastResolveGroupId: 0,
		lastResolveGroupData: undefined,
		loadMore: function(groupId){
			return $.Deferred(function(dfd){
				if(FW.Datamap.News.lastResolveGroupId == groupId){ 
					dfd.resolve([FW.Datamap.News.lastResolveGroupData, groupId]);
	    			return;
	    		}

	    		FW.Datamap.magic.More(groupId, function(res, err){
	    			var result = [undefined, undefined];
	    			FW.Datamap.News.lastResolveGroupId = groupId;
	    			FW.Datamap.News.lastResolveGroupData = {};
	    			if(res && res.success == 'true'){ 
	    				for(var i in res.data){
	    					var current = {};
	    					current['id'] = res.data[i].id;
	    					current['from'] = res.data[i].areaname;
	    					current['name'] = res.data[i].name;
	    					current['text'] = res.data[i].info;
	    					current['pic'] = res.data[i].pic;
	    					current['time'] = res.data[i].ptime?res.data[i].ptime:res.data[i].time;
	    					current['url'] = res.data[i].url;
	    					FW.Datamap.News.lastResolveGroupData[current['id']] = current;
	    				}

	    				result[0] = FW.Datamap.News.lastResolveGroupData;
	    				result[1] = groupId;
	    			}
	    			else{
	    				dfd.reject('ESERVERFAIL');
	    			}

	    			dfd.resolve(result);
	    		}, null, null, null, 'nmore');
			}).promise();
		}
	},
	Site: {
		resolveSiteCate: undefined,
		resolveSite: false,
		resolveSiteCateId: -1,
		resolveForce: '1',
		loadCates: function(force){		//force = [undefined, 'sgcate']，后者表示加载原网页导航
			return $.Deferred(function(dfd){
				if(FW.Datamap.Site.resolveSite == true){
					dfd.resolve(FW.Datamap.Site.resolveSiteCate);
					return;
				}

		        FW.Datamap.magic.Cate(null, null, function(res, err) {
		            if (!res) {
		                dfd.reject('ESERVERFAIL');
		                return;
		            }

		            if ('true' !== res.success || !res.data) {
		                dfd.reject('ESERVERFAIL');
		                return;
		            }

		            FW.Datamap.Site.resolveSite = true;
		            FW.Datamap.Site.resolveSiteCate = res;

		            dfd.resolve(res);
		        }, 'scate');

		    }).promise();
		}
		,lastResolvedMapId: -1
		,lastResolvedMapData : undefined
		,loadMap: function(id){
	        return $.Deferred(function(dfd){
	            if(FW.Datamap.Site.lastResolvedMapId == id){
	                dfd.resolve(FW.Datamap.Site.lastResolvedMapData);
	                return;
	            }

	            FW.Datamap.magic.Map(id, function(res, err){
	                var result = res;
	                FW.Datamap.Site.lastResolvedMapId = id;
	                if(!res){
	                    FW.Datamap.Site.lastResolvedMapId = -1;
	                }

	                FW.Datamap.Site.lastResolvedMapData = res;

	                dfd.resolve(result);
	            });
	        }).promise();
		},
		lastResolvedCateid:-1,
		lastResolvedCateData:undefined,
		loadWebList: function(mapid, pageIndex, loadCount, siteid){
	        return $.Deferred(function(dfd){
	        	if(FW.Datamap.Site.lastResolvedCateid == mapid
	        		&& FW.Datamap.Site.lastResolvedCateData){
	        		dfd.resolve(FW.Datamap.Site.lastResolvedCateData);
	        		return;
	        	}

	            FW.Datamap.magic.List(mapid, function(res, err){
	                var result = res;
	                FW.Datamap.Site.lastResolvedCateid = mapid;

	                if(!res){
	                    FW.Datamap.Site.lastResolvedCateid = -1;
	                    FW.Datamap.Site.lastResolvedCateData = undefined;
	                }

	                FW.Datamap.Site.lastResolvedCateData = res;

	                dfd.resolve(res);
	            },pageIndex, loadCount, siteid)
	        }).promise();
	    },
	    loadArt: function(artId){
			return $.Deferred(function(dfd){
				FW.Datamap.magic.Art(artId, function(res, err){ 
	    			var result = [{'success':false}, artId];

	    			if(res && res.success == 'true'){
	    				var current = {
		                    		id:null,
		                    		name:null,
		                    		url:null,
		                    		text:null,
		                    		table:null,
		                    		time:null,
		                    		from:null
		                    		};

		                current.id = res.data.id;
		                current.name = res.data.name;
		                current.url = res.data.url;
		                current.text = unescape(res.data.art);
		                current.time = res.data.time;
		                if(!current.time || current.time.length <= 0){
		                	current.time = res.data.ptime;
		                }

		                current.time = !current.time ? '' : current.time;

		                result[0]['success'] = true;
		                result[0][current.id] = current;
	    			}
	    			else{
	    				dfd.reject('ESERVERFAIL');
	    			}

	    			dfd.resolve(result);
	    		}, 'sart');
			}).promise();
		},
		loadIndex: function(id){
			return $.Deferred(function(dfd){
				FW.Datamap.magic.Index(id, function(res, err){
					if(!res || !res.success){
						dfd.reject(res);
					}

					dfd.resolve(res);
				}, 'sindex');
			}).promise();
		},
		//http://218.22.178.94/yxsm/index.php?m=apim2&a=sortByDate&lid=6&tid=&yxjn=dd
		loadSystemMessage: function(){
			return $.Deferred(function(dfd){
				FW.Datamap.magic.SortNews(function(res, err){
					var results=undefined;
					if(res && res.success && res.data){
						results = {};
						results['today'] = res.data['today'];
						results['week'] = res.data['week'];
					}
					dfd.resolve(results);
				});
			}).promise();
		}
	},
	Office: {
		resolveSiteCate: undefined,
		resolveSite: false,
		resolveSiteCateId: -1,
		resolveForce: '1',
		loadCates: function(force){		//force = [undefined, 'sgcate']，后者表示加载原网页导航
			return $.Deferred(function(dfd){
				if(FW.Datamap.Office.resolveSite == true){
					dfd.resolve(FW.Datamap.Office.resolveSiteCate);
					return;
				}

		        FW.Datamap.magic.Cate(null, null, function(res, err) {
		            if (!res) {
		                dfd.reject('ESERVERFAIL');
		                return;
		            }

		            if ('true' !== res.success || !res.data) {
		                dfd.reject('ESERVERFAIL');
		                return;
		            }

		            FW.Datamap.Office.resolveSite = true;
		            FW.Datamap.Office.resolveSiteCate = res;

		            dfd.resolve(res);
		        }, 'ocate');

		    }).promise();
		},
		lastResolvedCateid:-1,
		lastResolvedCateData:undefined,
		loadList: function(mapid, pageIndex, loadCount, siteid){
	        return $.Deferred(function(dfd){
	        	if(FW.Datamap.Office.lastResolvedCateid == mapid
	        		&& FW.Datamap.Office.lastResolvedCateData){
	        		dfd.resolve(FW.Datamap.Office.lastResolvedCateData);
	        		return;
	        	}

	            FW.Datamap.magic.List(mapid, function(res, err){
	                var result = res;
	                FW.Datamap.Office.lastResolvedCateid = mapid;

	                if(!res){
	                    FW.Datamap.Office.lastResolvedCateid = -1;
	                    FW.Datamap.Office.lastResolvedCateData = undefined;
	                }

	                FW.Datamap.Office.lastResolvedCateData = res;

	                dfd.resolve(res);
	            },pageIndex, loadCount, siteid, 'olist')
	        }).promise();
	    },
	    loadArt: function(artId){
			return $.Deferred(function(dfd){
				FW.Datamap.magic.Art(artId, function(res, err){ 
	    			var result = [{'success':false}, artId];

	    			if(res && res.success == 'true'){
	    				var current = {
		                    		id:null,
		                    		name:null,
		                    		url:null,
		                    		text:null,
		                    		table:null,
		                    		time:null,
		                    		from:null
		                    		};

		                current.id = res.data.id;
		                current.name = res.data.name;
		                current.url = res.data.url;
		                current.text = unescape(res.data.art);
		                current.time = res.data.time;
		                if(!current.time || current.time.length <= 0){
		                	current.time = res.data.ptime;
		                }

		                current.time = !current.time ? '' : current.time;

		                result[0]['success'] = true;
		                result[0][current.id] = current;
	    			}
	    			else{
	    				dfd.reject('ESERVERFAIL');
	    			}

	    			dfd.resolve(result);
	    		}, 'oart');
			}).promise();
		}
	}
};

//cate数据处理
FW.Datafactory = {
	init: function(){

	},
	getCatagroies: function(cate){
		var categore = {};

		if(!cate || !cate.data) return undefined;

		for(var c in cate.data){
			categore[c] = cate.data[c];
		}

		return categore;
	},
	//获得第一个metro的id
	getDefaultCategore: function(cates){
		if(!cates || !cates.data) return 0;

		var id = 0; 
    	if(cates.data){ 
    		for(var single in cates.data){
    			id = cates.data[single].id;
    			break;
    		}
    	}

    	return id;
	},
	//获得cateid下的默认第一个metro数据
	getDefaultMetro: function(cateid, cates){
		if(!cates || !cates.data) return undefined;

		var me = undefined;

		for(var d in cates.data){
			if(cates.data[d].id == cateid){
				for(var m in cates.data[d].metro){
					me = cates.data[d].metro[m];
					break;
				}

				break;
			}
		}

		return me;
	},
	//获得cateid下的所有metro
	getMetro: function(cateid, cates){
		if(!cates || !cates.data) return undefined;

		var me = {};

		for(var d in cates.data){
			if(cates.data[d].id == cateid){
				me = cates.data[d].metro;

				break;
			}
		}

		return me;
	},
	//获得mapid的详细路径
    //returns：[type, ids[], keys[]]
    //			type: -1--没找着~
    //				  0--第一层 1--第二层 2--第三层
    //			ids: mapid的所在路径对应的id，包含第一层id，第二层id，第三层id？
    //			keys：mapid的所在路径对应的键值
    //			brothers: 第三层检索时，返回兄弟对象
	relations: function(mapid, cates){
		var grandpaId = 1 ,keys = [0,0,0],ids = [0,0,0], brothers = {}, sons={}, id, type = -1, cateid=null, siteid = null;
		var bInMetro = false, bInGrid = false;
		var self = undefined;

		for(var i in cates.data){ 
			ids[0] = cates.data[i].id;
			keys[0] = i;
			if(cates.data[i].id == mapid){ 
				type = 0;
				sons = cates.data[i].metro;
				self = cates.data[i];
				break;
			}

			if(cates.data[i].metro && typeof cates.data[i].metro === 'object'){ 
				for(var m in cates.data[i].metro){
					ids[1] = cates.data[i].metro[m].id;
					keys[1] = m;
					if(mapid == cates.data[i].metro[m].id){
						bInMetro = true;
						type = 1;
						sons = cates.data[i].metro[m].grids;
						self = cates.data[i].metro[m];
						brothers = cates.data[i].metro;
						break;
					}

					if(cates.data[i].metro[m].grids){ 
						for(var g in cates.data[i].metro[m].grids){
							ids[2] = cates.data[i].metro[m].grids[g].id; 
							keys[2] = g;

							if(mapid == cates.data[i].metro[m].grids[g].id){
								bInGrid = true;
								type = 2;
								self = cates.data[i].metro[m].grids[g];
								break;
							}
						}

						if(bInGrid == true){ 
							for(var g in cates.data[i].metro[m].grids){
								brothers[g] = cates.data[i].metro[m].grids[g];
							}
						}
					}

					if(bInGrid){
						break;
					}
				}
			}

			if(bInMetro || bInGrid){
				break;
			}
		}

		return [type, ids, keys, brothers, sons, self];
	}
};