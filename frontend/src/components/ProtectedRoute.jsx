import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoute({isAuth}){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function authenticate(){
            const response = await fetch("https://dataquest-host.onrender.com/users/session/", {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.teamname){
                setLoading(false)
            } else {
                setLoading(true)
                navigate('/')
            }
          }
    
        authenticate()
    }, [loading])
    return (
        <>
            {!isAuth && loading ? <h1>Loading...</h1> : <Outlet />}
        </>
    )
}