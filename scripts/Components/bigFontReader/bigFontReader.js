
if(typeof(undefined) == typeof(FW)) FW={};
if(typeof(undefined) == typeof(FW.UI)) FW.UI={};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components={};


/*=============================================================================
#     FileName: comfortread.js
#     Desc: 大字幕版阅读器
#     Author: cici lin
#     Version: 0.0.2
#     LastChange: 2015-07-01
=============================================================================*/

FW.define(undefined, undefined, 'scripts/Components/bigFontReader/bigFontReader', function(){
    
    var
        container,
        data,
        height;

    var 
        chapters,
        chaptersLength,
        chapterId = 0;

    var
        YRAPI = YX.Read
        ,bigFontReader  = new Widget('scripts/Components/bigFontReader/bigFontReader');
 
 /**
 * 外层调用入口文件
 * @param {String}   外层容器
 * @param {String}   插入的数据(数据格式：文本字符串)
 * @param {function} 关闭容器回掉函数
 * @param {function} 加载容器回调函数
 * @return {Void}
 */

    bigFontReader.init = function(contain, arr, pheight) {
        if(contain) container = contain;
        if(arr) data = arr;
        if(pheight) height = pheight;

        if (container && data && height) {
            refineReaderData(data);
        } 
    };

    function refineReaderData (data) {
        chapters = [];
        for (var i in data) {
            chapters.push(data[i].value);
        }
        console.log(chapters);
        bigFontReader.Start(chapterId);
        // YRAPI.ContinueRead('好萌啊', null, null,  '好猛啊', true, null);
    };

    // 阅读部分
    bigFontReader.Start = function(index) {
        readArticleFromChapter(index);
    };

    function readArticleFromChapter(index) {
        chaptersLength = chapters.length - 1;
        currentChapter = chapters[index];

        if (index == chaptersLength) {
            nextChapter = null;
        }
        else {
            nextChapter = chapters[index +1];
        }
        console.log(currentChapter);
        console.log(nextChapter);
        debugger
        YRAPI.ContinueRead(currentChapter, null, null, SetCurrentReadingIndex,true, null);
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
    };

    bigFontReader.Pause = function() {
        YRAPI.UnContinueRead();
        YRAPI.Stop();
    };

    bigFontReader.Stop = function() {
        chapterId = 0;
        YRAPI.UnContinueRead();
        YRAPI.Stop();
    };

    return bigFontReader;
});
