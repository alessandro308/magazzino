import React from 'react';
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
    constructor(props){
        super(props);
        this.state = {limit: 100, products: [], isLoaded: false};
    }

    componentDidMount() {
        if(this.state.city != 0)
            var url = `http://www.parrucchieriestetiste.it/magazzino/db/api/getProducts?start=0&end=${this.state.limit}&city=${this.state.city}`;
        else
            var url = "http://www.parrucchieriestetiste.it/magazzino/db/api/getProducts?start=0&end="+this.state.limit;
        fetch(url)
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
            if(this.props.shop == 0){
                var tr = <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Brand</th>
                            <th>Barcode</th>
                            <th>Initial Price</th>
                            <th>Wholesale Price</th>
                            <th>Final Price</th>
                            <th>Shop 1</th>
                            <th>Shop 2</th>
                        </tr>
            }else{
                var tr = <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Brand</th>
                            <th>Barcode</th>
                            <th>Initial Price</th>
                            <th>Wholesale Price</th>
                            <th>Final Price</th>
                        </tr>
            }
            return (<Table id="mainTable" striped bordered condensed hover>
                            <thead>
                                {tr}
                            </thead>
                            <tbody>
                                {
                                    this.state.products.map((row, i) =>
                                        <TableRow row={row} i={i} key={row.barcode}/>
                                    )
                                }
                            </tbody>
                        </Table>);
        } else{
            return <h1>Loading data...</h1>;
        } 
    }
}

export default ProductsTable;