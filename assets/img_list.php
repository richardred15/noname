<?php
$files = scandir("./images");
echo "[";
$out = "";
foreach ($files as $file) {
    if ($file[0] == ".") continue;
    if (strpos($file, ".png") !== false)
        $out .= "\"" . str_replace(".png", "", $file) . "\",";
}
$out = substr($out, 0, strlen($out) - 1);
echo $out;
echo "]";
