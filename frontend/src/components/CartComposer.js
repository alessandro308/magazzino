import React from 'react';
import {Panel, FormControl, FormGroup, Form, Button, Alert, ButtonGroup, Grid, Row, Col} from 'react-bootstrap';
import {BASE_URL, LOCALE_STRING} from '../constant';
import { CartTable } from './cart/CartUtils';

class CartComposer extends React.Component{
    constructor(props){
        super(props);
        this.state = {barcode: "", products: [], clientId: "", go_checkout: false, priceSale: 0};
        this.resetState = (e => {
          this.setState({barcode: "", products: [], clientId: "", go_checkout: false});
        })
        this.handleChange = this.handleChange.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.go_checkoutHandler = this.go_checkoutHandler.bind(this);
        this.completeOrder = this.completeOrder.bind(this);
        this.setTotal = (e => {
          this.setState(
            {total: e}
          );
        })
        this.removeProduct = (index =>
          {
            const filtered = this.state.products;
            filtered.splice(index, 1);
            this.setState({products : filtered});
          }
        );
        this.setSale = this.setSale.bind(this);
        this.formSaleChanged = (e =>{
          let val = e.target.value;
          this.setState({
            priceSale: val
          });
        })
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getProduct(barcode){
      console.log("GET PRODUCT")
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
        cache: 'default'
      })
      .then(
        res => {
          if(res.status === 200){
            const total = this.state.products.reduce((acc, el, i, ar) => (
              acc += parseFloat(el.finalPrice, 10)), 0) * ((100-this.state.priceSale) * 0.01)
            fetch("https://www.parrucchieriestetiste.it/magazzino/db/api/addPoints", {
              method: "POST",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({cardNumber: this.state.clientId, 
                                    points: Math.floor(total)}),
              cache: "default"
            }).then(
              res => {
                console.log("POINT ADDED");
                if(res.status === 200){
                  this.setState(
                    {
                      pointAdded: true,
                      orderCompleted: true,
                      products: [],
                      previousTotal: total
                    })
                  }else{
                    console.error(res);
                  }
                }
            );
          }else{
            console.error(res);
          }
        }
      )
      console.log("ORDER COMPLETED");
      
    }

    setSale(val){
      this.setState({priceSale: val});
    }
    render(){
        let selectPrice;

        switch (this.state.priceSale){
          case 0:
            selectPrice = (
              <ButtonGroup>
                <Button active onClick={() => this.setSale(0)}>{LOCALE_STRING.per_cent_button0}</Button>
                <Button onClick={() => this.setSale(20)}>{LOCALE_STRING.per_cent_button20}</Button>
              </ButtonGroup>
            )
            break;
          case 20:
            selectPrice = (
              <ButtonGroup>
                <Button onClick={() => this.setSale(0)}>{LOCALE_STRING.per_cent_button0}</Button>
                <Button active onClick={() => this.setSale(20)}>{LOCALE_STRING.per_cent_button20}</Button>
              </ButtonGroup>
            )
            break;
          default:
            selectPrice = (
              <ButtonGroup>
                <Button onClick={() => this.setSale(0)}>{LOCALE_STRING.per_cent_button0}</Button>
                <Button onClick={() => this.setSale(20)}>{LOCALE_STRING.per_cent_button20}</Button>
              </ButtonGroup>
            )
        }

        let bottombody;
        if(this.state.go_checkout === false){
          bottombody = (
            <Grid>
              <Row>
                <Col md={6} lg={6}>
                  <Form onSubmit={this.handleSubmit} inline>
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
                        />

                        <Button bsStyle="success" onClick={this.handleSubmit}>{LOCALE_STRING.add_product}</Button>
                      </FormGroup>
                    </Form>
                </Col>
                <Col md={6} lg={6}>
                  <Form onSubmit={this.handleSubmit} inline>
                      <FormGroup>
                        <Button bsStyle="warning" className="align-right" onClick={this.go_checkoutHandler}>{LOCALE_STRING.go_checkout}</Button>
                      </FormGroup>
                  </Form>
                </Col>
              </Row>
            </Grid>
          )
        } else {
          if(this.state.orderCompleted === false)
            bottombody = (
              <Grid>
              <Row>
                <Col lg={12}>
                  <Form inline onSubmit={this.completeOrder}>
                          <FormGroup
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
                </Col>
              </Row>
            </Grid>
            );
          else{
            bottombody = (<Alert bsStyle="warning">
                            <strong>{LOCALE_STRING.orderCompleted}! Total: € {this.state.previousTotal}</strong>
                          </Alert>);
          }
        }

        return (
        <div>
          <Panel bsStyle="success">
            <Panel.Heading>
              <Panel.Title componentClass="h3">{LOCALE_STRING.cart_store_at} {this.props.shop === 2 ? LOCALE_STRING.shop2: LOCALE_STRING.shop1}
                <span style={{marginLeft: 30}}>{selectPrice}</span>
                <span className="align-right">Reset <span className="glyphicon glyphicon-repeat" onClick={this.resetState}></span></span>
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <CartTable products={this.state.products} deleteHandler={this.removeProduct} value={this.state.priceSale} handleChange={this.formSaleChanged}/>
            </Panel.Body>
                
          </Panel>
          {bottombody}
        </div>
        );
    }
}

export default CartComposer;