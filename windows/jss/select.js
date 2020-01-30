'use strict';
var packageList=window.parent.generalValues["packageList"];
var poemList=window.parent.generalValues["poemList"];
var sentenceNum = 0;
var valJust = 50;
var selected = [];
poemList.forEach(function (poemNow, index) {
    var availableCount = 0;
    poemNow.content.forEach(function (sentence) {
        if (sentence.pos != 'impossible') {
            availableCount++;
        }
    });
    poemList[index].availableCount = availableCount;
});

packageList.forEach(function(element,index) {
    $('#packageHolder').append('<div class="packageBtn passageDiv unselected" id="'+index+'"><span class="poemName">'+element.pakageName+'</span></div>')
});

$(document).on('click touchend','.packageBtn',function(){
    $('.packageBtn.selected').removeClass("selected");
    $('.packageBtn').addClass("unselected");
    $(this).addClass("selected");
    $(this).removeClass("unselected");
    $('#passageHolder').html('<div class="text"><span id="selectAllBtn">全选</span>   <span id="invertBtn">反选</span></div>');
    $('#text').html('选择篇目');
    packageList[$(this).attr('id')].content.forEach(function(element){
        $('#passageHolder').append('<div class="passageBtn passageDiv '+ifSelected(element)+'" id='+element+'><span class="poemName">'+poemList[element].name+'</span></div>')
    })
})

$(document).on('click touchend','.passageBtn',function(){
    if($(this).hasClass('selected')){
        select($(this),'deselect');
    }else{
        select($(this),'select');
    }
})
$(document).on('mousemove touchstart','.passageBtn',function(){
    $('#text').html(poemList[$(this).attr('id')].name+'</br>');
    poemList[$(this).attr('id')].content.forEach(function(element,index){
        $('#text').append(element.text);
        if(element.pos=='end'){
            $('#text').append('</br>');
        }
    })    
})
function ifSelected(PoemId){
    for (var i = 0; i < selected.length; i++) {
        if (selected[i] == PoemId) {
            return 'selected'
        }
    }
    return 'unselected'
}
function select(passageBtnObj,type){
    if(type=='select'){
        passageBtnObj.removeClass("unselected");
        passageBtnObj.addClass("selected");
        for (var i = 0; i < selected.length; i++) {
            if (selected[i] == passageBtnObj.attr('id')) {
                return;
            }
        }
        
        selected.push(passageBtnObj.attr('id'));        
        calcAll();        
    }
    if(type=='deselect'){
        passageBtnObj.removeClass("selected");
        passageBtnObj.addClass("unselected");
        for (var i = 0; i < selected.length; i++) {
            if (selected[i] == passageBtnObj.attr('id')) {
                selected.splice(i, 1);
                break;
            }
        }
        calcAll();
    }

    function calcAll() {
        sentenceNum = 0;
        selected.forEach(a => {
            sentenceNum += poemList[a].availableCount;
        });
        getVal(valJust);
    }    
}

$("#readyBtn").click(function (e) {
    var sentenceList = [];
    selected.forEach(poemNo => {
        poemList[poemNo].content.forEach(function (sentence, sentenceNo) {
            if (sentence.pos != "impossible") {
                sentenceList.push({
                    "poemNo": poemNo,
                    "sentenceNo": sentenceNo,
                    "score": '-',
                    "text": '?'
                });
            }
        })
    });
    var randomList = [];
    for (var i = 0; i < Math.round(sentenceNum * valJust / 100); i++) {
        var m = Math.round(Math.random() * sentenceList.length);
        if (m == sentenceList.length) {
            m = 0;
        }
        randomList.push(sentenceList.splice(m, 1)[0]);
    }
    if (randomList.length != 0) {
        window.parent.generalValues['testList'] = randomList;
        window.parent.newWindow('test');
        window.parent.closeForm('selectWindow');
    } else {
        window.parent.generalValues['msg'] = '请至少选择1句话';
        window.parent.newWindow('msgBox');
    }

});

$('#cancelBtn').click(() => {
    window.parent.closeForm('selectWindow');
})

function getVal(val) {
    valJust = val;
    $("#testNumShower").html(Math.round(sentenceNum * val / 100));
}

$(document).on('click touchend','#selectAllBtn',function(){
    $('.passageBtn').each(function(){
        select($(this),'select');
    })
})

$(document).on('click touchend','#invertBtn',function(){
    $('.passageBtn').each(function(){
        if($(this).hasClass('unselected')){
            select($(this),'select');
        }else{
            select($(this),'deselect');
        }
    })
    console.warn(1);
})