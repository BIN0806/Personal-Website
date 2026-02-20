import { motion } from "framer-motion";
import { Rocket, FileDown, Sparkles } from "lucide-react";
import { profile } from "@/data/portfolio-data";

export default function HeroSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-lg pixel-icon"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-lg pixel-icon"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-secondary/10 rounded-lg pixel-icon"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-muted rounded-full text-xl font-semibold text-muted-foreground mb-4"
          >
            <Sparkles className="w-6 h-6 text-accent" />
            {profile.title}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight vintage-hover-accent cursor-pointer"
          >
            {profile.name}<br/>
            {/* <span className="gradient-text">Building Software that impacts the World</span> */}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {profile.bio}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center pt-8"
          >
            <button 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg flex items-center gap-2 w-full sm:w-auto"
              data-testid="button-view-work"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Rocket className="w-5 h-5" />
              View My Work
            </button>
            {/* <a 
              href="/assets/BillyNguyenResume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-card text-card-foreground border-2 border-border rounded-lg text-lg font-semibold hover:border-primary transition-all flex items-center gap-2 w-full sm:w-auto"
              data-testid="button-download-resume"
            >
              <FileDown className="w-5 h-5" />
              Download Resume
            </a> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
