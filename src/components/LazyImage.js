import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  loadingClassName = '',
  errorClassName = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const defaultFallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHBhdGggZD0iTTEwMCAxNDUuNDUyQzY2Ljk3NCAxNDUuNDUyIDMwLjExNyAxMTcuNjU4IDMwLjExNyA4NC4wNzE3QzMwLjExNyA1MC40ODM3IDY2Ljk3NCAyMi42OSAxMDAgMjIuNjlDMTMzLjAyNiAyMi42OSAxNzAuMDEzIDUwLjQ4MzcgMTcwLjAxMyA4NC4wNzE2QzE3MC4wMTMgMTE3LjY1OCAxMzMuMDI2IDE0NS40NTIgMTAwIDE0NS40NTJ6IiBmaWxsPSIjRkZCNjI2IiBzdHJva2U9IiNGRkI2MjYiIHN0cm9rZS13aWR0aD0iMTUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSI+8J+OqDwvdGV4dD48L2c+PC9zdmc+";

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 ${loadingClassName}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      )}
      
      {isInView && (
        <img
          src={hasError ? (fallbackSrc || defaultFallback) : src}
          alt={alt}
          className={`${className} ${hasError ? errorClassName : ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="text-center text-amber-600">
            <div className="text-4xl mb-2">🎨</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
