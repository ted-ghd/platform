// src/components/PhoneInfoList.js
import React, { Component } from 'react';
import { Table,  Form, FormGroup, Label, Button, Input,  Col   } from 'reactstrap';
import * as api from 'lib/api';
import { connect } from 'react-redux';


class DeployInfoList extends Component {
  
  static defaultProps = {
    deploys: []
  }
   state = {
      group:'',
      reload:false
  }

  reload = () => {
       
       this.props.changeGroup(this.state.group, true)
  }
  handleChange = (e) => {
        this.setState({
        [e.target.name]: e.target.value
        })

        this.props.changeGroup(e.target.value);
    }
  deletePod = async (e) => {
      
    console.log("deletePod")
    console.log(e.target.name)

    let str = e.target.name
    let str_arr = e.target.name.split("-")
    console.log(str_arr)

    let pod_name = e.target.name
    let replica_name = str.substring(0, str.length-str_arr[str_arr.length-1].length-1)
    let deploy_name = str.substring(0, str.length- (str_arr[str_arr.length-2]+"-"+str_arr[str_arr.length-1]).length-1)

    console.log(pod_name)
    console.log(replica_name)
    console.log(deploy_name)

    let param = {}
     try {
      param.namespace = this.state.group;
      param.sessionId = this.props.sessionId;
      param.pod_name = pod_name;
      param.replica_name = replica_name;
      param.deploy_name = deploy_name;
      const response = await api.deletePod(param);
      console.log(response)
      alert("Deletion Succeded")  
      
      
      
      //this.props.changeGroup(this.state.group);

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }


  render() {
    const { deploys } = this.props;

    const { groups } = this.props;
        const groupList = groups.map(

                group => ( 
                <option key ={group.group} >{group.group}</option>
                )

            )

    const list = deploys.map(

        deploy => ( <tr key={deploy.uid} >
        <td >{deploy.name}</td>
        <td >{deploy.namespace}</td>
        <td >{deploy.image}</td>
        <td> {deploy.host_ip}</td>
        <td> {deploy.sshd_port}</td>
        <td> <Button name={deploy.name} size="sm" onClick={this.deletePod} color="primary">X</Button></td>
        </tr>  )

    )
    
    return (
        <div>
        <Form>
            <FormGroup row>
                <Label sm={1}>GitLab Group </Label>
                <Col sm={5}>
                
                <Input 
                    type="select"
                    value={this.state.group}
                    name="group"
                    onChange={this.handleChange}
                >
                <option></option>
                {groupList}
                </Input>
                    
                </Col>

                <Label sm={1}></Label>
                <Col sm={5}>
                <Button onClick={this.reload}>Reload</Button>    

                </Col>
                </FormGroup><hr />
        </Form>

        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Namespace</th>
                    <th>Phase</th>
                    <th>Host IP</th>
                    <th>SSH PORT</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>

            { this.props.deploys[0]  ? 
                this.props.deploys[0].uid.length > 0 
            ? list : <tr><td></td></tr> : <tr><td></td></tr>} 

            </tbody>   
        </Table>
        </div>
    );
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
export default connect(mapStateToProps)(DeployInfoList);
