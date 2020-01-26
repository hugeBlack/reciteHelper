'use strict';
var generalValues=[];
var windowCount=0;
function setWindow(windowName,windowTitle,height,width){
    var windowObj=$('#'+windowName+'Window')
    windowObj.children('.container_title').html(windowTitle);
    windowObj.css('height',height);
    windowObj.css('width',width);

}
$.get("./jss/getPoems.php", function (data) {
    window.parent.generalValues['poemList']=JSON.parse(data)
})

$.get("./jss/getPackages.php", function (data) {
    window.parent.generalValues['packageList']=JSON.parse(data)
})

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
function newWindow(windowName){
    if(!$('#'+windowName+'Window').length>0){
        $('body').append('<div id="'+windowName+'Window" id="selectFrame" class="window"><div class="container_title">加载中</div><div class="container_closeBtn">×</div><iframe class="frame" src="./windows/'+windowName+'.html"></iframe></div>')
        windowCount++;
        $('#desktop').css('display','none');

    }else{
        $('#'+windowName+'Window').children('.frame').attr('src',$('#'+windowName+'Window').children('.frame').attr('src'));
    }
}

$(document).on('click','.container_closeBtn',function () { 
    closeForm($(this).parent().attr('id'));
});

function closeForm(windowName) {
    windowCount--;
    if(window.parent.windowCount==0){
        showDesktop();
    }
    $('#'+windowName).remove();    
}

function generalVar(varName,value){
    generalValues[varName]=value;
}

function showDesktop() {
    $('#desktop').css('display','block');
}

$('#startBtn').click(()=>{
    newWindow('select');
})

$('#seeAllBtn').click(()=>{
    newWindow('allPassage');
})