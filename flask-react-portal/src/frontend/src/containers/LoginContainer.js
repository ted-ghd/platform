import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Home} from 'pages';
import * as loginActions from 'store/modules/login';

class LoginContainer extends Component {
  handleLogin = (param) => {
    this.props.login(param);
  }

  handleLogout = () => {
    this.props.logout();
  }
  
  state = {
        id: '',
        uid: '',
        pwd: '',
        comid : '', 
        comname : '', 
        grade : '', 
        name : '', 
        said : '', 
        saname : '', 
        silid : '', 
        silname : '', 
        teamid : '' , 
        teamname : '',
        sessionId : '',
        sessionYn: 'FALSE'
    }

  
  componentDidMount() {
        
  }

  render() {
    const { handleLogin, handleLogout } = this;
    const { sessionYn ,
            uid,
            comid , 
            comname, 
            grade, 
            name  ,
            said , 
            saname, 
            silid, 
            silname, 
            teamid , 
            teamname ,
            sessionId  } = this.props;

    return (
      <Home 
        onLogin={handleLogin}
        onLogout={handleLogout}
        sessionYn={sessionYn}
        sessionId={sessionId}
        uid= {uid}
        comid = {comid}
        comname = {comname} 
        grade = {grade} 
        name = {name}
        said = {said}
        saname = {saname} 
        silid = {silid}
        silname = {silname} 
        teamid = {teamid} 
        teamname = {teamname}
      />
    );
  }
}

// props 값으로 넣어 줄 상태를 정의해줍니다.
const mapStateToProps = (state) => ( {
    sessionYn: state.login.sessionYn,
    uid: state.login.uid,
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

// props 값으로 넣어 줄 액션 함수들을 정의해줍니다
const mapDispatchToProps = (dispatch) => ({
  login: (param) => dispatch(loginActions.login(param)),
  logout: () => dispatch(loginActions.logout())
})

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);