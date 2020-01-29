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
    case 'checkSimilarity':
        
        $reg = "/[。，，‘’：；…—]{1}/";
        $userText=$_POST['data']['userText'];
        $answer=$_POST['data']['answer'];
        if($answer==$userText){
            echo(json_encode(['score'=>1]));
            return;
        }elseif($userText==''){
            echo(json_encode(['score'=>0]));
            return;
        }else{
            $queryString=[
                'text_1'=>$userText,
                'text_2'=>$answer
            ];
            //echo(json_encode(['score'=>20]));
            $url="https://aip.baidubce.com/rpc/2.0/nlp/v2/simnet?access_token= 24.dd9f4fc4284af11fe8daa831a9795672.2592000.1582881687.282335-18347284&charset=UTF-8";   
            $ch = curl_init();
            $params[CURLOPT_URL] = $url;    //请求url地址
            $params[CURLOPT_HEADER] = FALSE; //是否返回响应头信息
            $params[CURLOPT_SSL_VERIFYPEER] = false;
            $params[CURLOPT_SSL_VERIFYHOST] = false;
            $params[CURLOPT_RETURNTRANSFER] = true; //是否将结果返回
            $params[CURLOPT_POST] = true;
            $params[CURLOPT_POSTFIELDS] = json_encode($queryString);
            curl_setopt_array($ch, $params); //传入curl参数
            $content = curl_exec($ch); //执行
            curl_close($ch); //关闭连接
       
            echo $content;

            return;
        }
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
        }
        $time=time();
        $newHistory=array(array(
            "time"=>$time,
            "item"=>$a
        ));
        $newHistory=array_merge($newHistory,json_decode(odbc_result($query,'testHistory')));
        $newHistoryList=array_splice($newHistory,0,30);

        $sql ="update info set testHistory='".json_encode($newHistoryList)."' WHERE userId=".($userInfo->id);
        $query = odbc_exec($conn, $sql);
    break;
    case 'getHistoryList':
        $sql ="select * FROM info WHERE userId=".$userInfo->id;
        $query = odbc_exec($conn, $sql);
        echo(odbc_result($query,'testHistory'));
    break;
    case 'clearHistoryList':
        $sql ="update info set testHistory='[]' WHERE userId=".($userInfo->id);
        $query = odbc_exec($conn, $sql);
    break;
    
}

?>