import React, { Component } from 'react';
import ReactTable from 'react-table';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import AddProductModal from './components/AddProductModal';
import CartComposer from './components/CartComposer';
import './App.css';
import "react-table/react-table.css";
import {BASE_URL, LOCALE_STRING} from './constant';

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
    var url = `${BASE_URL}/api/getProducts?parameters=`+JSON.stringify(payload);
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
            Header: LOCALE_STRING.avaiability,
            columns: [
                {
                Header: LOCALE_STRING.shop1,
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
                        <option value="all">{LOCALE_STRING.show_all}</option>
                        <option value="NOT 0">{LOCALE_STRING.availables}</option>
                        <option value="0">{LOCALE_STRING.out_of_stock}</option>
                    </select>
                },
                {
                Header: LOCALE_STRING.shop2,
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
            Header: LOCALE_STRING.shop1,
            columns: [
                {
                Header: LOCALE_STRING.shop1,
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
            Header: LOCALE_STRING.shop2,
            columns: [
                {
                Header: LOCALE_STRING.shop2,
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
                    <option value="all">{LOCALE_STRING.show_all}</option>
                    <option value="NOT 0">{LOCALE_STRING.availables}</option>
                    <option value="0">{LOCALE_STRING.out_of_stock}</option>
                    </select>
                }
            ]
          };
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
