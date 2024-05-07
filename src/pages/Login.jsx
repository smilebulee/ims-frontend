import { useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Login = () => {    

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    
        const handleSubmit = async (e) => {

            e.preventDefault()

            if(userId === "") {
                alert("ID를 입력해주세요.");
                return;
            }
            if(password === "") {
                alert("PASSWORD를 입력해주세요.");
                return;
            }

            fetch(process.env.REACT_APP_API_HOST + "/ims/auth/login", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                }),
                body: JSON.stringify({ userId: userId, password: password })
            })
            .then((res) => res.json())
            .then((data) => { 

                if(data.grantType) {
                    // set token
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('tokenExpiresIn', data.tokenExpiresIn);
                    // set user info
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('userNm', data.userNm);
                    localStorage.setItem('authGrpCd', data.authGrpCd);
                    window.location.href = `/`  
                }else{
                    alert(data.message)
                }
                
            }).catch((error) => {
                console.log(error);
            });  
        }

        return (
            <div className="d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="align-self-center">
                    <img src={process.env.PUBLIC_URL + '/logo.jpg'}  style={{ marginBottom: "10px"}}/>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ minWidth: "25vw" }}>
                            <input type="text" className="form-control" id="userId" onChange={e => setUserId(e.target.value) } value={userId} placeholder="ID"/>
                        </div>
                        <div className="form-group" style={{ minWidth: "25vw" , marginTop: "10px" }}>
                            <input type="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="PASSWORD"/>
                        </div>
                        <div className="form-group" style={{ minwidth: "25vw", marginTop: "20px", textAlign:"center" }}>
                            <Button variant='btn btn-outline-secondary' type="submit" style={{ width:"85%"} }>로그인</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
 }
export default Login;