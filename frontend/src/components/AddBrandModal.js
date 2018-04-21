import React from 'react';
import {Modal, Alert, FormControl, Button,ControlLabel, FormGroup} from 'react-bootstrap';
import {LOCALE_STRING, BASE_URL} from '../constant';

export class AddBrandModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {value: ""};
        this.handleChange = this.handleChange.bind(this);
        this.saveBrand = this.saveBrand.bind(this);
    }

    handleChange(e){
        this.setState({
            value: e.target.value
        });
    }

    saveBrand(){
        fetch(encodeURI(`${BASE_URL}/api/addBrand?name=${this.state.value}`))
        .then(
            res =>
            {
                if(res.statusText === "OK"){
                    this.setState(
                        {brandAdded: true}
                    )
                }else{
                    this.setState(
                        {
                            brandAdded: false,
                            error: res
                        }
                    )
                }
            }
        )
    }
    render(){
        let al;
        if(this.state.brandAdded != null && this.state.brandAdded){
            al = <Alert bsStyle="success">
                <strong>{LOCALE_STRING.brand_added}</strong>
            </Alert>;
        }
        if(this.state.brandAdded != null && !this.state.brandAdded){
            al = <Alert bsStyle="danger">
                    <strong>Error, see console</strong>
                </Alert>;
            console.error(this.state.error);
        }
        return(
            <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{LOCALE_STRING.add_brand}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={this.saveBrand}>
                    <FormGroup
                    controlId="addBrandController"
                    >
                    <ControlLabel>{LOCALE_STRING.add_brand}</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="CocaCola"
                        onChange={this.handleChange}
                    />
                    </FormGroup>
                </form>
              {al}
            </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.saveBrand}>{LOCALE_STRING.add_brand}</Button>
          </Modal.Footer>
        </Modal>
        )
    }
}