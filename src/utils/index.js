import { useCallback, useState } from 'react';
import axios from 'axios'

export default function useLoadedData({
  loadURL,
  getDataFromResponseFn = (res) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(res?.data, "text/html");
    return htmlDoc;
  },
  initialLoading = true,
  initialData = null,
}) {

  const [isLoading, setIsLoading] = useState(initialLoading); //helps to add spinner in future
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const result = await axios.get(loadURL);
        setData(getDataFromResponseFn(result));
      } catch (loadError) {
        setError(loadError);
        console.error(loadError);
      } finally {
        setIsLoading(false);
      }
    },
    [getDataFromResponseFn, loadURL]
  );

  return {
    isLoading,
    data,
    error,
    loadData,
    setData,
  };
}