// file: src/components/PhoneInfo.js
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';


class BuildInfo extends Component {

  static defaultProps = {
    build: {
      enable_cd:'',
      custom :'',
      id: '',
      group: '',
      project: '', 
      base: '',
      maintainer: '',
      py_ver  : '', 
      apt_pkgs  : '', 
      pip_pkgs  : '', 
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
  
  handleSubmit = (e) => {
    // 페이지 리로딩 방지
    console.log("BuildInfo handleSubmit");
    e.preventDefault();

    // 상태값을 onCreate 를 통하여 부모에게 전달
    this.props.onSubmit(this.props.build);
    
  }

  handleModify = (e) => {
      
    console.log("BuildInfo handleModify");
    // 페이지 리로딩 방지
    e.preventDefault();
    // 상태값을 onCreate 를 통하여 부모에게 전달
    this.props.onModify(this.props.build);
    
  }

  render() {
    const style = {
      border: '1px solid black',
      padding: '8px',
      margin: '8px'
    };

    console.log("BuildInfo render()");
    const { build } = this.props.location.state;
    const {
        id, group, project, base,maintainer,py_ver  , apt_pkgs  , pip_pkgs  , sshd  , utf8  , vim  
        , set_ld_path  , supd  , supd_programs  ,expose_ports  , node_ver  , 
        jup_hub  , jup_act  , cmd  , sub_prj,tag
    } =  this.props.location.state.build
    
    return (
      <div style={style}>
      
        <div>{id}</div>
        <div>{group}</div>
        <div>{project}</div>
        <div><b>{base}</b></div>
        <div>{maintainer}</div>
        <div>{py_ver}</div> 
        <div>{apt_pkgs}</div> 
        <div>{pip_pkgs}</div> 
        <div>{sshd}</div> 
        <div>{utf8}</div> 
        <div>{vim}</div> 
        <div>{set_ld_path}</div> 
        <div>{supd}</div> 
        <div>{supd_programs}</div> 
        <div>{expose_ports}</div> 
        <div>{node_ver}</div> 
        <div>{jup_hub}</div> 
        <div>{jup_act}</div> 
        <div>{cmd}</div> 
        <div>{sub_prj}</div>
        <div>{tag}</div>
        
        <div align="right">
            <Link to={ {pathname:`/Builds/edit/${id}`, state:{build}}}><Button>수정</Button></Link> &nbsp; 
            <Button onClick={this.handleSubmit}>제출</Button>
            
        </div>
      </div>
    );
  }
}

export default BuildInfo;