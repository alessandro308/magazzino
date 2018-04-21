<?php
require 'flight/Flight.php';
require '../Database.php';


Flight::set('db', new Database("localhost", "root", "root", "magazzino"));
//Flight::set('db', new Database("sql.parrucchieriestetiste.it", "parrucch09014", "parr90814", "parrucch09014"));
Flight::route('/', function(){
    echo 'hello world!';
});

Flight::route('GET /getProducts/', function(){
    $db = Flight::get('db');
    $count = $db -> getProductsCount(); //TODO: adjust the result w.r.t. filters
    if( isset($_GET["parameters"]) ){
        $par = json_decode($_GET["parameters"], true);
        $res["numberOfItems"] = $count[0]["num"];
        $res["items"] = $db -> getProductsRange($par["start"], $par["end"], isset($par["orderBy"]) ? $par["orderBy"] : null, isset($par["where"]) ? $par["where"] : null);
        Flight::json( $res );
    }else{
        Flight::json($db -> getProducts());
    }
});

Flight::route("GET /getProduct/", function(){
    $db = Flight::get('db');
    $res = $db -> getProduct($_GET["barcode"]);
    if(count($res)>0)
        Flight::json($res);
    else 
        Flight::notFound();
});

Flight::route("GET /deleteProduct/", function(){
    $db = Flight::get('db');
    $res = $db -> deleteProduct($_GET["barcode"]);
    if($res)
        echo "ok";
    else 
        Flight::notFound();
});

Flight::route("GET /addBrand/", function(){
    $db = Flight::get('db');
    $res = $db -> addBrand($_GET["name"]);
    if($res)
        echo "ok";
    else 
        Flight::error(new Exception("Cannot add Brand"));
});

Flight::route("POST|OPTIONS /registerOrder/", function(){
    $db = Flight::get('db');
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));

    $request = Flight::request();
    if($request->method == "OPTIONS"){
        echo "ok";
        return;
    }
    //Attempt to decode the incoming RAW post data from JSON.
    $_POST = json_decode($content, true);

    $shop = $_POST["shop"];
    $products = $_POST["products"];
    for($i = 0; $i<count($products); $i++){
        $barcode = $products[$i]["barcode"];
        $db -> decrease($barcode, $shop);
    }
    echo "ok";
});

Flight::route('POST|OPTIONS /addProduct/', function(){
    $db = Flight::get('db');
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));

    $request = Flight::request();
    if($request->method == "OPTIONS"){
        echo "ok";
        return;
    }
    //Attempt to decode the incoming RAW post data from JSON.
    $_POST = json_decode($content, true);
    if(!(
        isset($_POST["barcode"]) && isset($_POST["name"]) && isset($_POST["description"]) && isset($_POST["initPrice"])
        && isset($_POST["finalPrice"]) && isset($_POST["brand"]) && isset($_POST["wholesalePrice"])
    )){
        $barcode = $db -> real_escape_string($_POST["barcode"]);
        $name = $db -> real_escape_string($_POST["name"]);
        $description = $db -> real_escape_string($_POST["description"]);
        $initPrice = is_numeric($_POST["initialPrice"]) ? $_POST["initialPrice"] : 0;
        $finalPrice = is_numeric($_POST["finalPrice"]) ? $_POST["finalPrice"] : 0;
        $brand = is_numeric($_POST["brand"]) ? $_POST["brand"] : 1; //Default brand
        $wholesalePrice = is_numeric($_POST["wholesalePrice"]) ? $_POST["wholesalePrice"] : 0;
        $shop1 = is_numeric($_POST["shop1"]) ? $_POST["shop1"] : 0;
        $shop2 = is_numeric($_POST["shop2"]) ? $_POST["shop2"] : 0;
        $res = $db -> addProduct($name, $description, $initPrice, $wholesalePrice, $finalPrice, 
        $brand, $barcode, $shop1, $shop2);
        if($res === true){
            echo "OK";
        }else{
            Flight::error(new Exception($res));
        }
    }
});

Flight::route('POST|OPTIONS /editProduct/', function(){
    $db = Flight::get('db');
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));

    $request = Flight::request();
    if($request->method == "OPTIONS"){
        echo "ok";
        return;
    }
    //Attempt to decode the incoming RAW post data from JSON.
    $_POST = json_decode($content, true);
    if(!(
        isset($_POST["barcode"]) && isset($_POST["name"]) && isset($_POST["description"]) && isset($_POST["initPrice"])
        && isset($_POST["finalPrice"]) && isset($_POST["brand"]) && isset($_POST["wholesalePrice"])
    )){
        $barcode = $db -> real_escape_string($_POST["barcode"]);

        $params = [];
        if(isset($_POST["name"])) $params["name"] = $db -> real_escape_string($_POST["name"]);
        if(isset($_POST["description"])) $params["description"] = $db -> real_escape_string($_POST["description"]);
        if(isset($_POST["initialPrice"])) $params["initialPrice"] = is_numeric($_POST["initialPrice"]) ? $_POST["initialPrice"] : 0;
        if(isset($_POST["finalPrice"])) $params["finalPrice"] = is_numeric($_POST["finalPrice"]) ? $_POST["finalPrice"] : 0;
        if(isset($_POST["brand"])) $params["brand"] = is_numeric($_POST["brand"]) ? $_POST["brand"] : 1; //Default brand
        if(isset($_POST["wholesalePrice"])) $params["wholesalePrice"] = is_numeric($_POST["wholesalePrice"]) ? $_POST["wholesalePrice"] : 0;
        if(isset($_POST["shop1"])) $params["shop1"] = is_numeric($_POST["shop1"]) ? $_POST["shop1"] : 0;
        if(isset($_POST["shop2"])) $params["shop2"] = is_numeric($_POST["shop2"]) ? $_POST["shop2"] : 0;

        $res = $db -> editProduct($barcode, $params);
        if($res === true){
            echo "OK";
        }else{
            Flight::error(new Exception($res));
        }
    }
});

Flight::route("GET /addProduct/", function(){
    echo "RECEIVED GET";
});

Flight::route("GET /getBrands", function(){
    $db = Flight::get('db');
    return Flight::json($db->getBrands());
});

Flight::start();
