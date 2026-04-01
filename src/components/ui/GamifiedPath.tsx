import React from 'react';
import { motion } from 'motion/react';

export const GamifiedPath = () => {
  const phases = [
    { 
      title: "Problem Discovery", 
      desc: "Identify deep-rooted challenges.", 
      img: "/Businessman-rafiki.png",
      color: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
      delay: 0.1
    },
    { 
      title: "Stakeholder Mapping", 
      desc: "Engage with NGOs.", 
      img: "/Team-cuate.png",
      color: "from-pink-500 to-rose-600",
      borderColor: "border-pink-500",
      textColor: "text-pink-600",
      delay: 0.2
    },
    { 
      title: "Solution Design", 
      desc: "Build scalable models.", 
      img: "/Pair programming-pana.png",
      color: "from-orange-400 to-red-500",
      borderColor: "border-orange-500",
      textColor: "text-orange-500",
      delay: 0.3
    },
    { 
      title: "Impact Metrics", 
      desc: "Measure your success.", 
      img: "/Visual data-pana.png",
      color: "from-yellow-400 to-amber-500",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-500",
      delay: 0.4
    },
    { 
      title: "Resource Allocation", 
      desc: "Manage budgets effectively.", 
      img: "/Company-cuate.png",
      color: "from-lime-400 to-green-500",
      borderColor: "border-lime-500",
      textColor: "text-lime-600",
      delay: 0.5
    },
    { 
      title: "Crisis Management", 
      desc: "Navigate roadblocks.", 
      img: "/In progress-bro.png",
      color: "from-emerald-400 to-teal-500",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-600",
      delay: 0.6
    },
    { 
      title: "The Pitch", 
      desc: "Present to investors.", 
      img: "/Pitch meeting-bro.png",
      color: "from-fuchsia-500 to-purple-600",
      borderColor: "border-purple-500",
      textColor: "text-purple-600",
      delay: 0.7
    }
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center">
      <div className="flex flex-col gap-[80px] w-full relative z-10">
        <div className="absolute top-[80px] bottom-[140px] left-1/2 -translate-x-1/2 w-[220px] border-[20px] rounded-[100px] border-gray-100 z-0 transition-opacity"></div>
        {/* Inside zig-zagger (creates the 'S' shape by hiding borders) */}
        <div className="absolute top-[80px] bottom-[140px] left-[50%] w-[110px] bg-white z-10 hidden md:block" style={{
            maskImage: "linear-gradient(to bottom, black 14%, transparent 14%, transparent 28%, black 28%, black 43%, transparent 43%, transparent 57%, black 57%, black 71%, transparent 71%, transparent 85%, black 85%)"
        }}></div>
        {phases.map((phase, index) => {
          // Determine alternating layout
          const isLeft = index % 2 === 0;
          return (
            <div key={index} className={`flex w-full items-center justify-center relative z-10 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
              
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: phase.delay, type: 'spring' }}
                className={`relative w-full max-w-[500px] flex flex-col items-center sm:flex-row gap-6 p-2 rounded-[60px] ${!isLeft ? 'sm:flex-row-reverse text-right' : ''}`}
              >
                {/* Node Connector (Connector dot on the path) */}
                <div className={`hidden md:block absolute top-[50%] -translate-y-1/2 w-8 h-8 rounded-full border-4 bg-white z-20 ${phase.borderColor} ${isLeft ? '-right-[100px]' : '-left-[100px]'} shadow-md`}></div>

                {/* Horizontal Bar Connector SVG (connects node to box) */}
                <svg className={`hidden md:block absolute top-[50%] -translate-y-1/2 w-[120px] h-[5px] -z-10 ${isLeft ? '-right-[90px]' : '-left-[90px]'}`} preserveAspectRatio="none" viewBox="0 0 100 10" fill="none">
                    <path d="M0,5 L100,5" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-gray-200"/>
                </svg>

                {/* Image Bubble w/ Solid Colored Gamified Ring */}
                <div className={`relative w-36 h-36 md:w-[180px] md:h-[180px] flex-shrink-0 rounded-full border-[16px] shadow-lg flex items-center justify-center p-3 z-20 bg-white ${phase.borderColor}`}>
                    <img src={phase.img} alt={phase.title} className="w-full h-full object-contain hover:scale-110 transition-transform" />
                </div>
                
                {/* Text Content */}
                <div className={`flex flex-col flex-1 ${!isLeft ? 'sm:items-end' : 'sm:items-start'} px-2 z-20`}>
                    <h3 className={`text-xl md:text-2xl font-black ${phase.textColor}`}>
                      {phase.title}
                    </h3>
                    <p className="text-gray-500 font-medium mt-1">
                      {phase.desc}
                    </p>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div className="flex w-full items-center justify-center mt-4">
          <div className="text-center font-bold text-xl md:text-2xl text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-xl px-10 py-5 rounded-full z-20 hover:scale-105 transition-transform cursor-default border-4 border-white ring-4 ring-purple-200">
            Launch! 🚀
          </div>
        </div>
      </div>
    </div>
  );
};