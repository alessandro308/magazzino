import React from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';

function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
}

class BrandSelector extends React.Component{
  constructor(props){
    super(props);
    this.onChange = this.props.onChange;
    this.state = {
      name: this.props.name,
      id: this.props.id,
      label: this.props.label,
    }
  }

  componentDidMount() {
      fetch("http://localhost:8888/api/getBrands")
      .then(res => res.json())
      .then(
          (result) => {
              this.setState(
                  {
                      brands: result,
                      isLoaded: true
                  }
              )
          },
          (error) => {
              console.log(error);
              this.setState(
              {
                  isLoaded: false,
                  error: error
              }
          )}
      )
  }

  render(){
    var options;
    if(this.state.isLoaded){
      options = this.state.brands.map(row => {
        if(row.name===this.props.selected){
          return <option key={row.name+row.id} value={row.id} selected>{row.name}</option>;
        }
        return <option key={row.name+row.id} value={row.id}>{row.name}</option>;
      })
    }else{
      options=<option value="">Loading...</option>
    }
    return (<FormGroup controlId={this.state.id}>
      <ControlLabel>{this.state.label}</ControlLabel>
      <FormControl componentClass="select" name={this.state.name} onChange={this.onChange}>
        {options}
      </FormControl>
    </FormGroup>);
  }
}

class AddProductForm extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.handleChange = this.props.onChange;
      this.handleSubmit = this.props.onSubmit;
    }
  
    render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <FieldGroup
              id="barcode"
              type="text"
              label="Barcode"
              placeholder="000 000 000 000"
              name="barcode"
              value={this.props.barcode}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="name"
              type="text"
              label="Name"
              name="name"
              placeholder="e.g. Shampoo"
              value={this.props.name}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="description"
              type="text"
              label="Description"
              name="description"
              placeholder="e.g. A beautiful Shampoo"
              value={this.props.description}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="initialPrice"
              type="number"
              label="Purchase Price (€)"
              placeholder="0.00"
              name="initialPrice"
              value={this.props.initialPrice}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="wholesalePrice"
              type="number"
              label="Wholesale Price (€)"
              name="wholesalePrice"
              placeholder="0.00"
              value={this.props.wholesalePrice}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="salePrice"
              type="number"
              label="Sale Price (€)"
              name="finalPrice"
              placeholder="0.00"
              value={this.props.finalPrice}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="shop1"
              type="number"
              label="Number of item stored in Shop1"
              placeholder="0"
              name="shop1"
              value={this.props.shop1}
              onChange={this.handleChange}
              />
            <FieldGroup
              id="shop2"
              type="number"
              label="Number of item stored in Shop2"
              placeholder="0"
              name="shop2"
              value={this.props.shop2}
              onChange={this.handleChange}
              />
            <BrandSelector 
              onChange={this.handleChange} 
              name="brand"
              label="Select a brand"
              id="brand"
              selected={this.props.brand}
              />
          </form>
        );
    }
}

export default AddProductForm;
  