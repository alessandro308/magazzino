import React from 'react';
import {Table} from 'react-bootstrap';
import {LOCALE_STRING} from '../../constant'

export class CartTable extends React.Component{
    render(){
        var products = this.props.products;
        if(typeof products === "undefined"){
            products = [];
        }
        return (<Table responsive>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>{LOCALE_STRING.barcode}</th>
                    <th>{LOCALE_STRING.description}</th>
                    <th>{LOCALE_STRING.price}</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((e,i) =>{
                        return (
                            <tr key={e.barcode}>
                                <td>{i}</td>
                                <td>{e.barcode}</td>
                                <td>{e.description}</td>
                                <td>€ {e.finalPrice}</td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Totale: € {
                                products.reduce((acc, el, i, ar) => (
                                acc += parseFloat(el.finalPrice, 10)), 0).toFixed(2)
                            }</td>
                    </tr>
                </tbody>
            </Table>);
    }
}
