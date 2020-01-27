<?php
session_start();
$action=$_POST['actionCode'];

switch($action){//不用连接数据库的，不用用户登录
    case 'getPackages':
        $poemJson = fopen("packageInfo.json","r") or die('nmsl');
        echo fread($poemJson,filesize("packageInfo.json"));
        return;
        break;
    case 'getPoems':
        $poemJson = fopen("poemInfo.json","r") or die('nmsl');
        echo fread($poemJson,filesize("poemInfo.json"));
        return;
        break;
}
if(@$_SESSION['loggedin']!=true){//检测是否登录
    echo('notLoggedin');
    return;
}
switch($action){//不需要连接数据库的，需要用户登录
    case 'getPersonalInfo':
        echo $_SESSION['userInfo'];
        return;
        break;
}


$odbc = "Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=".realpath("./userReciteInfo.mdb");
$conn = odbc_connect($odbc, '', '');
$userInfo=json_decode($_SESSION['userInfo']);

switch($action){//需要连接数据库的，需要用户登录
    case 'readRecitePeresonalInfo':
        $sql ="select * FROM info WHERE userId=".$userInfo->id;
        $query = odbc_exec($conn, $sql);
        echo(odbc_result($query,'knowList'));
    break;
    case 'appendHistoryList':
        $sql ="select * FROM info WHERE userId=".$userInfo->id;
        $query = odbc_exec($conn, $sql);
        $a=$_POST['data'];
        foreach($a as $key => $value){
            unset($a[$key]['text']);
            $a[$key]['time']=time();
        }
        $newHistoryList=array_merge($a,json_decode(odbc_result($query,'testHistory')));
        $sql ="update info set testHistory='".json_encode($newHistoryList)."' WHERE userId=".($userInfo->id);
        $query = odbc_exec($conn, $sql);
    break;
}

?>