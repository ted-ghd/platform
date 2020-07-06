import React from 'react';
import { Jumbotron, Button} from 'reactstrap'

const Head = () => {
    return (
        <div>
                {/*<Jumbotron>
                    <h1 className="display-3">Docker Image Builder</h1>
                    <br></br>
                    <p className="lead">GitLab과 연동하여 Docker Image를 빌드 할 수 있습니다.</p>
                    <hr className="my-2" />
                    <p>GitLab 정보를 입력하고 빌드를 시작해보세요</p>
                    <p>HPC 기술팀 - 김태성 (tel. 02-6296-6938)</p>
                    <p className="lead">
                    <Button color="primary">Learn More</Button>
                    </p>
                </Jumbotron>
                */}
                
                <Jumbotron>
                    <h1> CI/CD Portal for AI Platform </h1>
                    <p>HPC 기술팀 - 김태성 (tel. 02-6296-6938)</p>
                </Jumbotron>
        </div>
    );
};

export default Head;

