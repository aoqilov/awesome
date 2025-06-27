import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full h-[90vh] flex items-center justify-center">
      {/* Loading animation */}
      <div className="w-full flex items-center justify-center flex-col ">
        <motion.img
          src="https://i.pinimg.com/736x/47/8b/c1/478bc151f6e603ae203e6b07341eec45.jpg"
          alt="loading ball"
          //   className="w-16 h-16 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          className="w-14 h-14 rounded-full"
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
        />
        <p className="text-black font-semibold text-2xl">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
