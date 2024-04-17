import { useState } from "react";
import axios from "axios";


const Login = () => {    

    // 토큰 만드는 함수
    const createTokenHeader = (token) => {
        return {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
    };

    // // 토큰 만료시간 계싼함수
    // const calculateRemainingTime = (expirationTime:number) => {
    //     const currentTime = new Date().getTime();
    //     const adjExpirationTime = new Date(expirationTime).getTime();
    //     const remainingDuration = adjExpirationTime - currentTime;
    //     return remainingDuration;
    //   };
      
    //   // 토큰, 만료시간 받으면 localStorage에 저장하고 남은 시간 반환
    //   export const loginTokenHandler = (token:string, expirationTime:number) => {
    //     localStorage.setItem('token', token);
    //     localStorage.setItem('expirationTime', String(expirationTime));
      
    //     const remainingTime = calculateRemainingTime(expirationTime);
    //     return remainingTime;
    //   }
      
    //   // localStorage 내부에 토큰이 존재하는지 검색
    //   // 존재시, 남은시간과 토큰을 객체로 반환
    //   // 1초 아래로 남았으면 자동으로 토큰 삭제
    //   export const retrieveStoredToken = () => {
    //     const storedToken = localStorage.getItem('token');
    //     const storedExpirationDate = localStorage.getItem('expirationTime') || '0';
      
    //     const remaingTime = calculateRemainingTime(+ storedExpirationDate);
      
    //     if(remaingTime <= 1000) {
    //       localStorage.removeItem('token');
    //       localStorage.removeItem('expirationTime');
    //       return null
    //     }
      
    //     return {
    //       token: storedToken,
    //       duration: remaingTime
    //     }
    //   }

    //   export const loginActionHandler = (email:string, password: string) => {
    //     const URL = '/auth/login';
    //     const loginObject = { email, password };
    //     const response = POST(URL, loginObject, {});
      
    //     return response;
    //   };
      
    //   export const logoutActionHandler = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('expirationTime');
    //   };

    // // retrieveStoredToken로 받은 token값과, logoutHandler를 종속변수로 삼는 useEffet훅
    // // 만료시간이 될 경우 자동으로 logoutHandler를 실행시킨다.
    // useEffect(() => {
    //     if(tokenData) {
    //       console.log(tokenData.duration);
    //       logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    //     }
    //   }, [tokenData, logoutHandler]);





    const TOKEN_TYPE = localStorage.getItem("tokenType");
    let ACCESS_TOKEN = localStorage.getItem("accessToken");


    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
   



        const handleSubmit = async (e) => {
            e.preventDefault()
            fetch(process.env.REACT_APP_API_HOST + "/ims/auth/login", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                }),
                body: JSON.stringify({ userId: userId, password: password })
            }).then((res) => res.json()).then((data) => { 
                //alert(JSON.stringify(data));
                console.log(">>"+JSON.stringify(data));
                /*grantType accessToken  tokenExpiresIn */
              if (data !== null) {
                const loginData = data.data;

                // set token
                setToken(data.accessToken);
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('tokenExpiresIn', data.tokenExpiresIn);

                // logouttimer

                 // setIsSuccess(true);

                 window.location.href = `/`    
                // setToken(loginData.accessToken);
                // logoutTimer = setTimeout(
                //   logoutHandler,
                //   authAction.loginTokenHandler(loginData.accessToken, loginData.tokenExpiresIn)
                // );
                // setIsSuccess(true);
                // console.log(isSuccess);
              }
            }).catch((error) => {
                console.log(error);
                alert(error);
            });  
        }

        return (
            <div className="d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="align-self-center">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ minWidth: "25vw" }}>
                            <label htmlFor="userId">아이디</label>
                            <input type="text" className="form-control" id="userId" onChange={e => setUserId(e.target.value)} value={userId}/>
                        </div>
                        <div className="form-group" style={{ minWidth: "25vw" }}>
                            <label htmlFor="password">비밀번호</label>
                            <input type="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} value={password}/>
                        </div>
                        <div className="form-group" style={{ minWidth: "25vw" }}>
                            <button type="submit" style={{ width: "100%"}}>로그인</button>
                        </div>
                    </form>
                </div>
            </div>
        );
 }
export default Login;