import React, { Component } from 'react';
import {  FormGroup, Label, Input,  Col, Badge , Row  } from 'reactstrap';
class VolInfo extends Component {

    state = {
        id : -1,
        vol_name: '',
        vol_size: ''
    }
  static defaultProps = {
    vol:
            {
                id : -1,
                vol_name: '',
                vol_size: ''
            }
        
  }
  
  handleChange = (e) => {
      
      if(e.target.name ==="vol_name"){
        this.props.onChange(this.props.vol.id , e)
      }
      
  }

  componentDidMount() {

      console.log(this.props)
      this.setState({
        id : -1,
        vol_name: '',
        vol_size: ''
        
      })
  }
  handleSubmit = (e) => { 
  }

  handleModify = (e) => {
    
  }

  render() {

    const {
        vol_name, vol_size, vol_id
    } =  this.props.vol
    
    const { pvcs } = this.props
    const  pvcList  = pvcs.map(

       pvc => ( <option key ={pvc.name} >{pvc.name}</option> )

 
    ) 


    if(this.props.readOnly) {

        return (
            <div>
                <Row>
                <Col sm={1}/>
                <Col><Badge color="danger">{vol_id}</Badge></Col>
                </Row>
                <FormGroup row>
                    <Col sm={1}/>
                    <Label sm={1}>VOL NAME</Label>
                    <Col sm={4}>
                       {/*  <Input 
                        placeholder="VOL_NAME"
                        value={vol_name}
                        onChange={this.handleChange}
                        name="vol_name"
                        /> */}
                        
                        <Input readOnly
                        type="select"
                        value={vol_name}
                        name="vol_name"
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {pvcList}
                        </Input>
                    </Col>
                    <Label sm={1}>VOL SIZE</Label>
                    <Col sm={5}>
                        
                        <Input readOnly
                        placeholder=""
                        value={vol_size}
                        onChange={this.handleChange}
                        name="vol_size"
                        />
                    
                    </Col> 
                </FormGroup>
            </div>
        );
    }
    else {
        return (
            <div>
                <Row>
                <Col sm={1}/>
                <Col><Badge color="danger">{vol_id}</Badge></Col>
                </Row>
                <FormGroup row>
                    <Col sm={1}/>
                    <Label sm={1}>VOL NAME</Label>
                    <Col sm={4}>
                       {/*  <Input 
                        placeholder="VOL_NAME"
                        value={vol_name}
                        onChange={this.handleChange}
                        name="vol_name"
                        /> */}
                        
                        <Input 
                        type="select"
                        value={vol_name}
                        name="vol_name"
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {pvcList}
                        </Input>
                    </Col>
                    <Label sm={1}>VOL SIZE</Label>
                    <Col sm={5}>
                        
                        <Input 
                        placeholder="" 
                        value={vol_size}
                        onChange={this.handleChange}
                        name="vol_size"
                        />
                    
                    </Col> 
                </FormGroup>
            </div>
        );
    }
  }
}

export default VolInfo;