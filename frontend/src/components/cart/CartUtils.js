import React from 'react';
import {Table, Button, FormControl, FormGroup, ControlLabel, InputGroup} from 'react-bootstrap';
import {LOCALE_STRING} from '../../constant'

function hashCode(string) {
    var hash = 0;
    if (string.length === 0) {
        return hash;
    }
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


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
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((e,i) =>{
                        return (
                            <tr key={hashCode(e.barcode)+i}>
                                <td>{i}</td>
                                <td>{e.barcode}</td>
                                <td>{e.description}</td>
                                <td>€ {e.finalPrice}</td>
                                <td><Button bsStyle="danger" onClick={_=>{console.log(i); this.props.deleteHandler(i)}}>{LOCALE_STRING.delete}</Button></td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            
                                <FormGroup
                                controlId="settingSalePrice"
                                >   
                                
                                <ControlLabel>{LOCALE_STRING.sale}</ControlLabel>
                                <InputGroup>
                                    <FormControl
                                    type="text"
                                    value={this.props.value}
                                    placeholder={LOCALE_STRING.sale}
                                    onChange={this.props.handleChange}
                                />
                                <InputGroup.Addon>%</InputGroup.Addon>
                                </InputGroup>
                                </FormGroup>
                            
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Totale: € { (this.props.products.reduce((acc, el, i, ar) => (
                                        acc += parseFloat(el.finalPrice, 10)), 0) * ((100-this.props.value) * 0.01)).toFixed(2)
                      }</td>
                    </tr>
                </tbody>
            </Table>);
    }
}
