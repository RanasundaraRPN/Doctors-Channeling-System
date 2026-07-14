import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="breadcrumbs">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {item.path ? (
                        <Link to={item.path} className="breadcrumb-link">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="breadcrumb-current">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <ChevronRight size={14} className="breadcrumb-separator" />
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
