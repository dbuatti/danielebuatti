import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Quote Not Found</h1>
      <p className="text-lg text-gray-600">
        We couldn't find the quote you were looking for. Please check the URL.
      </p>
    </div>
  );
};

export default NotFoundPage;