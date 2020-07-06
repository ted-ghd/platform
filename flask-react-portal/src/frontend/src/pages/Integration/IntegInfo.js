import React, { Component } from 'react';
import { IntegEdit } from 'pages'
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import * as api from 'lib/api';

class IntegInfo extends Component {
  
  state = {
        rancherInfo: {
            id:'0',
            uid:'',
            endPoint: '',//'https://rancher.hae-hpc.com/v3',
            accessKey: '',//'token-zqwfn',
            secretKey: '',//'nsthr8mjrxp95xjh5qdqq2c4qqqsxprg78g9vpz82hc9sq5bl9zlwg',
            projectId: '',//'1',
            target:'rancher'

        }
    }
    
    doRancherLogin = async ( param ) => {

        try{
            const response = await api.doRancherLogin( param);
            console.log(response);
        } catch (e) {
            console.log(e)
        }
    }

    doIntegrationSave = async ( param ) => {
        //param.id = '0'
        param.target ='rancher'
        param.uid = ''
        param.sessionId = this.props.sessionId
        try{
            const response = await api.doIntegrationSave ( param);
            console.log(response)
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
            }
        })

        this.doIntegrationSave(this.state.rancherInfo)
    }
  // rancher login 버튼 클릭 처리
    handleRancherLogin = () => {

        this.setState({

            rancherInfo : {

                ...this.state.rancherInfo
            }
        })
        this.doRancherLogin(this.state.rancherInfo)


    }

  componentDidMount() {

      this.getIntegration(this.state.rancherInfo)
  }
  
  getIntegration = async (param) => {
    //let param = {sessionId: ''}
    param.sessionId = this.props.sessionId
    try {
      const response = await api.getIntegration(param);

      if(response.data.length > 0){
            this.setState({

                rancherInfo: {...response.data[0]}

                
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
  
  reload = () => {
      this.getIntegration(this.state.rancherInfo)
  }
  render() {
    const { rancherInfo } = this.state;

    if( this.props.sessionYn === "TRUE"){
    return (
            <IntegEdit {...this.props} 
                    info={rancherInfo}
                    reload={this.reload}/>
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
export default connect(mapStateToProps)(IntegInfo);