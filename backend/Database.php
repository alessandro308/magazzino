<?php
class Database extends mysqli{
    function __construct($host, $user, $psw, $db_name){
        parent::__construct($host, $user, $psw, $db_name);
    }

    function queryJSON($query){
        $myArray = [];
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
        $query = "SELECT p.name, p.description, p.initialPrice,p.wholesalePrice, p.finalPrice, p.barcode, b.name AS brand, p.shop1, p.shop2 
                    FROM products as p, brands as b
                   WHERE p.brand = b.id
                ORDER BY p.name";
    
        return $this -> queryJSON($query);
    }

    function getProduct($barcode){
        $query = "SELECT p.name, p.description, p.initialPrice,p.wholesalePrice, p.finalPrice, p.barcode, b.name AS brand, p.shop1, p.shop2 
                    FROM products as p, brands as b
                   WHERE p.brand = b.id && p.barcode = '$barcode'
                ORDER BY p.name";

        return $this -> queryJSON($query);
    }

    function getBrands(){
        $query = "SELECT *
                    FROM brands";
        return $this -> queryJSON($query);
    }

    function getProductsRange($start, $end, $sortedBy, $filtered){
        if($sortedBy == null){
            $sortedBy = "p.name";
        }
        
        $diff = $end-$start;
        $query = "SELECT p.name, p.description, p.initialPrice, p.wholesalePrice, p.finalPrice, p.barcode, b.name AS brand, p.shop1, p.shop2 
                    FROM products p, brands b
                   WHERE p.brand = b.id
                ORDER BY $sortedBy
                   LIMIT $diff OFFSET $start";
        return $this -> queryJSON($query);
    }

    function getProductsCount(){
        $query = "SELECT COUNT(*) AS num FROM products;";
        return $this->queryJSON($query);
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

    function addProduct($name, $description, $initialPrice, $wholesalePrice, $finalPrice, $brand, $barcode, $shop1, $shop2){
        $query = "INSERT INTO products (name, description, initialPrice, wholesalePrice, finalPrice, brand, barcode, shop1, shop2)
            VALUES ('$name', '$description', $initialPrice, $wholesalePrice, $finalPrice, $brand, '$barcode', $shop1, $shop2)";
        if($this -> query($query)){
            return true;
        }else{
            return $this -> error;
        }
    }

    function editProduct($id, $newValues){
        // OVERRITE newValues parameters
    }

    function getByBarcode($barcode){
        // GET BARCODE
    }


}
?>