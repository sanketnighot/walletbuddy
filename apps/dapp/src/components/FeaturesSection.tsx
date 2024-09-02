import React from 'react';
import { motion } from 'framer-motion';
import { features } from '../data/features';

const FeatureCard: React.FC<{ title: string; description: string; icon: string; index: number; implemented: boolean }> = ({ title, description, icon, index, implemented }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`bg-background-light p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${implemented ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}
  >
    <div className="text-4xl mb-4 bg-gradient-to-br from-primary to-secondary rounded-full w-16 h-16 flex items-center justify-center text-white">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
    <p className="text-text-dark">{description}</p>
    <p className={`mt-2 font-semibold ${implemented ? 'text-green-500' : 'text-yellow-500'}`}>
      {implemented ? 'Implemented' : 'Coming Soon'}
    </p>
  </motion.div>
);

export const FeaturesSection: React.FC = () => (
  <section id="features" className="py-20 bg-gradient-to-br from-background to-background-light">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        Key Features
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>
    </div>
  </section>
);