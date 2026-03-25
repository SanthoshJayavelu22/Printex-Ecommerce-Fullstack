import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pr-4 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white dark:focus:bg-slate-700 font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-slate-500 text-slate-900 dark:text-white ${icon ? 'pl-12' : 'pl-4'} ${error ? 'ring-2 ring-red-500 bg-red-50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
