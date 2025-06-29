import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMenuData,
  setCategoriesData,
  setLoading,
  setError,
} from '@/store/apiSlice';

export const useApiData = () => {
  const dispatch = useDispatch();
  const { menu, categories, loading, error } = useSelector((state) => state.apiData);
  const lang = useSelector((state) => state.language.lang);

  const fetchData = useCallback(async () => {
    // Only fetch if we don't have data
    if (categories.length > 0 && menu.length > 0) {
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const headers = lang === "ar" ? { "Accept-Language": lang } : {};

      const [categoryResponse, menuResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { headers }),
      ]);

      if (!categoryResponse.ok || !menuResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const categoryResult = await categoryResponse.json();
      const menuResult = await menuResponse.json();

      if (categoryResult?.data?.categories?.length > 0) {
        dispatch(setCategoriesData(categoryResult.data.categories));
      }

      if (menuResult?.data?.length > 0) {
        dispatch(setMenuData(menuResult.data));
      }
    } catch (err) {
      dispatch(setError(err.message || "Unknown error"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, lang, categories.length, menu.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    menu,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
}; 