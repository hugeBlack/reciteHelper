'use strict';
var historyList=window.parent.generalValues["testHistory"];
var poemList=window.parent.generalValues["poemList"];
console.warn(historyList);
historyList.forEach(function(element,index) {
    var timestamp = element.time;
    var newDate = new Date();
    newDate.setTime(timestamp * 1000);
    $('#historyHolder').append('<div class="historyBtn unselected" id="'+index+'"><span class="poemName">'+newDate.toLocaleString()+'</span></div>')
});

$(document).on('click touchend','.historyBtn',function(){
    $('.historyBtn.selected').removeClass("selected");
    $('.historyBtn').addClass("unselected");
    $(this).addClass("selected");
    $(this).removeClass("unselected");
    $('#passageHolder').html('');
    packageList[$(this).attr('id')].content.forEach(function(element){
        $('#passageHolder').append('<div class="passageBtn passageDiv unselected" id='+element+'><span class="poemName">'+poemList[element].name+'</span></div>')
    })
    
})

function getShowText(sentenceId,poemId,showWhat) {//id: testlist中的index; showWhat:{0为和谐过 1为完整的句子}
    var kokoko;
    var poem = poemList[poemId];
    var sentencePos = testList[id].sentenceNo
    
    if(showWhat==0){
        kokoko='______________';
    }else if(showWhat==1){
        kokoko='<span class="answer">'+poem.content[testList[id].sentenceNo].text+'</span>';
    }
    
    if (sentencePos == 0) { //first sentence ___aaa
        return kokoko + poem.content[testList[id].sentenceNo + 1].text;
    }
    if (sentencePos == poem.content.length - 1) { //last sentence aaa___
        return poem.content[testList[id].sentenceNo - 1].text + kokoko;
    }
    if (poem.content[testList[id].sentenceNo].pos == "head" && poem.content[testList[id].sentenceNo + 1].pos != "head") { //head sentence ___aaa
        return kokoko + poem.content[testList[id].sentenceNo + 1].text;
    }
    if (poem.content[testList[id].sentenceNo].pos == "end") { //end sentence aaa___
        return poem.content[testList[id].sentenceNo - 1].text + kokoko;
    }
    if (poem.content[testList[id].sentenceNo].pos == "mid") { //middle sentence aaa ___ aaa
        return poem.content[testList[id].sentenceNo - 1].text + kokoko + poem.content[testList[id].sentenceNo + 1].text;
    }
}