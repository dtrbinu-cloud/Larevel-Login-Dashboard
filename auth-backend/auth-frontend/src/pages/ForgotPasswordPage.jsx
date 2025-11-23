import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Reset pesan setiap kali submit
        try {
            const response = await api.post('/forgot-password', { email });
            toast.success('Permintaan terkirim!');
            setMessage(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.errors?.email?.[0] || 'Gagal mengirim link reset.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. Tambahkan wrapper <div className="container">
        // Ini akan memberikan kotak, bayangan, dan bingkai yang sama seperti halaman login.
        // Kita buat sedikit lebih kecil karena hanya ada satu panel.
        <div className="container" style={{ width: '450px', minHeight: '420px' }}>

            {/* 2. Kita gunakan .form-container yang sama */}
            {/* Style inline di sini untuk membuatnya menempati seluruh ruang .container */}
            <div className="form-container" style={{ height: '100%', width: '100%', left: 0, top: 0, zIndex: 2 }}>
                <form onSubmit={handleSubmit}>
                    <h1>Lupa Password</h1>
                    <span style={{ padding: '0 20px' }}>Masukkan alamat email Anda dan kami akan mengirimkan link untuk mereset password Anda.</span>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{marginTop: '20px'}}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                    </button>
                    
                    {/* Tampilkan pesan feedback dari server */}
                    {message && <p style={{ marginTop: '20px', padding: '0 25px', color: '#00ff7f' }}>{message}</p>}

                    <Link to="/" style={{marginTop: '15px'}}>Kembali ke Halaman Login</Link>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;