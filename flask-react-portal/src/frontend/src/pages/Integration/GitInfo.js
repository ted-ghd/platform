import React, { Component } from 'react';
import {  GitEdit } from 'pages'
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import * as api from 'lib/api';

class GitInfo extends Component {
  
  state = {
        gitInfo: {
            id:'0',
            uid:'',
            endPoint: '',// 'gitlab.hae-hpc.com'
            accessKey: '',//'3AtZWZSdfRz5YU42hx2N',
            secretKey: '0',//,
            projectId: '0',//,
            target:'gitlab',
            sessionId: ''

        }
    }
    

    doIntegrationSave = async ( param ) => {
        //param.id = '0'
        param.target ='gitlab'
        param.uid = ''
        param.sessionId = this.props.sessionId
        try{
            console.log(param)
            const response = await api.doIntegrationSave ( param);
            console.log(response)
        } catch(e) {
            console.log(e)
        }
    }
    handleChange = (e) => {
    this.setState({
          

          gitInfo : {

           ...this.state.gitInfo, 
           [e.target.name] : e.target.value}
          
            }
    
        )
    }

    handleIntegrationSave = () => {

        this.setState({

            gitInfo : {

                ...this.state.gitInfo,
                sessionId : this.props.sessionId
            }
        })

        this.doIntegrationSave(this.state.gitInfo)
    }
  

  componentDidMount() {

      this.getIntegration(this.state.gitInfo)
  }
  reload = () => {
      this.getIntegration(this.state.gitInfo)
  }
  getIntegration = async (param) => {

    param.sessionId = this.props.sessionId
    try {
      const response = await api.getIntegration(param);
      
      if(response.data.length > 0){
            this.setState({

                  gitInfo: {...response.data[0]}
          
                })
      }
      
      

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  
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
    
  render() {
    const { gitInfo } = this.state;

    if( this.props.sessionYn === "TRUE"){
    return (
            <GitEdit info={gitInfo} reload={this.reload}/>
    );}
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
export default connect(mapStateToProps)(GitInfo);