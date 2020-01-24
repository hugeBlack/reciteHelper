<?php
$poemJson = fopen("poemInfo.json","r") or die('nmsl');
echo fread($poemJson,filesize("poemInfo.json"));
?>