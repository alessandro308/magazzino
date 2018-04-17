import React, { Component } from 'react';
import ProductsTable from './components/ProductsTable';
import {Navbar, Nav, NavItem, Modal, Button} from "react-bootstrap";
import AddProductForm from './components/AddProductForm';
import './App.css';

class MagazzinoNavBar extends React.Component{ 
      constructor(props){
        super(props);
        this.plusHandler = (buttonName) =>{
          this.props.plusHandler(buttonName);
        }
      }

      render(){
      return (<Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">Magazzino</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="#">
            Generale
          </NavItem>
          <NavItem eventKey={2} href="#">
            Terracina
          </NavItem>
          <NavItem eventKey={3} href="#">
            Borgo Hermada
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={4} onClick={this.plusHandler}>
            +
          </NavItem>
        </Nav>
      </Navbar>);
      }
}


class AddProductModal extends React.Component{
  constructor(props){
    super(props)
    this.handleClose = (button) => {
      this.props.hide(button);
    }
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount(){
    
  }

  addProduct(){
    
  }

  render(){
    return (<div className="static-modal">
      <Modal show={this.props.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddProductForm />
          </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
          <Button bsStyle="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>);
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {modalShow: false};
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  
  showModal(button){
    this.setState({
      modalShow: true
    })
  }

  hideModal(button){
    this.setState({
      modalShow: false
    })
  }
  
  render() {
    console.log("APP RENDER: "+this.state.modalShow);
    return (
      <div>
      <AddProductModal show={this.state.modalShow} hide={this.hideModal}/>
      <MagazzinoNavBar plusHandler={this.showModal} />;
      <div className="container">
       <ProductsTable limit="100"/>
      </div>
      </div>
    );
  }
}

export default App;
