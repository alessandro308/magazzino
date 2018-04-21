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
        $query = "SELECT p.name as name, description, initialPrice, wholesalePrice, finalPrice, barcode, b.name AS brand, shop1, shop2 
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

    function deleteProduct($barcode){
        $query = "DELETE FROM products
                   WHERE barcode = '$barcode'";
        $myfile = fopen("newfile.txt", "a") or die("Unable to open file!");
        $txt = $query.'\n';
        fwrite($myfile, $txt);
        fclose($myfile);
        return $this -> query($query);
    }

    function getBrands(){
        $query = "SELECT *
                    FROM brands";
        return $this -> queryJSON($query);
    }

    function getProductsRange($start, $end, $sortedBy, $filtered){
        $sorting = "ORDER BY";
        if($sortedBy != null){
            for($i = 0; $i<count($sortedBy); $i++){
                $sorting .= ($i == 0 ? " " : ", ").$sortedBy[$i]["id"];
                $sorting .= $sortedBy[$i]["desc"] ? " DESC ": " ASC ";
            }
        } else {
            $sorting = "";
        }
        $diff = $end-$start;
        $where = "WHERE p.brand = b.id";
        if($filtered != null){
            for($i = 0; $i<count($filtered); $i++){
                if(! ($filtered[$i]["id"] == "shop1" || $filtered[$i]["id"] == "shop2")) {
                    $where .= " AND (".($filtered[$i]["id"] == "brand" ? "b.name" : "p.".$filtered[$i]["id"]);
                    $where .= " LIKE CONCAT('%','".$filtered[$i]["value"]."', '%'))";
                } else {
                    if($filtered[$i]["value"] != "all")
                        if($filtered[$i]["value"] == "0"){
                            $where .= " AND ".$filtered[$i]["id"]." = 0";
                        }else{
                            $where .= " AND ".$filtered[$i]["id"]." <> 0";
                        }
                }
            }
        }
        $query = "SELECT p.name, p.description, p.initialPrice, p.wholesalePrice, p.finalPrice, p.barcode, b.name AS brand, p.shop1, p.shop2 
                    FROM products p, brands b
                   $where 
                   $sorting
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

    function editProduct($barcode, $values){
        $set = "SET ";
        $i = 0;
        foreach($values as $key => $value){
            if(is_numeric($value))
                $set .= "$key = $value ";
            else
                $set .= "$key = '$value' ";
            $i++;
            if ($i < count($values) )
                $set .= ", ";
        }
        $query = "UPDATE products
                     $set
                   WHERE barcode = $barcode";
        
        if($this -> query($query)){
            return true;
        }else{
            return $this -> error;
        }
    }

    function getByBarcode($barcode){
        // GET BARCODE
    }


}
?>