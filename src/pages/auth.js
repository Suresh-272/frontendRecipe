import { useState } from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Api from "../Api/Api";

export const Auth = () => {
    return (<div>
        <Login />
        <Register />
    </div>)
};

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [_, setCookies] = useCookies(["access_token"]);
    
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await Api.post("/auth/login", {username, password});
            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            navigate("/")
            
        } catch(err){
            console.error(err)
        }
    };

    return (<Form 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword}
        label={"Login"}
        onSubmit={onSubmit}

    />)
};

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await Api.post("/auth/register", {username, password});
            alert("Register completer now login !!")
        } catch(err){
            console.error(err)
        }
    };

    return (<Form 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword}
        label={"Register"}
        onSubmit={onSubmit}
    />)
};




const Form = ({username, setUsername, password, setPassword, label, onSubmit}) => {
    return (
        <div className="container">
            <div className="auth-container">
                <form onSubmit={onSubmit}>
                    <h2>{label}</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password </label>
                        <input
                            type="password"
                            id="passwprd"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button className="btn-create-recipe" type="submit">{label}</button>
                </form>
            </div>
        </div>
        
    )
};  