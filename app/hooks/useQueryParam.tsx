import { useState, useEffect, useContext, createContext } from 'react';
import { useLocation } from 'react-router-dom';

const QueryParamContext = createContext<{ [key: string]: string }>({});

/**
 * QueryParamProvider - bu React komponenti bo'lib,
 * u query parametri uchun kontekst yaratadi.
 * U o'z bolalarini o'z ichiga oladi va
 * query parametrini yangilash uchun hook beradi.
 * Quyida misol keltirilgan:
 *
 * const { foo } = useQueryParam();
 *
 * // foo o'zgaruvchisi foo query parametrining qiymatini saqlaydi
 *
 * @example
 * const App = () => {
 *   const { foo } = useQueryParam();
 *   return <div>foo: {foo}</div>;
 * }
 *
 * export default () => {
 *   return (
 *     <QueryParamProvider>
 *       <App />
 *     </QueryParamProvider>
 *   );
 * }
 */
export const QueryParamProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const [params, setParams] = useState<{ [key: string]: string }>(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: { [key: string]: string } = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newParams: { [key: string]: string } = {};
    for (const [key, value] of searchParams) {
      newParams[key] = value;
    }
    setParams(newParams);
  }, [location.search]);

  return (
    <QueryParamContext.Provider value={params}>
      {children}
    </QueryParamContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQueryParam = () => useContext(QueryParamContext);
