"use_strict";
var testCount = 10;
var nowTestId = 0;
var testList;
var poemList=window.parent.generalValues['poemList'];
var hasEnded=false;
var inputName=guid();

testList = window.parent.generalValues['testList'];
testCount=testList.length;
showTestSentence(0);
countDown(30,0);
$(".userInput").attr('id',inputName);


$('#nextBtn').click(function () {
    nextSentence();
});

$('#answerBtn').click(function () {
    showAnswer();
})

$(document).on('click touchend','#trashBtn',() =>{
    testList[nowTestId].score=200;
    nextSentence();
})

$(document).on('click touchend','#historyBtn',() =>{
    window.parent.generalValues['historyList']=testList;
    window.parent.newWindow('history');
})


function nextSentence(){
    testList[nowTestId].text=getShowText(nowTestId,1);
    if (nowTestId < testList.length-1) {
        $('#testPanel').css('display', 'block');
        $('#answerPanel').css('display', 'none');
        $("#testPanel").css("animation", "panelShow 1s");
        setTimeout(() => {
            $(".testPanel").css("animation", "");
        }, 500);
        nowTestId++;
        showTestSentence(nowTestId);
        countDown(30,nowTestId);
        $('#resultPanel').css('display', 'none');
        $('.userInput').css('display','block')
        if(nowTestId==testList.length-1){
            $('#nextBtn').html('完成');
        }
    } else {
        var forgetCount=0;
        var knowCount=0;
        testList.forEach(function(element){
            if(element.score>=100){
                knowCount++;
            }
            if(element.score<100){
                forgetCount++;
            }
        })
        window.parent.generalValues['testResult']={
            'totalCount':testList.length,
            'knowCount':knowCount,
            'forgetCount':forgetCount
        }
        window.parent.generalValues['historyList']=testList;
        window.parent.request('appendHistoryList',testList);
        window.parent.newWindow('testResult');
        window.parent.closeForm('testWindow',true);
    }
}

function showAnswer() {
    hasEnded=true;
    $('#poemContext_real').html(getShowText(nowTestId,1));
    var reg=/[。？！，、；：“”‘’（）《》〈〉【】『』「」﹃﹄〔〕…—～﹏￥]/g;
    var userInput=$('.userInput').val().replace(reg,'');
    var answer=getShowText(nowTestId,2).replace(reg,'');
    $('.userInput').css('display','none');
    $('#resultPanel').css('display', 'block');
    $('#resultPanel').html('请稍等');
    $('.userInput').val('');
    $.post("../jss/rhSever.php",{'actionCode':'checkSimilarity','data':{'userText':userInput,'answer':answer}}, function (data) {
        var a=calcScore(userInput,answer,JSON.parse(data).score)
        testList[nowTestId].score=a.score;
        $('#resultPanel').html('你的答案:'+a.correctText+' 得分:'+testList[nowTestId].score);
        $('#testPanel').css('display', 'none');
        $('#answerPanel').css('display', 'block');
        $("#answerPanel").css("animation", "panelShow 1s");
        setTimeout(() => {
            $(".answerPanel").css("animation", "");
        }, 500);
    })
}
function calcScore(userInput,answer,similarityScore){
    if(userInput==answer){
        return {score:100,correctText:userInput};
    }else if(userInput==''){
        return {score:0,correctText:'<span class="error">未作答</span>'};
    }
    var text1=answer.split('');
    var text2=userInput.split('');

    var minDistance=[]
    var credit=0;
    var maxLength=text1.length>text2.length ? text1.length : text2.length;
    for(var i=0;i<text1.length;i++){
        minDistance[i]=maxLength;
        for(var j=0;j<text2.length;j++){
            if(text1[i]==text2[j]){
                if(Math.abs(i-j)<minDistance[i]){
                    minDistance[i]=Math.abs(i-j);
                }
                if(i-j==0){
                    break;
                }
            }
        }        
    }
    minDistance.forEach(function(ele){
        credit+=ele;
    })
    var posScore=(Math.pow(maxLength,2)-credit)/Math.pow(maxLength,2);
    var correctText='';
    text2.forEach(function(letter,index){
        if(minDistance[index]!=0){
            correctText+='<span class="error">'+letter+'</span>';
        }else{
            correctText+=letter;
        }
    })
    return {score:Math.round(posScore*100*(1-posScore)+posScore*100*similarityScore),correctText:correctText};
}

function showTestSentence(id) {//testlist中的index
    $('#poemContext_fake').html(getShowText(id,0));
    $('#poemName_fake').html((nowTestId + 1) + '/' + testCount + ' ' + poemList[testList[id].poemNo].name);
    $("#poemText").css("animation", "poem_out 0.8s");
    $("#poemText_fake").css("animation", "poem_in 1s");
    setTimeout(() => {
        $(".poemText").css("animation", "");
    }, 800);
    setTimeout(() => {
        $('#poemContext_real').html(getShowText(id,0));
        $('#poemName_real').html((nowTestId + 1) + '/' + testCount + ' ' + poemList[testList[id].poemNo].name);
    }, 500);
    for (i = 1; i <= 100; i++) {
        (function (i) {
            setTimeout(() => {
                $("#progressBar").css("width", ((nowTestId) / testCount + i / testCount / 100) * 100 + "%");

            }, i * 5);
        })(i)
    }
}
function countDown(timeLeft, id) {//剩余时间，testlist中的index
    hasEnded=false;
    var a = setInterval(() => {
        if (nowTestId == id && !hasEnded) {
            timeLeft--;
            $("#timer").html(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(a)
                showAnswer();
            }
        } else {
            clearInterval(a)
        }
    }, 1000);

}

function getShowText(id,showWhat) {//id: testlist中的index; showWhat:{0为和谐过 1为完整的句子 2为仅有答案}
    var kokoko;
    var sentencePos = testList[id].sentenceNo
    var poem = poemList[testList[id].poemNo]
    if(showWhat==0){
        kokoko='______________';
    }else if(showWhat==1){
        kokoko='<span class="answer">'+poem.content[testList[id].sentenceNo].text+'</span>';
    }else if(showWhat==2){
        return poem.content[testList[id].sentenceNo].text
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

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}