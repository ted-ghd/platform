// file: src/components/PhoneInfo.js
import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink,  Button,   Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import * as api from 'lib/api';
import { Redirect } from 'react-router'
import { connect } from 'react-redux';

class BuildEdit extends Component {

  state = {
      
      activeTab: '1',
      build : {
          enable_cd: '',
          custom: '',
          sort: '',
          cudnn: '',
          script: '',
          id: '',
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
            tag: '',
            image_path: '',
            image_tag: ''
            
       },
      editing: false
  }
  static defaultProps = {
    build: {
        enable_cd:'',
     custom:'',
        sort: '',
          cudnn: '',
          script: '',
      id: '',
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
    tag: '',
    image_path: '',
    image_tag: ''
    }
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    /*this.state = {
      ...this.state,
      build : {...this.state.build
      
                },
      activeTab: this.props.build.sort === 'GUI' ? '1' : '2',
    };*/
  }

  toggle(tab) {

      console.log(this.state)
    if (this.state.activeTab !== tab) {
      this.setState({
        ...this.state,
        build : {...this.state.build,
        
            sort:  tab === '1' ? 'GUI' : 'SCRIPT',
        custom: tab === '1' ? 'FALSE' : 'TRUE'
        },
        activeTab: tab,
        
      });
    }

   /* if (this.state.activeTab !== tab) {
      this.setState({
        ...this.state,
        activeTab: tab,
        sort:  tab === '1' ? 'GUI' : 'SCRIPT',
        custom: tab === '1' ? 'FALSE' : 'TRUE'
      });
    }*/
  }

  handleUpdate = () => {

      this.updateBuild(this.state.build);
  }  
  
  updateBuild = async ( param ) => {
    try {
      
      param.custom  = param.sort === "GUI" ? "FALSE" : "TRUE"
      let _param = param
      _param.sessionId = this.props.sessionId
      const response = await api.updateBuild( _param );
      console.log(response)
      this.props.history.push('/Builds')
      //alert(response.status+" : "+response.statusText);
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
  
  handleChange = (e) => {
    
    const { build } = this.state;

    this.setState({
        build: {
            ...build,
            [e.target.name] : e.target.value,
            base : 'docker.hmc.co.kr'
        }
    })

    if(e.target.name === "image_path"){
        this.props.changeImagePath(e.target.value)
        this.setState({
            build: {
                ...build,
                [e.target.name] : e.target.value,
                base : 'docker.hmc.co.kr' + '/' +e.target.value

            }
        })
    }

    if(e.target.name === "image_tag"){
        
        this.setState({
            build: {
                ...build,
                [e.target.name] : e.target.value,
                 base : 'docker.hmc.co.kr/' + this.state.build.image_path + ':' +e.target.value
            }
        })
    }

    if (e.target.name === 'group') {

        this.props.changeGroup(e.target.value)

        this.setState({
            build: {
                ...build,
                [e.target.name] : e.target.value,
                base : 'docker.hmc.co.kr'
            }
        })
    }
      
  }

  componentDidMount() {
      this.props.changeGroup(this.props.location.state.build.group)
      this.props.changeImagePath(this.props.location.state.build.image_path)
      
    // getter
    console.log("get session id at BuildEdid.js")
    console.log(sessionStorage.getItem('mySessionId'));
  }
  // editing 값을 반전시키는 함수입니다
  // true -> false, false -> true
  handleToggleEdit = () => {
    const { editing } = this.state;
    this.setState({ editing: !editing });
  }

  componentDidUpdate(prevProps, prevState) {
    // 여기서는, editing 값이 바뀔 때 처리 할 로직이 적혀있습니다.
    // 수정을 눌렀을땐, 기존의 값이 input에 나타나고,
    // 수정을 적용할땐, input 의 값들을 부모한테 전달해줍니다.

    if(!prevState.editing && this.state.editing) {
      // editing 값이 false -> true 로 전환 될 때
      // info 의 값을 state 에 넣어준다 
      this.setState({
        build : {...this.props.location.state.build},
        activeTab :  this.props.location.state.build.sort === 'GUI' ? '1' : '2'
      })
    }

    /*if (prevState.editing && !this.state.editing) {
      // editing 값이 true -> false 로 전환 될 때
      onUpdate(info.id, {
        name: this.state.name,
        phone: this.state.phone
      });
    }*/
  }

  handleSubmit = (e) => {
    // 페이지 리로딩 방지
    console.log("BuildInfo handleSubmit");
    e.preventDefault();
    
    // 상태값을 onCreate 를 통하여 부모에게 전달
    this.submitCi(this.props.location.state.build);
    
  }

  submitCi = async ( param ) => {
    try {
      let _param = param;
      _param.sessionId = this.props.sessionId;
      const response = await api.submitCi( param );
      /*this.setState({

          builds: response.data.map(data=>data)

      })*/
      this.props.history.push({
          
          pathname: '/Builds',
          state: { activeName: "BuildList"}
          })
      console.log(response);

      if (response.statusText !== "UNKNOWN")
        alert("CI Submit successed");
      else
        if( response.status === 270)
            alert("Your branch is up-to-date");

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
      alert(e);
    }
  }
  render() {

    
    
    if (this.props.sessionYn === "TRUE") {
        const { build } = this.props.location.state;
        const { groups, projects, imagePaths, imageTags } = this.props;
//        const { groups, projects, changeGroup  } = this.props.route;
    if (!this.state.editing) {

        const {
         group, npm_pkgs, project, maintainer,py_ver  , apt_pkgs  , pip_pkgs  , sshd  , utf8  , vim  
        , set_ld_path  , supd  , supd_programs  ,expose_ports  , node_ver  , 
        jup_hub  , jup_act  , cmd  , sub_prj,tag, cudnn, sort, script, enable_cd,
        image_path, image_tag , base//, custom, base
        } =  build

        const list = groups.map(

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

         const imagePathList = imagePaths.map(

            imagePath => ( 
            <option key ={imagePath.image} >{imagePath.image}</option>
            )
        )

        const imageTagList = imageTags.map(

            imageTag => (
            
            <option key ={imageTag} >{imageTag}</option>
            )
        )
        return (
            
            <div>
            <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: sort === 'GUI' })}
              onClick={() => { this.toggle('1'); }}
            >
              GUI 편집
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: sort === 'SCRIPT' })}
              onClick={() => { this.toggle('2'); }}
            >
              Dockerfile 작성
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={ sort === 'GUI' ? '1' : '2' }>
          <TabPane tabId="1">
          <br></br>
          <hr />
            <Row>
              <Col sm="12">
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
                {list}
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
                {projectList}
                </Input>

                </Col>
                </FormGroup><hr />
        
               <FormGroup row>
                <Label sm={1}>Base Image </Label>
                <Col sm={11}>
                <Input readOnly
                value={base}
                onChange={this.handleChange}
                name="base"
                />
                </Col>
                </FormGroup>
                
                <FormGroup row>
                <Label sm={1}>Base Path </Label>
                <Col sm={5}>
               
                <Input readOnly
                type="select"
                name="image_path"
                value={image_path}
                onChange={this.handleChange}
                >
                <option></option>
                {imagePathList}
                </Input>

                </Col>

                <Label sm={1}>Base Tag </Label>
                <Col sm={5}>
                <Input readOnly
                type="select"
                name="image_tag"
                value={image_tag}
                onChange={this.handleChange}
                >
                <option></option>
                {imageTagList}
                </Input>

                </Col>
                </FormGroup><hr />
                
                <FormGroup row>
                <Label sm={2}>작성자</Label>
                <Col sm={10}><Input readOnly
                value={maintainer}
                onChange={this.handleChange}
                name="maintainer"
                />
                </Col>
                </FormGroup>

                
                <FormGroup row>
                <Label sm={2}>APT Pakages</Label>
                <Col sm={10}>
                <Input readOnly
                type="textarea"
                value={apt_pkgs}
                onChange={this.handleChange}
                name="apt_pkgs"
                />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={2}>Pypi Packages</Label>
                <Col sm={10}>
                <Input readOnly
                type="textarea"
                value={pip_pkgs}
                onChange={this.handleChange}
                name="pip_pkgs"
                />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={2}>NPM Packages</Label>
                <Col sm={10}>
                <Input readOnly
                type="textarea"
                value={npm_pkgs}
                onChange={this.handleChange}
                name="npm_pkgs"
                />
                </Col>
                </FormGroup>
                <hr />
                <FormGroup row>
                <Label sm={1}>Python</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={py_ver}
                name="py_ver"
                onChange={this.handleChange}
                >
                <option></option>
                <option>3.5.2</option>
                <option>3.5.5</option>
                <option>3.5.6</option>
                <option>3.6.0</option>
                <option>3.6.4</option>
                <option>3.6.5</option>
                <option>3.6.6</option>
                <option>3.7.0</option>
                </Input>
                </Col>
                {/*<Label sm={1}>sshd</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={sshd}
                name="sshd"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>*/}
                <Label sm={1}>utf8</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={utf8}
                name="utf8"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>vim</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={vim}
                name="vim"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={1}>ld path</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={set_ld_path}
                name="set_ld_path"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>node_ver</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={node_ver}
                name="node_ver"
                onChange={this.handleChange}
                >
                <option></option>
                <option>6</option>
                <option>8</option>
                </Input>
                </Col>
                
                <Label sm={1}>cudnn</Label>
                        <Col sm={2}>
                        <Input readOnly
                        type="select"
                        value={cudnn}
                        name="cudnn"
                        onChange={this.handleChange}
                        >
                        <option></option>
                        <option>7</option>
                        </Input>
                        </Col>

                <Label sm={1}>enable cd</Label>
                        <Col sm={2}>
                        <Input readOnly
                        type="select"
                        value={enable_cd}
                        name="enable_cd"
                        onChange={this.handleChange}
                        >
                        
                        <option></option>
                        <option>TRUE</option>
                        <option>FALSE</option>
                        </Input>
                        </Col>

                </FormGroup><hr />
               {/* <FormGroup row>
                <Label sm={1}>supd</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={supd}
                name="supd"
                onChange={this.handleChange}
                >
                
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>supd programs</Label>
                <Col sm={8}><Input readOnly
                type="textarea"
                value={supd_programs}
                onChange={this.handleChange}
                name="supd_programs"
                /></Col>
                </FormGroup>
                */}
                <FormGroup row>
                <Label sm={1}>jup_hub</Label>
                <Col sm={2}>
                <Input readOnly
                type="select"
                value={jup_hub}
                name="jup_hub"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>jup_act</Label>
                <Col sm={8}><Input readOnly
                type="textarea"
                value={jup_act}
                onChange={this.handleChange}
                name="jup_act"
                /></Col>
                </FormGroup>
                <hr />
                <FormGroup row>
                <Label sm={1}>cmd</Label>
                <Col sm={10}><Input readOnly
                type="textarea"
                value={cmd}
                onChange={this.handleChange}
                name="cmd"
                /></Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={1}>Ports</Label>
                <Col sm={3}><Input readOnly
                value={expose_ports}
                onChange={this.handleChange}
                name="expose_ports"
                /></Col>
                <Label sm={1}>sub_prj</Label>
                <Col sm={3}><Input readOnly
                value={sub_prj}
                onChange={this.handleChange}
                name="sub_prj"
                /></Col>
                <Label sm={1}>Tag</Label>
                <Col sm={3}><Input readOnly
                value={tag}
                onChange={this.handleChange}
                name="tag"
                /></Col>
                </FormGroup>
            <hr />
        </Form>
         
            <div align="right">
                <Button onClick={this.handleToggleEdit}>수정</Button> &nbsp; 
                <Button onClick={this.handleSubmit}>제출</Button>
                <br></br>
                    <br></br>
            </div>
        </Col>
            </Row>
          </TabPane> 
          <TabPane tabId="2">
          <br></br>
          <hr />

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
                        {list}
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
                        </FormGroup><hr />

        
                        <FormGroup row>
                        <Label sm={1}>Base Image </Label>
                        <Col sm={11}>
                        <Input readOnly
                        value={base}
                        onChange={this.handleChange}
                        name="base"
                        />
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label sm={1}>Base Path </Label>
                        <Col sm={5}>

                        <Input readOnly 
                        type="select"
                        name="image_path"
                        value={image_path}
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {imagePathList}
                        </Input>

                        </Col>

                        <Label sm={1}>Base Tag </Label>
                        <Col sm={5}>
                        <Input readOnly 
                        type="select"
                        name="image_tag"
                        value={image_tag}
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {imageTagList}
                        </Input>

                        </Col>
                        </FormGroup>
                        <hr />      

                        <FormGroup row>
                        <Label sm={2}>작성자</Label>
                        <Col sm={10}><Input readOnly
                        value={maintainer}
                        onChange={this.handleChange}
                        name="maintainer"
                        />
                        </Col>
                        </FormGroup>
                        
                        
                        <FormGroup row>
                            <Label sm={2}>sub_prj</Label>
                            <Col sm={4}><Input readOnly
                            //placeholder="sub_prj"
                            value={sub_prj}
                            onChange={this.handleChange}
                            name="sub_prj"
                            /></Col>
                            <Label sm={2}>Tag</Label>
                            <Col sm={4}><Input readOnly
                            //placeholder="tag"
                            value={tag}
                            onChange={this.handleChange}
                            name="tag"
                            /></Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label sm={2}>Dockerfile</Label>
                            <Col sm={10}><Input readOnly
                            type="textarea"
                            rows="30"
                            //placeholder="docker file description"
                            name="script"
                            value={script}
                            onChange={this.handleChange}
                            /></Col>
                        </FormGroup>

            
            <hr />
            <div align="right">
                <Button onClick={this.handleToggleEdit}>수정</Button> &nbsp; 
                <Button onClick={this.handleSubmit}>제출</Button>
                <br></br>
                    <br></br>
            </div>

            </Form>
          </TabPane>  
        </TabContent>
            </div>
        );
    }
    else {

        const {
         group, npm_pkgs, project, base,maintainer,py_ver  , apt_pkgs  , pip_pkgs  , sshd  , utf8  , vim  
        , set_ld_path  , supd  , supd_programs  ,expose_ports  , node_ver  , 
        jup_hub  , jup_act  , cmd  , sub_prj,tag, cudnn,  script, enable_cd, image_tag, image_path //, custom, sort
        } =  this.state.build

        const list = groups.map(

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

         const imagePathList = imagePaths.map(

            imagePath => ( 
            <option key ={imagePath.image} >{imagePath.image}</option>
            )
        )

        const imageTagList = imageTags.map(

            imageTag => (
            
            <option key ={imageTag} >{imageTag}</option>
            )
        )

        return (
            <div>
                <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              GUI 편집
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Dockerfile 작성
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
          <br></br>
          <hr />
            <Row>
              <Col sm="12">
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
                {list}
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
                {projectList}
                </Input>

                </Col>
                </FormGroup><hr />

                <FormGroup row>
                <Label sm={1}>Base Image </Label>
                <Col sm={11}>
                <Input  readOnly
                value={base}
                onChange={this.handleChange}
                name="base"
                />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label sm={1}>Base Path </Label>
                <Col sm={5}>

                <Input 
                type="select"
                name="image_path"
                value={image_path}
                onChange={this.handleChange}
                >
                <option></option>
                {imagePathList}
                </Input>

                </Col>

                <Label sm={1}>Base Tag </Label>
                <Col sm={5}>
                <Input 
                type="select"
                name="image_tag"
                value={image_tag}
                onChange={this.handleChange}
                >
                <option></option>
                {imageTagList}
                </Input>

                </Col>
                </FormGroup><hr />
                
                <FormGroup row>
                <Label sm={2}>작성자</Label>
                <Col sm={10}><Input 
                value={maintainer}
                onChange={this.handleChange}
                name="maintainer"
                />
                </Col>
                </FormGroup>

                
                <FormGroup row>
                <Label sm={2}>APT Pakages</Label>
                <Col sm={10}>
                <Input 
                type="textarea"
                value={apt_pkgs}
                onChange={this.handleChange}
                name="apt_pkgs"
                />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={2}>Pypi Packages</Label>
                <Col sm={10}>
                <Input 
                type="textarea"
                value={pip_pkgs}
                onChange={this.handleChange}
                name="pip_pkgs"
                />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={2}>NPM Packages</Label>
                <Col sm={10}>
                <Input 
                type="textarea"
                value={npm_pkgs}
                onChange={this.handleChange}
                name="npm_pkgs"
                />
                </Col>
                </FormGroup>
                <hr />
                <FormGroup row>
                <Label sm={1}>Python</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={py_ver}
                name="py_ver"
                onChange={this.handleChange}
                >
                <option></option>
                <option>3.5.2</option>
                <option>3.5.5</option>
                <option>3.5.6</option>
                <option>3.6.0</option>
                <option>3.6.4</option>
                <option>3.6.5</option>
                <option>3.6.6</option>
                <option>3.7.0</option>
                </Input>
                </Col>
                {/*<Label sm={1}>sshd</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={sshd}
                name="sshd"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>*/}
                <Label sm={1}>utf8</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={utf8}
                name="utf8"
                onChange={this.handleChange}
                >
                <option></option>                
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>vim</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={vim}
                name="vim"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={1}>ld path</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={set_ld_path}
                name="set_ld_path"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>node_ver</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={node_ver}
                name="node_ver"
                onChange={this.handleChange}
                >
                <option></option>                
                <option>6</option>
                <option>8</option>
                </Input>
                </Col>

                <Label sm={1}>cudnn</Label>
                        <Col sm={2}>
                        <Input
                        type="select"
                        value={cudnn}
                        name="cudnn"
                        onChange={this.handleChange}
                        >
                        
                        <option></option>
                        <option>7</option>
                        </Input>
                        </Col>

                <Label sm={1}>enable cd</Label>
                        <Col sm={2}>
                        <Input
                        type="select"
                        value={enable_cd}
                        name="enable_cd"
                        onChange={this.handleChange}
                        >
                        
                        <option></option>
                        <option>TRUE</option>
                        <option>FALSE</option>
                        </Input>
                        </Col>
                </FormGroup><hr />
                {/*
                <FormGroup row>
                <Label sm={1}>supd</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={supd}
                name="supd"
                onChange={this.handleChange}
                >
                <option></option>
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>supd programs</Label>
                <Col sm={8}><Input 
                type="textarea"
                value={supd_programs}
                onChange={this.handleChange}
                name="supd_programs"
                /></Col>
                </FormGroup>
                */}
                <FormGroup row>
                <Label sm={1}>jup_hub</Label>
                <Col sm={2}>
                <Input 
                type="select"
                value={jup_hub}
                name="jup_hub"
                onChange={this.handleChange}
                >
                <option></option>
                
                <option>TRUE</option>
                <option>FALSE</option>
                </Input>
                </Col>
                <Label sm={1}>jup_act</Label>
                <Col sm={8}><Input 
                type="textarea"
                value={jup_act}
                onChange={this.handleChange}
                name="jup_act"
                /></Col>
                </FormGroup>
                <hr />
                <FormGroup row>
                <Label sm={1}>cmd</Label>
                <Col sm={11}><Input 
                type="textarea"
                value={cmd}
                onChange={this.handleChange}
                name="cmd"
                /></Col>
                </FormGroup>
                <FormGroup row>
                <Label sm={1}>Ports</Label>
                <Col sm={3}><Input 
                value={expose_ports}
                onChange={this.handleChange}
                name="expose_ports"
                /></Col>
                <Label sm={1}>sub_prj</Label>
                <Col sm={3}><Input 
                value={sub_prj}
                onChange={this.handleChange}
                name="sub_prj"
                /></Col>
                <Label sm={1}>Tag</Label>
                <Col sm={3}><Input 
                value={tag}
                onChange={this.handleChange}
                name="tag"
                /></Col>
                </FormGroup>
            <hr />
        </Form>
         
            <div align="right">
                    <Button onClick={this.handleUpdate}>저장</Button>
                    <br></br>
                    <br></br>
                </div>
        </Col>
            </Row>
          </TabPane> 
          <TabPane tabId="2">
          <br></br>
          <hr />

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
                        {list}
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
                        </FormGroup><hr />
        
                        <FormGroup row>
                        <Label sm={1}>Base Image </Label>
                        <Col sm={11}>
                        <Input  readOnly
                        value={base}
                        onChange={this.handleChange}
                        name="base"
                        />
                        </Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label sm={1}>Base Path </Label>
                        <Col sm={5}>

                        <Input 
                        type="select"
                        name="image_path"
                        value={image_path}
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {imagePathList}
                        </Input>

                        </Col>

                        <Label sm={1}>Base Tag </Label>
                        <Col sm={5}>
                        <Input 
                        type="select"
                        name="image_tag"
                        value={image_tag}
                        onChange={this.handleChange}
                        >
                        <option></option>
                        {imageTagList}
                        </Input>

                        </Col>
                        </FormGroup>
                        <hr />      

                        <FormGroup row>
                        <Label sm={2}>작성자</Label>
                        <Col sm={10}><Input 
                        value={maintainer}
                        onChange={this.handleChange}
                        name="maintainer"
                        />
                        </Col>
                        </FormGroup>
                
                        
                        <FormGroup row>
                            <Label sm={2}>sub_prj</Label>
                            <Col sm={4}><Input 
                            //placeholder="sub_prj"
                            value={sub_prj}
                            onChange={this.handleChange}
                            name="sub_prj"
                            /></Col>
                            <Label sm={2}>Tag</Label>
                            <Col sm={4}><Input 
                            //placeholder="tag"
                            value={tag}
                            onChange={this.handleChange}
                            name="tag"
                            /></Col>
                        </FormGroup>

                        <FormGroup row>
                        <Label sm={2}>Dockerfile</Label>
                            <Col sm={10}><Input 
                            type="textarea"
                            rows="30"
                            //placeholder="docker file description"
                            name="script"
                            value={script}
                            onChange={this.handleChange}
                            /></Col>
                        </FormGroup>

            
            <hr />
            <div align="right">
                    <Button onClick={this.handleUpdate}>저장</Button>
                    <br></br>
                    <br></br>
                </div>

            </Form>
          </TabPane>  
        </TabContent>
                
            </div>




            

        );


    }
    }
    else {
        
         return (
             <Redirect to ="/" /> )
    } 
  }
}


// props 값으로 넣어 줄 상태를 정의해줍니다.
const mapStateToProps = (state) => ( {
    sessionYn: state.login.sessionYn,
    sessionId : state.login.sessionId
});

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default connect(mapStateToProps)(BuildEdit);