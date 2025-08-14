import React from 'react'
import { NavLink } from 'react-router-dom'

function Navber() {
    return (
        <nav className="flex items-center justify-between px-8 py-3 bg-gradient-to-r from-black via-gray-900 to-black shadow-lg border-b-2 border-blue-900">
            <div className="flex items-center gap-6">
                <span className="text-2xl font-extrabold text-blue-400 tracking-tight select-none">PasteX</span>
                <NavLink to="/" className={({ isActive }) =>
                    `text-base font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-900 text-blue-300 shadow' : 'text-white hover:bg-blue-900 hover:text-blue-400'}`
                }>Home</NavLink>
                <NavLink to="/paste" className={({ isActive }) =>
                    `text-base font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-900 text-blue-300 shadow' : 'text-white hover:bg-blue-900 hover:text-blue-400'}`
                }>Paste</NavLink>
            </div>
        </nav>
    )
}

export default Navber
