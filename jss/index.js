'use strict';
var generalValues=[];
function atest(w){
    $('#aaaWindow').children('.container_title').html(w);
}

function setWindow(windowName,windowTitle,height,width){
    var windowObj=$('#'+windowName+'Window')
    windowObj.children('.container_title').html(windowTitle);
    windowObj.css('height',height);
    windowObj.css('width',width);

}


var dragging=false;
var draggingElement;
var dy,dx;
$(document).on('mousedown touchstart','.container_title',function(e){
    if(!dragging){
        var mouseX=e.pageX;
        var mouseY=e.pageY;
        draggingElement=$(this).parent();
        dragging=true;
        dy=mouseY-draggingElement.offset().top
        dx=mouseX-draggingElement.offset().left
    }
})

$(document).on('mousemove touchmove',function(e) { 
    if(dragging){
        var mouseX=e.pageX;
        var mouseY=e.pageY;
        draggingElement.offset({"left":mouseX-dx,"top":mouseY-dy});
    }
});


$(document).on('mouseup touchend',function(){
    if(dragging){
        dragging=false;
    }
})
newWindow('select');
newWindow('msgBox');
function newWindow(windowName){
    if(!$('#'+windowName+'Window').length>0){
        $('body').append('<div id="'+windowName+'Window" id="selectFrame" class="window"><div class="container_title">加载中</div><div class="container_closeBtn">×</div><iframe class="frame" src="./windows/'+windowName+'.html"></iframe></div>')
    }else{
        $('#'+windowName+'Window').children('.frame').attr('src',$('#'+windowName+'Window').children('.frame').attr('src'));
    }
}

function generalVar(varName,value){
    generalValues[varName]=value;
}