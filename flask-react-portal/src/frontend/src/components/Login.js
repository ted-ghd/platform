import React from 'react';

const Login = ({
  sessionYn,
  onLogin,
  onLogout
}) => {

  return (
    <div>
      <h1>{sessionYn}</h1>
      <button onClick={onLogin}>로그인</button>
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
};

Login.defaultProps = {
  sessionYn: "FALSE"
}

export default Login;