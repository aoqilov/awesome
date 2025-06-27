/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import UploadSvg from "@/assets/svg/UploadSvg";
import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";

export default function ProfileEdit() {
  const t = useTranslation();
  const [form] = Form.useForm();

  const [avatar, setAvatar] = useState<string | null>(null); // base64 rasm
  const [avatarReady, setAvatarReady] = useState(false); // submit faollashtirish flag

  const handleImageChange = (info: any) => {
    const file = info.fileList?.[0]?.originFileObj as File;

    if (!file) {
      message.error("Faylni yuklab bo‘lmadi.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string); // base64 preview
      setAvatarReady(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFinish = (values: any) => {
    if (!avatar) {
      message.error(
        t({
          uz: "Iltimos, rasm tanlang.",
          en: "Please select an image.",
          ru: "Пожалуйста, выберите изображение.",
        })
      );
      return;
    }

    const payload = {
      ...values,
      avatar,
    };

    console.log("Yuborilayotgan payload:", payload);
    message.success(
      t({
        uz: "Ma'lumotlar saqlandi!",
        en: "Data saved!",
        ru: "Данные сохранены!",
      })
    );
  };

  return (
    <div className="w-full p-4 rounded-xl">
      {/* header */}
      <div className="flex items-center justify-center mb-3 relative">
        <span className="cursor-pointer absolute left-0">
          <BackBtn />
        </span>
        <h2 className="text-lg font-semibold">
          {t({
            uz: "Ma'lumotlarni tahrirlash",
            ru: "Редактирование данных",
            en: "Edit Profile",
          })}
        </h2>
      </div>

      {/* avatar preview va upload */}
      <div className="flex justify-center mb-4 relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img
            src={avatar || "https://randomuser.me/api/portraits/men/75.jpg"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleImageChange}
          accept="image/*"
        >
          <span className="absolute bottom-0 right-33 bg-white w-8 h-8 rounded-full cursor-pointer border-2 border-green-500 flex items-center justify-center">
            <UploadSvg width={20} />
          </span>
        </Upload>
      </div>

      {/* form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ism: "Abrorjon",
          familiya: "Turg'unboyev",
          sana: "1997-04-16",
          telefon: "+998 91 797 74 97",
          joy: "Farg'ona viloyati, Bag'dod tumani",
          manzil: "Toshkent shahri, Chilonzor tumani",
        }}
      >
        <Form.Item
          name="ism"
          label={t({ uz: "Ism", en: "First Name", ru: "Имя" })}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="familiya"
          label={t({
            uz: "Familiya",
            ru: "Фамилия",
            en: "Last Name",
          })}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="sana"
          label={t({
            uz: "Tug'ilgan sana",
            ru: "Дата рождения",
            en: "Date of Birth",
          })}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="telefon"
          label={t({
            uz: "Telefon raqami",
            ru: "Номер телефона",
            en: "Phone Number",
          })}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="joy"
          label={t({
            uz: "Tug'ilgan joyi",
            ru: "Место рождения",
            en: "Place of Birth",
          })}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="manzil"
          label={t({
            uz: "Yashash manzili",
            ru: "Адрес проживания",
            en: "Address",
          })}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ marginTop: 30 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-green-500 hover:bg-green-600 text-white"
            style={{ height: 48, borderRadius: "8px" }}
            disabled={!avatarReady}
          >
            {t({
              uz: "Saqlash",
              ru: "Сохранить",
              en: "Save",
            })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
