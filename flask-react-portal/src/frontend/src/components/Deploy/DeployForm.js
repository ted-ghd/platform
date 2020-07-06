import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input,  Col, Alert, Row   } from 'reactstrap';
import * as api from 'lib/api';
import ConInfo from './ConInfo';
import VolInfo from './VolInfo';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import uuid from 'react-native-uuid'

class DeployForm extends Component {
    id = 1000
  state = {
        enable_cd:'FALSE',
        id: '0',  
        group: '',
        project: 'flask-angular-portal',
        pod_name: 'jupyterhub-flask',
        pod_label: 'jupyterhub-flask',
        vol_name: 'jupyterhub-flask-volume1',
        vol_size: '1G',
        sc_name: 'basic',
        target_node: 'ai002',
        created_at: 'abcd',
        con_cnt: 0,
        vol_cnt: 0,
        volumes: [],
        shm_size:'',
        cons : [],
        tags: [],
        tag: '',
        sub_prj:'',
        tagList:'',
        last_event_ele:'',
        mul_dep:''
      
  }  

  handleChildChange = (id, e) => {
      const {cons } = this.state
      this.setState({
          last_event_ele : e.target.id,
          cons : cons.map(
              con => id === con.id 
              ? { ...con, 
                  [e.target.name] : e.target.value
                  
                  
                  
                }
              : con
          )

      })
  }

  handleVolumeChange = (id, e) => {
      const {volumes } = this.state
      
      if(this.props.volumes.filter(pvc => pvc.name === e.target.value ).length > 0)
      {
        console.log("if")
        let pvc = this.props.volumes.filter(pvc => pvc.name === e.target.value )[0];
        this.setState({

          volumes : volumes.map(
              vol => id === vol.id 
              ? { ...vol, 
                  vol_name : e.target.value,
                  vol_size : pvc.storage
                  //[e.target.name] : e.target.value
                  
                }
              : vol
          ) 
        })

      }
      else{
          console.log("else")
        this.setState({

          volumes : volumes.map(
              vol => id === vol.id 
              ? { ...vol, 
                  [e.target.name] : e.target.value,
                  vol_size : ""
                }
              : vol
          ) 
        })
      }
      

  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })

    if (e.target.name === 'group') {

        this.props.changeGroup(e.target.value)
        //this.getVolumes(e.target.value)

    }

    if(e.target.name === 'project') {
        console.log(this.state.group)
        console.log(e.target.value)
        this.getImages(e.target.value)
    }

    if(e.target.name === 'sub_prj'){
        console.log(this.state)
        const { tags } = this.state

        this.setState({

            tagList :  tags.map( tag => tag.image === e.target.value ?
       
                tag.tags.map( t => <option key={t}>{t}</option>)
                :
                ' '
            )
        })
        
    }
    
    console.log(this.state)
  }

  getImages = async (project) => {
      try {
            let param = { namespace: '', group: '', project: '', sessionId: ''}
            param.namespace = this.state.group;
            param.group = this.state.group;
            param.project = project;
            param.sessionId = this.props.sessionId;
            const response = await api.getImages(param);
            console.log(response)
            this.setState({

                tags: response.data.map(data=>data)

            })

    } catch (e) {
      // 오류가 났을 경우
            console.log(e);
    }
  }
/*
  getVolumes = async (groupName) => {
    try {
      let param = { namespace : '', sessionId: ''}
      param.namespace = groupName;
      param.sessionId = this.props.sessionId;
      const response = await api.getVolumes(param);
      console.log(response)
      this.setState({

          pvcs: response.data.map(data=>data)

      })

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
*/
  componentDidUpdate(prevProps, prevState) {
    // 이 API는 컴포넌트에서 render() 를 호출하고난 다음에 발생하게 됩니다.
    // this.props 와 this.state 가 바뀌어있습니다. 
    // 여기서는, editing 값이 바뀔 때 처리 할 로직이 적혀있습니다.
    // 수정을 눌렀을땐, 기존의 값이 input에 나타나고,
    // 수정을 적용할땐, input 의 값들을 부모한테 전달해줍니다.
    

    console.log(document.getElementById(this.state.last_event_ele))
    console.log(this.state.last_event_ele)
    if(document.getElementById(this.state.last_event_ele) !== null){
        console.log(this.state.last_event_ele)
        document.getElementById(this.state.last_event_ele).focus()
    }
  }
  componentDidMount() {
      //console.log(this.props)
  }
  handleSubmit = (e) => {
    
    e.preventDefault();
    // 상태값을 onCreate 를 통하여 부모에게 전달
    this.insertDeploys(this.state);

    console.log(this.state);
    // 상태 초기화
   /* this.setState({
        id: '',  
        group: '',
        project: '',
        pod_name: '',
        pod_label: '',
        vol_name: '',
        vol_size: '',
        sc_name: '',
        target_node: '',
        created_at: '',
        con_cnt: 0,
        vol_cnt: 0,
        volumes: [],
        cons : [ {
                    con_vols: []
                    }]

    })*/

  }
  
  insertDeploys = async (param ) => {
    try {
      let _param = param;
      //_param.uid = this.props.uid;
      _param.sessionId = this.props.sessionId;
      const response = await api.insertDeploys( _param );
      this.props.history.push('/Deploys')
      alert(response.status+" : UPDATED");
      //console.log(response)
    } catch (e) {
      // 오류가 났을 경우
      //console.log(e);
    }
  }

  removeContainer = () => {
      const {cons, con_cnt } = this.state;
      this.setState({
          cons : cons.filter(con => con.id !== con_cnt-1),
          con_cnt : con_cnt -1
      })
  }
  addContainer = () => {
      const {cons, con_cnt } = this.state;
    this.setState ({
        cons : cons.concat({
                id : con_cnt,
                con_id: con_cnt,
                con_name: 'sshd',
                con_port: '8000',
                con_args: '-D',
                con_cmd: '/usr/sbin/sshd',
                con_vol_name: '',
                con_vol_path:'',
                con_vol_cnt: 0,
                con_gpu: '4',
                con_exp_port: '22',
                con_vols: []

            })
        ,con_cnt : con_cnt+1
    })

    //console.log(this.state)
  }
  
  removeVolume = () => {
      const {volumes, vol_cnt } = this.state;
      this.setState({
          volumes : volumes.filter(vol => vol.id !== vol_cnt-1),
          vol_cnt : vol_cnt -1
      })
  }
  addVolume = () => {
      const {volumes, vol_cnt } = this.state;
    this.setState ({
        volumes : volumes.concat({
                vol_id : vol_cnt,
                id : vol_cnt,
                vol_name: '',
                vol_size: ''
                
            })
        ,vol_cnt : vol_cnt+1
    })

    //console.log(this.state)
  }

  addContainerVolume = (id) => {
      const { cons } = this.state;
      this.setState({
          cons : cons.map(
                con => id === con.id 
                ? 
                 {   ...con,
                     con_vols: con.con_vols.concat({
                         id : con.con_vol_cnt,
                         vol_id : con.con_vol_cnt,
                         con_vol_name: '',
                         con_vol_path: '/DF'
                         }),
                     con_vol_cnt:con.con_vol_cnt+1
                 }
                : con
          )
      })
      //console.log(this.state)
  }
  removeContainerVolume = (id) => {
     /* const {cons, con_cnt } = this.state;
      this.setState({
          cons : cons.filter(con => con.id !== con_cnt-1),
          con_cnt : con_cnt -1
      })*/

      const{ cons} = this.state;

      this.setState({
            cons : cons.map(
                con => id === con.id 
                ? 
                 {   ...con,
                     con_vols: con.con_vols.filter( vol => vol.id !== con.con_vol_cnt-1 ),
                     con_vol_cnt:con.con_vol_cnt-1
                 }
                : con
          )


      })
  }
  handleConVolChange = (conVolId, conId, e) => {
      const { cons } = this.state;

      this.setState({
          last_event_ele: e.target.id,
          cons : cons.map(
                con => conId === con.id 
                ? 
                {
                   ...con,
                   con_vols: con.con_vols.map( vol => vol.id === conVolId
                    ?
                    {
                       ...vol,
                       [e.target.name] : e.target.value
                    }
                   :
                    vol
                   )
                }
                : con
          )
      })
  }

  render() {
    const { enable_cd, target_node, group,project,
    cons,  volumes, tag, sub_prj, tagList, shm_size, mul_dep} = this.state

   const { tags } = this.state;

   const subPrjList = tags.map( tag =>
       <option key={tag.image}>
       
       
       {tag.image}
       
       
         </option>
   ) 

   const  list  = cons.map(

       con => ( <ConInfo key={uuid.v4()} 
                        onChange={this.handleChildChange} 
                        last_event_ele = {this.state.last_event_ele}
                        con={con} 
                        overwrite={this.handleOverwrite}
                        addContainerVolume={this.addContainerVolume}
                        conVolChange = {this.handleConVolChange}
                        removeContainerVolume={this.removeContainerVolume}
                        volumes={this.state.volumes}/>)


    )
    /*const  pvcList  = this.props.volumes.map(

       vol => ( <div key={vol.name} > {vol.name} </div>)


    )*/


    const  volList  = volumes.map(

       vol => ( <VolInfo key={uuid.v4()} 
                        onChange={this.handleVolumeChange}  
                        pvcs={this.props.volumes}
                        vol={vol} />)


    )

    const { groups, projects } = this.props;
        const groupList = groups.map(

                group => ( 
                <option key ={group.group} >{group.group}</option>
                )

            )

        const projectList = 
        
            projects.map(

                project => (
                
                <option key ={project} >{project}</option>
                )
            )
    if(this.props.sessionYn === "TRUE"){
    return (
        
        
      <Form onSubmit={this.handleSubmit}>
        
        <FormGroup row>
                <Label sm={1}>GitLab Group </Label>
                <Col sm={5}>
                
                <Input  
                    type="select"
                    value={group}
                    name="group"
                    onChange={this.handleChange}
                >
                <option></option>
                {groupList}
                </Input>
                    
                </Col>

                <Label sm={1}>GitLab Project </Label>
                <Col sm={5}>
                    
                <Input  
                    type="select"
                    value={project}
                    name="project"
                    onChange={this.handleChange}
                >
                <option></option>
                {projectList}
                </Input>

                </Col>
                </FormGroup>
                
            <FormGroup row>
                <Label sm={1}>SUB PRJ </Label>
                <Col sm={5}>
                
                <Input  
                    type="select"
                    value={sub_prj}
                    name="sub_prj"
                    onChange={this.handleChange}
                >
                <option></option>
                {subPrjList}
                </Input>
                    
                </Col>

                <Label sm={1}>TAG </Label>
                <Col sm={5}>
                
                <Input  
                    type="select"
                    value={tag}
                    name="tag"
                    onChange={this.handleChange}
                >
                <option></option>
                {tagList}
                </Input>
                </Col>

            </FormGroup>    
                
            <FormGroup row>
                <Label sm={1}>SHM SIZE</Label>
                <Col sm={5}>
                
                <Input  
                    value={shm_size}
                    name="shm_size"
                    onChange={this.handleChange}
                />  
                </Col>

                 <Label sm={1}>MUL DEP</Label>
                <Col sm={5}>
                
                <Input  
                    value={mul_dep}
                    name="mul_dep"
                    onChange={this.handleChange}
                />  
                </Col>
               

            </FormGroup>       
            <FormGroup row>
            <Label sm={1}>Target Node</Label>
            <Col sm={5}>
            <Input  
            placeholder="Target Node"
            value={target_node}
            onChange={this.handleChange}
            name="target_node"
            />
            </Col>
            <Label sm={1}>Enable CD</Label>
            <Col sm={5}>
            <Input  
            type="select"
            value={enable_cd}
            name="enable_cd"
            onChange={this.handleChange}
            >kub
            <option>TRUE</option>
            <option>FALSE</option>
            <option></option>
            </Input>
            </Col>
            </FormGroup>    
            <hr />

            <FormGroup row>
            <Col sm={1}/>
            <Col sm={5}>
            < Alert fade={false} color="danger">
                Volumes
            </ Alert >
            </Col>
            <Col align="right">
            <Button size="sm" color="primary" onClick={this.addVolume}>+</Button>&nbsp;
            <Button size="sm" color="primary" onClick={this.removeVolume}>-</Button>
            </Col>
            </FormGroup>
            
            { volList }
            
            <hr />

            <Row>
            <Col sm={1} />
            <Col>
            < Alert fade={false} color="info">
                Containers
            </ Alert >
            </Col>
            <Col align="right">
            <Button size="sm" color="primary" onClick={this.addContainer}>+</Button>&nbsp;
            <Button size="sm" color="primary" onClick={this.removeContainer}>-</Button>
            </Col>
            </Row>
            {this.state.con_cnt > 0 
            ? list
            : <div></div>}
        
        
        
        <div align="right">
            <Button  or="primary" type="submit">등록</Button>
            <br></br>
            <br></br>
        </div>
      </Form>
         
    );
    }
    else{
        return(
            <Redirect to="/" />
        )
    }
  }
}

//export default withRouter(DeployForm);



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
export default connect(mapStateToProps)(DeployForm);