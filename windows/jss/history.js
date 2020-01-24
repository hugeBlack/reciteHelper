'use strict'
var historyList=window.parent.generalValues['historyList'];
historyList.forEach(element => {
    var state=getState(element.stateId);
    var poemName=window.parent.generalValues['poemList'][element.poemNo].name;
    $('#historyHolder').append('<div class="sentence '+element.stateId+'"><span class="SentenceText">'+element.text+'</span><span class="poemName">'+poemName+'</span><span class="SentenceState">'+state+'</span></div>')
});

function getState(stateId){
    if(stateId=='untested'){return '未测试';}
    if(stateId=='tested'){return '通过';}
    if(stateId=='knew'){return '掌握';}
    if(stateId=='forget'){return '遗忘'};
}