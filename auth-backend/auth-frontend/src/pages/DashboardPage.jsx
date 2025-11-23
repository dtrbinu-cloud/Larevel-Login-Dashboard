import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function DashboardPage() {
    const [user, setUser] = useState(null);
    const [Loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        const fecthUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.log("Fail to validated token: ", error);
                
                if ( error.response && error.response.status === 401) {
                    toast.error(error.response?.data?.message || 'Your session is end, please back login')
                    handleLogout();
                }
            }finally {
                setLoading(false);
            }
        };
        fecthUser();
    }, []);

    if (Loading) {
        return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Memvalidasi sesi...</div>;
    }

    if (!user) {
        return (
            <div style={{ color: 'white', textAlign: 'center', paddingTop: '50px' }}>
                <h2>Gagal memuat data pengguna.</h2>
                <button onClick={handleLogout}>Kembali ke Login</button>
            </div>
        )
    }

    return (
       <>
            <button onClick={handleLogout} style={{textAlign: 'center'}}>Logout, {user.name}</button>
        </>
    );
}

export default DashboardPage;