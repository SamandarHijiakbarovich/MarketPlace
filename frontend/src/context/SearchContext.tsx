import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CatKey } from '../types/shop';

export type CategoryFilter = 'all' | CatKey;
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

interface SearchContextValue {
  search: string;
  setSearch: (v: string) => void;
  category: CategoryFilter;
  setCategory: (c: CategoryFilter) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  page: number;
  setPage: (p: number) => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

// Katalog filtr holati (qidiruv/kategoriya/saralash/sahifa) sahifalar orasida saqlanib qolishi uchun
export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearchRaw] = useState('');
  const [category, setCategoryRaw] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [page, setPage] = useState(1);

  // Qidiruv yoki kategoriya o'zgarsa 1-sahifaga qaytamiz
  const setSearch = (v: string) => {
    setSearchRaw(v);
    setPage(1);
  };
  const setCategory = (c: CategoryFilter) => {
    setCategoryRaw(c);
    setPage(1);
  };
  const clearFilters = () => {
    setSearchRaw('');
    setCategoryRaw('all');
    setPage(1);
  };

  return (
    <SearchContext.Provider value={{ search, setSearch, category, setCategory, sort, setSort, page, setPage, clearFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch SearchProvider ichida ishlatilishi kerak');
  return ctx;
}
