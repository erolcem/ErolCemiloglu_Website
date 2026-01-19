"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface SkillBox {
  id: number;
  title: string;
  category: string;
  image_path?: string;
  link?: string;
  is_wide: boolean; // Controls the box size
}

export default function SkillsBento() {
  const [skills, setSkills] = useState<SkillBox[]>([]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/api/skills`)
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-100">Skill Arsenal</h1>
        
        {/* THE BENTO GRID */}
        {/* auto-rows-fr ensures boxes stretch to fill gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[180px] gap-4">
          
          {skills.map((skill) => (
            <div 
              key={skill.id}
              // DYNAMIC CLASS: If is_wide is true, span 2 columns. Otherwise span 1.
              className={`
                group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-blue-500/50 hover:bg-neutral-800
                ${skill.is_wide ? 'md:col-span-2' : 'md:col-span-1'}
              `}
            >
              
              {/* Optional Background Image (Faded) */}
              {skill.image_path && (
                <img 
                  src={skill.image_path} 
                  className="absolute right-0 bottom-0 w-32 h-32 object-contain opacity-5 grayscale group-hover:opacity-20 group-hover:scale-110 transition-all duration-500" 
                />
              )}

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-400 mb-2 block">{skill.category}</span>
                  <h3 className="text-2xl font-bold text-gray-100">{skill.title}</h3>
                </div>

                {/* Optional Evidence Link */}
                {skill.link && (
                  <Link 
                    href={skill.link} 
                    target="_blank"
                    className="self-start inline-flex items-center text-sm text-neutral-400 hover:text-white mt-4"
                  >
                    View Proof 
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </Link>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}