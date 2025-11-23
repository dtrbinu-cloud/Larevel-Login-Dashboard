import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

// Definisikan nilai awal form di luar komponen agar tidak dibuat ulang setiap render
const initialRegisterForm = { name: '', email: '', password: '', password_confirmation: '' };
const initialLoginForm = { email: '', password: '' };

function AuthPage() {
    // --- Bagian State ---
    const [isContainerActive, setIsContainerActive] = useState(false);
    const [registerForm, setRegisterForm] = useState(initialRegisterForm);
    const [loginForm, setLoginForm] = useState(initialLoginForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // --- Bagian Validasi ---
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Nama tidak boleh kosong.';
                break;
            case 'email':
                if (!value) return 'Email tidak boleh kosong.';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Format email tidak valid.';
                break;
            case 'password':
                if (!value) return 'Password tidak boleh kosong.';
                if (value.length < 8) return 'Password minimal 8 karakter.';
                break;
            case 'password_confirmation':
                if (!value) return 'Konfirmasi password tidak boleh kosong.';
                if (value !== registerForm.password) return 'Konfirmasi password tidak cocok.';
                break;
            default:
                break;
        }
        return ''; // Mengembalikan string kosong jika valid
    };

    // --- Bagian Handlers ---
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));
        // Langsung hapus error untuk field ini saat pengguna mengetik
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errorMessage = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
    };

    const handleRegisterClick = () => setIsContainerActive(true);
    const handleLoginClick = () => setIsContainerActive(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        // Validasi semua field sebelum submit
        Object.keys(registerForm).forEach(key => {
            const error = validateField(key, registerForm[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error("Silakan perbaiki semua error pada form.");
            return;
        }
        
        setLoading(true);
        try {
            await api.post('/register', registerForm);
            toast.success('Registrasi berhasil! Silakan login.');
            setRegisterForm(initialRegisterForm);
            setIsContainerActive(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registrasi Gagal!");
            if (error.response?.data?.errors) {
                setErrors(prev => ({ ...prev, ...error.response.data.errors }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login', loginForm);
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Login berhasil!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Email atau Password salah!');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const response = await api.get(`/auth/${provider}/redirect`);
            window.location.href = response.data.redirect_url;
        } catch (error) {
            console.error("Gagal memulai social login", error);
            toast.error("Gagal terhubung dengan layanan " + provider);
        }
    };

    // --- Bagian Tampilan (JSX) ---
    return (
        <div className={`container ${isContainerActive ? 'active' : ''}`} id="container">
            {/* FORM REGISTRASI */}
            <div className="form-container sign-up">
                <form onSubmit={handleRegisterSubmit} noValidate>
                    <h1>Create Account</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={(e) => { e.preventDefault(); handleSocialLogin('google'); }}>
                            <i className="fa-brands fa-google-plus-g"></i>
                        </a>
                        <a href="#" className="icon" onClick={(e) => { e.preventDefault(); handleSocialLogin('facebook'); }}>
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="#" className="icon" onClick={(e) => { e.preventDefault(); handleSocialLogin('github'); }}>
                            <i className="fa-brands fa-github"></i>
                        </a>
                    </div>
                    <span>or use your email for registration</span>
                    
                    <input name="name" type="text" placeholder="Name" value={registerForm.name} onChange={handleRegisterChange} onBlur={handleBlur} autoComplete='off'/>
                    {errors.name && <span className="error-message">{errors.name}</span>}

                    <input name="email" type="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} onBlur={handleBlur} autoComplete='off'/>
                    {errors.email && <span className="error-message">{errors.email}</span>}

                    <div style={{ position: 'relative', width: '100%' }}>
                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} onBlur={handleBlur} autoComplete='off'/>
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '18px', cursor: 'pointer' }}></i>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                    
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input name="password_confirmation" type={showPassword ? 'text' : 'password'} placeholder='Password Confirmation' value={registerForm.password_confirmation} onChange={handleRegisterChange} onBlur={handleBlur} autoComplete='off'/>
                    </div>
                    {errors.password_confirmation && <span className="error-message">{errors.password_confirmation}</span>}
                    
                    <button type='submit' disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
                </form>
            </div>

            {/* FORM LOGIN */}
            <div className="form-container sign-in">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={(e) => { e.preventDefault(); handleSocialLogin('google'); }}>
                            <i className="fa-brands fa-google-plus-g"></i>
                        </a>
                        <a href="#" className="icon" onClick={(e) => { e.preventDefault(); handleSocialLogin('facebook'); }}>
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="#" className="icon" onClick={(e) => { e.preventDefault(); handleSocialLogin('github'); }}>
                            <i className="fa-brands fa-github"></i>
                        </a>
                    </div>
                    <span>or use your email password</span>
                    
                    <input name='email' type="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} autoComplete='off'/>
                    
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input name='password' type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginForm.password} onChange={handleLoginChange} autoComplete='off'/>
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '18px', cursor: 'pointer' }}></i>
                    </div>
                    
                    <Link to="/forgot-password">Forgot Your Password?</Link>
                    <button type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                </form>
            </div>

            {/* PANEL PENGGANTI (TOGGLE) */}
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button className="hidden" id="login" onClick={handleLoginClick}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button className="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;