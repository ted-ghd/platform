import React, {Component} from 'react';
import {  Route, NavLink } from 'react-router-dom';
import { Button, Container, Row, Col } from 'reactstrap'
import { DeployList, IngressList, DepList, ResourceList, VolumeList } from 'pages'; 
import DeployForm from 'components/Deploy/DeployForm';
import DeployEdit from 'components/Deploy/DeployEdit'

import { connect } from 'react-redux';
import * as api from 'lib/api';

class Deploys extends Component { 

    state = {
        projects: [] ,
        groups : []  ,
        volumes : [],
        activeName : 'DepList'
    }
    
    handleChangeGroup = (groupName) => {

      if( this.state.groups.length > 0){
        this.setState({

            projects : this.state.groups.filter(group=> group.group === groupName)[0].projects
        })
      }

      this.getVolumes(groupName)
  }
    componentDidMount() {
      this.getGitLabList()
  }

  getVolumes = async (groupName) => {
    try {
      let param = { namespace : '', sessionId: ''}
      param.namespace = groupName;
      param.sessionId = this.props.sessionId;
      const response = await api.getVolumes(param);
      console.log(response)
      this.setState({

          volumes: response.data.map(data=>data)

      })

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }

    getGitLabList = async () => {

      let sessionId = { sessionId : this.props.sessionId }
      
      try {
      const response = await api.getGitLabList(sessionId);
      
      this.setState({

          groups: response.data,
          projects: response.data[0].projects
          //groups.append()
      })

    } catch (e) {
      // 오류가 났을 경우

      console.log(e);
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
        return (
            <div>
                <Container>
                <Row>
                    <Col sm={2}>
                        
                            <NavLink to={`${this.props.match.url}/deps`}>
                                <Button size="lg" block active={this.state.activeName === "DepList"} 
                                            onClick={this.handleActiveButton}
                                            name = "DepList"
                                            color={this.state.activeName === "DepList" ? "primary" : "secondary"}>
                                        Deployments</Button>
                            </NavLink>
                            <br />
                            <NavLink to={`${this.props.match.url}/form`}>
                                <Button size="lg" block active={this.state.activeName === "NewDeploy"} 
                                            onClick={this.handleActiveButton}
                                            name = "NewDeploy"
                                            color={this.state.activeName === "NewDeploy" ? "primary" : "secondary"}>
                                        New Deploy</Button>
                                     
                            </NavLink>
                            <br />
                            
                            <NavLink to={`${this.props.match.url}/vollist`}>
                                <Button size="lg" block active={this.state.activeName === "VolumeList"} 
                                            onClick={this.handleActiveButton}
                                            name = "VolumeList"
                                            color={this.state.activeName === "VolumeList" ? "primary" : "secondary"}>
                                        Volumes</Button>
                                     
                            </NavLink>
                            <br />
                            
                            <NavLink to={`${this.props.match.url}/deplist`}>
                                <Button size="lg" block active={this.state.activeName === "DeployList"} 
                                            onClick={this.handleActiveButton}
                                            name = "DeployList"
                                            color={this.state.activeName === "DeployList" ? "primary" : "secondary"}>
                                        Pods</Button>
                            </NavLink>
                    
                            <br />
                            <NavLink to={`${this.props.match.url}/inglist`}>
                                <Button size="lg" block active={this.state.activeName === "IngressList"} 
                                            onClick={this.handleActiveButton}
                                            name = "IngressList"
                                            color={this.state.activeName === "IngressList" ? "primary" : "secondary"}>
                                        Ingresses</Button>
                                     
                            </NavLink>
                            <br />
                            <NavLink to={`${this.props.match.url}/reslist`}>
                                <Button size="lg" block active={this.state.activeName === "ResourceList"} 
                                            onClick={this.handleActiveButton}
                                            name = "ResourceList"
                                            color={this.state.activeName === "ResourceList" ? "primary" : "secondary"}>
                                        Resources</Button>
                                     
                            </NavLink>
                            <br />

                            
                            
                    </Col>
                    <Col sm={10}>
                        <Route exact path={this.props.match.url} component={DepList}/>
                        <Route exact path={`${this.props.match.url}/deplist`} 
                            render={(props) => <DeployList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleChangeGroup} />} /> 
                        <Route exact path={`${this.props.match.url}/inglist`} 
                        
                            render={(props) => <IngressList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleSelectGroup} />} /> 
                        
                        <Route exact path={`${this.props.match.url}/vollist`} 
                        
                            render={(props) => <VolumeList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleSelectGroup} />} /> 

                        <Route exact path={`${this.props.match.url}/reslist`} 
                        
                            render={(props) => <ResourceList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleSelectGroup} />} /> 

                        <Route exact path={`${this.props.match.url}/form`} 
                                   
                        render={(props) => <DeployForm {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   volumes={this.state.volumes}
                                                                   changeGroup = {this.handleChangeGroup} />} /> 

                        <Route exact path={`${this.props.match.url}/deps`} component={DepList}/>
                        <Route path={`${this.props.match.url}/detail`}

                        render={(props) => <DeployEdit {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   volumes={this.state.volumes}
                                                                   changeGroup = {this.handleChangeGroup} />} /> 
                        
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
    teamname : state.login.teamname,
    sessionId : state.login.sessionId
});

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps)(Deploys);