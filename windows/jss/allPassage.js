'use strict';
var packageList=window.parent.generalValues["packageList"];
var poemList=window.parent.generalValues["poemList"];
console.warn(packageList);
packageList.forEach(function(element,index) {
    $('#packageHolder').append('<div class="packageBtn passageDiv unselected" id="'+index+'"><span class="poemName">'+element.pakageName+'</span></div>')
});

$(document).on('click touchend','.packageBtn',function(){
    $('#passageHolder').html('');
    $('#text').html('选择篇目');
    packageList[$(this).attr('id')].content.forEach(function(element){
        $('#passageHolder').append('<div class="passageBtn passageDiv unselected" id='+element+'><span class="poemName">'+poemList[element].name+'</span></div>')
    })
    
})

$(document).on('click touchend','.passageBtn',function(){
    $('#text').html(poemList[$(this).attr('id')].name+'</br>');
    poemList[$(this).attr('id')].content.forEach(function(element,index){
        $('#text').append(element.text);
        if(element.pos=='end'){
            $('#text').append('</br>');
        }
    })
    
})