'use strict';
var result=window.parent.generalValues['testResult'];
$('#totalCount').html(result.totalCount);
$('#knowCount').html(result.knowCount);
$('#forgetCount').html(result.forgetCount);

$('#historyBtn').click(()=>{
    window.parent.newWindow('history');
})
