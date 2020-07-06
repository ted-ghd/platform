import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input,  Col   } from 'reactstrap';
import * as api from 'lib/api';
import VolInfo from './VolInfo';
import ConInfo from './ConInfo';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import uuid from 'react-native-uuid'

class ConInfoList extends Component {

    shouldComponentUpdate(nextProps, nextState) {
    
        console.log("should update ConInfoList")
    }
    render () {

    const { containers, editing, volumes,
    removeContainerVolume, conVolChange, addContainerVolume, onChange
     }  = this.props

    const  list  = containers.map(

            con => ( <ConInfo key={uuid.v4()} 
                        onChange={onChange} 
                        con={con} 
                        addContainerVolume={addContainerVolume}
                        conVolChange = {conVolChange}
                        removeContainerVolume={removeContainerVolume}
                        volumes={volumes}
                         readOnly={!editing}/>)

        
        )

    return (
        <div>
        {list}
        </div>
    )
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
export default connect(mapStateToProps)(ConInfoList);
