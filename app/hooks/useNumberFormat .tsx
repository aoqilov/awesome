const useNumberFormat = () => {
  const format = (value: number | string): string => {
    const str = value.toString().replace(/\D/g, "");
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return format;
};

export default useNumberFormat;
