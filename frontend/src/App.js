import React, { Component } from 'react';
import SortableProductsTable from './components/SortableProductsTable';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import AddProductModal from './components/AddProductModal';
import './App.css';

class MagazzinoNavBar extends React.Component{ 
      constructor(props){
        super(props);
        this.plusHandler = (buttonName) =>{
          this.props.plusHandler(buttonName);
        }
        this.selectShopHandler = (selectedKey) =>{
          this.props.selectShopHandler(selectedKey);
        }
      }

      render(){
      return (<Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">Magazzino</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav onSelect={this.selectShopHandler}>
          <NavItem eventKey={0} href="#">
            Generale
          </NavItem>
          <NavItem eventKey={1} href="#">
            Terracina
          </NavItem>
          <NavItem eventKey={2} href="#">
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

class App extends Component {
  constructor(props){
    super(props);
    this.state = {modalShow: false, shop: 0};
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.selectShopHandler = this.selectShopHandler.bind(this);
    this.redraw = this.redraw.bind(this);
    this.table = React.createRef();
  }
  
  showModal(button){
    this.setState({
      modalShow: true
    })
  }

  hideModal(button){
    this.setState({
      modalShow: false
    });
    this.redraw();
  }

  selectShopHandler(selectedKey){
    this.setState({
      shop: selectedKey
    });
  }

  redraw(){
    this.forceUpdate();
  }
  
  render() {
    return (
      <div>
      <AddProductModal show={this.state.modalShow} hide={this.hideModal}/>
      <MagazzinoNavBar plusHandler={this.showModal} selectShopHandler={this.selectShopHandler}/>;
      <div className="container">
       <SortableProductsTable limit="100" shop={this.state.shop}/>
      </div>
      </div>
    );
  }
}

export default App;
