import React, { Component } from 'react';
import * as api from 'lib/api';
import ImageInfoList from 'components/Build/ImageInfoList';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'

class ImageList extends Component {

  _namespace = ''
  state = {
    
    images: [ 
        {   
            image:'',
            tags:[]
        }
    ]
  }

    handleChangeGroup = (groupName) => {
        
        this.props.changeGroup(groupName)
      
    }
    handleSelectGroup = (param) => {
        console.log(param)
        this._namespace = param;
        this.getIngresses();
    }
    handleChangeProject = (groupName, projectName) => {
        if(projectName !== "") {
            
            console.log(groupName)
            console.log(projectName)
            let param = { group : groupName, project: projectName}
            this.getImages(param)
        }
    }
  getImages = async (param) => {
      try {
            
            param.namespace = this._namespace;
            param.sessionId = this.props.sessionId;
            const response = await api.getImages(param);
            console.log(response)
            this.setState({

                images: response.data.map(data=>data)

            })

    } catch (e) {
      // 오류가 났을 경우
            console.log(e);
    }
  }
  getIngresses = async () => {
    try {
      let param = { namespace : '', uid: ''}
      param.namespace = this._namespace;
      param.sessionId = this.props.sessionId;
      const response = await api.getIngresses(param);
      console.log(response)
      this.setState({

          ingresses: response.data.map(data=>data)

      })

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
  
  componentDidMount() {
     // this.getIngresses();
  }
  render() {
    
    const {images} = this.state;

    if(this.props.sessionYn === "TRUE"){
        
    return (
      <div>
          <ImageInfoList images={images}
                            groups={this.props.groups} 
                            projects={this.props.projects} 
                            changeGroup = {this.handleChangeGroup}
                            changeProject = {this.handleChangeProject}                                       
                                                                   />
      </div>
    );
    }
    else{
        return(
            <Redirect to ='/' />
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
export default connect(mapStateToProps)(ImageList);