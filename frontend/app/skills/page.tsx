"use client"; // <--- This is mandatory for data fetching in Next.js App Router

import React, { useEffect, useState } from 'react';

// Define the shape of the data we expect from Python
// This is TypeScript: It prevents bugs by ensuring we know what data looks like.
interface SkillData {
  featured: {
    title: string;
    desc: string;
    tags: string[];
  };
  stack: { name: string; level: string; color: string }[];
  hardware: string[];
  languages: string[];
}

export default function SkillsPage() {
  // STATE: This is where we store the data once we get it.
  const [data, setData] = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(true);

  // EFFECT: This runs ONCE when the page loads.
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/skills')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching skills:", error));
  }, []);

  // Show a loading text while waiting for Python
  if (loading) return <div className="min-h-screen bg-black text-white p-24">Loading System Data...</div>;
  if (!data) return <div className="min-h-screen bg-black text-white p-24">Error loading data.</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-100">Technical Arsenal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* DYNAMIC BLOCK 1: Featured */}
          <div className="col-span-1 md:col-span-2 row-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-blue-500 transition-colors">
            <h2 className="text-2xl font-bold text-blue-400 mb-2">{data.featured.title}</h2>
            <p className="text-gray-400 mb-4">{data.featured.desc}</p>
            <div className="w-full h-48 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-600">
               [Video Placeholder]
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {/* We loop through the tags list from Python */}
                {data.featured.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-full border border-blue-800">
                        {tag}
                    </span>
                ))}
            </div>
          </div>

          {/* DYNAMIC BLOCK 2: Stack */}
          <div className="col-span-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-green-500 transition-colors">
            <h2 className="text-xl font-bold text-green-400 mb-2">Software Stack</h2>
            <ul className="space-y-2 text-gray-300">
              {data.stack.map((item, index) => (
                <li key={index} className="flex justify-between border-b border-neutral-800 pb-1">
                    <span>{item.name}</span> <span className={`${item.color} font-mono`}>{item.level}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DYNAMIC BLOCK 3: Hardware */}
          <div className="col-span-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-purple-500 transition-colors">
            <h2 className="text-xl font-bold text-purple-400 mb-2">Hardware Access</h2>
            <div className="flex flex-wrap gap-2">
                {data.hardware.map((tool, index) => (
                    <span key={index} className="bg-neutral-800 px-2 py-1 rounded text-sm">{tool}</span>
                ))}
            </div>
          </div>

           {/* DYNAMIC BLOCK 4: Languages */}
           <div className="col-span-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500 transition-colors">
            <h2 className="text-xl font-bold text-orange-400 mb-2">Languages</h2>
             <ul className="text-sm text-gray-300 space-y-1">
                {data.languages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                ))}
             </ul>
          </div>

        </div>
      </div>
    </main>
  );
}