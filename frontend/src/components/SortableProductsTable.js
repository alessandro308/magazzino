import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class SortableProductsTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {limit: 100, products: [], isLoaded: false};
        this.fetchData = this.fetchData.bind(this);
        this.requestData = this.requestData.bind(this);
    }

    requestData(pageSize, page, sorted, filtered){
        var sorting = "";
        if(sorted.length){
            for(let i = 0; i<sorted.length; i++){
                if(i !== 0){
                    sorting += " AND ";
                }
                sorting += `p.${sorted[i].id} ${sorted.desc?"DESC":"ASC"}`;
            }
        }

        var filtering = "";
        if(filtered.length){
            for(let i = 0; i<filtered.length; i++){
                if(i!==0){
                    filtering += " AND ";
                }
                filtered += `p.${filtered[i].id}`;
            }
        }
        
        var url = `http://www.parrucchieriestetiste.it/magazzino/db/api/getProducts?start=${page*pageSize}&end=${page*pageSize+pageSize}`;
        if(sorting !== "")
            url += `&sortedBy=${sorting}`;
        if(filtering !== ""){
            url += `&filterBy=${filtering}`;
        }
        fetch(url)
        .then(res => {
            return res.json();
        })
        .then(
            (result) => {
                const res = {
                    rows: result.items,
                    pages: Math.ceil(result.numberOfItems / pageSize)
                };
                this.setState({
                    data: res.rows,
                    pages: res.pages,
                    loading: false
                });
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

    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.setState({ loading: true });
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        this.requestData(
          state.pageSize,
          state.page,
          state.sorted,
          state.filtered
        );
    }
    
    render(){
        const { data, pages, loading } = this.state;
        return (<ReactTable
            data={data}
            filterable
            defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value}
            columns={[
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
                },
                {
                    Header: "Avaiability",
                    columns: [
                        {
                        Header: "Shop1",
                        accessor: "shop1",
                        filterMethod: (filter, row) => {
                        if (filter.value === "all") {
                            return true;
                        }
                        if (filter.value === "true") {
                            return row[filter.id] > 0;
                        }
                        return row[filter.id] === 0;
                        },
                        Filter: ({ filter, onChange }) =>
                            <select
                            onChange={event => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : "all"}
                            >
                            <option value="all">Show All</option>
                            <option value="true">Avaialable</option>
                            <option value="false">Out of stock</option>
                            </select>
                        },
                        {
                        Header: "Shop2",
                        accessor: "shop2",
                        filterMethod: (filter, row) => {
                        if (filter.value === "all") {
                            return true;
                        }
                        if (filter.value === "true") {
                            return row[filter.id] > 0;
                        }
                        return row[filter.id] === 0;
                        },
                        Filter: ({ filter, onChange }) =>
                            <select
                            onChange={event => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : "all"}
                            >
                            <option value="all">Show All</option>
                            <option value="true">Avaialable</option>
                            <option value="false">Out of stock</option>
                            </select>
                        }
                    ]
                }
            ]}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            pages={pages} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchData} // Request new data when things change
            defaultPageSize={10}
            className="-striped -highlight"
            />);
    }
}

export default SortableProductsTable;