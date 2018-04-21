import React from 'react';
import {Panel, FormControl, Table, FormGroup} from 'react-bootstrap';
import {BASE_URL, LOCALE_STRING} from '../constant';
class CartComposer extends React.Component{
    constructor(props){
        super(props);
        this.state = {barcode: "", products: []};
        this.handleChange = this.handleChange.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        this.setState({
            barcode: e.target.value
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
              validation: "",
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



    render(){
        return (<Panel bsStyle="success">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{LOCALE_STRING.cart_store_at} {this.props.shop === 2 ? LOCALE_STRING.shop2: LOCALE_STRING.shop1} </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
            <Table responsive>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>{LOCALE_STRING.barcode}</th>
                    <th>{LOCALE_STRING.description}</th>
                    <th>{LOCALE_STRING.price}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.products.map((e,i) =>{
                        return (
                            <tr>
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
                                this.state.products.reduce((acc, el, i, ar) => (
                                acc += parseFloat(el.finalPrice, 10)), 0).toFixed(2)
                            }</td>
                    </tr>
                </tbody>
            </Table>

        </Panel.Body>
        <form onSubmit={this.handleSubmit}>
        <FormGroup
          controlId="formBasicText"
          validationState={this.state.validation}
        >
            <FormControl
                type="text"
                
                value={this.state.barcode}
                placeholder="Read a barcode"
                onChange={this.handleChange}
            />
        </FormGroup>
        </form>
      </Panel>);
    }
}

export default CartComposer;