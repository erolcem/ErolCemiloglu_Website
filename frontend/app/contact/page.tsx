import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 pt-32 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        
        <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-gray-100 tracking-tight">Connect</h1>
            <p className="text-gray-400 mt-4 text-lg">
                Currently based in Melbourne, Australia. <br/>
                Available for robotics engineering and full-stack collaborations.
            </p>
        </div>

        {/* THE DIRECTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BLOCK 1: Email (Primary Action) */}
          <a 
            href="mailto:your.email@gmail.com"
            className="col-span-1 md:col-span-2 group bg-neutral-900 border border-neutral-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
          >
            <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className="p-4 bg-blue-900/20 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {/* Mail Icon */}
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-100">Send Email</h3>
                    <p className="text-gray-500 group-hover:text-gray-400 transition-colors">your.email@gmail.com</p>
                </div>
            </div>
            <span className="px-6 py-2 bg-neutral-800 rounded-full text-sm font-medium text-gray-300 group-hover:bg-white group-hover:text-black transition-colors">
                Launch Client ➔
            </span>
          </a>

          {/* BLOCK 2: LinkedIn */}
          <Link 
            href="https://linkedin.com/in/your-profile" 
            target="_blank"
            className="group bg-[#0077b5] border border-transparent rounded-3xl p-8 flex flex-col justify-between h-64 hover:scale-[1.02] transition-transform shadow-lg shadow-blue-900/20"
          >
            <div className="flex justify-between items-start">
                <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white mb-1">LinkedIn</h3>
                <p className="text-blue-100 text-sm opacity-90">Professional Network</p>
            </div>
          </Link>

          {/* BLOCK 3: GitHub */}
          <Link 
            href="https://github.com/your-username" 
            target="_blank"
            className="group bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between h-64 hover:border-white hover:bg-neutral-800 transition-all"
          >
            <div className="flex justify-between items-start">
                <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <div className="bg-neutral-800 p-2 rounded-lg group-hover:bg-white group-hover:text-black transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white mb-1">GitHub</h3>
                <p className="text-gray-400 text-sm">Code Repositories</p>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}