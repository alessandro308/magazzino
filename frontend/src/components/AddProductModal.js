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
        shop1: 0,
        shop2: 0,
        barcode: "",
        brand: 0,
        barcodeExists: false
      }

      this.handleClose = (button) => {
        this.props.hide(button);
      }
      this.deleteButtonHandler = (button) =>{
        fetch(`http://localhost:8888/api/deleteProduct?barcode=${this.state.barcode}`)
        .then(
          (res => {
            if(res.status === 4 || res.status === 200){
              this.setState({
                actionExecuted: "deleted"
              });
              setTimeout(this.handleClose, 700);
            }
            
          })
        )
      }
      this.resetState = (barcode) =>{
        this.setState({
            name: "",
            description: "",
            initialPrice: 0,
            finalPrice: 0,
            wholesalePrice: 0,
            shop1: 0,
            shop2: 0,
            barcode: barcode == null? "" : barcode,
            brand: 0,
            barcodeExists: false
        });
      }
      this.addProductHandler = this.addProductHandler.bind(this);
      this.handleFormChange = this.handleFormChange.bind(this);
      this.checkValue = this.checkValue.bind(this);
      this.tick = null;
    }

    checkValue (barcode){
      fetch(`http://localhost:8888/api/getProduct?barcode=${barcode}`)
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
          this.setState(
            {
              name: res["name"],
              description: res["description"],
              initialPrice: res["initialPrice"],
              finalPrice: res["finalPrice"],
              wholesalePrice: res["wholesalePrice"],
              shop1: res["shop1"],
              shop2: res["shop2"],
              barcode: res["barcode"],
              barcodeExists: true,
              brand: res["brand"]
            }
          )

        }
      ).catch( e => {
        if(this.state.barcodeExists){
          this.resetState(this.state.barcode);
        }
      });
    }

    handleFormChange(e) {
        if(this.tick != null) window.clearTimeout(this.tick);
        this.tick = null;
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if(name === "barcode"){
          this.checkValue(value);
        }
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
      const payload = {
        name: this.state.name,
        description: this.state.description,
        barcode: this.state.barcode,
        initialPrice: this.state.initialPrice,
        finalPrice: this.state.finalPrice,
        wholesalePrice: this.state.wholesalePrice,
        brand: this.state.brand,
        shop1: this.state.shop1,
        shop2: this.state.shop2
      };

      const data = new FormData();
      data.append( "json", JSON.stringify( payload ) );
      var url = "http://localhost:8888/api/addProduct";
      if(this.state.barcodeExists){
        url = "http://localhost:8888/api/editProduct";
      }
      fetch(url,
      {
          method: "POST",
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify( payload ),
          mode: 'cors',
          cache: 'default'
      })
      .then(res => {
          this.setState({
            actionExecuted: true,
            addProductResponse: res.response,
            waitingResponse: false
          }, e => {
            this.tick = setTimeout(this.handleClose, 2000);
          });
      }, fail => {
        console.log(fail.response);
      });
    }
    
    componentDidMount(){
      this.resetState();
    }


    render(){
      var al;
      if(this.state.waitingResponse){
        al = <Alert bsStyle="warning">
                <strong>Adding product</strong> Sending information to database...
              </Alert>;
      }else{
        if(typeof this.state.actionExecuted !== "undefined"){
          if(this.state.actionExecuted === "deleted"){
            al = <Alert bsStyle="success">
                    <strong>Product deleted</strong>
                  </Alert>;
          }else{
            if(this.state.actionExecuted){
              al = <Alert bsStyle="success">
                      <strong>Product {this.state.barcodeExists ? "changed" : "added" }</strong>
                    </Alert>;
            }else{
              al = <Alert bsStyle="danger">
                    <strong>Error</strong> {this.state.error}
                  </Alert>;
            }
          }
        }
      }

      var deleteButton;
      if(this.state.barcodeExists){
        deleteButton = <Button bsStyle="danger" className="pull-left" onClick={this.deleteButtonHandler}>Delete</Button>
      }
      return (<div className="static-modal">
        <Modal show={this.props.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.barcodeExists ? "Edit the product" : "Add a product"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              
              <AddProductForm 
                onChange={this.handleFormChange}
                onSubmit={this.addProductHandler}
                name={this.state.name}
                description={this.state.description}
                initialPrice={this.state.initialPrice}
                wholesalePrice={this.state.wholesalePrice}
                finalPrice={this.state.finalPrice}
                shop1={this.state.shop1}
                shop2={this.state.shop2}
                barcode={this.state.barcode}
                brand={this.state.brand}
              />
              {al}
            </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            {deleteButton}
            <Button bsStyle={this.state.barcodeExists ? "warning" : "primary"} onClick={this.addProductHandler}>{this.state.barcodeExists ? "Edit" : "Add"} Product</Button>
          </Modal.Footer>
        </Modal>
      </div>);
    }
}

export default AddProductModal;