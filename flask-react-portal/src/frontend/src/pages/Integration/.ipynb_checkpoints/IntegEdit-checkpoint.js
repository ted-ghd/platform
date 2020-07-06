import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {  Route, NavLink } from 'react-router-dom';
import { Button, Col,  FormGroup, Form, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import * as api from 'lib/api';


class IntegInfo extends Component {
  
  static defaultProps = {
      info: {
            id:'0',
            uid:'',
            endPoint: '',//'https://rancher.hae-hpc.com/v3',
            accessKey: '',//'token-zqwfn',
            secretKey: '',//'nsthr8mjrxp95xjh5qdqq2c4qqqsxprg78g9vpz82hc9sq5bl9zlwg',
            projectId: '',//'1',
            target:'rancher',
            sessionId: ''

        }
  }
  state = {
        editing: false,
        rancherInfo: {
            id:'0',
            uid:'',
            endPoint: '',//'https://rancher.hae-hpc.com/v3',
            accessKey: '',//'token-zqwfn',
            secretKey: '',//'nsthr8mjrxp95xjh5qdqq2c4qqqsxprg78g9vpz82hc9sq5bl9zlwg',
            projectId: '',//'1',
            target:'rancher',
            sessionId: ''

        }
    }
    
    doRancherLogin = async ( param ) => {

        param.sessionId = this.props.sessionId
        try{
            const response = await api.doRancherLogin( param);
            console.log(response);
            alert(response.status+" : "+response.statusText);
        } catch (e) {
            console.log(e)
        }
    }

    reload = () => {
        this.props.reload()
    }
    doIntegrationSave = async ( param ) => {
        //param.id = '0'
        param.target ='rancher'
        param.sessionId = this.props.sessionId
        try{
            const response = await api.doIntegrationSave ( param);
            console.log(response)
            //
            this.handleToggleEdit()
            this.reload()
            //this.props.history.push('/Integration')
            alert(response.status+" : "+response.statusText);
        } catch(e) {
            console.log(e)
        }
    }
    handleChange = (e) => {
    this.setState({
          

          rancherInfo : {

           ...this.state.rancherInfo, 
           [e.target.name] : e.target.value}
          
            }
    
        )
    }

    handleIntegrationSave = () => {

        this.setState({

            rancherInfo : {

                ...this.state.rancherInfo,
                sessionId : this.props.sessionId
            }
        })

        this.doIntegrationSave(this.state.rancherInfo)
    }
  // rancher login 버튼 클릭 처리
    handleRancherLogin = () => {

        console.log(this.props.info)
        this.doRancherLogin(this.props.info)


    }

  

  handleCreate = (data) => {

    this.setState({
      builds : {...data}
    })
    this.insertBuilds(data);
  }
  
  insertBuilds = async ( param ) => {
    try {
      const response = await api.insertExams( param );

      console.log(response);
      alert("Success");
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
  
  // editing 값을 반전시키는 함수입니다
  // true -> false, false -> true
  handleToggleEdit = () => {
    console.log("toggle")
    this.setState({ 
      
        editing: !this.state.editing
    
    });

  }

  componentDidUpdate(prevProps, prevState) {
    // 여기서는, editing 값이 바뀔 때 처리 할 로직이 적혀있습니다.
    // 수정을 눌렀을땐, 기존의 값이 input에 나타나고,
    // 수정을 적용할땐, input 의 값들을 부모한테 전달해줍니다.

    console.log("componentDidUpdate")
    if(!prevState.editing && this.state.editing) {
        console.log("editing changed")
      // editing 값이 false -> true 로 전환 될 때
      // info 의 값을 state 에 넣어준다 
      this.setState({

        rancherInfo: {...this.props.info}
      })
    }

  }

  render() {
    console.log(this.props)
    

    if( this.props.sessionYn === "TRUE"){

        if(!this.state.editing) {

            const { secretKey, accessKey, endPoint, projectId, id } = this.props.info;
    return (
      
      <Form>{id}
                    <FormGroup row>
                        <Label sm={2}>secretKey </Label>
                        <Col sm={5}>
                            <Input readOnly
                            value={secretKey}
                            onChange={this.handleChange}
                            name="secretKey"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>accessKey </Label>
                        <Col sm={5}>
                            <Input readOnly
                            placeholder=""
                            value={accessKey}
                            onChange={this.handleChange}
                            name="accessKey"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>rancherUrl </Label>
                        <Col sm={5}>
                            <Input readOnly
                            placeholder=""
                            value={endPoint}
                            onChange={this.handleChange}
                            name="endPoint"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>projectId </Label>
                        <Col sm={5}>
                            <Input readOnly
                            placeholder=""
                            value={projectId}
                            onChange={this.handleChange}
                            name="projectId"
                            />
                        </Col>
                    </FormGroup>

                    <div align="right">
                        <Button onClick={this.handleRancherLogin} >Rancher 로그인</Button>
                        &nbsp;
                        <Button onClick={this.handleToggleEdit}>Edit</Button> &nbsp; 
                        <br></br>
                        <br></br>
                    </div>
                </Form>
    );
    }
    else {

        const {id, secretKey, accessKey, endPoint, projectId } = this.state.rancherInfo;
    return (
        <Form>{id}
                    <FormGroup row>
                        <Label sm={2}>secretKey </Label>
                        <Col sm={5}>
                            <Input 
                            value={secretKey}
                            onChange={this.handleChange}
                            name="secretKey"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>accessKey </Label>
                        <Col sm={5}>
                            <Input 
                            placeholder=""
                            value={accessKey}
                            onChange={this.handleChange}
                            name="accessKey"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>rancherUrl </Label>
                        <Col sm={5}>
                            <Input 
                            placeholder=""
                            value={endPoint}
                            onChange={this.handleChange}
                            name="endPoint"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>projectId </Label>
                        <Col sm={5}>
                            <Input 
                            placeholder=""
                            value={projectId}
                            onChange={this.handleChange}
                            name="projectId"
                            />
                        </Col>
                    </FormGroup>

                    <div align="right">
                        &nbsp;
                        <Button onClick={this.handleIntegrationSave} >Save</Button>
                        <br></br>
                        <br></br>
                    </div>
                </Form>
    );}
    
    
    }
    else{
        return(
            <Redirect to ="/" />
        )
    }
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
export default connect(mapStateToProps)(IntegInfo);