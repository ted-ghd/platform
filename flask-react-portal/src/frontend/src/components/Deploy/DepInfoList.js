// src/components/PhoneInfoList.js
import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom'

class DeployInfoList extends Component {
  static defaultProps = {
    deps: []
  }

  render() {
    const { deps } = this.props;

    const list = deps.map(

        deploy => ( <tr key={deploy.id} >
        <td >
        
        <Link to = {{ pathname: '/Deploys/detail', state:{deploy} }}>{deploy.id}</Link>
        </td>
        
        <td >{deploy.group}</td>
        <td >{deploy.project}</td>
        <td >{deploy.pod_name}</td>
        <td >{deploy.last_updated_by}</td>
        </tr>  )

    )
    
    return (
      
        <Table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>group</th>
                    <th>project</th>
                    <th>pod_name</th>
                    <th>last_updated_by</th>
                </tr>
            </thead>
            <tbody>
            {list} 
            </tbody>   
        </Table>
    );
  }
}

export default DeployInfoList;