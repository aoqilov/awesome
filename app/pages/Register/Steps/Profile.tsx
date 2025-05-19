/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, DatePicker, Select } from 'antd';
import { Camera, ChevronRight, User } from 'lucide-react';
import { useTranslation } from '@/hooks/translation';
import {
  type RegisterContextType,
  useRegister,
  itemVariants
} from '../Register';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { payload, handleChange, stateValidation, setPayload } =
    useRegister() as RegisterContextType;
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPayload((prevPayload) => ({
            ...prevPayload,
            avatar: event.target?.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard/home');
  };

  // Animation variants from the imported itemVariants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Check if user is a player
  const isPlayer = payload.userType === 'player';

  // Handle extended field changes
  const handleExtendedChange = (field: string, value: any) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      [field]: value
    }));
  };

  // Handle nested field changes
  const handleNestedChange = (
    parentField: string,
    field: string,
    value: any
  ) => {
    setPayload((prevPayload: any) => ({
      ...prevPayload,
      [parentField]: {
        ...prevPayload[parentField],
        [field]: value
      }
    }));
  };

  // Determine if form is valid based on user type
  const isFormValid = isPlayer
    ? payload.fullName?.trim() &&
      payload.familyName?.trim() &&
      payload.birthDate &&
      payload.birthPlace?.region &&
      payload.birthPlace?.district &&
      payload.residencePlace?.region &&
      payload.residencePlace?.district
    : payload.fullName?.trim();

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex-1 flex flex-col items-center py-8">
        {/* Avatar */}

        <motion.div
          variants={itemVariants}
          className="relative mb-8 mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={handleAvatarClick}
          >
            {payload.avatar ? (
              <img
                src={payload.avatar || '/placeholder.svg'}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-20 w-20 text-gray-400" />
            )}
          </div>
          <div
            className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </motion.div>

        {/* Name Input */}
        <motion.div variants={itemVariants} className="w-full mb-6 px-4">
          <label className="block text-gray-700 text-lg mb-2">
            {t({
              uz: 'Ismingiz:',
              ru: 'Ваше имя:',
              en: 'Your name:'
            })}
          </label>
          <Input
            size="large"
            value={payload.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder={
              t({
                uz: 'Ismingizni kiriting...',
                ru: 'Введите ваше имя...',
                en: 'Enter your name...'
              }) as string
            }
            className="text-lg rounded-lg"
            status={stateValidation.fullName ? 'error' : ''}
          />
          {stateValidation.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {t({
                uz: 'Ismingizni kiriting',
                ru: 'Введите ваше имя',
                en: 'Please enter your name'
              })}
            </p>
          )}
        </motion.div>

        {/* Player-specific fields */}
        {isPlayer && (
          <>
            {/* Family Name */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: 'Familiyangiz:',
                  ru: 'Ваша фамилия:',
                  en: 'Your family name:'
                })}
              </label>
              <Input
                size="large"
                value={payload.familyName || ''}
                onChange={(e) =>
                  handleExtendedChange('familyName', e.target.value)
                }
                placeholder={
                  t({
                    uz: 'Familiyangizni kiriting...',
                    ru: 'Введите вашу фамилию...',
                    en: 'Enter your family name...'
                  }) as string
                }
                className="text-lg rounded-lg"
                status={stateValidation.familyName ? 'error' : ''}
              />
              {stateValidation.familyName && (
                <p className="text-red-500 text-sm mt-1">
                  {t({
                    uz: 'Familiyangizni kiriting',
                    ru: 'Введите вашу фамилию',
                    en: 'Please enter your family name'
                  })}
                </p>
              )}
            </motion.div>

            {/* Birth Date */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: "Tug'ilgan sanangiz:",
                  ru: 'Дата рождения:',
                  en: 'Date of birth:'
                })}
              </label>
              <DatePicker
                size="large"
                value={payload.birthDate}
                onChange={(date) => handleExtendedChange('birthDate', date)}
                placeholder="--/--/----"
                className="w-full text-lg rounded-lg"
                format="DD/MM/YYYY"
                status={stateValidation.birthDate ? 'error' : ''}
              />
              {stateValidation.birthDate && (
                <p className="text-red-500 text-sm mt-1">
                  {t({
                    uz: "Tug'ilgan sanangizni kiriting",
                    ru: 'Введите дату рождения',
                    en: 'Please enter your date of birth'
                  })}
                </p>
              )}
            </motion.div>

            {/* Birth Place */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: "Tug'ilgan joyingiz:",
                  ru: 'Место рождения:',
                  en: 'Place of birth:'
                })}
              </label>
              <div className="space-y-4">
                <Select
                  size="large"
                  value={payload.birthPlace?.region}
                  onChange={(value) =>
                    handleNestedChange('birthPlace', 'region', value)
                  }
                  placeholder={
                    t({
                      uz: 'Viloyat / shahar',
                      ru: 'Область / город',
                      en: 'Region / city'
                    }) as string
                  }
                  className="w-full text-lg rounded-lg"
                  status={stateValidation.birthPlace?.region ? 'error' : ''}
                />
                <Select
                  size="large"
                  value={payload.birthPlace?.district}
                  onChange={(value) =>
                    handleNestedChange('birthPlace', 'district', value)
                  }
                  placeholder={
                    t({
                      uz: 'Tuman / shaharcha',
                      ru: 'Район / городок',
                      en: 'District / town'
                    }) as string
                  }
                  className="w-full text-lg rounded-lg"
                  status={stateValidation.birthPlace?.district ? 'error' : ''}
                />
              </div>
            </motion.div>

            {/* Residence Place */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: 'Yashash manzilingiz:',
                  ru: 'Место проживания:',
                  en: 'Place of residence:'
                })}
              </label>
              <div className="space-y-4">
                <Select
                  size="large"
                  value={payload.residencePlace?.region}
                  onChange={(value) =>
                    handleNestedChange('residencePlace', 'region', value)
                  }
                  placeholder={
                    t({
                      uz: 'Viloyat / shahar',
                      ru: 'Область / город',
                      en: 'Region / city'
                    }) as string
                  }
                  className="w-full text-lg rounded-lg"
                  status={stateValidation.residencePlace?.region ? 'error' : ''}
                />
                <Select
                  size="large"
                  value={payload.residencePlace?.district}
                  onChange={(value) =>
                    handleNestedChange('residencePlace', 'district', value)
                  }
                  placeholder={
                    t({
                      uz: 'Tuman / shaharcha',
                      ru: 'Район / городок',
                      en: 'District / town'
                    }) as string
                  }
                  className="w-full text-lg rounded-lg"
                  status={
                    stateValidation.residencePlace?.district ? 'error' : ''
                  }
                />
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Continue Button */}
      <motion.div variants={itemVariants} className="p-4 mb-4">
        <Button
          type="primary"
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full h-14 rounded-full text-lg font-medium flex items-center justify-center ${
            isFormValid
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-200 text-gray-400'
          }`}
          size="large"
        >
          <span>
            {t({
              uz: 'Kirish',
              ru: 'Войти',
              en: 'Enter'
            })}
          </span>
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
