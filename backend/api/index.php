<?php
require 'flight/Flight.php';
require '../Database.php';


Flight::set('db', new Database("sql.parrucchieriestetiste.it", "parrucch09014", "parr90814", "parrucch09014"));
Flight::route('/', function(){
    echo 'hello world!';
});

Flight::route('GET /getProducts', function(){
    $db = Flight::get('db');
    if(isset($_GET["start"]) && isset($_GET["end"]) && is_numeric($_GET["start"] && is_numeric($_GET["end"]))){
        Flight::json($db -> getProductsRange($_GET["start"], $_GET["end"]));
    }else{
        Flight::json($db -> getProducts());
    }
});

Flight::route("POST /addProduct", function(){
    if(!(
        isset($_POST["barcode"]) && isset($_POST["name"]) && isset($_POST["description"]) && isset($_POST["initPrice"])
        && isset($_POST["finalPrice"]) && isset($_POST["brand"]) && isset($_POST["wholesalePrice"])
    )){
        $barcode = mysql_real_escape_string($_POST["barcode"]);
        $name = mysql_real_escape_string($_POST["name"]);
        $description = mysql_real_escape_string($_POST["description"]);
        $initPrice = is_numeric($_POST["initPrice"]) ? $_POST["initialPrice"] : 0;
        $finalPrice = is_numeric($_POST["finalPrice"]) ? $_POST["finalPrice"] : 0;
        $brandCode = is_numeric($_POST["brand"]) ? $_POST["brandCode"] : 1; //Default brand
        $wholesalePrice = is_numeric($_POST["wholesalePrice"]);
        $shop1 = is_numeric($_POST["shop1"]);
        $shop2 = is_numeric($_POST["shop2"]);
        if($db -> addProduct($name, $description, $initPrice, $wholesalePrice, $finalPrice, 
                                $brandCode, $barcode, $shop1, $shop2)){
            echo "OK";
        }else{
            Flight::error("Cannot add products");
        }
    }
});

Flight::route("GET /getBrands", function(){
    $db = Flight::get('db');
    return Flight::json($db->getBrands());
});

Flight::start();
