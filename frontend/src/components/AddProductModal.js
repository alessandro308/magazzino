import React from 'react';
import {Alert, Modal, Button} from 'react-bootstrap';
import AddProductForm from './AddProductForm';

class AddProductModal extends React.Component{
    constructor(props){
      super(props)

      this.state = {
        waitingResponse: false,
        name: "",
        description: "",
        initialPrice: 0,
        finalPrice: 0,
        wholesalePrice: 0,
        numberShop1: 0,
        numberShop2: 0,
        barcode: "000 000 000 000"
      }

      this.handleClose = (button) => {
        this.props.hide(button);
      }
      this.addProductHandler = this.addProductHandler.bind(this);
      this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
  
        this.setState(
            {
                [name]: value
            }
        )
    }
    addProductHandler(e){
      this.setState(
        {
          waitingResponse: true
        }
      )
      console.log("SENDING DATA");
      var r = new XMLHttpRequest();
      r.onreadystatechange = function(){
        if(r.readyState !== 4 || r.status !== 200){
          this.setState({
            productAdded: false,
            waitingResponse: false,
            error: r.error
          })
        } else {
          this.setState({
            productAdded: true,
            addProductResponse: r.response,
            waitingResponse: false
          })
        }
      }
      r.open("POST", "http://www.parrucchieriestetiste.it/magazzino/db/api/getProducts", true);
      r.setRequestHeader("Content-Type", "application/json");
      r.send(JSON.stringify({
        name: this.state.name,
        description: this.state.description,
        barcode: this.state.barcode,
        initialPrice: this.state.initialPrice,
        finalPrice: this.state.finalPrice,
        wholesalePrice: this.state.wholesalePrice,
        shop1: this.state.shop1,
        shop2: this.state.shop2,
        brand: this.state.brand
      }));
    }
  
    render(){
      var al;
      if(this.state.waitingResponse){
        al = <Alert bsStyle="warning">
                <strong>Adding product</strong> Sending information to database...
              </Alert>;
      }else{
        if(typeof this.state.productAdded !== "undefined"){
          if(this.productAdded){
            al = <Alert bsStyle="success">
                    <strong>Product added</strong>
                  </Alert>;
          }else{
            al = <Alert bsStyle="danger">
                  <strong>Error</strong> {this.state.error}
                </Alert>;
          }
        }
      }
      return (<div className="static-modal">
        <Modal show={this.props.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add a product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {al}
              <AddProductForm 
                onChange={this.handleFormChange}
                onSubmit={this.addProductHandler}
                name={this.state.name}
                description={this.state.description}
                initialPrice={this.state.initialPrice}
                wholesalePrice={this.state.wholesalePrice}
                finalPrice={this.state.finalPrice}
                shop1={this.state.numberShop1}
                shop2={this.state.numberShop2}
                barcode={this.state.barcode}
              />
            </Modal.Body>
  
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary">Add Product</Button>
          </Modal.Footer>
        </Modal>
      </div>);
    }
  }

export default AddProductModal;