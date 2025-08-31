import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removePaste } from '../slice/paste-slice';
import { useNavigate } from 'react-router-dom';

// Trie classes for search suggestions
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.words = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
      node.words.push(word);
    }
    node.isEnd = true;
  }
  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return Array.from(new Set(node.words));
  }
}

function Paste() {
  const pastes = useSelector((state) => state.paste.pastes);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const trieRef = useRef(null);
  const [shareId, setShareId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Build trie when pastes change
  useEffect(() => {
    const trie = new Trie();
    pastes.forEach((p) => trie.insert(p.title));
    trieRef.current = trie;
  }, [pastes]);

  // Update suggestions as user types
  useEffect(() => {
    if (searchTerm && trieRef.current) {
      setSuggestions(trieRef.current.startsWith(searchTerm));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleClickDelete = (id) => dispatch(removePaste(id));
  const handleView = (id) => navigate(`/paste/${id}`);
  const handleEdit = (id) => navigate(`/?pasteId=${id}`);
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Paste copied!');
  };
  const handleShare = (id) => setShareId(shareId === id ? null : id);

  const filterPastes = pastes.filter(
    (paste) =>
      paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getShareLinks = (paste) => {
    const text = encodeURIComponent(`${paste.title}\n${paste.content}`);
    const url = encodeURIComponent(window.location.origin + '/paste/' + paste._id);
    return {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      instagram: `https://www.instagram.com/?url=${url}`,
    };
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2 flex flex-col items-center">
      <input
        type="text"
        placeholder="🔍 Search pastes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 px-6 py-4 rounded-2xl w-full max-w-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white placeholder-gray-400 border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/60 shadow-xl transition-all duration-300 text-lg tracking-wide"
        autoFocus
      />

      {suggestions.length > 0 && (
        <div className="bg-gray-800 text-white max-w-lg w-full mb-4 rounded-lg p-3 shadow-lg">
          {suggestions.map((s) => {
            const idx = s.toLowerCase().indexOf(searchTerm.toLowerCase());
            let before = s.slice(0, idx);
            let match = s.slice(idx, idx + searchTerm.length);
            let after = s.slice(idx + searchTerm.length);
            return (
              <div
                key={s}
                className="cursor-pointer px-2 py-1 rounded hover:bg-blue-900/40"
                style={{ fontWeight: 'normal' }}
                onClick={() => setSearchTerm(s)}
              >
                {idx !== -1 ? (
                  <>
                    {before}
                    <b>{match}</b>
                    {after}
                  </>
                ) : (
                  s
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full max-w-3xl space-y-8 mt-4">
        {filterPastes.length > 0 &&
          filterPastes.map((paste) => (
            <div
              key={paste._id}
              className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl p-7 flex flex-col md:flex-row md:items-center justify-between border border-gray-700 hover:scale-[1.02] hover:shadow-blue-900/40 transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-yellow-400 truncate mb-1">{paste.title}</h2>
                <p className="text-gray-200 mt-1 break-words max-h-32 overflow-y-auto text-base leading-relaxed pr-2">{paste.content}</p>
                <div className="text-gray-500 text-xs mt-3">{new Date(paste.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 mt-6 md:mt-0 md:ml-8 items-center">
                <button onClick={() => handleView(paste._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">View</button>
                <button onClick={() => handleEdit(paste._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">Edit</button>
                <button onClick={() => handleCopy(paste.content)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">Copy</button>
                <button onClick={() => handleClickDelete(paste._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">Delete</button>
                <button onClick={() => handleShare(paste._id)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">Share</button>
              </div>
              {shareId === paste._id && (
                <div className="mt-4 md:mt-0 md:ml-8 bg-gray-900 rounded-lg p-4 shadow-inner flex flex-col items-start">
                  <div className="text-white mb-2">Share via:</div>
                  <a href={getShareLinks(paste).whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline mb-1">WhatsApp</a>
                  <a href={getShareLinks(paste).instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Paste;

