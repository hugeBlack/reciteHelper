<?php
$poemJson = fopen("packageInfo.json","r") or die('nmsl');
echo fread($poemJson,filesize("packageInfo.json"));
?>