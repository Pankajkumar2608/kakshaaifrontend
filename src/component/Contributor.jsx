import React from 'react';

const Contributor = ({ name, role }) => (
  <div className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition">
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-sm text-gray-600">{role}</p>
  </div>
);

export default Contributor;
