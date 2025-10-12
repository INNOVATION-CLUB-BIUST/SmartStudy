import React from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  children: React.ReactNode;
  to: string;
  variant?: 'primary' | 'secondary' | 'link';
  className?: string;
};

const Button = ({ children, to, variant = 'primary', className = '' }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium';

  const variantClasses = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700',
    secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200',
    link: 'text-slate-500 hover:text-slate-900 shadow-none',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (variant === 'link') {
    return (
      <Link to={to} className={`${classes} shadow-none`}>
        {children}
      </Link>
    );
  }

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};

export default Button;
