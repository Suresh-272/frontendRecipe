import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import { useNavigate } from "react-router-dom";


export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userId");
        navigate("/auth");
    }
    return (
        <div className = "nav">
            <Link to="/" className="site-title"> Burn <span> Out</span> </Link>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/create-recipe'>Create Recipe</Link></li>
                
                {!cookies.access_token ? (
                    <li><Link to='/auth'>Login/Register</Link></li>
                ) : (   
                    <>
                    <li><Link to='/saved-recipes'>Saved Recipes</Link></li>
                    <button className="login-btn" onClick={logout}>Logout</button>
                    
                    </>
                )}
            </ul>

        </div>
    )
}