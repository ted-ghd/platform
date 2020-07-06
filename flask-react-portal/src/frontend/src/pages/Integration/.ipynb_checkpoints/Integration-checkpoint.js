import React, {Component} from 'react';
import {  Route, NavLink } from 'react-router-dom';
import {  IntegInfo,  GitInfo } from 'pages'; 
import { Button, Container, Row, Col } from 'reactstrap'
import { connect } from 'react-redux';

import { Redirect } from 'react-router'
class Integration extends Component { 

    static defaultProps = {
        location: {
          state: {
              activeName: 'IntegInfo'
          }   
        }
    }
    state = {
        activeName : 'IntegInfo',
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
    

    handleActiveButton = (e) => {
        //e.preventDefault();

        const param = e.target.name;
        this.setState({
            activeName :  param 
        });
    }

  

    render() {

        
        console.log(this.state.activeName)
        return (
            <div>
                <Container>
                <Row>
                    <Col sm={2}>
                        
                            <NavLink to={`${this.props.match.url}/list`}>
                                <Button size="lg" block active={this.state.activeName === "IntegInfo"} 
                                            onClick={this.handleActiveButton}
                                            name = "IntegInfo"
                                            color={this.state.activeName === "IntegInfo" ? "primary" : "secondary"}>
                                        Rancher</Button>
                            </NavLink>
                    
                            <br />

                            <NavLink to={`${this.props.match.url}/git`}>
                                <Button size="lg" block active={this.state.activeName === "GitInfo"} 
                                            onClick={this.handleActiveButton}
                                            name = "GitInfo"
                                            color={this.state.activeName === "GitInfo" ? "primary" : "secondary"}>
                                        GitLab</Button>
                            </NavLink>
                            
                    </Col>
                    <Col sm={10}>
                        <Route exact path={this.props.match.url} 
                                render={(props) => <IntegInfo {...props} /> } />


                    {/*
                    
                    render={(props) => <DeployList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleChangeGroup} />} /> 

                    
                    */}
                        <Route path={`${this.props.match.url}/list`} 
                            render={(props) => <IntegInfo {...props} /> } />
                        <Route path={`${this.props.match.url}/git`} 
                            render={(props) => <GitInfo {...props} /> } />
                    </Col>
            </Row>
            </Container>
            
            </div>
        );
    }
};

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
    teamname : state.login.teamname
});

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps)(Integration);