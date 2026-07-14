import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import { apiFetch } from '../utils/api';
import Toast from '../components/shared/Toast';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [toastMessage, setToastMessage] = React.useState('');

    React.useEffect(() => {
        if (location.state?.message) {
            setToastMessage(location.state.message);
            // Clear location state so message doesn't persist on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem('medichannel_token', data.token);
            localStorage.setItem('medichannel_user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/doctors');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.message);
            alert(`Login Failed: ${err.message}\nPlease check that the backend server is running on port 5001.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="form-header">
                <h2>Welcome Back</h2>
                <p>Connect with top specialists instantly.</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
                {error && <div className="error-message" style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <Input
                    label="Email or Username"
                    placeholder="name@medichannel.com"
                    icon={Mail}
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    placeholder="Enter your password"
                    isPassword
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="form-actions">
                    <a href="#" className="forgot-password">Forgot Password?</a>
                </div>

                <Button type="submit" showArrow disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setEmail('admin@123');
                            setPassword('Am456');
                        }}
                        style={{
                            background: 'none',
                            border: '1px dashed var(--text-secondary)',
                            color: 'var(--text-secondary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        Auto-fill Admin Credentials
                    </button>
                </div>
            </form>

            <div className="divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-login">
                {/* Using inline SVGs for logos for better quality without external assets */}
                <SocialButton
                    label="Google"
                    icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    onClick={async () => {
                        try {
                            const data = await apiFetch('/auth/social-login', {
                                method: 'POST',
                                body: JSON.stringify({ email: 'google_user@test.com', fullname: 'Google User', provider: 'google' }),
                            });
                            localStorage.setItem('medichannel_token', data.token);
                            localStorage.setItem('medichannel_user', JSON.stringify(data.user));
                            navigate('/dashboard');
                        } catch (err) {
                            setError(err.message);
                        }
                    }}
                />
                <SocialButton
                    label="Apple"
                    icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                    onClick={async () => {
                        try {
                            const data = await apiFetch('/auth/social-login', {
                                method: 'POST',
                                body: JSON.stringify({ email: 'apple_user@test.com', fullname: 'Apple User', provider: 'apple' }),
                            });
                            localStorage.setItem('medichannel_token', data.token);
                            localStorage.setItem('medichannel_user', JSON.stringify(data.user));
                            navigate('/dashboard');
                        } catch (err) {
                            setError(err.message);
                        }
                    }}
                />
            </div>

            <div className="form-footer">
                <p>Don't have an account? <Link to="/register" className="highlight-link">Register Now</Link></p>
            </div>
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            )}
        </AuthLayout>
    );
};

export default Login;
