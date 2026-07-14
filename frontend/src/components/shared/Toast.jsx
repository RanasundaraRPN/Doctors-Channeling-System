import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for transition
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`toast-notification toast-${type}`}>
            <div className="toast-content">
                <CheckCircle size={20} className="toast-icon" />
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={() => setVisible(false)}>
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
