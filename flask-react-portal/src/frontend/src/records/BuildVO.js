import React from 'react';
import { Record } from 'immutable';

const BuildVO = Record({
    
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
      tag: '',
      created_at: '',
      updated_at: '',
      last_updated_by: ''
});

export default BuildVO