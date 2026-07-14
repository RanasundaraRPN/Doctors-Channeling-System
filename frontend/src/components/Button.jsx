import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', showArrow }) => {
    return (
        <button className="btn-primary" type={type} onClick={onClick}>
            {children}
            {showArrow && <ArrowRight size={20} className="btn-icon" />}
        </button>
    );
};

export default Button;
