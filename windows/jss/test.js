"use_strict";
var testCount = 10;
var nowTestId = 0;
var testList;
var poemList=window.parent.generalValues['poemList'];

$(document).ready(()=>{
    testList = window.parent.generalValues['testList'];
    testCount=testList.length;
    showTestSentence(0);
    countDown(5,0);

})


$('#nextBtn').click(function () {
    testList[nowTestId].stateId='tested';
    nextSentence();
});

$('#answerBtn').click(function () {
    showAnswer();
})


$(document).on('click touchend','#forgetBtn',() =>{
    testList[nowTestId].stateId='forget';
    nextSentence();
})

$(document).on('click touchend','#trashBtn',() =>{
    testList[nowTestId].stateId='knew';
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
        countDown(5,nowTestId);
        if(nowTestId==testList.length-1){
            $('#nextBtn').html('完成');
        }
    } else {
        var forgetCount=0;
        var knowCount=0;
        testList.forEach(function(element){
            if(element.stateId=='forget'){
                forgetCount++;
            }
            if(element.stateId=='knew'){
                knowCount++;
            }
        })
        window.parent.generalValues['testResult']={
            'totalCount':testList.length,
            'knowCount':knowCount,
            'forgetCount':forgetCount
        }
        window.parent.generalValues['historyList']=testList;
        window.parent.newWindow('testResult');
        window.parent.closeForm('testWindow');
    }
}

function showAnswer() {
    $('#testPanel').css('display', 'none');
    $('#answerPanel').css('display', 'block');
    $("#answerPanel").css("animation", "panelShow 1s");
    setTimeout(() => {
        $(".answerPanel").css("animation", "");
    }, 500);
    clearInterval('a');
    $('#poemContext_real').html(getShowText(nowTestId,1));
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
    var a = setInterval(() => {
        if (nowTestId == id) {
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

function getShowText(id,showWhat) {//id: testlist中的index; showWhat:{0为和谐过 1为完整的句子}
    var kokoko;
    var sentencePos = testList[id].sentenceNo
    var poem = poemList[testList[id].poemNo]
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