import { useEffect, useState } from "react";
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserId";
import {useCookies} from "react-cookie";
import Api from "../Api/Api";


export const Home = () => {
    const [recipes, setRecipes] = useState([]);
    // const [users, setUsers] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [cookies, _] = useCookies(["access_token"]);
    const userID = useGetUserID();
    

    useEffect(() => {
        const fetchRecipe = async () => {
            try{
                const response = await Api.get("/recipes");
                setRecipes(response.data);
            } catch(err) {
                console.error(err);
            }
        };

        // const fetchUser = async () => {
        //     try{
        //         const response = await axios.get("http://localhost:3001/users");
        //         console.log(response.data);
        //     } catch(err) {
        //         console.error(err);
        //     }
        // };

        const fetchSavedRecipe = async () => {
            try{
                const response = await Api.get(`/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(response.data.savedRecipes);
            } catch(err) {
                console.error(err);
            }
        };

        fetchRecipe();
        // fetchUser();
        if(cookies.access_token) fetchSavedRecipe();

    }, []);

    const savedRecipe = async (recipeID) => {
        try{
            const response = await axios.put("http://localhost:3001/recipes", {recipeID, userID}, {headers : {authorization : cookies.access_token}});
            setSavedRecipes(response.data.savedRecipes);
        } catch(err) {
            console.error(err);
        }
    }

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    return(
        <div>
            <h1 className="home-title">Recipes</h1>
            <div className="home-container">
                <div className="home-box">
                    {recipes.map((recipe) => (
                        <p key={recipe._id}>
                        <div className="content-title">
                            <h2>{recipe.name}</h2>
                        </div>
                        
                        <div className="boxs">
                            <img src={recipe.imageUrl}  alt={recipe.name}/>
                            <div className="instructions">
                                <p> {recipe.instructions}</p>
                            </div>
                            <p className="content-title"> Cooking Time: {recipe.cookingTime} (minutes)</p>
                            <button className="btn" onClick={() => savedRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}> 
                                {isRecipeSaved(recipe._id) ? "Saved" : "Save"} 
                            </button>
                        </div>

                    </p> 
                  
                    ))}
                    
                </div>
                
            
            </div>
            
        </div>
    )
    
};
