"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string | string[];
  image_path: string; 
  link: string;
  year?: string; 
}

// 1. THE COLOR MAP: Assigns style classes based on tech name
const getTechColor = (tech: string) => {
  const t = tech.toLowerCase();
  if (t.includes('python')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
  if (t.includes('react') || t.includes('next')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
  if (t.includes('rust')) return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
  if (t.includes('c++') || t.includes('cpp')) return 'bg-blue-600/20 text-blue-300 border-blue-500/50';
  if (t.includes('sql') || t.includes('data')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
  if (t.includes('ros') || t.includes('robot')) return 'bg-red-500/20 text-red-300 border-red-500/50';
  
  // Default Style (Cool Gray)
  return 'bg-neutral-800 text-neutral-300 border-neutral-700';
};

// ... (keep parseTechStack helper here) ...
const parseTechStack = (stack: string | string[] | null | undefined): string[] => {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack;
  if (typeof stack === 'string') {
    const cleanString = stack.replace(/[{\}\[\]"']/g, '');
    return cleanString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  return [];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/api/projects`)
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
        <h1 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Projects & Experience
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const safeTechStack = parseTechStack(project.tech_stack);
            console.log(`Project: ${project.title}, Loading Media: ${project.image_path}`);

            return (
              <div key={project.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">

                {/* Visual Header - Now Supports Images AND Videos */}
                <div className="h-48 bg-neutral-800 w-full flex items-center justify-center text-neutral-600 group-hover:bg-neutral-800/80 transition-colors relative overflow-hidden">
                    
                    {project.image_path ? (
                        // CHECK: Is it a video?
                        project.image_path.endsWith('.mp4') || project.image_path.endsWith('.webm') ? (
                            <video
                                src={project.image_path}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        ) : (
                            // OTHERWISE: It's an image
                            <img 
                                src={project.image_path} 
                                alt={project.title} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                        )
                    ) : (
                        // FALLBACK if field is NULL
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">⚡</span>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60 pointer-events-none"></div>
                </div>

                {/* Content Body */}
                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <span className="text-xs font-mono text-blue-400 mb-1 block">
                              {project.category} // {project.year || '2025'}
                          </span>
                          <h2 className="text-2xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors">{project.title}</h2>
                      </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                      {project.description}
                  </p>

                  {/* Colorful Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                      {safeTechStack.length > 0 ? (
                          safeTechStack.map((t, i) => (
                              <span 
                                key={i} 
                                // 2. APPLY THE COLOR HERE
                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getTechColor(t)}`}
                              >
                                  {t}
                              </span>
                          ))
                      ) : (
                          <span className="text-xs text-gray-600">Stack info unavailable</span>
                      )}
                  </div>

                  <Link href={project.link || '#'} target="_blank" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
                      View Documentation 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <h3 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Projects & Experience
        </h3>

      </div>
    </main>
  );
}