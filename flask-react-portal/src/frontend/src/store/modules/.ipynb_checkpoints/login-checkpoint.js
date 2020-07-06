
import { createAction, handleActions } from 'redux-actions';
// 액션 타입을 정의해줍니다.

const LOGIN = 'login/LOGIN';
const LOGOUT = 'login/LOGOUT';

// 액션 생성 함수를 만듭니다.
// 이 함수들은 나중에 다른 파일에서 불러와야 하므로 내보내줍니다.
//export const login = (param) => ({ type: LOGIN });

export const login = createAction(LOGIN);

export const logout = () => ({ type: LOGOUT });

// 모듈의 초기 상태를 정의합니다.
const initialState = {
    sessionYn : "FALSE",
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
    sessionId: 'NONE'
  
};


export default handleActions({

    [LOGOUT]: (state, action) => {
       
        return { sessionYn: "FALSE", 
                  uid: '' , 
                    comid : '' , 
                    comname : '' , 
                    grade : '' , 
                    name : '' , 
                    said : '' , 
                    saname : '' , 
                    silid : '' , 
                    silname : '' , 
                    teamid : '' , 
                    teamname : '',
                    sessionId: ''}

    },
    [LOGIN]: (state, action) => {
         
         console.log("action")
        console.log(action)
        return { sessionYn: "TRUE", 
                  uid: action.payload.uid,
                    comid : action.payload.comid, 
                    comname : action.payload.comname, 
                    grade : action.payload.grade, 
                    name : action.payload.name, 
                    said : action.payload.said, 
                    saname : action.payload.saname, 
                    silid : action.payload.silid, 
                    silname : action.payload.silname, 
                    teamid : action.payload.teamid , 
                    teamname : action.payload.teamname,
                    sessionId : action.payload.sessionId}}
    
}, initialState)
