import React, { Component } from 'react';
import {Table} from 'react-bootstrap';

const TableRow = ({row, i}) => (
    <tr>
      <td>{i}</td>
      <td>{row.name}</td>
      <td>{row.description}</td>
      <td>{row.brand}</td>
      <td>{row.barcode}</td>
      <td>{row.initialPrice}</td>
      <td>{row.wholesalePrice}</td>
      <td>{row.finalPrice}</td>
    </tr>
);

class ProductsTable extends React.Component{
    constructor(maxRow, city){
        super();
        var shop;
        if(typeof city === 'undefined')
            shop = "*";
        else
            shop = city;

        this.state = {shop: city, limit: 100, products: [], isLoaded: false};
    }

    componentDidMount() {
        fetch("http://www.parrucchieriestetiste.it/magazzino/db/api/getProducts?start=0&end="+this.state.limit)
        .then(res => res.json())
        .then(
            (result) => {

                this.setState(
                    {
                        products: result,
                        isLoaded: true
                    }
                )
            },
            (error) => {
                console.log(error);
                this.setState(
                {
                    isLoaded: false,
                    error: error
                }
            )}
        )
    }

    render(){
        if(this.state.isLoaded){
            var table = (<Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Brand</th>
                                    <th>Barcode</th>
                                    <th>Price</th>
                                    <th>Price</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.products.map((row, i) =>
                                        <TableRow row={row} i={i} key={row.barcode}/>
                                    )
                                }
                            </tbody>
                        </Table>);
            return table;
        } else{
            return <h1>Loading data...</h1>;
        } 
    }
}

export default ProductsTable;