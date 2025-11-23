// src/pages/AuthCallbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function AuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Simpan token
            localStorage.setItem('auth_token', token);

            // Ambil data user menggunakan token baru ini
            api.get('/user', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                localStorage.setItem('user', JSON.stringify(response.data));
                // Arahkan ke dashboard
                navigate('/dashboard');
            }).catch(err => {
                console.error("Gagal mengambil data user setelah callback", err);
                setError("Gagal memverifikasi data Anda. Silakan coba login kembali.");
            });
        } else {
            setError("Proses otentikasi gagal. Tidak ada token yang diterima.");
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>
            {error ? (
                <>
                    <h2>Terjadi Kesalahan</h2>
                    <p>{error}</p>
                </>
            ) : (
                <h2>Memproses login Anda...</h2>
            )}
        </div>
    );
}

export default AuthCallbackPage;