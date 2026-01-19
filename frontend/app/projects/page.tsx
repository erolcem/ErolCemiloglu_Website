"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// 1. Interface matches what we expect from the backend
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech_stack: string | string[]; // Accepts raw strings OR arrays
  image_path: string; 
  link: string;
  created_at?: string; 
  year: string;
}

// 2. The "Safety Net" Helper Function
// This forces ANY data format into a clean Array of strings
const parseTechStack = (stack: string | string[] | null | undefined): string[] => {
  // A. If it's missing or empty, return empty list
  if (!stack) return [];

  // B. If it's already a List (Perfect!), return it
  if (Array.isArray(stack)) return stack;

  // C. If it's a String (The messy part)
  if (typeof stack === 'string') {
    // Regex explanation:
    // / ... /g  -> Global search (find all matches)
    // [ ... ]   -> Match any character inside these brackets
    // { } [ ] " ' -> The characters we want to delete
    // \ acts as an escape character for special regex symbols
    const cleanString = stack.replace(/[{\}\[\]"']/g, '');
    
    // Split by comma, trim whitespace, and ignore empty strings
    return cleanString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  return [];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Fetch Data
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    console.log(`Fetching from: ${API_URL}/api/projects`); // Debug Log 1

    fetch(`${API_URL}/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Database Data Received:", data); // Debug Log 2
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white p-24">Loading Projects...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-100">Engineering Log</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            // 4. Clean the stack data right before rendering
            const safeTechStack = parseTechStack(project.tech_stack);

            return (
              <div key={project.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300">

                {/* Visual Header */}
                <div className="h-48 bg-neutral-800 w-full flex items-center justify-center text-neutral-600 group-hover:bg-neutral-800/80 transition-colors relative overflow-hidden">
                   {project.image_path && project.image_path.startsWith('/') ? (
                      /* If using standard <img> tag */
                      <img 
                        src={project.image_path} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                   ) : (
                      /* Fallback Icon */
                      <span className="text-4xl">🤖</span>
                   )}
                </div>

                {/* Content Body */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <span className="text-xs font-mono text-blue-400 mb-1 block">
                              {project.category} // {project.year || '2025'}
                          </span>
                          <h2 className="text-2xl font-bold text-gray-100">{project.title}</h2>
                      </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                      {project.description}
                  </p>

                  {/* Tech Stack Tags - Using the Clean Data */}
                  <div className="flex flex-wrap gap-2 mb-6">
                      {safeTechStack.length > 0 ? (
                          safeTechStack.map((t, i) => (
                              <span key={i} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-700">
                                  {t}
                              </span>
                          ))
                      ) : (
                          <span className="text-xs text-gray-600">Stack info unavailable</span>
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