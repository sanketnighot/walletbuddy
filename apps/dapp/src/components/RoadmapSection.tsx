import React from 'react';
import { motion } from 'framer-motion';
import { roadmapItems } from '../data/roadmap';

const RoadmapItem: React.FC<{ phase: string; description: string; status: string; details: string[]; index: number }> = ({ phase, description, status, details, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
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
          animate={{ opacity: 1, x: 0 }}
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

export const RoadmapSection: React.FC = () => (
  <section id="roadmap" className="py-20 bg-gradient-to-tl from-background to-background-light">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
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