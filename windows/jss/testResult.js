'use strict';
var result=window.parent.generalValues['testResult'];
$('#totalCount').html(result.totalCount);
$('#knowCount').html(result.knowCount);
$('#forgetCount').html(result.forgetCount);
$('#score').html(Math.round((1-result.forgetCount/result.totalCount)*100));

$('#historyBtn').click(()=>{
    window.parent.newWindow('history');
})
$('#finishBtn').click(()=>{
    window.parent.closeForm('testResultWindow');
})
