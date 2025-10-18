import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ className = '' }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement search functionality
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, phụ kiện, dịch vụ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oldCopper-500 focus:border-transparent transition-all duration-300"
          style={{ 
            backgroundColor: '#f9f9f9',
            borderColor: '#d1d5db'
          }}
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm font-medium rounded-md transition-colors duration-300"
          style={{ 
            backgroundColor: '#c47256',
            color: 'white'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#a05a45'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#c47256'}
        >
          Tìm
        </button>
      </div>
    </form>
  );
}
