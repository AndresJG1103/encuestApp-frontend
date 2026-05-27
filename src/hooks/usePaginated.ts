"use client";

import { useCallback, useEffect, useState } from 'react';
import type { PaginatedResult, PaginationParams } from '../types';

interface UsePaginatedOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginatedResult<T, F> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  filters: F;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: F) => void;
  patchFilters: (filters: Partial<F>) => void;
  refetch: () => Promise<void>;
}

export function usePaginated<T, F extends object = Record<string, never>>(
  fetcher: (params: PaginationParams & F) => Promise<PaginatedResult<T>>,
  initialFilters: F = {} as F,
  options: UsePaginatedOptions = {},
): UsePaginatedResult<T, F> {
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 10);
  const [filters, setFilters] = useState<F>(initialFilters);
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<UsePaginatedResult<T, F>['meta']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher({ page, limit, ...filters });
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, limit, filters]);

  useEffect(() => {
    run();
  }, [run]);

  const patchFilters = useCallback((next: Partial<F>) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    page,
    limit,
    filters,
    setPage,
    setLimit,
    setFilters,
    patchFilters,
    refetch: run,
  };
}
