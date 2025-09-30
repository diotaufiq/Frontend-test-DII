"use client";

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000 // Durasi diperpanjang jadi 5 detik
}: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      // Reset progress
      setProgress(100);
      
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(progressInterval);
            onClose();
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-white border-l-4 border-green-500 shadow-lg',
          icon: 'bg-green-100 text-green-600',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          container: 'bg-white border-l-4 border-red-500 shadow-lg',
          icon: 'bg-red-100 text-red-600',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          container: 'bg-white border-l-4 border-yellow-500 shadow-lg',
          icon: 'bg-yellow-100 text-yellow-600',
          progress: 'bg-yellow-500'
        };
      case 'info':
        return {
          container: 'bg-white border-l-4 border-blue-500 shadow-lg',
          icon: 'bg-blue-100 text-blue-600',
          progress: 'bg-blue-500'
        };
      default:
        return {
          container: 'bg-white border-l-4 border-gray-500 shadow-lg',
          icon: 'bg-gray-100 text-gray-600',
          progress: 'bg-gray-500'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-6 right-6 z-50 w-96 max-w-sm">
      <div 
        className={`${styles.container} rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        {/* Main Content */}
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.icon} flex items-center justify-center mr-3`}>
              {getIcon()}
            </div>
            
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-5">
                {message}
              </p>
              {type === 'success' && (
                <p className="mt-1 text-xs text-gray-500">
                  Akan dialihkan ke halaman daftar pasien...
                </p>
              )}
            </div>
            
            {/* Close Button */}
            <div className="flex-shrink-0 ml-4">
              <button
                onClick={onClose}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}