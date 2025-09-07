'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  className?: string;
}

export function SearchBar({ 
  placeholder = 'Search...', 
  onSearch, 
  onFilter,
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn('flex space-x-2', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white text-opacity-60" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      
      {onFilter && (
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onFilter}
          className="px-4"
        >
          <Filter className="w-4 h-4" />
        </Button>
      )}
    </form>
  );
}
