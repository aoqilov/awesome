import { useNavigate, useLocation } from "react-router-dom";
import { useQueryParam } from "./useQueryParam";

export const useNavigateWithChatId = () => {
  const n = useNavigate();
  const { pathname } = useLocation();
  const { chat_id } = useQueryParam();

  const navigate = (pathName: string | number) => {
    n(pathName + (pathname.includes("?") ? "&" : "?") + `chat_id=${chat_id}`);
  };

  return { navigate, chat_id, n, pathname };
};
