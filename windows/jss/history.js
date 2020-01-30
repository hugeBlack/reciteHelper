'use strict'
var historyList=window.parent.generalValues['historyList'];
historyList.forEach(element => {
    var state=getState(element);
    var poemName=window.parent.generalValues['poemList'][element.poemNo].name;
    $('#historyHolder').append('<div class="sentence '+state.type+'"><span class="SentenceText">'+element.text+'</span><span class="poemName">'+poemName+'</span><span class="SentenceState">'+element.score+' '+state.text+'</span></div>')
});

function getState(element){
    if(element.score=='-'){return {text:'未测试',type:'untested'};}
    if(element.score==200){return {text:'I',type:'p'};}
    if(element.score==100){return {text:'P',type:'p'};}
    if(element.score>=85 && element.score<100){return {text:'C',type:'c'};}
    if(element.score>=70 && element.score<85){return {text:'D',type:'d'};}
    if(element.score<75){return {text:'F',type:'f'};}
}