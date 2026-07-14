import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import { apiFetch } from '../utils/api';
import './Login.css'; // Reuse login styles

const Register = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ fullname, email, password }),
            });
            // Go to login after successful registration with a success message
            navigate('/', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="form-header">
                <h2>Create Account</h2>
                <p>Join MediChannel to access premium healthcare.</p>
            </div>

            <form onSubmit={handleRegister} className="login-form">
                {error && <div className="error-message" style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    icon={User}
                    type="text"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />

                <Input
                    label="Email Address"
                    placeholder="name@medichannel.com"
                    icon={Mail}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    placeholder="Create a password"
                    isPassword
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    isPassword
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div style={{ height: '16px' }}></div>

                <Button type="submit" showArrow disabled={loading}>
                    {loading ? 'Registering...' : 'Register Now'}
                </Button>
            </form>

            <div className="divider">
                <span>OR SIGN UP WITH</span>
            </div>

            <div className="social-login">
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
                <p>Already have an account? <Link to="/" className="highlight-link">Sign In</Link></p>
            </div>
        </AuthLayout>
    );
};

export default Register;
