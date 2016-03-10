介绍：本插件实现业务层数据获取、缓存以及回调等功能
对外接口说明：
var instance=new YX.Data() 
@abstract 初始化数据接口，调用接口必须执行，根据index.html lid或者tid设置获取网站群数据

instance.Site(callback)
@abstract 获取网站类别和站点基本信息接口
@callback 获取数据后执行的回调函数，并将地图数据作为回调函数的参数传递

instance.Map(sid,callback) 
@abstract 获取网站地图数据接口
@callback 获取数据后执行的回调函数，并将地图数据作为回调函数的参数传递
@sid 网站编号，为空则根据index.html配置中读取,若读取不到返回异常

instance.Hot(sid,callback)
@abstract 获取系统最新和站点下最新10条新闻接口
@callback 获取数据后的回调函数，并将地图数据作为回调函数的参数传递
@sid 网站编号，缺省为上次Map接口传递的参数


instance.List(mid,callback,pno,pco,sid)
@abstract 获取指定栏目的列表数据接口
@callback 获取数据后的回调函数，并将地图数据作为回调函数的参数传递
@mid 栏目编号
@pno 第几页下标从1开始，默认为第一页
@pco 每页多少条，默认为150条
@sid 网站编号，缺省为上次Map接口传递的参数

instance.Art(aid,callback)
@abstract 获取文章数据接口
@aid 文章编号
@callback 获取数据后执行的回调函数，并将文章数据作为回调函数的参数传递


instance.Cate(lid,tid,callback)
@abstract 获取系统类目接口
@callback 获取数据后的回调函数，并将地图数据作为回调函数的参数传递
@lid 系统所属地区，缺省为根据页面中id为yx_lid元素text数值
@tid 系统所属行业，缺省为根据页面中id为yx_tid元素text数值


instance.More(cid,callback,pno,pco,sid)
@abstract 获取更多数据接口
@cid 栏目编号
@callback 获取数据后的回调函数，并将地图数据作为回调函数的参数传递
@pno 第几页下标从1开始，默认为第一页
@pco 每页多少条，默认为150条
@sid 网站编号，缺省为上次Map接口传递的参数




instance.cache.IsCache=[true|false]
@abstract 指示获取的数据是否缓存

instance.SetTimeout(t)
@abstract 设置请求数据超时时间
@t 超时时间(毫秒)，默认数值为10000

YX.Data.StopAllRequest()
@abstract 中断所有请求

instance.cache.Clear()
@abstract 清空数据缓存

instance.RD(url,data,callback,cKey)
@url 数据接口的地址
@data 向数据接口提交的数据
@abstract 获取通用数据接口
@callback 获取数据后的回调函数，并将地图数据作为回调函数的参数传递
@cKey 设置缓存键值
