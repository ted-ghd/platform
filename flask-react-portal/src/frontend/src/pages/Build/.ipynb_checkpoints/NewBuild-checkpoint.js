import React, { Component } from 'react';
import BuildForm from 'components/Build/BuildForm';
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import * as api from 'lib/api';

class NewBuild extends Component {
  id = 3;

  state = {
    projects: [] ,
    groups : []  ,
    imagePaths: [],
    imageTags: [],
    build:  
        {   
            enable_cd: '',
            custom: '',
            sort: '',
            cudnn: '',
            script: '',

            id: '',
            created_at: '',
            group: '',
            project: '',
            base: '',
            maintainer: '',
            py_ver  : '', 
            apt_pkgs  : '', 
            pip_pkgs  : '', 
            npm_pkgs : '',
            sshd  : '', 
            utf8  : '', 
            vim  : '', 
            set_ld_path  : '', 
            supd  : '', 
            supd_programs  : '', 
            expose_ports  : '', 
            node_ver  : '', 
            jup_hub  : '', 
            jup_act  : '', 
            cmd  : '', 
            sub_prj: '',
            tag: ''
        }
    
  }
  
  componentDidMount() {
      this.getGitLabList()
      this.getBaseImageList()
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
  handleChangeImagePath = (pathName) => {

      this.setState({

          imageTags : this.state.imagePaths.filter(imagePath=> imagePath.image === pathName)[0].tags
      })
  }
  handleChangeGroup = (groupName) => {

      this.setState({

          projects : this.state.groups.filter(group=> group.group === groupName)[0].projects
      })

      
  }
  handleCreate = (data) => {

    this.setState({
      builds : {...data}
    })
    this.insertBuilds(data);
  }
  
  insertBuilds = async ( param ) => {
    try {
      // const response = await api.insertExams( param );
      
      alert("Success");
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }

    
  render() {
    const { build, groups , projects} = this.state;

    if( this.props.sessionYn === "TRUE"){
    return (
      <div>
        <BuildForm
          sessionId={this.props.sessionId}
          onCreate={this.handleCreate}
          build={build}
          groups={groups}
          projects={projects}
        imagePaths={this.state.imagePaths}
        imageTags={this.state.imageTags}
        changeImagePath={this.handleChangeImagePath}
          changeGroup = {this.handleChangeGroup}
        />
      </div>
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
export default connect(mapStateToProps)(NewBuild);