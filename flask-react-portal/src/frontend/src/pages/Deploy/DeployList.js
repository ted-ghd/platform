import React, { Component } from 'react';
import * as api from 'lib/api';
import DeployInfoList from 'components/Deploy/DeployInfoList';
import { connect } from 'react-redux';

import { Redirect } from 'react-router'

class DeployList extends Component {

  _namespace = ''
  state = {
    
    deployments: [ 
        {   
            uid: '',
            namespace: '',
            name: '',
            image: '',
            host_ip: '',
            sshd_port: ''
        }
    ]
  }

  handleSelectGroup = (param, flag) => {

      if(flag){
        this.setState({
            deployments: []
        })
        
        this.getDeploys(param);
      }
      else{
        console.log(param)
        this._namespace = param;
        this.getDeploys();
      }
  }

  reloadDeploy(){

  }
  getDeploys = async () => {
    try {
      let param = { namespace : '', uid: ''}
       
      param.namespace = this._namespace;
      param.sessionId = this.props.sessionId
      const response = await api.getDeploys(param);
      console.log(response)
      this.setState({

          deployments: response.data.map(data=>data)

      })

    } catch (e) {
      // 오류가 났을 경우
      
      alert("Rancher Login 상태를 확인해주세요\nIntegeration -> Rancher")
      console.log(e);
    }
  }
  
  componentDidMount() {
     //this.getDeploys();
  }
  render() {
    
    const {deployments} = this.state;

    if(this.props.sessionYn === "TRUE"){
    return (
      <div>
          <DeployInfoList {...this.props} deploys={deployments}
                          groups={this.props.groups} 
                          projects={this.props.projects} 
                          changeGroup = {this.handleSelectGroup}
                          sessionId = {this.props.sessionId}  
                            />
      </div>
    );
    }
    else{
         return(
            <Redirect to="/"/>
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
export default connect(mapStateToProps)(DeployList);