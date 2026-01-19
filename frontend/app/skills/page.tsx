"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface SkillBox {
  id: number;
  title: string;
  category: string;
  image_path?: string;
  link?: string;
  is_wide: boolean;
}

export default function SkillsBento() {
  const [skills, setSkills] = useState<SkillBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    fetch(`${API_URL}/api/skills`)
      .then((res) => { if (!res.ok) throw new Error('API Error'); return res.json(); })
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white p-24">Loading Skills...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Skill Arsenal
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[180px] gap-4">
          
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className={`
                group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-500
                hover:border-purple-500/50 hover:bg-neutral-800 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                ${skill.is_wide ? 'md:col-span-2' : 'md:col-span-1'}
              `}
            >
              
              {/* Background Image Effect */}
              {skill.image_path && (
                <img 
                  src={skill.image_path} 
                  className="absolute -right-1 -bottom-8 w-64 h-64 object-contain opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" 
                />
              )}

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-purple-400 mb-2 block tracking-wider uppercase">{skill.category}</span>
                  <h3 className="text-3xl font-bold text-gray-100 group-hover:text-white transition-colors">{skill.title}</h3>
                </div>

                {skill.link && (
                  <Link 
                    href={skill.link} 
                    target="_blank"
                    className="self-start inline-flex items-center text-xs font-bold text-neutral-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors mt-4"
                  >
                    Evidence 
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