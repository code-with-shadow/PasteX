import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Viewpaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paste = useSelector(state => state.paste.pastes.find(p => p._id === id));

  if (!paste) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow-lg text-lg font-semibold">Paste not found.</div>
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2">
      <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 tracking-tight drop-shadow-lg">View Paste</h1>
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-700">
        <div className="mb-6">
          <div className="text-xl font-semibold text-white mb-2">Title</div>
          <div className="text-2xl font-bold text-blue-300 bg-gray-900 rounded-lg p-4 shadow-inner break-words">{paste.title}</div>
        </div>
        <div className="mb-6">
          <div className="text-xl font-semibold text-white mb-2">Content</div>
          <div className="text-lg text-gray-200 bg-gray-900 rounded-lg p-4 shadow-inner whitespace-pre-wrap break-words min-h-[100px]">{paste.content}</div>
        </div>
        <div className="text-xs text-gray-400 mb-8">Created: {new Date(paste.createdAt).toLocaleString()}</div>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">Back</button>
      </div>
    </div>
  );
}

export default Viewpaste;
