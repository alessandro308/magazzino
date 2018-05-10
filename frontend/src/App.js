import React, { Component } from 'react';
import ReactTable from 'react-table';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import AddProductModal from './components/AddProductModal';
import CartComposer from './components/CartComposer';
import './App.css';
import "react-table/react-table.css";
import {BASE_URL, LOCALE_STRING} from './constant';
import { AddBrandModal } from './components/AddBrandModal';

const APIToken = React.createContext("");

class MagazzinoNavBar extends React.Component{ 
      constructor(props){
        super(props);
        this.navBarButtonHandler = (e) =>{
          this.props.buttonHandler(e.target.getAttribute("data-key"));
        }

      }

      render(){
        return (<Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">Magazzino</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={0} data-key={0} onClick={this.navBarButtonHandler}>
              {this.props.selected === 0 ? <strong>{LOCALE_STRING.general}</strong> : "Generale"}
            </NavItem>
            <NavItem eventKey={1} data-key={1} onClick={this.navBarButtonHandler}>
              {this.props.selected === 1 ? <strong>{LOCALE_STRING.shop1}</strong> : "Terracina"}
            </NavItem>
            <NavItem eventKey={2} data-key={2} onClick={this.navBarButtonHandler} >
              {this.props.selected === 2 ? <strong>{LOCALE_STRING.shop2}</strong> : "Borgo Hermada"}
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={7} data-key={7} onClick={this.navBarButtonHandler}>
              <span className="glyphicon glyphicon-list-alt" data-key={7}></span>
            </NavItem>
            <NavItem eventKey={6} data-key={6} onClick={this.navBarButtonHandler}>
              <span className="glyphicon glyphicon-shopping-cart" data-key={6}></span>
            </NavItem>
            <NavItem eventKey={4} data-key={4} onClick={window.print}>
              <span className="glyphicon glyphicon-print" data-key={4}></span>
            </NavItem>
            <NavItem eventKey={5} data-key={5} onClick={this.navBarButtonHandler}>
              <span className="glyphicon glyphicon-wrench" data-key={5}></span>
            </NavItem>
            <NavItem eventKey={8} data-key={8} onClick={this.navBarButtonHandler}>
              <span className="glyphicon glyphicon-ice-lolly-tasted" data-key={8}></span>
            </NavItem>
          </Nav>
        </Navbar>);
      }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {table: {
      pageSize: 10,
      page: 0,
      sorted: [],
      filtered: [],
      loading: true
    }, cartComposer: false, shop: 0};

    this.hideModal = this.hideModal.bind(this);
    this.navBarButtonHandler = this.navBarButtonHandler.bind(this);
    this.requestData = this.requestData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.brandModalCloseHandler = this.brandModalCloseHandler.bind(this);
    
  }
  
  componentDidMount(){
    this.fetchData();
  }

  hideModal(button){
    this.setState({
      modalShow: false
    });
    this.fetchData();
  }

  navBarButtonHandler(selectedKey){
    selectedKey = parseInt(selectedKey, 10);
    switch(selectedKey){
      case 7:
        this.setState({
          cartComposer: false
        });
        break;
      case 6: 
        this.setState(prevState =>
          ({cartComposer: true, shop: prevState.shop === 0 ? 1 : prevState.shop})
        );
        break;
      case 5: 
        this.setState({
          modalShow: true
        });
        break;
      case 8:
        this.setState({
          addBrandModalShow: true
        });
        break;
      default:
        let newState = {
          shop: selectedKey
        };
        if(selectedKey === 0){
          newState.cartComposer = false;
        }
        this.setState(newState);
        break;
    }
  }

  requestData(pageSize, page, sorted, filtered){
    console.log(filtered);
    var filtered_without_all = [];
    filtered.forEach(element => {
      if(element.id === "shop1" || element.id === "shop2"){
        if(element.value !== "all"){
          filtered_without_all.push(element);
        }
      }else{
        filtered_without_all.push(element);
      }
    });
    var payload = {
      start: page*pageSize,
      end: page*pageSize+pageSize,
      orderBy: sorted,
      where: filtered_without_all
    }
    var url = `${BASE_URL}/api/getProducts?parameters=`+JSON.stringify(payload);

    fetch(encodeURI(url))
    .then(res => {
        return res.json();
    })
    .then(
      (result) => {
          console.log(result);
          var tableState = {...this.state.table}
          tableState.data = [];
          let shift = page*pageSize;
          console.log("SHIFT "+(shift));
          for(let i = 0; i<result.items.length; i++){
            tableState.data[i+shift] = result.items[i];
          }
          console.log(tableState.data);
          tableState.pages = Math.ceil(result.numberOfItems / pageSize);
          tableState.loading = false;
          this.setState({table: {...tableState}});
      },
      (error) => {
          this.setState({
              data: [],
              pages: 0,
              loading: false
          });
      }
    )
  };

  fetchData() {
      // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
      // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
      this.setState({ loading: true });
      // Request the data however you want.  Here, we'll use our mocked service we created earlier
      /*this.requestData(
        this.state.table.pageSize,
        this.state.table.page,
        this.state.table.sorted,
        this.state.table.filtered
      );*/
      fetch(encodeURI(`${BASE_URL}/api/getProducts`))
      .then(res => {
          return res.json();
      })
      .then(
        (result) => {
          let tableState = {...this.state.table}
          tableState.data = result;
          tableState.loading = false;
          this.setState({
            table: tableState
          });
        }
      );
  }
  
  brandModalCloseHandler(){
    this.setState(
      {
        addBrandModalShow: false
      }
    );
  }
  render() {
    let cartComposer;
    let table;
    if(this.state.cartComposer){
      cartComposer = <CartComposer shop={this.state.shop}/>
    }else{
      const filterMethod = function(filter, row){
        if(filter.value === "NOT 0"){
          return row[filter.id] > 0;
        }
        if(filter.value === "0"){
          return row[filter.id] <= 0;
        }
        return true;
      };
      let selectedShop;
      switch(this.state.shop){
        case 0:
          selectedShop = {
                Header: LOCALE_STRING.shops,
                columns: [
                {
                Header: LOCALE_STRING.shop1,
                accessor: "shop1",
                filterMethod: filterMethod,
                Filter: ({ filter, onChange }) =>
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                        >
                        <option value="all">{LOCALE_STRING.show_all}</option>
                        <option value="NOT 0">{LOCALE_STRING.availables}</option>
                        <option value="0">{LOCALE_STRING.out_of_stock}</option>
                    </select>
                },
                {
                Header: LOCALE_STRING.shop2,
                accessor: "shop2",
                filterMethod: filterMethod,
                Filter: ({ filter, onChange }) =>
                    <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                    >
                    <option value="all">{LOCALE_STRING.show_all}</option>
                    <option value="NOT 0">{LOCALE_STRING.availables}</option>
                    <option value="0">{LOCALE_STRING.out_of_stock}</option>
                    </select>
                }
            ]
          };
          break;
        case 1:
          selectedShop = {
            Header: LOCALE_STRING.shops,
            columns: [
                {
                Header: LOCALE_STRING.shop1,
                accessor: "shop1",
                filterMethod: filterMethod,
                Filter: ({ filter, onChange }) =>
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                        >
                        <option value="all">{LOCALE_STRING.show_all}</option>
                        <option value="NOT 0">{LOCALE_STRING.availables}</option>
                        <option value="0">{LOCALE_STRING.out_of_stock}</option>
                    </select>
                }
            ]
          };
          break;
        case 2:
          selectedShop = {
            Header: LOCALE_STRING.shops,
            columns: [
                {
                Header: LOCALE_STRING.shop2,
                accessor: "shop2",
                filterMethod: filterMethod,
                Filter: ({ filter, onChange }) =>
                    <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                    >
                    <option value="all">{LOCALE_STRING.show_all}</option>
                    <option value="NOT 0">{LOCALE_STRING.availables}</option>
                    <option value="0">{LOCALE_STRING.out_of_stock}</option>
                    </select>
                }
            ]
          };
          break;
        default: 
          break;
      } 
      
      const columns = [
                          {
                          Header: LOCALE_STRING.products,
                          columns: [
                              {
                              Header: LOCALE_STRING.barcode,
                              accessor: "barcode",
                              filterMethod: (filter, row) =>
                                  row[filter.id].startsWith(filter.value)
                              },
                              {
                              Header: LOCALE_STRING.name,
                              accessor: "name",
                              filterMethod: (filter, row) =>
                                  row[filter.id].includes(filter.value)
                              },
                              {
                              Header: LOCALE_STRING.description,
                              id: "description",
                              accessor: d => d.description,
                              filterMethod: (filter, row) =>
                                  row[filter.id].includes(filter.value)
                              }
                          ]
                          },
                          {
                          Header: LOCALE_STRING.prices,
                          columns: [
                              {
                              Header: LOCALE_STRING.initialPrice,
                              accessor: "initialPrice"
                              },
                              {
                              Header: LOCALE_STRING.wholesalePrice,
                              accessor: "wholesalePrice"
                              },
                              {
                              Header: LOCALE_STRING.finalPrice,
                              accessor: "finalPrice"
                              }
                          ]
                          },
                          {
                          Header: LOCALE_STRING.brand,
                          columns: [
                              {
                              Header: LOCALE_STRING.brand,
                              accessor: "brand",
                              filterMethod: (filter, row) =>
                                  row[filter.id].includes(filter.value)
                              }
                          ]
                          }
                      ];
      columns.push(selectedShop);
      table = 
            <ReactTable
              data={this.state.table.data}
              columns = {columns}
              //pivotBy={["barcode"]}
              loading={this.state.table.loading}
              filterable
              defaultPageSize={10}
              className="-striped -highlight"
              pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
              
            />
    }
    return (
      <React.Fragment>
        <AddProductModal show={this.state.modalShow} hide={this.hideModal} />
        <AddBrandModal show={this.state.addBrandModalShow} handleClose={this.brandModalCloseHandler} />
        <MagazzinoNavBar buttonHandler={this.navBarButtonHandler} selected={this.state.shop}/>;
          <div id="main" className="container">
            {this.state.cartComposer ? cartComposer : table}
          </div>
      </React.Fragment>
    );
  }
}

export default App;
