import { createRoot } from "react-dom/client";

import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Theme from "./middleware/Theme";
import { router } from "./router/Router";
import { LangProvider } from "./providers/LangProvider";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Theme>
    <LangProvider>
      <QueryClientProvider client={queryClient}>
        <AntdApp>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#42BA3D",
              },
            }}
          >
            <RouterProvider router={createBrowserRouter(router)} />
          </ConfigProvider>
        </AntdApp>
      </QueryClientProvider>
    </LangProvider>
  </Theme>
);
