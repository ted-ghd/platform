// src/components/PhoneInfoList.js
import React, { Component } from 'react';
import { Table,  Form, FormGroup, Label, Input,  Col, Button   } from 'reactstrap';
import * as api from 'lib/api';
import { connect } from 'react-redux';

class VolumeInfoList extends Component {
  static defaultProps = {
    volumes: []
    
  }
  state = {
      group:'',
      addVolume: false,
      new_vol_name:'',
      new_vol_size:'',
      new_vol_sc:''
  }
  handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })

        if(e.target.name === 'group'){
            this.setState({
                [e.target.name]: e.target.value,
                new_vol_sc : 'rnd-'+ e.target.value ,
                addVolume: false
            })
            this.props.changeGroup(e.target.value);
        }
    }

  cancleCreateVolume = () => {
      this.setState({
            addVolume: false
        })
  }
    createVolume = () => {

        if(this.state.addVolume === false) {
            console.log(this.state.group+"에 볼륨 추가");
            this.setState({
                addVolume: true
            })
        } else {
            
            console.log("yaml 제출하러 가자")
            console.log(this.state)
            this.createPvc(this.state)
        }
    }

    createPvc = async ( param ) => {
    try {
      let _param = param
      _param.sessionId = this.props.sessionId
      const response = await api.createPvc( _param );

       alert(response.status+" : Created");
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }

  render() {

    const { groups } = this.props;
        const groupList = groups.map(

                group => ( 
                <option key ={group.group} >{group.group}</option>
                )

            )

    const { volumes } = this.props;
    
    const list = volumes.map(

        volume => ( <tr key={volume.name} >
        <td >{volume.name}</td>
        <td >{volume.storage}</td>
        
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
                    <th>storage</th>
                </tr>
            </thead>
            <tbody>
            
            {list} 
            </tbody>   
        </Table>
        
        <hr/>
                {
                    this.state.addVolume ?
                    <div>
                        <FormGroup row>
                            <Label sm={1}>name</Label>
                            <Col sm={5}> 
                                <Input value={this.state.new_vol_name} onChange={this.handleChange} name="new_vol_name"/> 
                            </Col>
                            <Label sm={1}>size</Label>
                            <Col sm={5}>
                                <Input value={this.state.new_vol_size} onChange={this.handleChange} name="new_vol_size"/> 
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={1}>storage class</Label>
                            <Col sm={5}> 
                                <Input type="select" >
                                    <option>{'rnd-'+this.state.group}</option>
                                </Input> 
                            </Col>
                        </FormGroup>
                        </div>
                    : <div></div>
                }
                

                <div align="right">

                    {
                        this.state.group.length > 0 ?
                    
                    <Button onClick={this.createVolume}>볼륨 추가</Button>
                    : <div></div>
                    }
                    {
                    this.state.addVolume ?
                    
                    <span>&nbsp;&nbsp;<Button onClick={this.cancleCreateVolume}>취소</Button></span>
                    : <div></div>
                    }
                    
                    <br></br>
                    <br></br>
                </div>
        </div>
    );
  }
}


// props 값으로 넣어 줄 상태를 정의해줍니다.
const mapStateToProps = (state) => ( {
    sessionYn: state.login.sessionYn,
    comid : state.login.comid, 
    comname : state.login.comname, 
    grade : state.login.grade, 
    name : state.login.name, 
    said : state.login.said, 
    saname : state.login.saname, 
    silid : state.login.silid, 
    silname : state.login.silname, 
    teamid : state.login.teamid , 
    teamname : state.login.teamname,
    sessionId : state.login.sessionId
});

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps)(VolumeInfoList);
