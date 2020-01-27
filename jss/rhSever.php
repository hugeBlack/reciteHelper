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
switch($action){//需要连接数据库的，需要用户登录
    case 'getPersonalInfo':
        echo $_SESSION['userInfo'];
        return;
    break;
}


$odbc = "Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=".realpath("./userReciteInfo");
$conn = odbc_connect($odbc, '', '');
switch($action){//需要连接数据库的，需要用户登录

}

?>