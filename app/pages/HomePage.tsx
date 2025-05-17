import { Select } from 'antd';
import { useLang } from '@/providers/LangProvider';
import { useTranslation } from '@/hooks/translation';

const HomePage = () => {
  const { lang, setLang } = useLang();

  const handleLangChange = (value: string) => {
    setLang(value);
  };
  const t = useTranslation();
  return (
    <div>
      <Select
        value={lang}
        style={{ width: 120 }}
        onChange={handleLangChange}
        options={[
          {
            value: 'uz',
            label: 'Uzbek'
          },
          {
            value: 'en',
            label: 'English'
          },
          {
            value: 'ru',
            label: 'Russian'
          }
        ]}
      />
      <div>{t({ uz: 'AsosiySahifa', en: 'Main page', ru: 'Главная' })}</div>
    </div>
  );
};

export default HomePage;
