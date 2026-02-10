import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // If loading, show nothing or spinner
    if (loading) return <div>Loading...</div>;

    // If user is authenticated, render child routes
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
