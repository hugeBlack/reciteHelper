'use strict';
var generalValues=[];
var windowCount=0;
function setWindow(windowName,windowTitle,height,width){
    var windowObj=$('#'+windowName+'Window')
    windowObj.children('.container_title').html(windowTitle);
    windowObj.css('height',height);
    windowObj.css('width',width);

}
getData();
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
    getData();
}

function generalVar(varName,value){
    generalValues[varName]=value;
}

function showDesktop() {
    $('#desktop').css('display','block');
}

$('#startBtn').click(()=>{
    if(typeof(generalValues['personalInfo'])!="undefined"){
        newWindow('select');
    }else{
        generalValues['msg']='请登录';
        newWindow('msgBox');
    }
    
})

$('#seeAllBtn').click(()=>{
    newWindow('allPassage');
})

$('#personalInfoBtn').click(()=>{
    newWindow('personalInfo');
})

$('#syncBtn').click(function(){
    getData();
    $('#syncBtnText').html('已完成同步');
    setTimeout(function(){
        $('#syncBtnText').html('数据同步');
    },1000)
})

function getData(){
    $.post("./jss/rhSever.php",{'actionCode':'readRecitePeresonalInfo'}, function (data) {
        // console.warn(data);
    })

    $.post("./jss/rhSever.php",{'actionCode':'getHistoryList'}, function (data) {
        if(data!='notLoggedin'){
            generalValues['testHistory']=JSON.parse(data);
        }
    })

    $.post("./jss/rhSever.php",{'actionCode':'getPoems'}, function (data) {
        generalValues['poemList']=JSON.parse(data)
        $.post("./jss/rhSever.php",{'actionCode':'getPackages'}, function (data) {
            generalValues['packageList']=JSON.parse(data)
            generalValues['packageList'].push({pakageName:'所有篇目',content:[]});
            generalValues['poemList'].forEach(function(e,index){
            generalValues['packageList'][generalValues['packageList'].length-1].content.push(index);
        });
    })
    })



    $.post("./jss/rhSever.php",{'actionCode':'getPersonalInfo'}, function (data) {
        if(data!='notLoggedin'){
            generalValues['personalInfo']=JSON.parse(data)
            $('#personalInfoBtnText').html(generalValues['personalInfo'].nickName);
        }
    })
}

function request(actionCode,value){
    $.post("./jss/rhSever.php",{'actionCode':actionCode,'data':value}, function (data) {
        return(data);
    })
}