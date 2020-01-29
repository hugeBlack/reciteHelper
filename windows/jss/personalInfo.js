'use strict';
var historyList=window.parent.generalValues["testHistory"];
var poemList=window.parent.generalValues["poemList"];
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
        return '<div class="sentence '+getState(record).type+'"><span class="SentenceText">'+text+'</span><span class="poemName">'+poem.name+'</span><span class="SentenceState">'+record.score+' '+getState(record).text+'</span></div>'
    }
    function getState(element){
        if(element.score==200){return {text:'I',type:'p'};}
        if(element.score==100){return {text:'P',type:'p'};}
        if(element.score>=90 && element.score<100){return {text:'C',type:'c'};}
        if(element.score>=70 && element.score<90){return {text:'D',type:'d'};}
        if(element.score<75){return {text:'F',type:'f'};}
    }
}