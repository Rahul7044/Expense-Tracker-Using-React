import React, {useContext, useRef, useState } from "react";

import "./LoginForm.css";
import AuthContext from "../../store/AuthContext";
import {useHistory,Link} from "react-router-dom";

const LoginForm = () =>{
    const history = useHistory();
    const emailRef = useRef();
    const passwordRef = useRef();

    const[isLoading, setIsLoading] = useState(false);
    const[password, confirmPassword] = useState(true);

    const authCtx = useContext(AuthContext);
    const handleSubmit = (event) =>{
        event.preventDefault();

        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;

        setIsLoading(true);
        fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyABV3Ka88_JCZGivdh4xR89-n-S_BkTf1I",{
                method: "POST",
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true,
                }),
                headers:{
                    "Content-Type": "applicatio/json",
                },


            }).then((response) =>{
                confirmPassword(true);
                confirmPassword("Successful!");
                setIsLoading(false);

                if(response.ok){
                    return response.json();
                }else{
                    response.json().then((data)=>{
                        let errorMessage = "IncorrectPassword";
                        if(data && data.error && data.error.message){
                            errorMessage = data.error.message;
                        }
                        confirmPassword(errorMessage);
                        throw new Error(errorMessage);
                    });
                }
            }).then((data) => {
                console.log(data.idToken);
                authCtx.login(data.idToken);
                history.replace("./home");

            }).catch((error)=>{
                console.log(error.message);
            });   
        };
        return(
            <form onSubmit={handleSubmit} className="login">
                <h2>LoginForm</h2>
                <div className = "body">
                    <div>
                        <label className="label">Email</label>
                        <input type="email" id ="email" ref={emailRef} placeholder="Email" />
                    </div>
                    <div>
                        <label ClassName="label">Password</label>
                        <input type="password" id="password" ref={passwordRef} placeholder="password" />
                    </div>
                    {password}
                </div>
                <div className="foo">
                    <button type="submit" className="btn">Login</button>
                    {isLoading && <p>Loading</p>}
                </div>
                <p>Have an account? <Link to ="/register">Register</Link></p>
                

            </form>
        )

};
export default LoginForm;