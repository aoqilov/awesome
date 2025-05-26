/* eslint-disable react-hooks/rules-of-hooks */
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePocketBase } from './pb';
import { useInView } from 'react-intersection-observer';

/**
 * usePocketBaseCollection funksiyasi - PocketBase kolleksiyasi bilan ishlash uchun turli
 * funksiyalarni o'z ichiga olgan hook.
 *
 * @param collection - Kolleksiya nomi.
 * @returns
 * - list: Kolleksiyadagi barcha yozuvlarni olish uchun funksiya.
 * - one: Berilgan ID bo'yicha bitta yozuvni olish uchun funksiya.
 * - create: Yangi yozuv yaratish uchun funksiya.
 * - update: Berilgan ID bo'yicha yozuvni yangilash uchun funksiya.
 * - patch: Berilgan ID bo'yicha yozuvni qisman yangilash uchun funksiya.
 * - remove: Berilgan ID bo'yicha yozuvni o'chirish uchun funksiya.
 * - subscribe: Kolleksiyadagi o'zgarishlarni kuzatib borish uchun obuna funksiyasi.
 * - infinity: Cheksiz scroll amalga oshirish uchun funksiya.
 *
 * @example
 * const { list, create, update, remove } = usePocketBaseCollection('products');
 * // Mahsulotlar ro'yxatini olish
 * const { data, isLoading } = list();
 * // Yangi mahsulot yaratish
 * create().mutate({ name: 'Yangi Mahsulot' });
 */

export function usePocketBaseCollection<T>(collection: string) {
  const pb = usePocketBase();
  const queryClient = useQueryClient();

  const list = () =>
    useQuery<T[]>({
      queryKey: [collection],
      queryFn: () =>
        pb.collection(collection).getFullList<T>({ sort: '-created' })
    });

  const one = (id: string) =>
    useQuery<T>({
      queryKey: [collection, id],
      queryFn: () => pb.collection(collection).getOne<T>(id),
      enabled: !!id
    });

  const create = () =>
    useMutation({
      mutationFn: (data: Partial<T>) =>
        pb.collection(collection).create<T>(data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection] })
    });

  const update = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
        pb.collection(collection).update<T>(id, data),
      onSuccess: (_, vars) =>
        queryClient.invalidateQueries({ queryKey: [collection, vars.id] })
    });

  const patch = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
        pb.collection(collection).update<T>(id, data),
      onSuccess: (_, vars) =>
        queryClient.invalidateQueries({ queryKey: [collection, vars.id] })
    });

  const remove = () =>
    useMutation({
      mutationFn: (id: string) => pb.collection(collection).delete(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection] })
    });

  const subscribe = (cb: (data: { action: string; record: T }) => void) => {
    useEffect(() => {
      pb.collection(collection).subscribe<T>('*', cb);

      return () => {
        pb.collection(collection).unsubscribe('*');
      };
    }, [cb]);
  };
  const infinity = () => {
    const { ref, inView } = useInView({ threshold: 1 });

    const query = useInfiniteQuery({
      queryKey: [collection, 'infinite'],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const limit = 10;
        const result = await pb
          .collection(collection)
          .getList<T>(pageParam, limit, {
            sort: '-created'
          });
        return result;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      }
    });

    useEffect(() => {
      if (inView && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    }, [inView, query, query.hasNextPage, query.isFetchingNextPage]);

    return {
      ...query,
      ref
    };
  };
  return {
    list,
    one,
    create,
    update,
    patch,
    remove,
    subscribe,
    infinity
  };
}
