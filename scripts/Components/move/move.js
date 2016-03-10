
if(typeof(undefined) == typeof(FW)) FW={};
if(typeof(undefined) == typeof(FW.UI)) FW.UI={};
if(typeof(undefined) == typeof(FW.UI.Components)) FW.UI.Components={};


/*=============================================================================
#     FileName: move.js
#     Desc: 上下滚动
#     Author: cici lin
#     Version: 0.0.2
#     LastChange: 2015-10-13
=============================================================================*/

FW.define(undefined, undefined, 'scripts/Components/move/move', function(){
    var
        move  = new Widget('scripts/Components/move/move');


    move.tmove = function (contain, high, fou) {
        var container = 'body', foucs = 'body',
            height = '70',  index = null,   mask = 2, //要摆放的位置
            step, top;
        
        if(contain) container = contain;
        if(high) height = high;
        if(fou) foucs = fou;

        if (container && height && foucs) {
            index = foucs.index();
            step = mask -index;
            top = 410/2 + 45 + (80)*index + 25;
            container.animate({'margin-top' : '-' + top + 'px'}, 600);
        }     
    };

    move.lmove = function (contain, cfou) {
        var container = 'body', target = 'body',             
            mf = 0, step = 0, itemWidth = 370, spacing = 40;
     
        if(contain) container = contain;
        if(cfou) target = cfou;
      
        if (container && target) {
            step = target.index();
            itemWidth = target.width() + spacing;

            if (step > 0) {
                mf = -((step - 1) * itemWidth + 250);
            } else {
                mf = 0;
            }
            container.animate({left : mf + 'px'}, 600);
        }
    };

    return move;
});
