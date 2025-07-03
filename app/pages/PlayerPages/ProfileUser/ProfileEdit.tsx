/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Upload, Button, message } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import dayjs from "dayjs";
import { useTranslation } from "@/hooks/translation";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import {
  UsersRecord,
  CitiesRecord,
  RegionsRecord,
} from "@/types/pocketbaseTypes";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useNavigate } from "react-router-dom";
import BackBtn from "@/components/ui/back-btn";

export default function ProfileEdit() {
  const [form] = Form.useForm();
  const t = useTranslation();
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
  const { one, patch } = usePocketBaseCollection<UsersRecord>("users");
  const { list: listRegions } =
    usePocketBaseCollection<RegionsRecord>("regions");
  const { list: listCities } = usePocketBaseCollection<CitiesRecord>("cities");
  const { getFileUrl } = usePocketBaseFile();

  const { data: user } = one(userId);
  const { data: regions } = listRegions({ expand: "name" });
  const { data: cities } = listCities({ expand: "name" });

  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bornRegion, setBornRegion] = useState<string | undefined>();
  const [liveRegion, setLiveRegion] = useState<string | undefined>();
  const [isFormValid, setIsFormValid] = useState(false);

  const { mutate: updateUser, isPending } = patch();

  useEffect(() => {
    if (!user || !cities) return;

    const avatarUrl = user.avatar
      ? getFileUrl("users", user.id, user.avatar)
      : null;
    setPreview(avatarUrl);

    const bornCityRecord = cities.find((c) => c.id === user.bornCity);
    const liveCityRecord = cities.find((c) => c.id === user.liveCity);

    if (bornCityRecord?.region) setBornRegion(bornCityRecord.region);
    if (liveCityRecord?.region) setLiveRegion(liveCityRecord.region);

    const [firstName = "", lastName = ""] = user.fullname?.split(" ") ?? [];

    form.setFieldsValue({
      fullname: firstName,
      lastName,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate ? dayjs(user.birthDate) : null,
      bornCity: user.bornCity,
      liveCity: user.liveCity,
    });

    const initialValues = {
      fullname: firstName,
      lastName,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      bornCity: user.bornCity,
      liveCity: user.liveCity,
    };
    const allFilled = Object.values(initialValues).every(Boolean);
    setIsFormValid(allFilled);
  }, [user, cities]);

  const handleBeforeUpload = (file: RcFile) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    return false;
  };

  const handleValuesChange = (_: any, allValues: any) => {
    const requiredFields = [
      "fullname",
      "lastName",
      "phoneNumber",
      "birthDate",
      "bornCity",
      "liveCity",
    ];
    const allFilled = requiredFields.every((field) => !!allValues[field]);
    setIsFormValid(allFilled);
  };

  const onFinish = async (values: any) => {
    const fullNameCombined = `${values.fullname} ${values.lastName}`.trim();

    const payload: Partial<UsersRecord> = {
      fullname: fullNameCombined,
      phoneNumber: values.phoneNumber,
      birthDate: values.birthDate?.toISOString(),
      bornCity: values.bornCity,
      liveCity: values.liveCity,
    };

    if (imageFile) {
      (payload as any).avatar = imageFile;
    }

    await updateUser(
      { id: userId, data: payload },
      {
        onSuccess: () => {
          message.success(t({ uz: "Saqlandi", ru: "Сохранено", en: "Saved" }));
        },
        onError: () => {
          message.error(t({ uz: "Xatolik", ru: "Ошибка", en: "Error" }));
        },
      }
    );
    navigate(`/client/profile?chat_id=${chat_id || ""}`);
  };

  if (!userId) return null;

  return (
    <div className="w-full px-4">
      <div className="relative flex justify-center">
        <span className="absolute left-0">
          <BackBtn />
        </span>
        <h2 className="text-lg font-semibold mb-4">
          {t({
            uz: "Profilni tahrirlash",
            ru: "Редактировать профиль",
            en: "Edit Profile",
          })}
        </h2>
      </div>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        <div className="mb-6  flex justify-center">
          <div className="relative w-24 h-24">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserOutlined style={{ fontSize: 36, color: "#aaa" }} />
              )}
            </div>
            <Upload
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
              accept="image/*"
            >
              <div className="absolute bottom-0 right-0 bg-white w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 cursor-pointer hover:bg-gray-100">
                <PlusOutlined style={{ fontSize: 12 }} />
              </div>
            </Upload>
          </div>
        </div>

        <Form.Item
          label={t({ uz: "Ism", ru: "Имя", en: "First Name" })}
          name="fullname"
          rules={[
            {
              required: true,
              message: t({
                uz: "Ism kiriting",
                ru: "Введите имя",
                en: "Enter name",
              }),
            },
          ]}
        >
          <Input size="middle" />
        </Form.Item>

        <Form.Item
          label={t({ uz: "Familiya", ru: "Фамилия", en: "Last Name" })}
          name="lastName"
          rules={[
            {
              required: true,
              message: t({
                uz: "Familiya kiriting",
                ru: "Введите фамилию",
                en: "Enter last name",
              }),
            },
          ]}
        >
          <Input size="middle" />
        </Form.Item>

        <Form.Item
          label={t({
            uz: "Telefon raqam",
            ru: "Номер телефона",
            en: "Phone number",
          })}
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: t({
                uz: "Telefon kiriting",
                ru: "Введите телефон",
                en: "Enter phone",
              }),
            },
          ]}
        >
          <Input size="middle" />
        </Form.Item>

        <Form.Item
          label={t({
            uz: "Tug‘ilgan sana",
            ru: "Дата рождения",
            en: "Birth date",
          })}
          name="birthDate"
          rules={[
            {
              required: true,
              message: t({
                uz: "Sanani tanlang",
                ru: "Выберите дату",
                en: "Select date",
              }),
            },
          ]}
        >
          <DatePicker size="middle" className="w-full" format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item
          label={t({
            uz: "Tug‘ilgan viloyat",
            ru: "Регион рождения",
            en: "Born Region",
          })}
        >
          <Select
            size="middle"
            value={bornRegion}
            onChange={(val) => {
              setBornRegion(val);
              form.setFieldValue("bornCity", undefined);
            }}
            options={
              regions?.map((r) => ({
                label: t({
                  uz: r.expand?.name?.uz || "",
                  ru: r.expand?.name?.ru || "",
                  en: r.expand?.name?.eng || "",
                }),
                value: r.id,
              })) || []
            }
          />
        </Form.Item>

        <Form.Item
          name="bornCity"
          rules={[
            {
              required: true,
              message: t({
                uz: "Shahar tanlang",
                ru: "Выберите город",
                en: "Select city",
              }),
            },
          ]}
        >
          <Select
            size="middle"
            disabled={!bornRegion}
            options={
              cities
                ?.filter((c) => c.region === bornRegion)
                .map((c) => ({
                  label: t({
                    uz: c.expand?.name?.uz || "",
                    ru: c.expand?.name?.ru || "",
                    en: c.expand?.name?.eng || "",
                  }),
                  value: c.id,
                })) || []
            }
          />
        </Form.Item>

        <Form.Item
          label={t({
            uz: "Yashash viloyati",
            ru: "Регион проживания",
            en: "Live Region",
          })}
        >
          <Select
            size="middle"
            value={liveRegion}
            onChange={(val) => {
              setLiveRegion(val);
              form.setFieldValue("liveCity", undefined);
            }}
            options={
              regions?.map((r) => ({
                label: t({
                  uz: r.expand?.name?.uz || "",
                  ru: r.expand?.name?.ru || "",
                  en: r.expand?.name?.eng || "",
                }),
                value: r.id,
              })) || []
            }
          />
        </Form.Item>

        <Form.Item
          name="liveCity"
          rules={[
            {
              required: true,
              message: t({
                uz: "Shahar tanlang",
                ru: "Выберите город",
                en: "Select city",
              }),
            },
          ]}
        >
          <Select
            size="middle"
            disabled={!liveRegion}
            options={
              cities
                ?.filter((c) => c.region === liveRegion)
                .map((c) => ({
                  label: t({
                    uz: c.expand?.name?.uz || "",
                    ru: c.expand?.name?.ru || "",
                    en: c.expand?.name?.eng || "",
                  }),
                  value: c.id,
                })) || []
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            disabled={!isFormValid}
            block
          >
            {t({ uz: "Saqlash", ru: "Сохранить", en: "Save" })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
