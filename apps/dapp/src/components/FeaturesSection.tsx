import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { title: 'Easy Setup', description: 'Connect your wallet in seconds' },
  { title: 'Secure', description: 'Your keys, your crypto' },
  { title: 'Analytics', description: 'Track your portfolio performance' },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 px-6 bg-background-light">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-background p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};