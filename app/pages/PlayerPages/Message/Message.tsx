import { useTranslation } from "@/hooks/translation";

const Message = () => {
  const t = useTranslation();
  return (
    <div>
      {t({
        uz: "Message tayyor bolsa habar beramiz",
        en: "We will notify you when the message is ready",
        ru: "Мы сообщим вам, когда сообщение будет готово",
      })}
    </div>
  );
};

export default Message;
