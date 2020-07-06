import React, { Component } from 'react';
import * as api from 'lib/api';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
        

class BuildInfoList extends Component {
  static defaultProps = {
    builds: []
  }
  
  state = {
      groups: [],
      projects: []
  }
  handleSubmit = (data) => {
    
    console.log("BuildInfoList handleSubmit");
    console.log(data)

    this.submitCi(data);
  }


  handleModify = (data) => {
    
    console.log("BuildInfoList handleModify");
    console.log(data)

  }

  submitCi = async ( param ) => {
    try {
      const response = await api.submitCi( param );
      /*this.setState({

          builds: response.data.map(data=>data)

      })*/

      console.log(response);

      if (response.statusText !== "UNKNOWN")
        alert(response.statusText);
      else
        if( response.status === 270)
            alert("Your branch is up-to-date");

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
      alert(e);
    }
  }

  
  /*getGitLabList = async () => {

      let uid = { uid : this.props.uid}
      console.log(uid)
      try {
      const response = await api.getGitLabList(uid);
      const { groups } = this.state

      this.setState({

          groups: response.data,
          projects: response.data[0].projects
          //groups.append()
      })

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }

  }*/
  
  /*handleChangeGroup = (groupName) => {

      console.log("BuildInfoList ChangeGroup")
      this.setState({

          projects : this.state.groups.filter(group=> group.group == groupName)[0].projects
      })

      
  }*/

    /*groups={this.props.groups} 
                        projects={this.props.projects} 
                        changeGroup = {this.props.changeGroup} />
*/
  
  componentDidMount() {
     // this.getGitLabList()
  }

  render() {
    //const { handleChangeGroup } = this;
    const { builds } = this.props;
   // const { groups, projects } = this.props
    /*const  list  = builds.map(
        build => ( <BuildInfo key={build.id} build={build} onSubmit={this.handleSubmit}
                                                            onModify={this.handleModify}/>) 
    );*/
    // props.location.state
    const list = builds.map(

        build => ( <tr key ={build.id} >
        <td ><Link to = {{ pathname: '/Builds/detail' , state:{build} }}>{build.id}</Link></td>
        <td >{build.group}</td>
        <td >{build.project}</td>
        <td >{build.sub_prj}</td>
        <td >{build.tag}</td>

        <td >{build.last_updated_by}</td>
        </tr>  )

    )
    

    const {sessionYn} = this.props;
    return (
        
        <div>
        {
            sessionYn === "TRUE" 
        
        ? <Table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>group</th>
                    <th>project</th>
                    <th>sub_prj</th>
                    <th>tag</th>
                    <th>last_updated_by</th>
                </tr>
            </thead>
            <tbody>
            {list} 
            </tbody>   
        </Table>

        :
         
             <Redirect to ="/" />
        }
        </div>
    );
  }
}


// props 값으로 넣어 줄 상태를 정의해줍니다.
const mapStateToProps = (state) => ( {
    sessionYn: state.login.sessionYn,
    uid: state.login.uid
});

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps)(BuildInfoList);