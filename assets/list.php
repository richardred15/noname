<?php
$dirs = ["audio", "images", "music"];
$exts = ["png", "mp3"];
$out = "{";
$c = 0;
foreach ($dirs as $dir) {
    $files = scandir("./$dir");
    $json = "\"$dir\":[";
    if ($c > 0) $json = "," . $json;
    foreach ($files as $file) {
        if ($file[0] == ".") continue;
        $ext = end(explode(".", $file));
        if (in_array($ext, $exts))
            $json .= "\"" . str_replace(".$ext", "", $file) . "\",";
    }
    $json = substr($json, 0, strlen($json) - 1);
    $json = $json . "]";
    $out .= $json;
    $c++;
}
echo $out . "}";
