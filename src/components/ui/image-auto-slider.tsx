import React from 'react';
import { motion } from 'motion/react'; // Kept since HomeView uses it in other places if needed, but not strictly required here

export const ImageAutoSlider = () => {
  // Our phases for the simulation, now paired with your downloaded illustrations
  const phases = [
    { 
      title: "Problem Discovery", 
      desc: "Identify deep-rooted social challenges.", 
      img: "/Businessman-rafiki.png" 
    },
    { 
      title: "Stakeholder Mapping", 
      desc: "Engage with NGOs and governments.", 
      img: "/Team-cuate.png" 
    },
    { 
      title: "Solution Design", 
      desc: "Build sustainable, scalable models.", 
      img: "/Pair programming-pana.png" 
    },
    { 
      title: "Impact Metrics", 
      desc: "Define how success is measured.", 
      img: "/Visual data-pana.png" 
    },
    { 
      title: "Resource Allocation", 
      desc: "Manage limited budgets effectively.", 
      img: "/Company-cuate.png" 
    },
    { 
      title: "Crisis Management", 
      desc: "Navigate unexpected roadblocks.", 
      img: "/In progress-bro.png" 
    },
    { 
      title: "The Pitch", 
      desc: "Present your vision to investors.", 
      img: "/Pitch meeting-bro.png" 
    }
  ];

  // Duplicate for seamless loop
  const duplicatedPhases = [...phases, ...phases, ...phases]; // Extra dupe for smoother wide-screen looping

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Scroll exactly one set of the items */
            transform: translateX(calc(-100% / 3));
          }
        }

        .infinite-scroll {
          animation: scroll-left 30s linear infinite;
          width: max-content;
        }
          
        .infinite-scroll:hover {
          animation-play-state: paused;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          overflow: hidden;
        }

        .phase-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .phase-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
      <div className="w-full relative overflow-hidden flex items-center justify-center py-10">
        
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="scroll-container w-full max-w-7xl mx-auto px-4">
            <div className="infinite-scroll flex gap-6">
              {duplicatedPhases.map((phase, index) => (
                <div
                  key={index}
                  className="phase-card flex-shrink-0 w-[280px] bg-white/50 backdrop-blur-md border border-neutral-200 p-6 rounded-2xl space-y-4 hover:border-neutral-400 group shadow-sm hover:shadow-md"
                >
                  <div className="aspect-video rounded-xl overflow-hidden bg-black/5 relative">
                    <img
                      src={phase.img}
                      alt={phase.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest text-neutral-500">
                      Phase {(index % phases.length) + 1 < 10 ? '0' : ''}{(index % phases.length) + 1}
                    </span>
                    <h3 className="text-xl font-serif text-neutral-900">{phase.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
