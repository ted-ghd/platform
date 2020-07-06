import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input,  Col,  Alert , Badge, Row   } from 'reactstrap';
import * as api from 'lib/api';
import VolInfo from './VolInfo';
import ConInfo from './ConInfo';
import ConInfoList from './ConInfoList';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import uuid from 'react-native-uuid'

class DeployEdit extends Component {
    id = 1000
  state = {
        enable_cd:'',
        con_cnt:0,
        created_at:'',
        volumes: [],
        shm_size: '',
        containers:[
            {
                con_args:'',
                con_cmd:'',
                con_id:0,
                con_name:'',
                con_port:'',
                con_vol_name:'',
                con_vol_path:'',
                created_at:'',
                dep_id:0,
                id:0,
                last_updated_by:'',
                updated_at:'',
            }
                  ],
        group:'',
        id:0,
        last_updated_by:'',
        pod_label:'',
        pod_name:'',
        project:'',
        sc_name:'',
        target_node:'',
        updated_at:'',
        vol_name:'',
        vol_size:'',
        tag: '',
        sub_prj:'',
        tagList:'',
        tags: [],
        last_event_ele : '',
        mul_dep:'',
        editing: false
  }
      
  handleUpdate = () => {

      this.updateDeploy(this.state);
  }  

  removeVolume = () => {
      const {volumes, vol_cnt } = this.state;
      this.setState({
          volumes : volumes.filter(vol => vol.vol_id !== vol_cnt-1),
          vol_cnt : vol_cnt -1
      })
  }

  updateDeploy = async ( param ) => {
    try {
      let _param = param
      //_param.uid = this.props.uid
      _param.sessionId = this.props.sessionId
      const response = await api.updateDeploy( _param );

      this.props.history.push('/Deploys')
       alert(response.status+" : UPDATED");
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }

  /*handleChildChange = (id, e) => {
      console.log(id)
      console.log(e.target.name)
      console.log(e.target.value)
      const {containers } = this.state
      this.setState({

          containers : containers.map(
              con => id === con.id 
              ? { ...con, [e.target.name] : e.target.value}
              : con
          )

      })

  }*/
  handleChildChange = (id, e, con_id) => {
      const {containers } = this.state

      console.log(e.target.id)
      this.setState({
          last_event_ele : e.target.id,
          containers : containers.map(
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

  /*handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })

    if (e.target.name === 'group') {

        this.props.changeGroup(e.target.value)

    }
    
  }*/
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
        this.getImages(this.state.group, e.target.value)
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

    
  }

  handleSubmit = (e) => {
    
    e.preventDefault();
    const { deploy } = this.props.location.state

    console.log(deploy)

    this.submitCd(deploy)
  }
  
  submitCd = async ( param ) => {
    try {
        let _param = param;
        //_param.uid = this.props.uid;
        _param.sessionId = this.props.sessionId;
        const response = await api.submitCd( _param );
        //this.props.history.push('/Builds')
        // Alert fade={false}(response.status+" : "+response.statusText);
        console.log(response)

        if (response.statusText !== "UNKNOWN")
             alert("CD Submit successed");
        else
            if( response.status === 270)
                 alert("Your branch is up-to-date");

    } catch (e) {
    // 오류가 났을 경우
    console.log(e);
    }    
  }
  insertDeploys = async (param ) => {
    try {
      const response = await api.insertDeploys( param );
      //this.props.history.push('/Builds')
      // Alert fade={false}(response.status+" : "+response.statusText);
      console.log(response)
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
  // editing 값을 반전시키는 함수입니다
  // true -> false, false -> true
  handleToggleEdit = () => {
    console.log("toggle")
    this.setState({ 
      
        editing: !this.state.editing
    
    });

  }

  componentDidUpdate(prevProps, prevState) {
    // 이 API는 컴포넌트에서 render() 를 호출하고난 다음에 발생하게 됩니다.
    // this.props 와 this.state 가 바뀌어있습니다. 
    // 여기서는, editing 값이 바뀔 때 처리 할 로직이 적혀있습니다.
    // 수정을 눌렀을땐, 기존의 값이 input에 나타나고,
    // 수정을 적용할땐, input 의 값들을 부모한테 전달해줍니다.
    
    if(!prevState.editing && this.state.editing) {
        console.log("editing changed")
      // editing 값이 false -> true 로 전환 될 때
      // info 의 값을 state 에 넣어준다 
      this.setState({


         ...this.props.location.state.deploy
      })

        console.log("componentDidUpdate get image")
        this.getImages(
            
            this.props.location.state.deploy.group
            ,this.props.location.state.deploy.project)

    }

    if(prevState.tags.length === 0 && this.state.tags.length !== 0) {
        console.log(prevState.tags)
        console.log(this.state.tags)

        const {tags} = this.state
        this.setState({

            tagList :  tags.map( tag => tag.image === this.props.location.state.deploy.sub_prj ?
       
                tag.tags.map( t => <option key={t}>{t}</option>)
                :
                ' '
            )
        })

    }

    console.log(document.getElementById(this.state.last_event_ele))
    console.log(this.state.last_event_ele)
    if(document.getElementById(this.state.last_event_ele) !== null){
        console.log(this.state.last_event_ele)
        document.getElementById(this.state.last_event_ele).focus()
    }
  }

  removeContainer = () => {
      const {containers, con_cnt } = this.state;
      this.setState({
          containers : containers.filter(con => con.con_id !== con_cnt-1),
          con_cnt : con_cnt -1
      })
  }
  addContainer = () => {
      const {containers, con_cnt } = this.state;
    this.setState ({
        containers : containers.concat({
                con_id : con_cnt,
                con_name: 'jupyterhub',
                con_port: '8000',
                con_args: '-f /etc/jupyterhub/jupyterhub_config.py',
                con_cmd: 'jupyterhub',
                con_vol_name: 'jupyterhub-airnd-volume2',
                con_vol_path:'/data',
                con_vol_cnt : 0,                
                con_vols: []
            })
        ,con_cnt : con_cnt+1
    })

    console.log(this.state)
  }
  addVolume = () => {
      const {volumes, vol_cnt } = this.state;
    this.setState ({
        volumes : volumes.concat({
                vol_id : vol_cnt,
                vol_name: '',
                vol_size: ''
                
            })
        ,vol_cnt : vol_cnt+1
    })

    //console.log(this.state)
  }

  addContainerVolume = (id) => {
      const { containers } = this.state;
      this.setState({
          containers : containers.map(
                con => id === con.id 
                ? 
                 {   ...con,
                     con_vols: con.con_vols.concat({
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

      const{ containers} = this.state;

      this.setState({
            containers : containers.map(
                con => id === con.id 
                ? 
                 {   ...con,
                     con_vols: con.con_vols.filter( vol => vol.vol_id !== con.con_vol_cnt-1 ),
                     con_vol_cnt:con.con_vol_cnt-1
                 }
                : con
          )


      })
  }
  getImages = async (group, project) => {

      console.log("getImages : "+ group + " - " + project)
      try {
            let param = { namespace: '', group: '', project: '', sessionId: ''}
            param.namespace = group;
            param.group = group;
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

  insertDeploy = async ( param ) => {
    
    /*try {
      const response = await api.insertExams( param );
      this.props.history.push('/Builds')
       Alert fade={false}(response.status+" : "+response.statusText);
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }*/
  }
  componentDidMount() {
      this.props.changeGroup(this.props.location.state.deploy.group)
  }

  handleConVolChange = (conVolId, conId, e) => {

      e.preventDefault();
      console.log(e.target.id);
      const { containers } = this.state;

      this.setState({
          last_event_ele: e.target.id,
          containers : containers.map(
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
  /*
  shouldComponentUpdate(nextProps, nextState) {

    console.log("should update DeployEdit?")

    // false 에서 true로 넘어가는 경우에는 다시 그린다
    if( nextState.editing && !this.state.editing) {
        return true;
    }

    // True True인 경우도 다시 그린다
    if(nextState.editing && this.state.editing){
        console.log(this.state.containers)
        // 내 자식의 모든 값이 똑같은데 딱 하나만 바뀌었을때는 다시 안그린다
        //for ( i=0;i<this.state.containers in this.state.containers) {

        //}
        
        for (let i = 0; i<this.state.containers.length; i++) {

            let false_count = 0
            
            for( let item in this.state.containers[i] ){
                
                //console.log(item);

                if( this.state.containers[i][item] !== nextState.containers[i][item] )
                    false_count = false_count + 1;
            }

            console.log(false_count)

            if(false_count == 1)
                return false
        }

        return true;
    }

    return false;
  }*/

  render() {

    
    if(this.props.sessionYn === "TRUE"){

    if(!this.state.editing) {
        const { target_node, enable_cd, group,project,con_cnt,containers, volumes,
        sub_prj, tag, shm_size, mul_dep
              } = this.props.location.state.deploy
       
        console.log(volumes)

        /* const subPrjList = tags.map( tag =>
            <option key={tag.image}>
            
            
            {tag.image}
            
            
                </option>
        ) */
        
        const subPrjList = <option key={sub_prj}>{sub_prj}</option>
        const tagList = <option key={tag}>{tag}</option>
        const  list  = containers.map(

            con => ( <div key={uuid.v4()}><ConInfo key={uuid.v4()} 
                        last_event_ele = {this.state.last_event_ele}
                        onChange={this.handleChildChange} 
                        con={con} 
                        addContainerVolume={this.addContainerVolume}
                        conVolChange = {this.handleConVolChange}
                        removeContainerVolume={this.removeContainerVolume}
                        volumes={volumes}
                         readOnly={!this.state.edting}/> 
                        <hr/> 
                        </div>
                         )

        
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
        
        const  volList  = volumes.map(

            vol => ( <VolInfo key={uuid.v4()} 
                                onChange={this.handleVolumeChange}  
                                pvcs={this.props.volumes}
                                vol={vol} 
                                readOnly={!this.state.edting} />)


        )

        return (
            
            
        <Form onSubmit={this.handleSubmit}>
        
        <FormGroup row>
                <Label sm={1}>GitLab Group </Label>
                <Col sm={5}>
                
                <Input readOnly
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
                    
                <Input readOnly
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
                
                <Input readOnly
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
                
                <Input readOnly
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
                
                <Input readOnly
                    value={shm_size}
                    name="shm_size"
                    onChange={this.handleChange}
                />  
                </Col>

               <Label sm={1}>MUL DEP</Label>
                <Col sm={5}>
                
                <Input readOnly
                    value={mul_dep}
                    name="mul_dep"
                    onChange={this.handleChange}
                />  
                </Col>

            </FormGroup>       
            <FormGroup row>
            <Label sm={1}>Target Node</Label>
            <Col sm={5}>
            <Input readOnly
            placeholder="Target Node"
            value={target_node}
            onChange={this.handleChange}
            name="target_node"
            />
            </Col>
            <Label sm={1}>Enable CD</Label>
            <Col sm={5}>
            <Input readOnly
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
            </Row>
            {con_cnt > 0 
            ? list
            : <div></div>}

            <div align="right">
                <Button onClick={this.handleToggleEdit}>수정</Button> &nbsp; 
                <Button  or="primary" type="submit">제출</Button>
                <br></br>
                <br></br>
            </div>
        </Form>
            
        );
    }  
    else {

        const { target_node, enable_cd, group,project,con_cnt,
        containers, volumes, tags, tag, sub_prj, tagList, shm_size, mul_dep
              
        } = this.state

    
       const {groups, projects } = this.props; 

    
    const subPrjList = tags.map( tag =>
        <option key={tag.image}>
        
        
        {tag.image}
        
        
            </option>
    ) 

    const  list  = containers.map(

        con => ( <div key={uuid.v4()}><ConInfo key={uuid.v4()} onChange={this.handleChildChange} 
                    last_event_ele = {this.state.last_event_ele}
                     con={con} 
                     addContainerVolume={this.addContainerVolume}
                     readOnly={!this.state.editing}
                     conVolChange = {this.handleConVolChange}
                     removeContainerVolume={this.removeContainerVolume}
                     volumes={volumes} 
                        />
                        <hr/>
                        </div>)

            
        
        )

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


        const  volList  = volumes.map(

            vol => ( <VolInfo key={uuid.v4()} 
                                onChange={this.handleVolumeChange}  
                                pvcs={this.props.volumes}
                                vol={vol} 
                                readOnly={!this.state.editing} />)


        )

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
            {con_cnt > 0 
            ? list
            : <div></div>}

            

           

            <div align="right">
                <Button onClick={this.handleUpdate}>저장</Button>
                <br></br>
                <br></br>
            </div>
        </Form>
            
        );

    }
    }
    else{
        
        return (
            <Redirect to="/"/>
        );
        
    }
  }
}

//export default withRouter(DeployEdit);



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
export default connect(mapStateToProps)(DeployEdit);