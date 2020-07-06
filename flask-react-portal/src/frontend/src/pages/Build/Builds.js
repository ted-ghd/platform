import React, {Component} from 'react';
import {  Route, NavLink } from 'react-router-dom';
import {  ImageList, BuildList, NewBuild } from 'pages'; 
import BuildEdit from 'components/Build/BuildEdit';
import { connect } from 'react-redux';
import { Button, Container, Row, Col } from 'reactstrap'
import * as api from 'lib/api';

class Builds extends Component { 

    static defaultProps = {
        location: {
          state: {
              activeName: 'BuildList'
          }   
        }
    }
    state = {
        projects: [] ,
        groups : []  ,
        activeName : 'BuildList',
        imagePaths: [],
        imageTags: []
    }

    /*constructor(props) {
    super(props);
        this.state = {
            instructors: [],
            instructorID : props.match.params.instructorID
        };
    }*/
    handleActiveButton = (e) => {
        //e.preventDefault();

        const param = e.target.name;
        this.setState({
            activeName :  param 
        });
    }
    
    handleChangeImagePath = (pathName) => {
            if( this.state.imagePaths.length > 0){
                    
      
                this.setState({

                    imageTags : this.state.imagePaths.filter(imagePath=> imagePath.image === pathName)[0].tags
                })
            }
    }

    handleChangeGroup = (groupName) => {
        if( this.state.groups.length > 0){

            this.setState({

                projects : this.state.groups.filter(group=> group.group === groupName)[0].projects
            })
        }

      
  }

    getBaseImageList = async () => {

        try {
        const response = await api.getBaseImageList();

        console.log(response)
        this.setState({

           imagePaths: response.data,
           imageTags: response.data[0].tags
        })

        } catch (e) {
        // 오류가 났을 경우
        console.log(e);
        }
    }
    getGitLabList = async () => {

      let sessionId = { sessionId : this.props.sessionId}
      
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

  componentDidMount() {
      this.getGitLabList()
      this.getBaseImageList()
  }

    render() {

        
        console.log(this.state.activeName)
        return (
            <div>
                <Container>
                <Row>
                    <Col sm={2}>
                        
                            <NavLink to={`${this.props.match.url}/list`}>
                                <Button size="lg" block active={this.state.activeName === "BuildList"} 
                                            onClick={this.handleActiveButton}
                                            name = "BuildList"
                                            color={this.state.activeName === "BuildList" ? "primary" : "secondary"}>
                                        BuildList</Button>
                            </NavLink>
                    
                            <br />
                            <NavLink to={`${this.props.match.url}/form`}>
                                <Button size="lg" block active={this.state.activeName === "NewBuild"} 
                                            onClick={this.handleActiveButton}
                                            name = "NewBuild"
                                            color={this.state.activeName === "NewBuild" ? "primary" : "secondary"}>
                                        New Build</Button>
                                     
                            </NavLink>
                            <br />
                            <NavLink to={`${this.props.match.url}/images`}>
                                <Button size="lg" block active={this.state.activeName === "ImageList"} 
                                            onClick={this.handleActiveButton}
                                            name = "ImageList"
                                            color={this.state.activeName === "ImageList" ? "primary" : "secondary"}>
                                        Image List</Button>
                                     
                            </NavLink>
                    </Col>
                    <Col sm={10}>
                        <Route exact path={this.props.match.url} component={BuildList}/>

                        <Route path={`${this.props.match.url}/list`} 
                        
                                render={(props) => <BuildList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleChangeGroup} 
                                                                   imagePaths={this.state.imagePaths}
                                                                   imageTags={this.state.imageTags}
                                                                    changeImagePath={this.handleChangeImagePath}
                                                                                                                />}
                        />
                        <Route path={`${this.props.match.url}/form`} component={NewBuild}/>
                        <Route path={`${this.props.match.url}/detail`} 
                            
                            render={(props) => <BuildEdit {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleChangeGroup} 
                                                                   imagePaths={this.state.imagePaths}
                                                                   imageTags={this.state.imageTags}
                                                                    changeImagePath={this.handleChangeImagePath}
                                                                                                                />} /> 

                        <Route exact path={`${this.props.match.url}/images`} 
                        
                            render={(props) => <ImageList {...props} groups={this.state.groups} 
                                                                   projects={this.state.projects} 
                                                                   changeGroup = {this.handleChangeGroup}  />} /> 
                            
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
export default connect(mapStateToProps)(Builds);