import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Button} from 'reactstrap';
import * as loginActions from 'store/modules/login';
import { connect } from 'react-redux';

class Menu extends Component {
    
    state = {
        activeName : 'home'        

    }
    
    handleActiveButton = (e) => {
        //e.preventDefault();

        const activeName = e.target.name;
        this.setState({ activeName });
    }
    
    render() {
        return (
            <div>
                <Container>
                
                {
                this.props.sessionYn === "TRUE"
                 
                ?<div><NavLink to="/" ><Button name="home"  size="lg"
                                    active={this.state.activeName === "home"} 
                                    onClick={this.handleActiveButton}
                                    color={this.state.activeName === "home" ? "primary" : "secondary"}>
                                    Home
                                </Button>
                </NavLink>
                &nbsp;
                
                <NavLink to="/Builds"><Button name="Builds"   size="lg"
                                        active={this.state.activeName === "Builds"} 
                                        onClick={this.handleActiveButton} 
                                        color={this.state.activeName === "Builds" ? "primary" : "secondary"}>
                                        Build
                                     </Button>
                </NavLink>
               
               &nbsp;

                <NavLink to="/Deploys"><Button name="Deploys"   size="lg"
                                        active={this.state.activeName === "Deploys"} 
                                        onClick={this.handleActiveButton} 
                                        color={this.state.activeName === "Deploys" ? "primary" : "secondary"}>
                                        Deploy
                                     </Button>
                </NavLink>
                
                &nbsp;
                
                <NavLink to="/Integration"><Button name="Integration"   size="lg"
                                        active={this.state.activeName === "Integration"} 
                                        onClick={this.handleActiveButton} 
                                        color={this.state.activeName === "Integration" ? "primary" : "secondary"}>
                                        Integration
                                     </Button>
                </NavLink>

                <div align="right">
                        {this.props.name}님, 환영합니다. &nbsp; &nbsp;
                        <Button size="sm" onClick={ this.props.logout}>로그아웃</Button>
                        
                        <br></br>
                </div>

                <hr/></div>
                : <div></div>
                }
                </Container>
            </div>
        );
    }
}


// props 값으로 넣어 줄 액션 함수들을 정의해줍니다
const mapDispatchToProps = (dispatch) => ({
  login: (param) => dispatch(loginActions.login(param)),
  logout: () => dispatch(loginActions.logout())
})

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
    teamname : state.login.teamname
});

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps, mapDispatchToProps)(Menu);