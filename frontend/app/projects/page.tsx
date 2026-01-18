"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string | string[]; // <--- Update type to accept both
  image_path: string; 
  link: string;
  created_at?: string; 
}

// --- HELPER: Cleans up messy database data ---
const parseTechStack = (stack: string | string[] | null | undefined): string[] => {
  // 1. If it's empty, return empty list
  if (!stack) return [];

  // 2. If it's already an Array, return it
  if (Array.isArray(stack)) return stack;

  // 3. If it's a String (The likely culprit)
  if (typeof stack === 'string') {
    // Handle Postgres format "{Python,SQL}" by removing curly braces
    const cleanString = stack.replace(/{/g, '').replace(/}/g, '').replace(/"/g, '');
    // Split by comma and remove extra whitespace
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
        console.log("Raw Data:", data); 
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
          {projects.map((project) => {
            // Use the helper to get a clean array
            const safeTechStack = parseTechStack(project.tech_stack);

            return (
              <div key={project.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300">

                {/* Visual Header */}
                <div className="h-48 bg-neutral-800 w-full flex items-center justify-center text-neutral-600 group-hover:bg-neutral-800/80 transition-colors relative overflow-hidden">
                   {project.image_path && project.image_path.startsWith('/') ? (
                      <img 
                        src={project.image_path} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                   ) : (
                      <span className="text-4xl">🤖</span>
                   )}
                </div>

                {/* Content Body */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <span className="text-xs font-mono text-blue-400 mb-1 block">
                              {project.category} // {project.created_at ? new Date(project.created_at).getFullYear() : '2024'}
                          </span>
                          <h2 className="text-2xl font-bold text-gray-100">{project.title}</h2>
                      </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                      {project.description}
                  </p>

                  {/* Tech Stack Tags - USING THE HELPER */}
                  <div className="flex flex-wrap gap-2 mb-6">
                      {safeTechStack.length > 0 ? (
                          safeTechStack.map((t, i) => (
                              <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-700">
                                  {t}
                              </span>
                          ))
                      ) : (
                          <span className="text-xs text-gray-600">No stack data</span>
                      )}
                  </div>

                  <Link href={project.link || '#'} target="_blank" className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      View Documentation 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}