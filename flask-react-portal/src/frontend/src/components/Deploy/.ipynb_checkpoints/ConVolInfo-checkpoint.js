import React, { Component } from 'react';
import {  FormGroup, Label, Input,  Col , Badge, Row  } from 'reactstrap';

class ConVolInfo extends Component {

    state = {
        id : -1,
        con_vol_name: '',
        con_vol_path: ''
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
        e.preventDefault();
        this.props.onChange(this.props.vol.id , e)
      

  }
  
  componentDidMount() {

      //console.log(this.props)
      this.setState({
        id : -1,
        con_vol_name: '',
        con_vol_path: ''
        
      })
  }
  
  render() {

    const {
        con_vol_name, con_vol_path, vol_id
    } =  this.props.vol
    
    //const { con_vol_name, con_vol_path} = this.state
    console.log(this.props)
    const { pvcs } = this.props
    const  pvcList  = pvcs.map(

       pvc => ( <option key ={pvc.vol_name} >{pvc.vol_name}</option> )

 
    ) 


    if(this.props.readOnly) {

        return (
            <div>
                <Row> 
                <Col sm={2}> </Col>
                <Col> <Badge color="warning">{vol_id}</Badge>  </Col> </Row>
                <FormGroup row>
                    <Col sm={2}/>
                    <Label sm={1}>NAME</Label>
                    <Col sm={4}>
                       {/*  <Input 
                        placeholder="VOL_NAME"
                        value={vol_name}
                        onChange={this.handleChange}
                        name="vol_name"
                        /> */}
                        
                        <Input readOnly
                        type="select"
                        value={con_vol_name}
                        name="con_vol_name"
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {pvcList}
                        </Input>
                    </Col>
                    <Label sm={1}>PATH</Label>
                    <Col sm={4}>
                        
                        <Input readOnly
                        placeholder=""
                        value={con_vol_path}
                        onChange={this.handleChange}
                        name="con_vol_path"
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
                <Col sm={2}> </Col>
                <Col> <Badge color="warning">{vol_id}</Badge>  </Col> </Row>
                <FormGroup row>
                    <Col sm={2}/>
                    <Label sm={1}>NAME</Label>
                    <Col sm={4}>
                       {/*  <Input 
                        placeholder="VOL_NAME"
                        value={vol_name}
                        onChange={this.handleChange}
                        name="vol_name"
                        /> */}
                        
                        <Input 
                        type="select"
                        value={con_vol_name}
                        name="con_vol_name"
                        id={'con_vol_name'+'_'+vol_id}
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {pvcList}
                        </Input>
                    </Col>
                    <Label sm={1}>PATH</Label>
                    <Col sm={4}>
                        
                        <Input
                        placeholder=""
                        value={con_vol_path}
                        onChange={this.handleChange}
                        id={'con_vol_path'+'_'+this.props.con_id+vol_id}
                        name="con_vol_path"
                        />
                    
                    </Col> 
                </FormGroup>
            </div>
        );
    }
  }
}

export default ConVolInfo;