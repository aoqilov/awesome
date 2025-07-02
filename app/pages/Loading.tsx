import { motion } from "framer-motion";
import BallSvg from "@/assets/svg/ballSvg";

const Loading = () => {
  return (
    <div className="w-full h-[90vh] flex items-center justify-center">
      {/* Loading animation */}
      <div className="w-full flex items-center justify-center flex-col">
        <motion.div
          className="w-14 h-14"
          animate={{
            rotate: [0, 360],
            y: [0, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          <BallSvg />
        </motion.div>
        <p className="animate-pulse text-black font-semibold text-2xl mt-4">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
