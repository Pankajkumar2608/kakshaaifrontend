import React, { PureComponent } from 'react';


export class LoadingPage extends PureComponent {
  render() {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin h-5 w-5 border-b-2 border-gray-900 rounded-full"></div>
        <img src="https://cdn-icons-png.flaticon.com/512/3145/3145765.png" alt="Kaksha AI" className="h-12 w-auto mt-6" />
        <p className="mt-6 text-2xl font-medium text-gray-900">Kaksha AI</p>
        <p className="mt-2 text-lg text-gray-600">Loading, please wait...</p>
      </div>
    );
  }
}

export default LoadingPage;

