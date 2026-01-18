"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Define the shape of a single project
interface Project {
  id: number;
  title: string;
  category: string;
  date: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white p-24">Loading Projects...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-100">Engineering Log</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300">

              {/* Visual Header - UPDATED LOGIC */}
              <div className="h-48 bg-neutral-800 w-full flex items-center justify-center text-neutral-600 group-hover:bg-neutral-800/80 transition-colors relative overflow-hidden">
                 
                 {/* Check if it's a real image path (starts with /) */}
                 {project.image.startsWith('/') ? (
                    /* Note: We use standard <img> tag here for simplicity. 
                       Next.js has a specialized <Image/> component for optimization we can use later. */
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                 ) : (
                    /* Otherwise, show placeholders based on keywords */
                    <>
                     {project.image === 'video' && <span>[ 🎥 Robot Demo Video ]</span>}
                     {project.image === 'code' && <span>[ 💻 Source Code Preview ]</span>}
                    </>
                 )}

              </div>

              {/* Content Body */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-mono text-blue-400 mb-1 block">{project.category} // {project.date}</span>
                        <h2 className="text-2xl font-bold text-gray-100">{project.title}</h2>
                    </div>
                </div>
                
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-700">
                            {t}
                        </span>
                    ))}
                </div>

                {/* Link Button */}
                <Link href={project.link} target="_blank" className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    View Documentation 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}