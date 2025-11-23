import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        token: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        if (token && email) {
            setFormState(prev => ({ ...prev, token, email }));
        } else {
            setMessage("Token atau email tidak ditemukan di URL.");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formState.password !== formState.password_confirmation) {
            toast.error("Konfirmasi password tidak cocok.");
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const response = await api.post('/reset-password', formState);
            toast.success('Password berhasil direset!');
            setMessage(response.data.message + " Anda akan diarahkan ke halaman login dalam 3 detik.");
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal mereset password.');
            toast.error(error.response?.data?.message || 'Gagal mereset password.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ width: '450px', minHeight: '420px' }}>
            <div className="form-container" style={{ height: '100%', width: '100%', left: 0, top: 0, zIndex: 2 }}>
                <form onSubmit={handleSubmit} method='post'> 
                    <h1>Atur Password Baru</h1>
                    <span>Masukkan password baru Anda di bawah ini.</span>
                    
                    <input
                        name="password"
                        type="password"
                        placeholder="Password Baru"
                        value={formState.password}
                        onChange={handleChange}
                        required
                        style={{marginTop: '20px'}}
                    />
                    <input
                        name="password_confirmation"
                        type="password"
                        placeholder="Konfirmasi Password Baru"
                        value={formState.password_confirmation}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Reset Password'}
                    </button>

                    {message && <p style={{ marginTop: '20px', padding: '0 25px', color: '#00ff7f' }}>{message}</p>}

                    {!message.includes("berhasil") && (
                        <Link to="/" style={{marginTop: '15px'}}>Batal dan Kembali ke Login</Link>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;