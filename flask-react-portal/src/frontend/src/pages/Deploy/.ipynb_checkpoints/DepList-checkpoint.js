import React, { Component } from 'react';
import * as api from 'lib/api';
import DepInfoList from 'components/Deploy/DepInfoList';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'

class DepList extends Component {
  
  state = {
    
    deps: [ 
        {
        enable_cd:'',
        con_cnt:'',
        containers:[
            {
                con_args:'',
                con_cmd:'',
                con_id:'',
                con_name:'',
                con_port:'',
                con_vol_name:'',
                con_vol_path:'',
                created_at:'',
                dep_id:'',
                id:'',
                last_updated_by:'',
                updated_at:'',
            }
                  ],
        created_at:'',
        group:'',
        id:'',
        last_updated_by:'',
        pod_label:'',
        pod_name:'',
        project:'',
        sc_name:'',
        target_node:'',
        updated_at:'',
        vol_name:'',
        vol_size:''
        }
      ]
  }
  getDeps = async () => {

      let param = {}
      param.sessionId = this.props.sessionId
    try {
      const response = await api.getDeps(param);
      console.log(response)
      this.setState({

          deps: response.data

      })

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
  
  componentDidMount() {
     this.getDeps();
  }
  render() {
    
    
    const {deps} = this.state;
    
    if(this.props.sessionYn === "TRUE"){

    return (
       <div>
          <DepInfoList deps={deps}
                                                                   
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
export default connect(mapStateToProps)(DepList);