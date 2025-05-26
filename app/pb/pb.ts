import PocketBase, { AuthRecord } from 'pocketbase';
import { useEffect } from 'react';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL as string);
const originalFetch = pb.send.bind(pb);

pb.send = async (path, options = {}) => {
  try {
    const response = await originalFetch(path, options);
    if (response?.code === 401 || response?.code === 403) {
      pb.collection('users').authRefresh();
      // console.warn('Unauthorized! Redirecting to login...');
      // window.localStorage.removeItem('pocketbase_auth');
      // window.location.href = '/login';
    }
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
export { pb };
export function usePocketBase() {
  useEffect(() => {
    // localStorage'dan pocketbase_auth ni olish
    const authData = localStorage.getItem('pocketbase_auth');

    if (authData) {
      const parsedData = JSON.parse(authData);
      if (parsedData?.token && parsedData.token !== 'null') {
        pb.authStore.save(
          parsedData.token,
          parsedData.model as AuthRecord | undefined
        );
      } else {
        pb.authStore.clear();
      }
    } else {
      pb.authStore.clear();
    }
  }, []); // Bo'sh dependency array, chunki biz faqat component mount bo'lganda ishga tushishini xohlaymiz

  return pb;
}
