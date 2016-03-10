YX.Data.Config = function(module)
{
	var instance =this;
	this.serverPath = "";
	this.siteUrl="";
	this.siteRouter = "";
	this.mapUrl="";
	this.mapRouter = "";
	this.hotUrl="";
	this.hotRouter = "";
	this.listUrl="";
	this.listRouter = "";
	this.artUrl="";
	this.artRouter = "";
	this.cateUrl="";
	this.cateRouter = "";
	this.moreUrl="";
	this.moreRouter = "";
	this.orderUrl="";
	this.orderRouter="";
	this.newsUrl="";
	this.newsRouter="";
	this.indexUrl="";
	this.indexRouter="";
	this.sortUrl="";
	this.sortRouter="";
	this.sid="";
	this.lid="";
	this,tid="";
	this.HttpPath = function(path)
	{
		return instance.GetDomain()+instance.serverPath+path;
	};
	this.GetDomain=function()
	{
		return document.location.href.split(instance.serverPath)[0];
	};
	this.Init=function()
	{
		var paths = location.pathname.split("/");
		var lasPath = paths.length<3?"":paths[paths.length-2];
		instance.serverPath=lasPath+"/";
		instance.siteUrl = $("#yx_siteurl").length>0?$("#yx_siteurl").get(0).href:"";
		instance.siteRouter = $("#yx_siteurl").length>0?$("#yx_siteurl").get(0).getAttribute('router'):"";
		instance.mapUrl = $("#yx_mapurl").length>0?$("#yx_mapurl").get(0).href:"";
		instance.mapRouter = $("#yx_mapurl").length>0?$("#yx_mapurl").get(0).getAttribute('router'):"";
		instance.hotUrl = $("#yx_hoturl").length>0?$("#yx_hoturl").get(0).href:"";
		instance.hotRouter = $("#yx_hoturl").length>0?$("#yx_hoturl").get(0).getAttribute('router'):"";
		instance.listUrl = $("#yx_listurl").length>0?$("#yx_listurl").get(0).href:"";
		instance.listRouter = $("#yx_listurl").length>0?$("#yx_listurl").get(0).getAttribute('router'):"";
		instance.cateUrl = $("#yx_cateurl").length>0?$("#yx_cateurl").get(0).href:"";
		instance.cateRouter = $("#yx_cateurl").length>0?$("#yx_cateurl").get(0).getAttribute('router'):"";
		instance.moreUrl = $("#yx_moreurl").length>0?$("#yx_moreurl").get(0).href:"";
		instance.moreRouter = $("#yx_moreurl").length>0?$("#yx_moreurl").get(0).getAttribute('router'):"";
		instance.artUrl = $("#yx_arturl").length>0?$("#yx_arturl").get(0).href:"";
		instance.artRouter = $("#yx_arturl").length>0?$("#yx_arturl").get(0).getAttribute('router'):"";
		instance.orderUrl = $("#yx_suburl").length>0?$("#yx_suburl").get(0).href:"";
		instance.orderRouter = $("#yx_suburl").length>0?$("#yx_suburl").get(0).getAttribute('router'):"";
		instance.newsUrl = $("#yx_newsurl").length>0?$("#yx_newsurl").get(0).href:"";
		instance.newsRouter = $("#yx_newsurl").length>0?$("#yx_newsurl").get(0).getAttribute('router'):"";
		instance.indexUrl = $("#yx_indexurl").length>0?$("#yx_indexurl").get(0).href:"";
		instance.indexRouter = $("#yx_indexurl").length>0?$("#yx_indexurl").get(0).getAttribute('router'):"";
		instance.sortUrl = $("#yx_sorturl").length>0?$("#yx_sorturl").get(0).href:"";
		instance.sortRouter = $("#yx_sorturl").length>0?$("#yx_sorturl").get(0).getAttribute('router'):"";
		instance.sid=$("#yx_sid").length>0?$("#yx_sid").text():"";
		instance.tid=$("#yx_tid").length>0?$("#yx_tid").text():"";
		instance.lid=$("#yx_lid").length>0?$("#yx_lid").text():"";
	};
};
