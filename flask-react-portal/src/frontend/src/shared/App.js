import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { NewBuild, Builds, Head, BuildList, Deploys, Integration } from 'pages';
import  LoginContainer  from 'containers/LoginContainer'
import Menu from 'components/Menu';
import { Container } from 'reactstrap'

class App extends Component {
    
    render() {

        return (
            <div>
                <Container>
                <Head />
                <Menu />
                <div>
                <Route exact path="/" component={LoginContainer}/>
                <Route exact path="/Build" component={NewBuild}/>
                <Route exact path="/BuildList" component={BuildList}/>
                <Route path="/Builds" component={Builds}/>
                <Route path="/Deploys" component={Deploys}/>
                <Route path="/Integration" component={Integration}/>
                
                </div>
                </Container>


            </div>        
        );
    }
}

// 컴포넌트를 리덕스와 연동 할 떄에는 connect 를 사용합니다.
// connect() 의 결과는, 컴포넌트에 props 를 넣어주는 함수를 반환합니다.
// 반환된 함수에 우리가 만든 컴포넌트를 넣어주면 됩니다.
export default App;