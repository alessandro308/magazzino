import React from 'react';
import {Panel, FormControl, FormGroup, Form, Button, Alert} from 'react-bootstrap';
import {BASE_URL, LOCALE_STRING} from '../constant';
import { CartTable } from './cart/CartUtils';
class CartComposer extends React.Component{
    constructor(props){
        super(props);
        this.state = {barcode: "", products: [], clientId: "", go_checkout: false};
        this.resetState = (e => {
          this.setState({barcode: "", products: [], clientId: "", go_checkout: false});
        })
        this.handleChange = this.handleChange.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.go_checkoutHandler = this.go_checkoutHandler.bind(this);
        this.completeOrder = this.completeOrder.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getProduct(barcode){
        fetch(`${BASE_URL}/api/getProduct?barcode=${barcode}`)
      .then(
        res => {
          if(res.status === 200){
            return res.json();
          } else {
            throw new Error("");
          }
        }
      ).then(
        response => {
          const res = response[0];
          this.setState(prevState => ({
              products: [...prevState.products, res],
              validation: null,
              barcode: ""
          }));
        }
      ).catch( e => {
        this.setState({
            validation: "error"
        })
      });
    }

    handleSubmit(e){
      e.preventDefault();
      const barcode = this.state.barcode;
      this.getProduct(barcode);
    }

    go_checkoutHandler(e){
      this.setState({
        go_checkout: true,
        orderCompleted: false
      })
    }

    completeOrder(e){
      e.preventDefault();
      const payload = {
        products: this.state.products.map(e => ({barcode: e.barcode})),
        shop: "shop"+this.props.shop
      }
      fetch(BASE_URL+"/api/registerOrder", {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify( payload ),
        mode: 'cors',
        cache: 'default'
      })
      .then(
        res => {
          if(res.statusText === "OK"){
            this.setState({
              orderCompleted: true,
              products: []
            });
          }else{
            console.error(res);
          }
        }
      )
      
    }

    render(){
        let bottombody;
        if(this.state.go_checkout === false){
          bottombody = <Form onSubmit={this.handleSubmit}>
                    <FormGroup
                      validationState={this.state.validation}
                      controlId="barcodeController">
                      <FormControl
                          type="text"
                          value={this.state.barcode}
                          placeholder={LOCALE_STRING.readBarcode}
                          onChange={this.handleChange}
                          autoComplete="off"
                          name="barcode"
                          style= {{width: "50%"}}
                      />
                      <Button bsStyle="success" onClick={this.handleSubmit}>{LOCALE_STRING.add_product}</Button>
                    </FormGroup>
                    <FormGroup>
                      <Button bsStyle="warning" className="align-right" onClick={this.go_checkoutHandler}>{LOCALE_STRING.go_checkout}</Button>
                    </FormGroup>
                  </Form>
        } else {
          if(this.state.orderCompleted === false)
            bottombody = (
              <Form inline onSubmit={this.handleSubmit} id="completeOrder">
                      <FormGroup
                        width="100px"
                        controlId="barcodeController">
                        <FormControl
                            type="text"
                            value={this.state.clientId}
                            placeholder={LOCALE_STRING.getIdClient}
                            onChange={this.handleChange}
                            name="clientId"
                            autoComplete="off"
                        />
                        <Button type="submit" bsStyle="success" onClick={this.completeOrder}>{LOCALE_STRING.completeOrder}</Button>
                      </FormGroup>
              </Form>
            );
          else{
            bottombody = (<Alert bsStyle="warning">
                            <strong>Completato!</strong> {LOCALE_STRING.orderCompleted}
                          </Alert>);
          }
        }

        return (<Panel bsStyle="success">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{LOCALE_STRING.cart_store_at} {this.props.shop === 2 ? LOCALE_STRING.shop2: LOCALE_STRING.shop1} <span className="align-right">Reset <span className="glyphicon glyphicon-repeat" onClick={this.resetState}></span></span> </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
            <CartTable products={this.state.products} />
            {bottombody}
        </Panel.Body>
            
      </Panel>);
    }
}

export default CartComposer;