import { nanoid } from 'nanoid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addPaste, resetPastes, updatePaste } from '../slice/paste-slice.js';
import { toast } from 'react-hot-toast';    

function Home() {
    const [title, setTitle] = React.useState('');
    const [value, setValue] = React.useState('');
    const [searchparam, setSearchparam] = useSearchParams('');
    const pasteId = searchparam.get('pasteId');
    const dispatch = useDispatch();
    const pastes = JSON.parse(localStorage.getItem('pastes') || '[]');

    // Pre-fill title/content if editing
    React.useEffect(() => {
        if (pasteId) {
            const paste = pastes.find(p => p._id === pasteId);
            if (paste) {
                setTitle(paste.title);
                setValue(paste.content);
            }
        } 
        else {
            setTitle('');
            setValue('');
        }
    }, [pasteId]);

    function handleCreateOrUpdatePaste() {
        const pasteData = {
            title: title,
            content: value,
            _id: pasteId || nanoid(),
            createdAt: new Date().toISOString(),
        };

        if (pasteId) {
            dispatch(updatePaste(pasteData));
        } else {
            dispatch(addPaste(pasteData));
        }

        setTitle('');
        setValue('');
        setSearchparam('');
    }


    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-2">
            <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 tracking-tight drop-shadow-lg">{pasteId ? 'Edit Paste' : 'Paste App Home'}</h1>
            <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-700">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <input
                        id="paste-title"
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-3/5 shadow mr-8 text-lg"
                        aria-label="Paste title"
                    />
                    <button
                        onClick={handleCreateOrUpdatePaste}
                        className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow hover:bg-yellow-500 transition-colors disabled:opacity-50 text-lg"
                        disabled={!title.trim() || !value.trim()}
                    >
                        {pasteId ? 'Update Paste' : 'Create Paste'}
                    </button>
                    {pasteId && (
                        <button
                            onClick={() => window.history.back()}
                            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-4 text-lg font-semibold shadow"
                        >
                            Back
                        </button>
                    )}
                </div>
                <textarea
                    id="paste-content"
                    placeholder="Enter your paste content"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg shadow"
                    aria-label="Paste content"
                />
            </div>
        </div>
    )
}

export default Home
