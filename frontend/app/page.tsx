import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black text-white relative overflow-hidden">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 text-center max-w-3xl">
        <div className="mb-6 flex justify-center">
            <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest">
                System Online
            </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 mb-6">
          Erol Cemiloglu
        </h1>
        
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
          Robotics Engineer & Full Stack Developer.<br/>
          Building autonomous systems and scalable digital infrastructure.
        </p>


        <div className="mb-6 flex justify-center">
            <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest">
                System Online
            </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                href="/projects"
                className="px-8 py-3 rounded-lg border border-neutral-700 text-gray-300 hover:bg-neutral-800 transition-colors"
            >
                My projects
            </Link>
            <Link 
                href="/skills"
                className="px-8 py-3 rounded-lg border border-neutral-700 text-gray-300 hover:bg-neutral-800 transition-colors"
            >
                My skills
            </Link>

            <Link 
                href="/contact"
                className="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
            >
                Contact Me
            </Link>
        </div>
      </div>
    </main>
  );
}