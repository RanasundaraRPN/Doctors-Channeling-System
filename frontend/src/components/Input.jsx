import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import './Input.css';

const Input = ({ label, type = 'text', placeholder, icon: Icon, isPassword, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                <input
                    type={inputType}
                    className="input-field"
                    placeholder={placeholder}
                    {...props}
                />
                {Icon && !isPassword && (
                    <div className="input-icon">
                        <Icon size={20} color="#6b7d75" />
                    </div>
                )}
                {isPassword && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Eye size={20} color="#6b7d75" /> : <EyeOff size={20} color="#6b7d75" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
