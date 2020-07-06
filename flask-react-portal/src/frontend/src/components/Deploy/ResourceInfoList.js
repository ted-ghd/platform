// src/components/PhoneInfoList.js
import React, { Component } from 'react';
import { Table,  Form, FormGroup, Label, Input,  Col , Row  } from 'reactstrap';
import DoughnutChart from "components/Deploy/DoughnutChart";

class ResourceInfoList extends Component {
  static defaultProps = {
    resources: []
  }

  chartList = ""
  state = {
      group:''
  }
  handleChange = (e) => {
        

        this.setState({
        [e.target.name]: e.target.value
        })

        this.chartList = ""
        this.props.changeGroup(e.target.value);
    }

  componentDidMount() {
        
        console.log(this.props.resources)
    }
  
  ConvertMTtoG = (str) => {

      let unit = str.substring(str.length-2,str.length-1)
      let number = 0 
      switch(unit){
          case 'M':
            number = Number.parseInt(str.substring(0,str.length-2))
            number = number / 1024
            return number
          case 'T':
            number = Number.parseInt(str.substring(0,str.length-2))
            number = number * 1024
            return number
          default:
            return str;
      }

  }
  render() {

    const { groups } = this.props;
        const groupList = groups.map(

                group => ( 
                <option key ={group.group} >{group.group}</option>
                )

            )

    const { resources } = this.props;
   
    if (resources.length > 0 && resources[0].name !== "" ) {
         this.chartList = resources.map (

            resource => (
                
                <Col key={resource.name}>

                <DoughnutChart used={this.ConvertMTtoG(resource.used)} hard={this.ConvertMTtoG(resource.hard)} type={resource.type}  />
                   
                      <Table>
                        <tbody>
                        <tr>
                            <th>name</th>
                            <td>{resource.name}    </td>
                        </tr>
                        <tr>
                            <th>type</th>
                            <td>{resource.type}    </td>
                        </tr>
                        <tr>
                            <th>used/hard</th>
                            <td>{resource.used+'/'+resource.hard}    </td>
                        </tr>

                        </tbody>
                      </Table>
                      <br/>
                      <br/>
                </Col>      
               
            
            )

        )

        
    } 
    
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
       {/* <Table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>namespace</th>
                    <th>type</th>
                    <th>used</th>
                    <th>hard</th>
                    <th>gauge</th>
                </tr>
            </thead>
            <tbody>
            
             {list}  
            </tbody>   
            
        </Table>
        */}
        <Row>
            
            {
                this.props.resources.length>0 ?
                this.chartList
                : ''
            } 
        </Row>
        </div>
    );
  }
}

export default ResourceInfoList;