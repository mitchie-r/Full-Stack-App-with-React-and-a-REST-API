import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import UserContext from '../context/UserContext';

const PrivateRoute = () => {

    // User Context
    const { authUser } = useContext(UserContext);

    // Location hook
    const location = useLocation();

    if (authUser) {
        return <Outlet /> 
    } else {
        return <Navigate to="/signin" state={{from: location.pathname}}/>
    }
}

export default PrivateRoute;