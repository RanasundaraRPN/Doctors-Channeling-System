import React from 'react';
import './SocialButton.css';

const SocialButton = ({ icon, label, onClick }) => {
    return (
        <button className="btn-social" onClick={onClick}>
            <img src={icon} alt={label} className="social-icon" />
            <span>{label}</span>
        </button>
    );
};

export default SocialButton;
