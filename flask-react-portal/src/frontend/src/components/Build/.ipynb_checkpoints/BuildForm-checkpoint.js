import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink,  Button,   Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import * as api from 'lib/api';

class BuildForm extends Component {

  state = {
        enable_cd: '',
        custom: '',
        id: '0',
        created_at: '2018-08-29T07:11:27.725057+00:00',  
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
        cudnn: '',
        script: '',
        sort: '',
        activeTab: '1',
        image_path: '',
        image_tag: ''
  }  
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      
    })

    if (e.target.name === 'group') {
        
        this.setState({
            base : 'docker.hmc.co.kr'
        })
        this.props.changeGroup(e.target.value)

    }

    if(e.target.name === 'image_path') {
        this.props.changeImagePath(e.target.value)
        this.setState({
            base : 'docker.hmc.co.kr' + '/' +e.target.value
        })
        
    }

    if(e.target.name === 'image_tag'){
        this.setState({
            base : 'docker.hmc.co.kr' +'/' + this.state.image_path+ ':' +e.target.value
        })
    }

  }
  componentDidMount() {
      
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      ...this.state,
      activeTab: '1',
      sort: 'GUI',
      custom: 'FALSE'
    };
  }

  toggle(tab) {
    console.log(this.state)
    if (this.state.activeTab !== tab) {
      this.setState({
        ...this.state,
        activeTab: tab,
        sort:  tab === '1' ? 'GUI' : 'SCRIPT',
        custom: tab === '1' ? 'FALSE' : 'TRUE'
      });
    }
  }

  handleSubmit = (e) => {
    // 페이지 리로딩 방지
    e.preventDefault();
    // 상태값을 onCreate 를 통하여 부모에게 전달

    if( this.state.activeTab === '1'){ // GUI
        
        this.setState({
            ...this.state,
            sort : 'GUI',
            custom: 'FALSE'
        })
    }
    else { // Docker file
        this.setState({
            ...this.state,
            sort : 'SCRIPT',
            custom: 'TRUE',
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
            cudnn: ''
        })
    }

    this.insertBuilds(this.state);

    // 상태 초기화
    this.setState({
        id: '',  
        group: '',
        enable_cd : '',
        custom : '',
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
        cudnn: '',
        script: '',
        sort: '',
        activeTab: '1',
        image_path: '',
        image_tag: ''
    })

    
    
  }
  

  insertBuilds = async ( param ) => {
    try {
      let _param = param
      _param.sessionId = this.props.sessionId
      const response = await api.insertExams( _param );
      this.props.history.push('/Builds')
      alert(response.status+" : "+response.statusText);
    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
 
  render() {
    const {  group, npm_pkgs, project,base,maintainer,py_ver  ,apt_pkgs  ,pip_pkgs  ,sshd  ,utf8  ,
    vim  ,set_ld_path  ,supd  ,supd_programs  ,expose_ports  ,node_ver  ,jup_hub  ,
    jup_act  ,cmd, sub_prj, tag, cudnn,  script, enable_cd , image_path, image_tag//, custom, sort
    } = this.state;

    const { groups, projects, imagePaths, imageTags } = this.props;
//    console.log(groups)
 //   console.log(groups[0].projects)
    const list = groups.map(

        group => ( 
        <option key ={group.group} >{group.group}</option>
        )

    )

    const projectList = projects.map(

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
                        <Input readOnly
                        //placeholder="Base Image"
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
                        //placeholder="Maintainer"
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
                        //placeholder="APT Pakages"
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
                        //placeholder="Pypi Packages"
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
                        //placeholder="NPM Packages"
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
                        {/* <Label sm={1}>sshd</Label>
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
                        </Col>
                        */}
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
                       {/* <FormGroup row>
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
                        placeholder="supd_programs"
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
                        placeholder="jup_act"
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
                        //placeholder="cmd"
                        value={cmd}
                        onChange={this.handleChange}
                        name="cmd"
                        /></Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label sm={1}>Ports</Label>
                        <Col sm={3}><Input
                        //placeholder="expose_ports"
                        value={expose_ports}
                        onChange={this.handleChange}
                        name="expose_ports"
                        /></Col>
                        <Label sm={1}>sub_prj</Label>
                        <Col sm={3}><Input
                        //placeholder="sub_prj"
                        value={sub_prj}
                        onChange={this.handleChange}
                        name="sub_prj"
                        /></Col>
                        <Label sm={1}>Tag</Label>
                        <Col sm={3}><Input
                        //placeholder="tag"
                        value={tag}
                        onChange={this.handleChange}
                        name="tag"
                        /></Col>
                        </FormGroup>
                        <hr />


                        
                        <div align="right">
                            <Button  or="primary" type="submit">등록</Button>
                            <br></br>
                            <br></br>
                        </div>
                    </Form>
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
                        </FormGroup>
                        <hr />
        
                        <FormGroup row>
                        <Label sm={1}>Base Image </Label>
                        <Col sm={11}>
                        <Input readOnly
                        //placeholder=""
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
                        <hr/>

                            
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
                            <Button  or="primary" >등록</Button>
                            <br></br>
                            <br></br>
            </div>

            </Form>
          </TabPane>
        </TabContent>
      </div>




      

      </div>
    );
  }
}


export default withRouter(BuildForm);