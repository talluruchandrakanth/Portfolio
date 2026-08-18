import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  X,
  Moon,
  Sun,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  Download,
  ExternalLink,
  ChevronUp,
  Send,
  Sparkles,
  Brain,
  Database,
  Server,
  Cpu,
  FileCode,
  Layers,
  GitBranch,
  MessageSquare,
  Users,
  Target,
  Zap,
  CheckCircle2,
  Star,
  Calendar,
  Building2,
  Eye,
  FileText,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

// Types
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

// Custom Hooks
function useTypingEffect(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return currentText;
}

function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}

function useAnimatedCounter(end: number, duration = 0, start = 0) {
  const [count, setCount] = useState(start);
  const { ref, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration, start]);

  return { count, ref };
}

// Particle Canvas Component
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 15000);
    particles.current = [];

    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`;
        ctx.fill();

        // Connect particles
        particles.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-40"
    />
  );
}

// Navigation Component
function Navigation({
  isDark,
  toggleTheme,
  isScrolled,
  activeSection,
}: {
  isDark: boolean;
  toggleTheme: () => void;
  isScrolled: boolean;
  activeSection: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openPDF } = usePDF();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openPDF('/documents/TalluruChandrakanth_Resume.pdf', 'Talluru Chandrakanth - Resume');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass dark:glass-dark shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-bold text-sm font-heading">TC</span>
            </div>
            <span className="font-bold text-lg font-heading text-dark-800 dark:text-white hidden sm:block">
              Chandrakanth
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-600 dark:text-dark-300 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Resume Button (Desktop) */}
            <button
              onClick={handleResumeClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-[1.02] transition-all duration-300"
            >
              <Eye size={18} />
              View Resume
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-600 dark:text-dark-300 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[500px] mt-4' : 'max-h-0'
          }`}
        >
          <div className="glass dark:glass-dark rounded-2xl p-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeSection === link.id
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleResumeClick}
              className="flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium w-full"
            >
              <Eye size={18} />
              View Resume
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const typingText = useTypingEffect(
    [
      'Artificial Intelligence Engineer',
      'Machine Learning Engineer',
      'Python Developer',
      'AI & Data Science Engineer',
      'NLP Enthusiast',
      'Backend Developer',
    ],
    80,
    40,
    2000
  );
  const { openPDF } = usePDF();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewResume = () => {
    openPDF('/documents/TalluruChandrakanth_Resume.pdf', 'Talluru Chandrakanth - Resume');
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-primary-950"
    >
      {/* Animated Particles */}
      <ParticlesCanvas />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/20 dark:bg-accent-500/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Profile Image */}
          <div className="relative animate-fade-in">
            {/* Soft glow behind the photo */}
            <div className="absolute inset-0 rounded-full bg-primary-400/20 dark:bg-primary-500/15 blur-2xl scale-110" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl shadow-primary-500/30"
              style={{ boxShadow: '0 0 0 3px rgba(99,102,241,0.25), 0 25px 60px -10px rgba(99,102,241,0.35)' }}
            >
              <img
                src="/Gemini_Generated_Image_or34fmor34fmor34%20copy.png"
                alt="Talluru Chandrakanth"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 8%' }}
              />
              {/* Subtle vignette to soften the circular crop edge */}
              <div className="absolute inset-0 rounded-full ring-4 ring-white/30 dark:ring-dark-900/40" aria-hidden="true" />
            </div>
            {/* Decorative Ring */}
            <div className="absolute -inset-4 rounded-full border-2 border-primary-500/30 animate-spin-slow" />
            <div className="absolute -inset-8 rounded-full border border-accent-500/20" />

            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 floating-delayed">
              <div className="glass dark:glass-dark px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-dark-700 dark:text-dark-200">AI Engineer</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 floating">
              <div className="glass dark:glass-dark px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-dark-700 dark:text-dark-200">CGPA: 8.49</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left flex-1">
            <div className="animate-fade-in-down">
              <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-6">
                Available for opportunities
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-dark-900 dark:text-white mb-4 animate-fade-in-up">
              Hi, I'm{' '}
              <span className="gradient-text">Talluru Chandrakanth</span>
            </h1>

            <div className="h-12 md:h-14 flex items-center justify-center lg:justify-start mb-6 animate-fade-in-up delay-200">
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-dark-600 dark:text-dark-300">
                {typingText}
                <span className="inline-block w-0.5 h-8 md:h-10 bg-primary-500 ml-1 animate-blink" />
              </span>
            </div>

            <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl mb-8 leading-relaxed animate-fade-in-up delay-300">
              Final-year AI & Data Science student passionate about building scalable AI-powered
              applications, machine learning systems, and intelligent automation tools. Experienced
              in NLP, Computer Vision, REST APIs, and Generative AI integration with hands-on
              internship experience delivering production-ready solutions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 animate-fade-in-up delay-400">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary group"
              >
                <span className="relative z-10">View Projects</span>
                <ExternalLink className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              <button onClick={handleViewResume} className="btn-secondary">
                <Eye className="w-4 h-4 mr-2" />
                View Resume
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="btn-ghost"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Me
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-500">
              <a
                href="https://github.com/talluruchandrakanth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-100 dark:bg-dark-800 hover:bg-dark-800 dark:hover:bg-dark-700 text-dark-600 dark:text-dark-300 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/talluru-chandrakanth-b57530330/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-100 dark:bg-dark-800 hover:bg-[#0A66C2] text-dark-600 dark:text-dark-300 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="mailto:talluruchandrakanth131105@gmail.com"
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-100 dark:bg-dark-800 hover:bg-primary-600 text-dark-600 dark:text-dark-300 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 rounded-full border-2 border-dark-400 dark:border-dark-500 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-500 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const { ref, isVisible } = useIntersectionObserver();

  const facts = [
    { icon: MapPin, label: 'Location', value: 'Tirupati, India' },
    { icon: GraduationCap, label: 'Degree', value: 'B.Tech AI & Data Science' },
    { icon: Award, label: 'CGPA', value: '8.49' },
    { icon: Briefcase, label: 'Experience', value: 'AI Intern' },
  ];

  const interests = [
    { icon: Brain, label: 'Artificial Intelligence' },
    { icon: Cpu, label: 'Machine Learning' },
    { icon: Server, label: 'Backend Development' },
    { icon: Sparkles, label: 'Generative AI' },
    { icon: Eye, label: 'Computer Vision' },
    { icon: MessageSquare, label: 'Natural Language Processing' },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 bg-white dark:bg-dark-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            About Me
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            Get to Know <span className="gradient-text">Me Better</span>
          </h2>
          <p className="section-subtitle">
            Passionate about transforming ideas into intelligent solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <h3 className="text-2xl font-bold font-heading text-dark-900 dark:text-white mb-6">
              Professional Introduction
            </h3>
            <div className="space-y-4 text-dark-600 dark:text-dark-300 leading-relaxed">
              <p>
                I'm a final-year Computer Science student specializing in AI & Data Science at
                Vel Tech Rangarajan Dr. Sagunthala R&D Institute. My journey in technology began
                with a curiosity about how machines can learn and make decisions, which evolved
                into a deep passion for building AI-powered solutions.
              </p>
              <p>
                With hands-on experience from my AI internship at EduTantr, I've developed
                production-ready NLP systems, machine learning pipelines, and intelligent
                automation tools that deliver measurable business impact.
              </p>
              <p>
                I believe in writing clean, maintainable code and building systems that are
                not just functional but scalable and efficient. My goal is to leverage AI/ML
                technologies to solve real-world problems and create meaningful impact.
              </p>
            </div>

            {/* Career Objective */}
            <div className="mt-8 p-6 glass-card dark:glass-card-dark">
              <h4 className="font-semibold text-dark-800 dark:text-white mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-500" />
                Career Objective
              </h4>
              <p className="text-dark-600 dark:text-dark-300">
                Seeking opportunities to apply my expertise in AI, Machine Learning, and Software
                Engineering to build innovative solutions while continuously learning and growing
                in a dynamic environment.
              </p>
            </div>
          </div>

          {/* Right Content - Quick Facts */}
          <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className="card-premium text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <fact.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                  <p className="text-sm text-dark-500 dark:text-dark-400">{fact.label}</p>
                  <p className="font-semibold text-dark-800 dark:text-white">{fact.value}</p>
                </div>
              ))}
            </div>

            {/* Interests */}
            <div className="glass-card dark:glass-card-dark p-6">
              <h4 className="font-semibold text-dark-800 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary-500" />
                Areas of Interest
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div
                    key={interest.label}
                    className="flex items-center gap-2 text-dark-600 dark:text-dark-300"
                  >
                    <interest.icon className="w-4 h-4 text-accent-500" />
                    <span className="text-sm">{interest.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Skills Section
function SkillsSection() {
  const { ref, isVisible } = useIntersectionObserver();

  const skillCategories = [
    {
      title: 'Programming',
      icon: Code2,
      skills: [
        { name: 'Python', level: 90 },
        { name: 'SQL', level: 80 },
      ],
    },
    {
      title: 'AI & ML',
      icon: Brain,
      skills: [
        { name: 'Generative AI', level: 85 },
        { name: 'Agentic AI', level: 80 },
        { name: 'Machine Learning Techniques', level: 85 },
      ],
    },
    {
      title: 'Libraries & Frameworks',
      icon: Layers,
      skills: [
        { name: 'PyTorch', level: 85 },
        { name: 'Pandas', level: 80 },
        { name: 'NumPy', level: 80 },
        { name: 'Matplotlib', level: 80 },
      ],
    },
    {
      title: 'Databases',
      icon: Database,
      skills: [
        { name: 'MySQL', level: 85 },
      ],
    },
    {
      title: 'Tools',
      icon: GitBranch,
      skills: [
        { name: 'Git', level: 85 },
        { name: 'GitHub', level: 90 },
        { name: 'VS Code', level: 95 },
        { name: 'MySQL Workbench', level: 80 },
      ],
    },
    {
      title: 'Soft Skills',
      icon: Users,
      skills: [
        { name: 'Problem Solving', level: 95 },
        { name: 'Analytical Thinking', level: 90 },
        { name: 'Communication', level: 85 },
        { name: 'Team Collaboration', level: 90 },
        { name: 'Adaptability', level: 90 },
        { name: 'Time Management', level: 85 },
      ],
    },
  ];

  return (
    <section
      id="skills"
      ref={ref}
      className="py-24 bg-dark-50 dark:bg-dark-950 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Skills & Expertise
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            Technical <span className="gradient-text">Proficiency</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive skill set spanning AI/ML and Data Science
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.title}
              className={`card-premium ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${catIndex * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold font-heading text-dark-800 dark:text-white">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className={`flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300 ${
                      isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${catIndex * 100 + skillIndex * 50}ms` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Experience Section
function ExperienceSection() {
  const { ref, isVisible } = useIntersectionObserver();

  const experiences = [
    {
      role: 'Artificial Intelligence Intern',
      company: 'EduTantr',
      location: 'Bengaluru',
      period: 'Jul 2025 – Sep 2025',
      description: [
        'Developed Grow Hub AI Career Platform with intelligent resume screening',
        'Reduced resume screening time by 97% using NLP-based skill extraction',
        'Built NLP skill extraction engine with 85%+ keyword matching accuracy',
        'Created ML pipelines using Scikit-learn for candidate ranking',
        'Documented REST APIs for seamless frontend-backend integration',
      ],
      tech: ['Python', 'NLP', 'Scikit-learn', 'TF-IDF', 'REST APIs'],
    },
  ];

  return (
    <section
      id="experience"
      ref={ref}
      className="py-24 bg-white dark:bg-dark-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Work Experience
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-subtitle">
            Building real-world AI solutions with measurable impact
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div
              key={exp.role}
              className={`timeline-item ${
                isVisible ? 'animate-slide-in-left' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="ml-6">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-heading text-dark-900 dark:text-white mb-1">
                  {exp.role}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-dark-500 dark:text-dark-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {exp.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {exp.location}
                  </span>
                </div>

                {/* Achievements */}
                <div className="space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-dark-600 dark:text-dark-300">
                      <CheckCircle2 className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Projects Section
function ProjectsSection() {
  const { ref, isVisible } = useIntersectionObserver();

  const projects = [
    {
      title: 'Grow Hub',
      subtitle: 'AI Powered Resume Analyzer',
      tech: ['Python', 'Streamlit', 'TF-IDF', 'Scikit-learn', 'PyPDF2', 'Pandas'],
      highlights: ['97%+ matching accuracy', 'Skill gap dashboard', 'Resume parser', 'NLP engine'],
      description:
        'An intelligent resume screening platform that uses NLP and ML to analyze resumes against job descriptions, providing skill gap analysis and candidate ranking with unprecedented accuracy.',
      github: 'https://github.com/talluruchandrakanth/grow-hub',
    },
    {
      title: 'Career DNA',
      subtitle: 'Developer Analytics Platform',
      tech: ['Python', 'Streamlit', 'GitHub API', 'Gemini 2.5 Flash', 'PyPDF2'],
      highlights: ['GitHub analytics', 'Resume parsing', 'AI interview question generator', 'Career insights'],
      description:
        'A comprehensive developer analytics platform that integrates GitHub data analysis, resume parsing, and uses Gemini AI to generate personalized interview questions and career insights.',
      github: 'https://github.com/talluruchandrakanth/career-dna',
    },
    {
      title: 'Real-Time Event Sync Engine',
      subtitle: 'Event Management System',
      tech: ['Node.js', 'Express.js', 'MySQL', 'REST APIs', 'RBAC'],
      highlights: ['Role-based authentication', '1000 concurrent bookings', 'Real-time ticket management', 'Normalized relational database'],
      description:
        'A high-performance event synchronization platform featuring role-based access control, real-time ticket management, and a normalized relational database architecture handling 1000+ concurrent bookings.',
      github: 'https://github.com/talluruchandrakanth/real-time-event-synchronization',
    },
  ];

  return (
    <section
      id="projects"
      ref={ref}
      className="py-24 bg-dark-50 dark:bg-dark-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Featured Projects
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            What I've <span className="gradient-text">Built</span>
          </h2>
          <p className="section-subtitle">
            Production-ready applications showcasing AI/ML and backend expertise
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group card overflow-visible ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading text-dark-900 dark:text-white mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                  {project.subtitle}
                </p>
                <p className="text-dark-600 dark:text-dark-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-2 py-1 rounded bg-dark-100 dark:bg-dark-800 text-dark-500 text-xs">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {project.highlights.slice(0, 4).map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-1 text-xs text-dark-500 dark:text-dark-400"
                    >
                      <Zap className="w-3 h-3 text-accent-500" />
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-dark-200 dark:border-dark-700">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Education Section
function EducationSection() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section
      id="education"
      ref={ref}
      className="py-24 bg-white dark:bg-dark-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Education
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            Academic <span className="gradient-text">Background</span>
          </h2>
        </div>

        {/* Education Card */}
        <div className={`max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="glass-card dark:glass-card-dark p-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-dark-900 dark:text-white mb-1">
                    Vel Tech Rangarajan Dr. Sagunthala R&D Institute
                  </h3>
                  <p className="text-dark-600 dark:text-dark-300">
                    B.Tech in Computer Science & Engineering
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 text-sm">
                    Specialization: AI & Data Science
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-dark-200 dark:border-dark-700">
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">8.49</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">CGPA</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">2027</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Expected Graduation</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">4</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Years Program</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">AI</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Specialization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Certifications Section
function CertificationsSection() {
  const { ref, isVisible } = useIntersectionObserver();
  const { openPDF } = usePDF();

  const certifications = [
    {
      name: 'Cisco Python Essentials 1',
      issuer: 'Cisco',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      pdfPath: '/certificates/Python_Essentials_1_certificate.pdf'
    },
    {
      name: 'Cisco Python Essentials 2',
      issuer: 'Cisco',
      icon: Code2,
      color: 'from-blue-600 to-cyan-600',
      pdfPath: '/certificates/Python_Essentials_2_certificate.pdf'
    },
    {
      name: 'Deloitte Technology Job Simulation',
      issuer: 'Deloitte',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-500',
      pdfPath: '/certificates/Deloitte_Technology_job_simulation_certificate.pdf'
    },
    {
      name: 'Deloitte Data Analytics Job Simulation',
      issuer: 'Deloitte',
      icon: Database,
      color: 'from-emerald-600 to-teal-600',
      pdfPath: '/certificates/Deloitte_Data_Analytics_Job_Simulation_Certificate.pdf'
    },
    {
      name: 'NPTEL Social Innovation in Industry 4.0',
      issuer: 'NPTEL',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      pdfPath: '/certificates/Social_Innovation_in_Industry_.pdf'
    },
  ];

  const handleCertClick = (cert: typeof certifications[0]) => {
    openPDF(cert.pdfPath as string, `${cert.name} - ${cert.issuer}`);
  };

  return (
    <section
      id="certifications"
      ref={ref}
      className="py-24 bg-dark-50 dark:bg-dark-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Certifications
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            Professional <span className="gradient-text">Credentials</span>
          </h2>
          <p className="section-subtitle">Click on any certificate to view it</p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <button
              key={cert.name}
              onClick={() => handleCertClick(cert)}
              className={`card-premium flex items-center gap-4 text-left group cursor-pointer ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <cert.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-dark-800 dark:text-white">{cert.name}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400">{cert.issuer}</p>
              </div>
              <Eye className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Achievements Section
function AchievementsSection() {
  const stats = [
    { label: 'Projects Completed', value: 10, suffix: '+', animate: true, icon: FileCode },
    { label: 'Internships', value: 1, suffix: '', animate: false, icon: Briefcase },
    { label: 'Certifications', value: 10, suffix: '+', animate: true, icon: Award },
    { label: 'Technologies Learned', value: 10, suffix: '+', animate: true, icon: Cpu },
  ];

  const counters = stats.map((stat) => useAnimatedCounter(stat.animate ? stat.value : 0, 2000));

  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Achievements & Stats
          </h2>
          <p className="text-xl text-white/80">
            Numbers that represent my journey
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={counters[index].ref}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stat.animate ? counters[index].count : stat.value}{stat.suffix}
              </div>
              <p className="text-white/80 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* GitHub Stats Placeholder */}
        <div className="mt-16 text-center">
          <div className="inline-block glass rounded-2xl p-8 backdrop-blur-md">
            <Github className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">GitHub Activity</h3>
            <p className="text-white/70 mb-4">Contributing to open source projects</p>
            <a
              href="https://github.com/talluruchandrakanth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold hover:bg-white/90 transition-colors"
            >
              <Github className="w-5 h-5" />
              View GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Resume Section
function ResumeSection() {
  const { ref, isVisible } = useIntersectionObserver();
  const { openPDF } = usePDF();

  const handleViewResume = () => {
    openPDF('/documents/TalluruChandrakanth_Resume.pdf', 'Talluru Chandrakanth - Resume');
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-white dark:bg-dark-900"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Resume
          </span>
          <h2 className="section-title text-dark-900 dark:text-white mb-4">
            My <span className="gradient-text">Resume</span>
          </h2>
          <p className="section-subtitle mb-8">
            Get a comprehensive overview of my skills, experience, and qualifications
          </p>

          <div className="glass-card dark:glass-card-dark p-8 mb-8">
            <FileCode className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
              Talluru Chandrakanth - Resume
            </h3>
            <p className="text-dark-500 dark:text-dark-400 mb-6">
              AI & Data Science Engineer | Updated 2025
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleViewResume}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                View Resume
              </button>
              <a
                href="/documents/TalluruChandrakanth_Resume.pdf"
                download
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { ref, isVisible } = useIntersectionObserver();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 bg-dark-50 dark:bg-dark-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
            Get in Touch
          </span>
          <h2 className="section-title text-dark-900 dark:text-white">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <form onSubmit={handleSubmit} className="glass-card dark:glass-card-dark p-8">
              <h3 className="text-xl font-bold font-heading text-dark-900 dark:text-white mb-6">
                Send a Message
              </h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder=""
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder=""
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    placeholder="Project Collaboration"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field min-h-[150px] resize-none"
                    placeholder="Your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="space-y-6">
              {/* Contact Cards */}
              <a
                href="mailto:talluruchandrakanth131105@gmail.com"
                className="block card-premium group hover:border-primary-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">Email</p>
                    <p className="font-semibold text-dark-900 dark:text-white">talluruchandrakanth131105@gmail.com</p>
                  </div>
                </div>
              </a>

              <div className="card-premium">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">Location</p>
                    <p className="font-semibold text-dark-900 dark:text-white">Tirupati, India</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card dark:glass-card-dark p-6">
                <h4 className="font-semibold text-dark-800 dark:text-white mb-4">Connect on Social</h4>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/talluruchandrakanth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-all"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/talluru-chandrakanth-b57530330/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-[#0A66C2] text-dark-700 dark:text-dark-300 hover:text-white transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-dark-900 dark:bg-dark-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-heading">TC</span>
              </div>
              <span className="font-bold text-lg font-heading">Chandrakanth</span>
            </div>
            <p className="text-dark-400 mb-6">
                AI & Data Science Engineer passionate about building intelligent solutions that make a difference.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/talluruchandrakanth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/talluru-chandrakanth-b57530330/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-[#0A66C2] flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:talluruchandrakanth131105@gmail.com"
                className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-dark-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-dark-400">
                <Mail className="w-4 h-4 text-primary-500" />
                talluruchandrakanth131105@gmail.com
              </li>
              <li className="flex items-center gap-2 text-dark-400">
                <MapPin className="w-4 h-4 text-primary-500" />
                Tirupati, India
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-800 pt-8 flex items-center justify-center">
          <p className="text-dark-400 text-sm">
            &copy; {currentYear} Talluru Chandrakanth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// PDF Viewer Modal Component
interface PDFViewerModalProps {
  isOpen: boolean;
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

function PDFViewerModal({ isOpen, pdfUrl, title, onClose }: PDFViewerModalProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-900/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-6xl h-[90vh] mx-4 flex flex-col bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white">{title}</h3>
              <p className="text-sm text-dark-500 dark:text-dark-400">PDF Document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-3 py-1 bg-dark-100 dark:bg-dark-700 rounded-lg">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.25))}
                className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-dark-600 dark:text-dark-300" />
              </button>
              <span className="text-sm font-medium text-dark-600 dark:text-dark-300 min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(Math.min(2, scale + 0.25))}
                className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-dark-600 dark:text-dark-300" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={pdfUrl}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-dark-600 dark:text-dark-300" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 overflow-auto bg-dark-100 dark:bg-dark-950 p-4">
          <div
            className="mx-auto bg-white dark:bg-dark-900 shadow-xl rounded-lg overflow-hidden transition-transform duration-300"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={pdfUrl}
              title={title}
              className="w-full h-[calc(90vh-120px)] border-0"
              style={{ minHeight: '70vh' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// PDF Context for sharing modal state
interface PDFContextType {
  openPDF: (url: string, title: string) => void;
  closePDF: () => void;
  currentPDF: { url: string; title: string } | null;
}

const PDFContext = React.createContext<PDFContextType | null>(null);

function usePDF() {
  const context = React.useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within PDFProvider');
  }
  return context;
}

function PDFProvider({ children }: { children: React.ReactNode }) {
  const [currentPDF, setCurrentPDF] = useState<{ url: string; title: string } | null>(null);

  const openPDF = useCallback((url: string, title: string) => {
    setCurrentPDF({ url, title });
  }, []);

  const closePDF = useCallback(() => {
    // @ts-ignore - React typing issue
    setCurrentPDF(null);
  }, []);

  return (
    <PDFContext.Provider value={{ openPDF, closePDF, currentPDF }}>
      {children}
      <PDFViewerModal
        isOpen={!!currentPDF}
        pdfUrl={currentPDF?.url || ''}
        title={currentPDF?.title || ''}
        onClose={closePDF}
      />
    </PDFContext.Provider>
  );
}

// Main App Component
function App() {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Theme Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  // Scroll Effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);

      // Active Section Detection
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'home';

      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop - 100;
        const sectionHeight = htmlSection.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id') || 'home';
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PDFProvider>
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 font-sans theme-transition">
        {/* Scroll Progress Bar */}
        <div className="scroll-progress w-full fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 z-40 origin-left"
          style={{ transform: `scaleX(${typeof window !== 'undefined' ? window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) : 0})` }}
        />

        {/* Navigation */}
        <Navigation
          isDark={isDark}
          toggleTheme={toggleTheme}
          isScrolled={isScrolled}
          activeSection={activeSection}
        />

        {/* Main Content */}
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <EducationSection />
          <CertificationsSection />
          <AchievementsSection />
          <ResumeSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </PDFProvider>
  );
}

export default App;
