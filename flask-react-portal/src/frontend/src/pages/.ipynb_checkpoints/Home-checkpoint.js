import React, { Component } from 'react';
import { Table, Button, Col,  FormGroup, Form, Label, Input, Row } from 'reactstrap';
import * as api from 'lib/api';
import {ChasingDots, Circle} from 'better-react-spinkit'

class Home extends Component {
    
    data = {
        datasets: [{
            data: [4, 12],
            backgroundColor: [
            '#FF6384',
            '#36A2EB'
            ],
            hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB'
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Occupied',
            'Available'
        ]
    };

    static defaultProps = {
        sessionYn: "FALSE",
        uid: 'NONE',
        comid : '', 
        comname : '', 
        grade : '', 
        name : '', 
        said : '', 
        saname : '', 
        silid : '', 
        silname : '', 
        teamid : '' , 
        teamname : '',
        sessionId : 'NONE'
    }
    state = {
        id: '',
        uid: '',
        pwd: '',
        comid : '', 
        comname : '', 
        grade : '', 
        name : '', 
        said : '', 
        saname : '', 
        silid : '', 
        silname : '', 
        teamid : '' , 
        teamname : '',
        sessionId : '',
        loading: false
    }

    componentDidMount() {
    }

    handleChange = (e) => {
    this.setState({
          [e.target.name]: e.target.value,

          rancherInfo : {

           ...this.state.rancherInfo, 
           [e.target.name] : e.target.value}
          
            }
    
        )
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleSubmit();
        }
    }
    doRancherLogin = async ( param ) => {

        try{
            const response = await api.doRancherLogin( param);
            console.log(response);
        } catch (e) {
            console.log(e)
        }
    }

    doLogin = async ( param ) => {
        try {
            const response = await api.doLogin( param );
            this.setState({
                sessionId: response.data.sessionId,
                uid : response.data.id,
                comid : response.data.comid, 
                comname : response.data.comname, 
                grade : response.data.grade, 
                name : response.data.name, 
                said : response.data.said, 
                saname : response.data.saname, 
                silid : response.data.silid, 
                silname : response.data.silname, 
                teamid : response.data.teamid , 
                teamname : response.data.teamname
            })

            console.log(response)
            this.props.onLogin(this.state)
            console.log(this.state.id)

            console.log("log sessionId in SessionStorage")
            // setter
            sessionStorage.setItem('mySessionId', response.data.sessionId);
            
            // getter
            console.log("get session id at Home.js login.do")
            console.log(sessionStorage.getItem('mySessionId'));

        } catch (e) {
        // 오류가 났을 경우
            alert("AD 또는 패스워드가 잘못되었습니다.")
            
            console.log(e);
        }

        this.setState({
            loading : false
        })
    }


    // 로그인 버튼 클릭 처리 함수
    handleSubmit = () => {

        this.setState({
            loading:true
        })

        this.doLogin(this.state)

        this.setState({
            id : '',
            pwd : ''
        })
    }

    // rancher login 버튼 클릭 처리
    handleRancherLogin = () => {

        this.setState({

            rancherInfo : {

                ...this.state.rancherInfo,
                uid : this.props.uid
            }
        })
        this.doRancherLogin(this.state.rancherInfo)


    }

    render() {
        
        const {id,  pwd } = this.state;
        const {uid,
                comid, 
                comname, 
                grade, 
                name, 
                said, 
                saname, 
                silid, 
                silname, 
                teamid , 
                teamname } = this.props;

        return (
            <div>
                {   this.props.sessionYn === "TRUE" 
                ? 
                <div>
                

                <Table>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>이름</th>
                            <th>직급</th>
                            <th>팀명</th>
                            <th>실명</th>
                            <th>사업부명</th>
                            <th>회사명</th>
                        
                        </tr>
                        <tr>
                            <td>{uid}</td>
                            <td>{name}</td>
                            <td>{grade}</td>
                            <td>{teamname}-{teamid}</td>
                            <td>{silname}-{silid}</td>
                            <td>{saname}-{said}</td>
                            <td>{comname}-{comid}</td>
                            
                        </tr>
                    </tbody>
                </Table>

                
                </div>
                : 
                <Form>
                    <FormGroup row>
                        <Label sm={2}>HKMC AD </Label>
                        <Col sm={5}>
                            <Input
                            placeholder="HKMC AD"
                            value={id}
                            onChange={this.handleChange}
                            name="id"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>Pwd </Label>
                        <Col sm={5}>
                            <Input
                            type="password"
                            placeholder=""
                            value={pwd}
                            onChange={this.handleChange}
                            onKeyPress={this.handleKeyPress}
                            name="pwd"
                            />
                        </Col>
                        { this.state.loading ? 

                            <Col sm={2}>
                                <Circle color="black" size={30}/>
                            </Col>
                            : <Col sm={2}><div></div></Col>
                            }
                        <Col sm={3}>
                            <div align="right">
                            <Button  onClick={ this.handleSubmit}>로그인</Button>
                            </div>
                        </Col>
                    </FormGroup>
                    <div align="right">
                        
                        <br></br>
                        <br></br>
                        
                    </div>
                        

                    
                

                    {/**/}
                </Form>
                }

            </div>

            
        );
    }
};

export default Home;