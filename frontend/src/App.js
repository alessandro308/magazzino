import React, { Component } from 'react';
import ReactTable from 'react-table';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import AddProductModal from './components/AddProductModal';
import CartComposer from './components/CartComposer';
import './App.css';
import "react-table/react-table.css";
import {BASE_URL} from './constant';

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
              {this.props.selected === 0 ? <strong>Generale</strong> : "Generale"}
            </NavItem>
            <NavItem eventKey={1} data-key={1} onClick={this.navBarButtonHandler}>
              {this.props.selected === 1 ? <strong>Terracina</strong> : "Terracina"}
            </NavItem>
            <NavItem eventKey={2} data-key={2} onClick={this.navBarButtonHandler} >
              {this.props.selected === 2 ? <strong>Borgo Hermada</strong> : "Borgo Hermada"}
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
          </Nav>
        </Navbar>);
      }
}

class App extends Component {
  constructor(props){
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.navBarButtonHandler = this.navBarButtonHandler.bind(this);
    this.requestData = this.requestData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.state = {table: {
      pageSize: 10,
      page: 0,
      sorted: [],
      filtered: [],
      loading: true
    }, cartComposer: false, shop: 0};
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
    console.log(selectedKey);
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

    var payload = {
      start: page*pageSize,
      end: page*pageSize+pageSize,
      orderBy: sorted,
      where: filtered
    }
    /*var sorting = "";
    if(typeof sorted !== "undefined" && sorted.length){
        for(let i = 0; i<sorted.length; i++){
            if(i !== 0){
                sorting += " AND ";
            }
            sorting += `p.${sorted[i].id}}`;
        }
    }

    var filtering = "";
    if(typeof filtered !== "undefined" && filtered.length){
        for(let i = 0; i<filtered.length; i++){
            if(i!==0){
                filtering += " AND ";
            }
            const id = filtered[i].id;
            filtering += `${id}=${filtered[i].value}`;
        }
    }*/
    var url = `http://localhost:8888/api/getProducts?parameters=`+JSON.stringify(payload);
    fetch(encodeURI(url))
    .then(res => {
        return res.json();
    })
    .then(
      (result) => {
          var tableState = {...this.state.table}
          tableState.data = [];
          
          for(let i = 0; i<result.items.length; i++){
            tableState.data[i+page*pageSize] = result.items[i];
          }
          
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
      this.requestData(
        this.state.table.pageSize,
        this.state.table.page,
        this.state.table.sorted,
        this.state.table.filtered
      );
  }
  
  render() {
    let cartComposer;
    let table;
    var selectedShop;
    if(this.state.cartComposer){
      cartComposer = <CartComposer shop={this.state.shop}/>
    }else{
      switch(this.state.shop){
        case 0:
          selectedShop = {
            Header: "Avaiability",
            columns: [
                {
                Header: "Shop1",
                accessor: "shop1",
                filterMethod: (filter, row) => {
                  return true;
                },
                Filter: ({ filter, onChange }) =>
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                        >
                        <option value="all">Show All</option>
                        <option value="NOT 0">Avaialable</option>
                        <option value="0">Out of stock</option>
                    </select>
                },
                {
                Header: "Shop2",
                accessor: "shop2",
                filterMethod: (filter, row) => {
                    return true;
                },
                Filter: ({ filter, onChange }) =>
                    <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                    >
                    <option value="all">Show All</option>
                    <option value="NOT 0">Avaialable</option>
                    <option value="0">Out of stock</option>
                    </select>
                }
            ]
          };
          break;
        case 1:
          selectedShop = {
            Header: "Avaiability",
            columns: [
                {
                Header: "Shop1",
                accessor: "shop1",
                filterMethod: (filter, row) => {
                  return true;
                },
                Filter: ({ filter, onChange }) =>
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                        >
                        <option value="all">Show All</option>
                        <option value="NOT 0">Avaialable</option>
                        <option value="0">Out of stock</option>
                    </select>
                }
            ]
          };
          break;
        case 2:
          selectedShop = {
            Header: "Avaiability",
            columns: [
                {
                Header: "Shop2",
                accessor: "shop2",
                filterMethod: (filter, row) => {
                    return true;
                },
                Filter: ({ filter, onChange }) =>
                    <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : "all"}
                    >
                    <option value="all">Show All</option>
                    <option value="NOT 0">Avaialable</option>
                    <option value="0">Out of stock</option>
                    </select>
                }
            ]
          };
      } 
      
      const columns = [
                          {
                          Header: "Product",
                          columns: [
                              {
                              Header: "Barcode",
                              accessor: "barcode",
                              filterMethod: (filter, row) =>
                                  row[filter.id].startsWith(filter.value)
                              },
                              {
                              Header: "Name",
                              accessor: "name",
                              filterMethod: (filter, row) =>
                                  row[filter.id].includes(filter.value)
                              },
                              {
                              Header: "Description",
                              id: "description",
                              accessor: d => d.description,
                              filterMethod: (filter, row) =>
                                  row[filter.id].includes(filter.value)
                              }
                          ]
                          },
                          {
                          Header: "Prices",
                          columns: [
                              {
                              Header: "Initial Price",
                              accessor: "initialPrice"
                              },
                              {
                              Header: "Wholesale Price",
                              accessor: "wholesalePrice"
                              },
                              {
                              Header: "Final Price",
                              accessor: "finalPrice"
                              }
                          ]
                          },
                          {
                          Header: 'Brand',
                          columns: [
                              {
                              Header: "Brand",
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
              pages={this.state.table.pages}
              // Controlled props
              sorted={[]}
              pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
              page={this.state.table.page}
              pageSize={this.state.table.pageSize}
              filtered={this.state.table.filtered}
              // Callbacks
              onSortedChange={sorted => {
                  const tableStatus = {...this.state.table};
                  tableStatus.sorted = sorted;
                  this.setState({ table: tableStatus }, this.fetchData );
                }
              }
              onPageChange={page => {
                  const tableStatus = {...this.state.table};
                  tableStatus.page = page;
                  this.setState({ table: tableStatus }, this.fetchData );
                }
              }
              onPageSizeChange={(pageSize, page) => {
                const tableStatus = {...this.state.table};
                tableStatus.page = page;
                tableStatus.pageSize = pageSize;
                this.setState({ table: tableStatus }, this.fetchData );
              }}
              onFilteredChange={filtered => {
                const tableStatus = {...this.state.table};
                tableStatus.filtered = filtered;
                this.setState({ table: tableStatus }, this.fetchData );
              }
            }
            />
    }
    return (
      <div>
      <AddProductModal show={this.state.modalShow} hide={this.hideModal} />
      <MagazzinoNavBar buttonHandler={this.navBarButtonHandler} selected={this.state.shop}/>;
      <div id="main" className="container">
       {this.state.cartComposer ? cartComposer : table}
      </div>
      </div>
    );
  }
}

export default App;
