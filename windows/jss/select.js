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
    $('#passageHolder').html('<div class="text"><span id="selectAllBtn">全选</span>   <span id="clearBtn">反选</span></div>');
    $('#text').html('选择篇目');
    packageList[$(this).attr('id')].content.forEach(function(element){
        $('#passageHolder').append('<div class="passageBtn passageDiv unselected" id='+element+'><span class="poemName">'+poemList[element].name+'</span></div>')
    })
})

$(document).on('click touchend','.passageBtn',function(){
    $('#text').html(poemList[$(this).attr('id')].name+'</br>');
    if($(this).hasClass('selected')){
        $(this).removeClass("selected");
        $(this).addClass("unselected");
        for (var i = 0; i < selected.length; i++) {
            if (selected[i] == $(this).attr('id')) {
                selected.splice(i, 1);
                break;
            }
        }
        calcAll();
    }else{
        $(this).removeClass("unselected");
        $(this).addClass("selected");
        selected.push($(this).attr('id'));
        calcAll();
    }
    function calcAll() {
        sentenceNum = 0;
        selected.forEach(a => {
            sentenceNum += poemList[a].availableCount;
        });
        getVal(valJust);
    }
    poemList[$(this).attr('id')].content.forEach(function(element,index){
        $('#text').append(element.text);
        if(element.pos=='end'){
            $('#text').append('</br>');
        }
    })
    
})

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