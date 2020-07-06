import React, { Component } from 'react';
import BuildInfoList from 'components/Build/BuildInfoList';
import * as api from 'lib/api';
import { connect } from 'react-redux';

class BuildList extends Component {
  id = 3;
  state = {
    
    builds: [ 
        {   
            enable_cd: '',
            custom: '',
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
            created_at: '',
            updated_at: '',
            last_updated_by: '',
            sort: '',
            cudnn: '',
            script: '',
            imagePath: '',
            imageTag: ''

        }
    ]
  }
  getBuilds = async (namespace) => {
    try {
      
      let _param = {};
      _param.sessionId = this.props.sessionId
        
      const response = await api.getBuilds(_param);
      this.setState({

          builds: response.data.map(data=>data)

      })

    } catch (e) {
      // 오류가 났을 경우
      console.log(e);
    }
  }
  
  componentDidMount() {
     this.getBuilds();
  }
  render() {
    const { builds } = this.state;
    
    return (
      <div>
        <BuildInfoList builds={builds}
                        groups={this.props.groups} 
                        projects={this.props.projects} 
                        changeGroup = {this.props.changeGroup} />
      </div>
    );
  }
}

// props 값으로 넣어 줄 상태를 정의해줍니다.
const mapStateToProps = (state) => ( {
    sessionYn: state.login.sessionYn,
    sessionId : state.login.sessionId
});

export default connect(mapStateToProps)(BuildList);