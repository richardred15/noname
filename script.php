<?php
header('Content-type: text/javascript');
$start = microtime(true);
function list_all($target)
{
    $out = [];
    if (is_dir($target)) {
        $files = glob($target . '*', GLOB_MARK);
        foreach ($files as $file) {
            $out = array_merge($out, list_all($file));
        }
    } elseif (is_file($target)) {
        $out[] = $target;
    }
    return $out;
}
$list = list_all("classes");
foreach ($list as $item) {
    $data = file_get_contents($item);
    $data = preg_replace('/\/\/.*/', "", $data);
    $data = preg_replace('/\/\*((.|\s)*?)(\*\/)/', "", $data);
    $data = preg_replace('/^\s*/m', "", $data);
    $out .= $data;
}
$end = microtime(true) - $start;
if ($_GET["debug"]) {
    echo "<pre>";
}
echo "'use strict';\n//Completed in $end ms\n$out";
