import React from 'react';
import Contributor from './Contributor';

const contributors = [
  { name: 'Pankaj Jaat', role: 'Project Owner & Lead Developer' },
  { name: 'Sarvesh', role: 'Backend Developer' },
 
];

const ContributorsPage = () => (
  <div className="min-h-screen bg-gray-50 py-10 px-5">
    <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Contributors</h2>
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
      {contributors.map((contributor, index) => (
        <Contributor key={index} name={contributor.name} role={contributor.role} />
      ))}
    </div>
  </div>
);

export default ContributorsPage;
