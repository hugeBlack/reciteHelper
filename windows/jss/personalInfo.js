'use strict';
var historyList=window.parent.generalValues["testHistory"];
var poemList=window.parent.generalValues["poemList"];
console.warn(historyList);
historyList.forEach(function(element,index) {
    var timestamp = element.time;
    var newDate = new Date();
    newDate.setTime(timestamp * 1000);
    $('#historyHolder').append('<div class="historyBtn unselected" id="'+index+'"><span class="historyName">'+newDate.toLocaleString()+'</span></div>')
});

$(document).on('click touchend','.historyBtn',function(){
    $('.historyBtn.selected').removeClass("selected");
    $('.historyBtn').addClass("unselected");
    $(this).addClass("selected");
    $(this).removeClass("unselected");
    $('#sentenceHolder').html('');
    historyList[$(this).attr('id')].item.forEach(function(element){
        $('#sentenceHolder').append(getShowText(element));
    })
    
})

$('#clearBtn').click(()=>{
    window.parent.request('clearHistoryList');
    window.parent.generalValues['msg']='已清空历史记录并同步';
    window.parent.newWindow('msgBox');
    window.parent.closeForm('personalInfoWindow');
})

function getShowText(record) {//{poemNo: "1", sentenceNo: "3", stateId: "forget"}
    var poem = poemList[record.poemNo];
    var sentencePos = parseInt(record.sentenceNo)    
    var kokoko='<span class="answer">'+poem.content[sentencePos].text+'</span>';
    if (sentencePos == 0) { //first sentence ___aaa
        return recodeDiv(kokoko + poem.content[sentencePos + 1].text);
    }
    if (sentencePos == poem.content.length - 1) { //last sentence aaa___
        return recodeDiv(poem.content[sentencePos - 1].text + kokoko);
    }
    if (poem.content[sentencePos].pos == "head" && poem.content[sentencePos + 1].pos != "head") { //head sentence ___aaa
        return recodeDiv(kokoko + poem.content[sentencePos + 1].text);
    }
    if (poem.content[sentencePos].pos == "end") { //end sentence aaa___
        return recodeDiv(poem.content[sentencePos - 1].text + kokoko);
    }
    if (poem.content[sentencePos].pos == "mid") { //middle sentence aaa ___ aaa
        return recodeDiv(poem.content[sentencePos - 1].text + kokoko + poem.content[sentencePos + 1].text);
    }
    function recodeDiv(text){
        return '<div class="sentence '+record.stateId+'"><span class="SentenceText">'+text+'</span><span class="poemName">'+poem.name+'</span><span class="SentenceState">'+getState(record.stateId)+'</span></div>'
    }
    function getState(stateId){
        if(stateId=='untested'){return '未测试';}
        if(stateId=='tested'){return '通过';}
        if(stateId=='knew'){return '掌握';}
        if(stateId=='forget'){return '遗忘'};
    }
}