import React from 'react';
import { motion, useInView } from 'framer-motion';
import { roadmapItems } from '../data/roadmap';

const RoadmapItem: React.FC<{ phase: string; description: string; status: string; details: string[]; index: number }> = ({ phase, description, status, details, index }) => {
	const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-background-light p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="flex items-center mb-4">
        <div className={`text-white font-bold rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md bg-gradient-to-br ${
          status === "Completed" ? "from-green-400 to-green-600" :
          status === "In Progress" ? "from-yellow-400 to-yellow-600" :
          "from-blue-400 to-blue-600"
        }`}>
          {phase}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary">{description}</h3>
          <p className={`font-semibold ${
            status === "Completed" ? "text-green-500" :
            status === "In Progress" ? "text-yellow-500" :
            "text-blue-500"
          }`}>{status}</p>
        </div>
      </div>
      <ul className="space-y-2 text-text-dark">
        {details.map((detail, idx) => (
          <motion.li 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: 0.1 * idx }}
            className={`flex items-center ${detail.includes("Coming Soon") ? "text-yellow-500" : ""}`}
          >
            <span className="mr-2 text-primary">•</span>
            {detail}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export const RoadmapSection: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="roadmap" className="py-20 bg-gradient-to-tl from-background to-background-light">
      <div className="container mx-auto">
        <motion.h2 
          ref={ref}
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Development Roadmap
        </motion.h2>
        <div className="space-y-8">
          {roadmapItems.map((item, index) => (
            <RoadmapItem key={index} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};