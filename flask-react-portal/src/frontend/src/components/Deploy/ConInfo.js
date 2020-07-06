import React, { Component } from 'react';
import {  FormGroup, Button, Label, Input,  Col, Badge ,  Alert , Row  } from 'reactstrap';
import ConVolInfo  from './ConVolInfo'
import uuid from 'react-native-uuid'

class ConInfo extends Component {

    state = {
        id : -1,
        con_name: '',
        con_port: '',
        con_args: '',
        con_cmd: '',
        con_vol_name: '',
        con_vol_path:'',
        con_vol_cnt: 0,
        con_gpu:'',
        con_exp_port:'',
        con_vols: [

        ]
    }
  static defaultProps = {
    con:
            {
                id : -1,
                con_name: 'sshd',
                con_port: '8000',
                con_args: '-D',
                con_cmd: '/usr/sbin/sshd',
                con_vol_name: '',
                con_vol_path:'',
                con_vol_cnt: 0,
                con_gpu: '4',
                con_exp_port: '22',
                con_vols: []
            }
        
  }
  componentDidUpdate(prevProps, prevState) {
      
      console.log('con info componentDidUpdate')
      console.log(this.props.last_event_ele)
      if(document.getElementById(this.props.last_event_ele) !== null){
                console.log(this.props.last_event_ele)
                document.getElementById(this.props.last_event_ele).focus()
         }   
  }
  handleChange = (e) => {
      this.props.onChange(this.props.con.id , e, this.props.con.con_id)
  }

  handleConVolChange = (id, e) => {
      this.props.conVolChange(id, this.props.con.id, e)
  }
  addVolume = () => {
    this.props.addContainerVolume(this.props.con.id)
  }

  removeVolume = () => {
      console.log("coninfo removeVolume")
      this.props.removeContainerVolume(this.props.con.id)
  }
  componentDidMount() {

      console.log(this.props)
      this.setState({
        id : this.props.con.id,
        con_name: 'sshd',
        con_port: '8000',
        con_args: '-D',
        con_cmd: '/usr/sbin/sshd',
        con_vol_name: '',
        con_vol_path:'',
        con_vol_cnt: 0,
        con_gpu: '4',
        con_exp_port: '22',
        con_vols: []
      })
  }
  handleSubmit = (e) => { 
  }

  handleModify = (e) => {
    
  }
  render() {

    const {
        con_name, con_port, con_args, con_cmd,  
        con_gpu, con_exp_port, con_id
    } =  this.props.con
    
    
    console.log(this.props.con)
    const  conVollist  = this.props.con.con_vols.map(

       vol => ( <ConVolInfo key={uuid.v4()}
                        con_id={con_id}
                        vol={vol} 
                        onChange={this.handleConVolChange}
                        pvcs={this.props.volumes}
                        readOnly={this.props.readOnly}/>)
    )

    //console.log(conVollist);
    if(this.props.readOnly) {

        return (
            <div>
            <Row>
            <Col sm={1}/>
            <Col><Badge color="info">{con_id}</Badge></Col>
            </Row>
            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON NAME</Label>
            <Col sm={4}>
            <Input readOnly
            placeholder="CON NAME"
            value={con_name}
            onChange={this.handleChange}
            name="con_name"
            />
            </Col>
            <Label sm={1}>CON PORT</Label>
            <Col sm={5}>
            <Input readOnly
            placeholder="CON PORT"
            value={con_port}
            onChange={this.handleChange}
            name="con_port"
            />
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON GPU</Label>
            <Col sm={4}>
            <Input readOnly
            placeholder="CON GPU"
            value={con_gpu}
            onChange={this.handleChange}
            name="con_gpu"
            />
            </Col>
            <Label sm={1}>EXP PORT</Label>
            <Col sm={5}>
            <Input readOnly
            placeholder="EXP PORT"
            value={con_exp_port}
            onChange={this.handleChange}
            name="con_exp_port"
            />
            </Col>
            </FormGroup>

            {/*<FormGroup row>
            <Label sm={1}>CON VOL NAME</Label>
            <Col sm={5}>
            <Input readOnly
            placeholder="CON VOLNAME"
            value={con_vol_name}
            onChange={this.handleChange}
            name="con_vol_name"
            />
            </Col>
            <Label sm={1}>CON VOL PATH</Label>
            <Col sm={5}>
            <Input readOnly
            placeholder="CON VOL PATH"
            value={con_vol_path}
            onChange={this.handleChange}
            name="con_vol_path"
            />
            </Col>
            </FormGroup>*/}

            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON ARGS</Label>
            <Col sm={10}>
            <Input readOnly
            type="textarea"
            placeholder="CON ARGS"
            value={con_args}
            onChange={this.handleChange}
            name="con_args"
            />
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON CMD</Label>
            <Col sm={10}>
            <Input readOnly
            type="textarea"
            placeholder="CON CMD"
            value={con_cmd}
            onChange={this.handleChange}
            name="con_cmd"
            />
            </Col>
            </FormGroup>

            
            <FormGroup row>
            
            <Label sm={2}></Label>
            <Col sm={6}>
            < Alert fade={false} color="warning">
            Container Volumes
            </ Alert >
            </Col>
            <Col align="right">
            <Button size="sm" onClick={this.addVolume} color="primary"  >+</Button>&nbsp;
            <Button size="sm" onClick={this.removeVolume} color="primary"  >-</Button>
            </Col>
            </FormGroup>

            {conVollist}
            
            </div>
        );
    }
    else {
        return (
            <div>
            <Row>
            <Col sm={1}/>
            <Col><Badge color="info">{con_id}</Badge></Col>
            </Row>
            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON NAME</Label>
            <Col sm={4}>
            <Input  
            placeholder="CON NAME"
            id={'con_name'+'_'+this.state.id}
            value={con_name}
            onChange={this.handleChange}
            name="con_name"
            />
            </Col>
            <Label sm={1}>CON PORT</Label>
            <Col sm={5}>
            <Input  
            placeholder="CON PORT"
            id={'con_port'+'_'+this.state.id}
            value={con_port}
            onChange={this.handleChange}
            name="con_port"
            />
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON GPU</Label>
            <Col sm={4}>
            <Input  
            placeholder="CON GPU"
            id={'con_gpu'+'_'+this.state.id}
            value={con_gpu}
            onChange={this.handleChange}
            name="con_gpu"
            />
            </Col>
            <Label sm={1}>EXP PORT</Label>
            <Col sm={5}>
            <Input  
            placeholder="EXP PORT"
            id={'con_exp_port'+'_'+this.state.id}
            value={con_exp_port}
            onChange={this.handleChange}
            name="con_exp_port"
            />
            </Col>
            </FormGroup>

            {/*<FormGroup row>
            <Label sm={1}>CON VOL NAME</Label>
            <Col sm={5}>
            <Input  
            placeholder="CON VOLNAME"
            value={con_vol_name}
            onChange={this.handleChange}
            name="con_vol_name"
            />
            </Col>
            <Label sm={1}>CON VOL PATH</Label>
            <Col sm={5}>
            <Input  
            placeholder="CON VOL PATH"
            value={con_vol_path}
            onChange={this.handleChange}
            name="con_vol_path"
            />
            </Col>
            </FormGroup>*/}

            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON ARGS</Label>
            <Col sm={10}>
            <Input  
            type="textarea"
            placeholder="CON ARGS"
            id={'con_args'+'_'+this.state.id}
            value={con_args}
            onChange={this.handleChange}
            name="con_args"
            />
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col sm={1}/>
            <Label sm={1}>CON CMD</Label>
            <Col sm={10}>
            <Input  
            type="textarea"
            placeholder="CON CMD"
            id={'con_cmd'+'_'+this.state.id}
            value={con_cmd}
            onChange={this.handleChange}
            name="con_cmd"
            />
            </Col>
            </FormGroup>

            
            <FormGroup row>
            
            <Label sm={2}></Label>
            <Col sm={6}>
            < Alert fade={false} color="warning">
            Container Volumes
            </ Alert >
            </Col>
            <Col align="right">
            <Button size="sm" onClick={this.addVolume} color="primary"  >+</Button>&nbsp;
            <Button size="sm" onClick={this.removeVolume} color="primary"  >-</Button>
            </Col>
            </FormGroup>

            {conVollist}
            
            </div>
        );
    }
  }
}

export default ConInfo;