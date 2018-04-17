import React, {Component} from 'react';
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

class AddProductForm extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleChange = this.handleChange.bind(this);
  
      this.state = {
        value: ''
      };
    }
  
    getValidationState() {
      const length = this.state.value.length;
      if (length > 10) return 'success';
      else if (length > 5) return 'warning';
      else if (length > 0) return 'error';
      return null;
    }
  
    handleChange(e) {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState(
          {
              [name]: value
          }
      )
    }
  
    render() {
      return (
        <form>
          <FieldGroup
            id="name"
            type="text"
            label="Name"
            name="name"
            placeholder="e.g. Shampoo"
            value={this.state.name}
            onChange={this.handleChange}
            />
          <FieldGroup
            id="description"
            type="text"
            label="Description"
            name="description"
            placeholder="e.g. A beautiful Shampoo"
            value={this.state.description}
            onChange={this.handleChange}
            />
          <FieldGroup
            id="description"
            type="number"
            label="Purchase Price"
            placeholder="0.00"
            />
          <FieldGroup
            id="description"
            type="number"
            label="Wholesale Price"
            placeholder="e.g. Shampoo"
            />
           <FieldGroup
            id="barcode"
            type="text"
            label="Barcode"
            placeholder="000 000 000 000"
            />
        </form>
      );
    }
}

export default AddProductForm;
  