import React from 'react';

export const ProjectDemoSection: React.FC = () => {
	return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Project Demo</h2>
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative pt-[56.25%]">
            <iframe
              src="https://www.youtube.com/embed/jIGLsgdTahU"
              title="Project Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};