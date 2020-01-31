'use strict';
var packageList=window.parent.generalValues["packageList"];
var poemList=window.parent.generalValues["poemList"];
packageList.forEach(function(element,index) {
    $('#packageHolder').append('<div class="packageBtn passageDiv unselected" id="'+index+'"><span class="poemName">'+element.pakageName+'</span></div>')
});

$(document).on('click touchend','.packageBtn',function(){
    $('.packageBtn.selected').removeClass("selected");
    $('.packageBtn').addClass("unselected");
    $(this).addClass("selected");
    $(this).removeClass("unselected");
    $('#passageHolder').html('');
    $('#text').html('选择篇目');
    packageList[$(this).attr('id')].content.forEach(function(element){
        $('#passageHolder').append('<div class="passageBtn passageDiv unselected" id='+element+'><span class="poemName">'+poemList[element].name+'</span></div>')
    })
    
})

$(document).on('click touchend','.passageBtn',function(){
    $('#text').html(poemList[$(this).attr('id')].name+'</br>');
    $('.passageBtn.selected').removeClass("selected");
    $('.passageBtn').addClass("unselected");
    $(this).addClass("selected");
    $(this).removeClass("unselected");
    poemList[$(this).attr('id')].content.forEach(function(element,index){
        $('#text').append('<span class="'+getState(element)+'">'+element.text+'</span>');
        if(element.pos=='end'){
            $('#text').append('</br>');
        }
    })
    
})

function getState(element){
    if(typeof(element.knowPoint)=='undefined'){return 'untested';}
    if(element.knowPoint>2){return 'i';}
    if(element.knowPoint>0){return 'p';}
    if(element.knowPoint>-2){return 'c';}
    if(element.knowPoint>-3){return 'd';}
    if(element.knowPoint<=-3){return 'f';}
}