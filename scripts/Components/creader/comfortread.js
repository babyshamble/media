
if(typeof(undefined) == typeof(FW)) FW={};
if(typeof(undefined) == typeof(FW.UI)) FW.UI={};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components={};


/*=============================================================================
#     FileName: comfortread.js
#     Desc: 舒适版阅读器
#     Author: cici lin
#     Version: 0.0.2
#     LastChange: 2015-07-01
=============================================================================*/

FW.define(undefined, undefined, 'scripts/Components/creader/comfortread', function(){
    var
        container = 'body'
        ,url = null
        ,data = null
        ,onclose = undefined
        ,onload = undefined
        ,readChapters = []
        ,chapterId = 0
        ,currentChapter
        ,nextChapter
        ,chaptersLength = null
        ,speechSpeed = 0
        ,TRANSFORMER = /<p[^>]*>|<\/p[^>]*>|<br[^>]*>|<span[^>]*>|<\/span[^>]*>|<table[^>]*>|<\/table[^>]*>|<tbody[^>]*>|<\/tbody[^>]*>|<td[^>]*>|<\/td[^>]*>|<tr[^>]*>|<\/tr[^>]*>/g // 用于分割段落
        SECTENCE = /\n|。/g;// 用于分句

    var
        YRAPI = YX.Read
        ,comfortread  = new Widget('scripts/Components/creader/comfortread');

    var
        __container_id = undefined;
 /**
 * 外层调用入口文件
 * @param {String}   外层容器
 * @param {String}   插入的数据(数据格式：文本字符串)
 * @param {function} 关闭容器回掉函数
 * @param {function} 加载容器回调函数
 * @return {Void}
 */

    comfortread.init = function(contain, close, loaded) {
        if(contain) container = contain;
        
        onclose = close;
        onload = loaded;
    };

    comfortread.show = function(d){
        data = d;
        prepareDom();
        $('#comfortread-content').text('');
        dealData(data.text);
        chooseReadChapter(data.text);
    };

    comfortread.close = function(){
        $('#comfortread-close').trigger('click');
    };

    function prepareDom() {
        var html = '<div id="comfortread-close" class="comfortread_close" style="display: none;"></div>'//关闭按钮
                 + '<div id="creader-'+data.id+'" class="creader_container" style="">'
                    +'<div id="comfortread-content" class="comfortread_content" style="">'
                    +'</div>'
                 + '</div>'

        $(container).append(html);
        __container_id = 'creader-'+data.id;
        bindEvents();
    };

    function dealData(e) {
        var cache = [];

        if(!e || !e.length) return;

        cache = e;
        cache = cache.replace(/(&gt;)/ig,">").replace(/(&lt;)/ig,"<").replace(/(&nbsp;)/ig,"");
        cache = cache.split(TRANSFORMER);
        cache = cache.filter(isNullDrop);
        getChapters(cache);
    }

    function isNullDrop(e) {
        var re = /\S+/g; //  非空字符
        e = re.test(e);
        return e;
    }

    function getChapters(e) {
        var
            div,
            nodes,
            node,
            inner,
            chapters = [];

        for (var i=0; i<e.length; i++) {
            div = document.createElement('div');
            div.innerHTML = e[i];
            nodes = $('img', div);

            if (nodes.length > 0) {  //说明包含img标签
                for (var n=0; n<div.childNodes.length; n++){
                    node = div.childNodes[n];
                    if (node.nodeName == 'IMG' || node.nodeName == 'img') {//
                        inner = "<div style='margin-left:50px;width: 50%;max-width:480px;height: 400px;background-image: url("+node.src+");background-repeat: no-repeat;background-position: center;background-size:contain;'>"
                                +"</div>";
                        chapters.push({type: 'image', value: inner});
                    }
                    else if (node.nodeName == '#text') { //这是文本 直接把p里的内容丢进去
                        chapters.push({type: 'text', value: node.nodeValue});

                    }

                }

            }
            else { //说明不包含img标签
                chapters.push({type: 'text', value: e[i]});

            }

        }

        showArt(chapters);
        // chooseReadChapter(chapters);
    }

    function showArt(e){

        var title =
                "<p style='' class='cread_header'>"
                    +data.name
                +"</p>"
                +"<span class='creader_from'>来源:</span><span class='creader_from_name'>"
                +""
                +"</span>";

                $('#comfortread-content').append(title);

        for (var i=0; i<e.length; i++) {
            if (e[i].type == 'text') {
                var text =
                        "<p style='' class='cread_p'>"
                            +e[i].value
                        +"</p>";
                $('#comfortread-content').append(text);
            }
            else if (e[i].type == 'image') { //图片
                $('#comfortread-content').append(e[i].value);
            }
        }
    };

    function bindEvents() {
        $('#comfortread-close').bind('click', function(ev) {
            $('#'+__container_id).empty(); 
            YRAPI.UnContinueRead();
            YRAPI.Stop();

            if(onclose){
                onclose();
            }

        });

    };

    // 阅读部分
    function chooseReadChapter(e) {
        e = e.replace(/<\/?[^>]*>/g,"").replace(/(&nbsp;)/ig,"");
        e = e.split(SECTENCE);
        e = e.filter(isNullDrop);

        readChapters = e;
        chaptersLength = readChapters.length - 1;

        if (window.top !== window.self) {
            window.top.YX.Tools.InitPlaybar(chaptersLength, 0);
            window.top.YX.Tools.SetPlayStatus("pause");
        }
    };

    comfortread.Start = function() {
        readArticleFromChapter(chapterId);
    };

    function readArticleFromChapter(index) {
        currentChapter = readChapters[index];
        if (index == chaptersLength) {
            nextChapter = null;
        }
        else {
            nextChapter = readChapters[index +1];
        }
        // console.log(currentChapter);
        // console.log(nextChapter);
        YRAPI.ContinueRead(currentChapter, null, null,SetCurrentReadingIndex,true,null);

    };

    function SetCurrentReadingIndex() {
        if (chapterId < chaptersLength) {
            chapterId++;
        }
        else {
            chapterId = 0;
            return;
        }

        readArticleFromChapter(chapterId);
        window.top.YX.Tools.InitPlaybar(chaptersLength , chapterId);
    };

    comfortread.ChangeStep = function(type) {
        console.log(chapterId);
        if (type == 'next' && chapterId < chaptersLength) {
            chapterId++;
        }
        else if(type == 'prev' && chapterId > 0) {
            chapterId--;
        }
        readArticleFromChapter(chapterId);
        window.top.YX.Tools.InitPlaybar(chaptersLength , chapterId);
    };


    comfortread.Pause = function() {
        YRAPI.UnContinueRead();
        YRAPI.Stop();
    };

    comfortread.Stop = function() {
        chapterId = 0;
        YRAPI.UnContinueRead();
        YRAPI.Stop();
    };

    comfortread.SetVolume = function(val) {
        val = val > 10 ? 10 : val;
        val = val < 0 ? 0 : val;
        val *= 10;
        YRAPI.SetVolume(val);
    };

    comfortread.SetSpeed = function(type) {
        if (type == 'up') {
            speechSpeed++;
        }
        else if(type == 'down') {
            speechSpeed--;
        }
        if (speechSpeed <0)
            speechSpeed = 0;
        console.log(speechSpeed);
        YRAPI.SetSpeed(speechSpeed);
    };

    return comfortread;
});
