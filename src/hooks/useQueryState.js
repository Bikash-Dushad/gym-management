// hooks/useQueryState.js
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function useQueryState(initialQuery) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => ({
    status: searchParams.get("status") || initialQuery.status || "all",
    name: searchParams.get("name") || initialQuery.name || "",
    page: Number(searchParams.get("page")) || initialQuery.page || 1,
    limit: Number(searchParams.get("limit")) || initialQuery.limit || 10,
  }));

  // Update URL when query changes
  const updateQuery = useCallback(
    (newQuery) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newQuery).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Update specific fields
  const setQueryField = useCallback(
    (field, value) => {
      setQuery((prev) => {
        const newQuery = { ...prev, [field]: value };
        updateQuery(newQuery);
        return newQuery;
      });
    },
    [updateQuery],
  );

  // Batch update
  const setQueryBatch = useCallback(
    (updates) => {
      setQuery((prev) => {
        const newQuery = { ...prev, ...updates };
        updateQuery(newQuery);
        return newQuery;
      });
    },
    [updateQuery],
  );

  // Sync with URL changes
  useEffect(() => {
    const newQuery = {
      status: searchParams.get("status") || initialQuery.status || "all",
      name: searchParams.get("name") || initialQuery.name || "",
      page: Number(searchParams.get("page")) || initialQuery.page || 1,
      limit: Number(searchParams.get("limit")) || initialQuery.limit || 10,
    };
    setQuery(newQuery);
  }, [searchParams, initialQuery]);

  return { query, setQueryField, setQueryBatch };
}
