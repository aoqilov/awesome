import TelegramSvg from "./TelegramSvg";
import InstagramSvg from "./InstagramSvg";
import FacebookSvg from "./FacebookSvg";
import YoutubeSvg from "./YoutubeSvg";

const ForMappingSocialSvg: Record<string, React.ReactNode> = {
  telegram: <TelegramSvg activeColor={true} />,
  instagram: <InstagramSvg activeColor={true} />,
  facebook: <FacebookSvg activeColor={true} />,
  youtube: <YoutubeSvg activeColor={true} />,
};
export default ForMappingSocialSvg;
