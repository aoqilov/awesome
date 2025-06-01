/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from 'framer-motion';
import { ConfigProvider, Table } from 'antd';
import { ChevronLeft } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import shoe from '@/assets/shoe.png';
import TimeRange from '../components/TimeRange';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigateWithChatId } from '@/hooks/useNavigate';
const hours = [
  '00 - 01',
  '01 - 02',
  '02 - 03',
  '03 - 04',
  '04 - 05',
  '05 - 06',
  '06 - 07',
  '07 - 08',
  '08 - 09',
  '09 - 10',
  '10 - 11',
  '11 - 12',
  '12 - 13',
  '13 - 14',
  '14 - 15',
  '15 - 16',
  '16 - 17',
  '17 - 18',
  '18 - 19',
  '19 - 20',
  '20 - 21',
  '21 - 22',
  '22 - 23',
  '23 - 00'
];
const currentHour = new Date().getHours();
const currentTime = `${currentHour < 10 ? '0' : ''}${currentHour} - ${
  currentHour + 1 < 10 ? '0' : ''
}${currentHour + 1}`;

const fields = [1, 2, 3, 4, 5, 6, 11];

const generateColumns = (): ColumnsType<any> => [
  {
    title: (
      <div className="p-1 pl-2 bg-white">
        <h1 className=" h-full  bg-gray-50 min-w-[80px] w-full  w-f rounded-sm py-1 px-2 flex items-center justify-center">
          Vaqtlar
        </h1>
      </div>
    ),
    dataIndex: 'time',
    fixed: 'left',
    width: 80,
    render: (text) => (
      <div
        className={
          text === currentTime
            ? ' border-l-3 border-green-500 text-[#42BA3D] p-1 h-[30px] bg-white'
            : 'p-1 h-[30px] bg-white'
        }
      >
        {text === currentTime ? (
          <div className=" top-1.5 left-[3px] absolute h-[20px] bg-[#ECFCE2] w-[89px]"></div>
        ) : null}
        <div
          className={`time-cell w-[80px]  ${
            currentTime === text ? 'bg-[#ECFCE5]' : 'bg-gray-50/90'
          } h-[32px] absolute top-0 left-2  rounded-md py-1 px-2 flex items-center justify-center`}
        >
          {text}
        </div>
      </div>
    )
  },
  ...fields.map((f) => ({
    title: (
      <div className=" bg-gray-50 m-1  min-w-[60px] rounded-md py-1 px-2 flex  justify-center  gap-2 items-center">
        <img src={shoe} alt="shoe" className="icon" width={30} />
        {f}
      </div>
    ),

    dataIndex: `field${f}`,

    render: (value: 'active' | 'busy', row: any) => {
      return (
        <div className={`relative  w-full h-full ${row.time === currentTime}`}>
          {row.time === currentTime && (
            <div className="absolute -top-[11px] left-0 w-full  bg-[#ECFCE5]  z-0.5 h-[20px] "></div>
          )}
          <div
            className={` ${
              value === 'active'
                ? 'bg-[#ECFCE5] text-[#42BA3D]'
                : value === 'busy'
                ? 'bg-[#FFE5E5] text-[#FF5247]'
                : value === 'pause'
                ? 'bg-[#FFEFD7] text-[#FFB300]'
                : 'bg-gray-50 text-gray-500'
            }  absolute  z-[1.5] -top-[1.3rem] left-0  bottom-0 right-0  h-[32px] m-1 rounded-sm py-1 px-2 flex items-center justify-center`}
          >
            {value === 'active' ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_23_6198)">
                      <path
                        d="M9.00018 17.1818C13.5189 17.1818 17.182 13.5187 17.182 9C17.182 4.4813 13.5189 0.818176 9.00018 0.818176C4.48148 0.818176 0.818359 4.4813 0.818359 9C0.818359 13.5187 4.48148 17.1818 9.00018 17.1818Z"
                        stroke="#42BA3D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <g clip-path="url(#clip1_23_6198)">
                      <path
                        d="M13 6L7.5 12L5 9.27273"
                        stroke="#42BA3D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_6198">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                      <clipPath id="clip1_23_6198">
                        <rect
                          width="10"
                          height="8"
                          fill="white"
                          transform="translate(4 5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            ) : value === 'busy' ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-red-500">
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_23_4051)">
                      <path
                        d="M15.1109 17.1004V15.3004C15.1109 14.3456 14.7363 13.4299 14.0695 12.7548C13.4027 12.0797 12.4983 11.7004 11.5553 11.7004H4.44423C3.50124 11.7004 2.59687 12.0797 1.93007 12.7548C1.26327 13.4299 0.888672 14.3456 0.888672 15.3004V17.1004"
                        stroke="#FF5247"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.99978 8.10039C9.96346 8.10039 11.5553 6.48862 11.5553 4.50039C11.5553 2.51217 9.96346 0.900391 7.99978 0.900391C6.0361 0.900391 4.44423 2.51217 4.44423 4.50039C4.44423 6.48862 6.0361 8.10039 7.99978 8.10039Z"
                        stroke="#FF5247"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_4051">
                        <rect width="16" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            ) : value === 'pause' ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-yellow-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_23_4107)">
                      <path
                        d="M7.36381 11.4545V6.54545M10.6365 11.4545V6.54545M17.182 8.99999C17.182 13.5187 13.5189 17.1818 9.00018 17.1818C4.48148 17.1818 0.818359 13.5187 0.818359 8.99999C0.818359 4.4813 4.48148 0.818176 9.00018 0.818176C13.5189 0.818176 17.182 4.4813 17.182 8.99999Z"
                        stroke="#FFD188"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_4107">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_23_4181)">
                    <path
                      d="M15.1109 17.1004V15.3004C15.1109 14.3456 14.7363 13.4299 14.0695 12.7548C13.4027 12.0797 12.4983 11.7004 11.5553 11.7004H4.44423C3.50124 11.7004 2.59687 12.0797 1.93007 12.7548C1.26327 13.4299 0.888672 14.3456 0.888672 15.3004V17.1004"
                      stroke="#CDCFD0"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.99978 8.10039C9.96346 8.10039 11.5553 6.48862 11.5553 4.50039C11.5553 2.51217 9.96346 0.900391 7.99978 0.900391C6.0361 0.900391 4.44423 2.51217 4.44423 4.50039C4.44423 6.48862 6.0361 8.10039 7.99978 8.10039Z"
                      stroke="#CDCFD0"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_23_4181">
                      <rect width="16" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        </div>
      );
    }
  }))
];

const data = hours.map((hour, i) => {
  const row: Record<string, any> = {
    key: i,
    time: hour
  };
  fields.forEach((field) => {
    const randomStatus =
      Math.random() < 0.25
        ? 'active'
        : Math.random() < 0.5
        ? 'busy'
        : Math.random() < 0.75
        ? 'pause'
        : 'closed';
    row[`field${field}`] = randomStatus;
  });

  return row;
});
const Schedule = () => {
  const { navigate } = useNavigateWithChatId();
  const [date, setDate] = useState(dayjs(new Date()));
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: 'white',
            headerColor: '#000',
            borderColor: 'transparent',
            rowHoverBg: 'transparent',
            rowSelectedBg: 'transparent',
            cellPaddingBlock: 2,
            cellPaddingInline: 0
          }
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-2 text-center text-xl font-semibold">
          Jadval
          <div
            className="absolute left-0 top-0 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </div>
        </div>

        <TimeRange value={date} onChange={(date: any) => setDate(date)} />
        <div className="bg-white p-2 rounded-xl">
          <Table
            columns={generateColumns()}
            dataSource={data}
            pagination={false}
            scroll={{ x: true }}
            bordered={false}
            className="custom-table"
          />
        </div>
        <div className="text-center text-gray-500 mt-4">
          Zarur vaqt oralig’ini tanlang!
        </div>
        <button
          className="w-full mt-2 bg-gray-300 text-gray-600 py-2 rounded-md font-semibold"
          disabled
        >
          Davom etish →
        </button>
      </motion.div>
    </ConfigProvider>
  );
};

export default Schedule;
