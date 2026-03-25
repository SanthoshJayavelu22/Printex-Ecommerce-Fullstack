import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-black text-white shadow-xl shadow-indigo-500/20',
    secondary: 'bg-emerald-500 hover:bg-black text-white shadow-xl shadow-emerald-500/20',
    outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white hover:border-black dark:hover:border-white',
    danger: 'bg-red-500 hover:bg-black text-white shadow-xl shadow-red-500/20',
    ghost: 'bg-transparent text-slate-500 hover:text-black hover:bg-slate-50'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
    xl: 'px-12 py-5 text-lg rounded-[1.25rem]'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <>
          {leftIcon && <span className="mr-2 group-hover:-translate-x-1 transition-transform">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2 group-hover:translate-x-1 transition-transform">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
