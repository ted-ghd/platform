// src/components/PhoneInfoList.js
import React, { Component } from 'react';
import { Table,  Form, FormGroup, Label, Input,  Col , Container  } from 'reactstrap';
import {ChasingDots, Circle} from 'better-react-spinkit'

class ImageInfoList extends Component {
  static defaultProps = {
    ingresses: []
  }
  state = {
      group:'',
      project:'',
      loading:false
  }
  makeTagsColumn = (tags) => {

      let res = ""
      for(var i=0;i<tags.length;i++){
          res = res + "<td>"+ tags[i]  +"</td>"
      }
      return res;
  }
  handleChange = (e) => {
        this.setState({
        [e.target.name]: e.target.value
        })

        if (e.target.name === 'group') {

           this.props.changeGroup(e.target.value)

         }

         if(e.target.name === 'project') {
             this.props.changeProject(this.state.group, e.target.value)
             this.setState({
                 loading:true
             })
         }

      //  this.props.changeGroup(e.target.value);
    }
  
  componentWillReceiveProps(nextProps) {
  // this.props 는 아직 바뀌지 않은 상태
        this.setState({
            loading:false
        })
    }
  render() {
    
    const { groups } = this.props;
        const groupList = groups.sort((a,b) => a.group > b.group).map(

                group => ( 
                <option key ={group.group} >{group.group}</option>
                )

            )

    const { projects } = this.props;

    const projectList = projects.map(

        project => (
        
         <option key ={project} >{project}</option>
        )
    )
    
    const {images } = this.props;
    /*const imageList = images.map(

        image => (
            <tr key={image.image} >
            <td rowspan={image.tags.length}>{image.image}</td>
            {this.makeTagsColumn(image.tags)}
            </tr>
        )
    )*/

    const imageList = images.map(function(image, i) {
        let row = [];

        image.tags.map( function (tag, i) {

            if( i === 0) {
                row.push(
                    <tr key={image.image+tag}>
                    <td rowSpan={image.tags.length}>{image.image}</td>
                    <td >{tag}</td>
                    </tr>
                )
            } else {
                row.push(
                    <tr key={image.image+tag}>
                    <td >{tag}</td>
                    </tr>
                )
            }
        })
        
        return row
    })


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

                        <Label sm={1}>GitLab Project </Label>
                        <Col sm={5}>
                        
                        <Input
                        type="select"
                        value={this.state.project}
                        name="project"
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {projectList}
                        </Input>



                        </Col>
                        </FormGroup><hr />
        </Form>
        <Table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>tag</th>
                </tr>
            </thead>
            <tbody>
            
            {imageList}


            </tbody>   
            
        </Table>
        { this.state.loading ? 
            <div align="center">
            <Circle color="black" size={120} />
            </div>
            : <div></div>
        }

        </div>
    );
  }
}

export default ImageInfoList;