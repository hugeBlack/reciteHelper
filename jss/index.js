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
})

function getData(){
    var time=0;
    var loaded=0;    
    $('#syncBtnText').html('同步中');
    $.post("./jss/rhSever.php",{'actionCode':'readRecitePeresonalInfo'}, function (data) {
        // console.warn(data);
        loaded++;
    })

    var a=setInterval(() => {
        time++;
        if(loaded>=4){
            $('#syncBtnText').html('完成:'+time/100+'秒');
            time=0;
            loaded==0;
            setTimeout(function(){
                $('#syncBtnText').html('数据同步');
            },2000)
            clearInterval(a);
        }
    },10)
    
    function getState(element){
        if(element.score==200){return 3;}
        if(element.score==100){return 1;}
        if(element.score>=85 && element.score<100){return -1;}
        if(element.score>=70 && element.score<85){return -2;}
        if(element.score<75){return -3;}
    }

    $.post("./jss/rhSever.php",{'actionCode':'getPoems'}, function (data) {
        generalValues['poemList']=JSON.parse(data)
        $.post("./jss/rhSever.php",{'actionCode':'getPackages'}, function (data) {
            $.post("./jss/rhSever.php",{'actionCode':'getHistoryList'}, function (data) {
                if(data!='notLoggedin'){
                    data=data==''?'[]':data;
                    generalValues['testHistory']=JSON.parse(data);
                    generalValues['testHistory'].forEach(function(record){
                        record.item.forEach(function(sentence,sentenceIndex){
                            var sentenceNo=parseInt(sentence.sentenceNo);
                            var poemNo=parseInt(sentence.poemNo);
                            if(typeof(generalValues['poemList'][poemNo].content[sentenceNo].knowPoint)!='undefined'){
                                generalValues['poemList'][poemNo].content[sentenceNo].knowPoint+=getState(sentence);
                            }else{
                                generalValues['poemList'][poemNo].content[sentenceNo].knowPoint=getState(sentence);
                            }
                        })
                    })
                }
                loaded+=3;
            })            
            generalValues['packageList']=JSON.parse(data)
            generalValues['packageList'].push({pakageName:'所有篇目',content:[]});
            generalValues['poemList'].forEach(function(e,index){
                generalValues['packageList'][generalValues['packageList'].length-1].content.push(index);
            });
            $('#seeAllBtnText').html('共'+generalValues['poemList'].length+'篇')
        })
    })



    $.post("./jss/rhSever.php",{'actionCode':'getPersonalInfo'}, function (data) {
        if(data!='notLoggedin'){
            generalValues['personalInfo']=JSON.parse(data)
            $('#personalInfoBtnText').html(generalValues['personalInfo'].nickName);
        }else{
            $('#personalInfoBtnText').html('请登录');
        }
    })
}

function request(actionCode,value){
    $.post("./jss/rhSever.php",{'actionCode':actionCode,'data':value}, function (data) {
        return(data);
    })
}