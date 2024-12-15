import React from "react";

const Contributors = () => {
  const contributors = [
    { name: "Pankaj Kumar", role: "Developer", profileLink: "https://github.com/Pankajkumar2608" },
    { name: "Sarvesh", role: "Auth And Mentor", profileLink: "https://github.com/sarvesh371" },
    
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 text-white font-body">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Project Contributors</h1>
        {contributors.length === 0 ? (
          <p className="text-center">No contributors found.</p>
        ) : (
          <ul className="space-y-4">
            {contributors.map((contributor, index) => (
              <li
                key={index}
                className="flex flex-col items-start bg-gray-700 p-4 rounded-md shadow"
              >
                <p className="text-lg font-semibold">{contributor.name}</p>
                <p className="text-sm text-yellow-400">{contributor.role}</p>
                {contributor.profileLink && (
                  <a
                    href={contributor.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline mt-1"
                  >
                    View Profile
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Contributors;
