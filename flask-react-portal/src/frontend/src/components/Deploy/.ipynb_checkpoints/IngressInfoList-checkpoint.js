// src/components/PhoneInfoList.js
import React, { Component } from 'react';
import { Table,  Form, FormGroup, Label, Input,  Col   } from 'reactstrap';


class IngressInfoList extends Component {
  static defaultProps = {
    ingresses: []
  }
  state = {
      group:''
  }
  handleChange = (e) => {
        this.setState({
        [e.target.name]: e.target.value
        })

        this.props.changeGroup(e.target.value);
    }
  render() {

    const { groups } = this.props;
        const groupList = groups.map(

                group => ( 
                <option key ={group.group} >{group.group}</option>
                )

            )

    const { ingresses } = this.props;
    
    const list = ingresses.map(

        ingress => ( <tr key={ingress.uid} >
        <td >{ingress.name}</td>
        <td >{ingress.namespace}</td>
        <td ><a target={ingress.uid} href={`http://${ingress.host}`} 
        >{ingress.host}</a></td>
        <td >{ingress.service}</td>
        </tr>  )

    )
    
    

    return (
        <div>

        <Form>
            <FormGroup row>
                <Label sm={1}>GitLab Group </Label>
                <Col sm={5}>
                
                <Input 
                    type="select"
                    value={this.state.group}
                    name="group"
                    onChange={this.handleChange}
                >
                <option></option>
                {groupList}
                </Input>
                    
                </Col>

                <Label sm={1}></Label>
                <Col sm={5}>
                    

                </Col>
                </FormGroup><hr />
        </Form>
        <Table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>namespace</th>
                    <th>host</th>
                    <th>service</th>
                </tr>
            </thead>
            <tbody>
            
            {list} 
            </tbody>   
        </Table>
        </div>
    );
  }
}

export default IngressInfoList;