"use strict";
var sentenceNum = 0;
var valJust = 50;
var selected = [];
var poemList;
$.get("../jss/getPoems.php", function (data) {
    poemList = JSON.parse(data);
    window.parent.generalValues['poemList']=poemList;
    $(document).on("click touchend", ".choice", function (e) {
        if ($(this).hasClass("unselected")) {
            $(this).removeClass("unselected");
            $(this).addClass("selected");
            selected.push($(this).attr('id'));
            calcAll();
            return;
        }
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).addClass("unselected");
            for (var i = 0; i < selected.length; i++) {
                if (selected[i] == $(this).attr('id')) {
                    selected.splice(i, 1);
                    break;
                }
            }
            calcAll();
            return;
        }

        function calcAll() {
            sentenceNum = 0;
            selected.forEach(a => {
                sentenceNum += poemList[a].availableCount;
            });
            getVal(valJust);
        }

    });


    $(document).ready(function () {
        poemList.forEach(function (poemNow,index) {
            var availableCount = 0;
            poemNow.content.forEach(function (sentence) {
                if (sentence.pos != 'impossible') {
                    availableCount++;
                }
            });
            poemList[index].availableCount=availableCount;
        });
        for (var i = 0; i < poemList.length; i++) {
            $("#choiceHolder").append('<div class="choice unselected" id=' + i +
                '><span class="poemName">' + poemList[i].name + '</span><span class="poemText">' +
                poemList[i].content[0].text + poemList[i].content[1].text + '...</span><span class="poemSentenceNum">' + poemList[i].availableCount + '句</span></div>');
        };

    });


    $("#readyBtn").click(function (e) {
        var sentenceList = [];
        selected.forEach(poemNo => {
            poemList[poemNo].content.forEach(function (sentence, sentenceNo) {
                if (sentence.pos != "impossible") {
                    sentenceList.push({
                        "poemNo": poemNo,
                        "sentenceNo": sentenceNo,
                        "stateId":'untested',
                        "text":'?'
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
            randomList.push(sentenceList.splice(m,1)[0]);
        }
        window.parent.generalValues['testList']=randomList;
        window.parent.newWindow('test');
        window.parent.document.getElementById('selectWindow').remove();
    });
});

function getVal(val) {
    valJust = val;
    $("#testNumShower").html(Math.round(sentenceNum * val / 100));
}