import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        ref={ref}
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-white
        ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'} 
        ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
