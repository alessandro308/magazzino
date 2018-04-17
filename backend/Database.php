<?php
class Database extends mysqli{
    function __construct($host, $user, $psw, $db_name){
        parent::__construct($host, $user, $psw, $db_name);
    }

    function queryJSON($query){
        if($res = $this -> query($query)){
            while($row = $res -> fetch_array(MYSQL_ASSOC)) {
                $myArray[] = $row;
            }
            //$json = json_encode($myArray);
            return $myArray;
        }
        return json_encode("{}");
    }

    function getProducts(){
        $query = "SELECT p.name, p.description, p.initialPrice,p.wholesalePrice, p.finalPrice, p.barcode, b.name AS brand
                    FROM products as p, brands as b
                   WHERE p.brand = b.id
                ORDER BY p.name";
    
        return $this -> queryJSON($query);
    }

    function getBrands(){
        $query = "SELECT *
                    FROM brands";
        return $this -> queryJSON($query);
    }

    function getProductsRange($start, $end){
        $query = "SELECT p.name, p.description, p.initialPrice, p.finalPrice, p.barcode, b.name AS brand
                    FROM products p, brand b
                   WHERE p.brand = b.id
                ORDER BY p.name
                   LIMIT $start OFFSET $end-$start";
        return $this -> queryJSON($query);
    }

    function search($query){
        /*
            SELECT p.name, p.description, p.initialPrice, p.finalPrice, p.barcode, b.name
            FROM product p, brand b
            WHERE p.brand = b.id AND $query
            ORDER BY p.name
        */
    }

    function filter($where_filter){

    }

    function addProduct($name, $description, $initialPrice, $finalPrice, $brand, $barcode){
        /*
            INSERT INTO products ('name', 'description', 'initialPrice', 'finalPrice', 'brand', 'barcode')
            VALUES ($name, $description, $initialPrice, $finalPrice, $brand, $barcode);
        */
    }

    function editProduct($id, $newValues){
        // OVERRITE newValues parameters
    }

    function getByBarcode($barcode){
        // GET BARCODE
    }


}
?>