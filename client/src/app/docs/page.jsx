"use client";

import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { 
  Sparkles, 
  ArrowLeft,
  Search, 
  Terminal, 
  Book, 
  Cpu, 
  Shield, 
  ChevronDown,
  Copy,
  Check,
  Zap,
  Box,
  Server,
  Database,
  Layers,
  GitBranch,
  Code2,
  Lock
} from "lucide-react";
import Link from "next/link";

// --- ANIMATIONS ---
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- LAYOUT & BACKGROUNDS ---
const PageContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 50%, #000000 100%);
  position: relative;
  overflow-x: hidden;
  color: white;
`;

const StarField = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  &::before, &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    box-shadow: ${Array.from({ length: 100 }, () => `${Math.random() * 2000 - 1000}px ${Math.random() * 2000}px white`).join(', ')};
    animation: ${float} ${Math.random() * 10 + 20}s ease-in-out infinite;
  }
  &::after { animation-delay: -10s; }
`;

const GridPattern = styled.div`
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  pointer-events: none;
  z-index: 0;
`;

const FloatingOrb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: ${float} 15s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  &:nth-child(1) { width: 400px; height: 400px; background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%); top: 10%; left: -10%; }
  &:nth-child(2) { width: 500px; height: 500px; background: radial-gradient(circle, rgba(147, 51, 234, 0.4), transparent 70%); top: 50%; right: -10%; animation-delay: -5s; }
`;

// --- NAVIGATION ---
const Navigation = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
`;

const NavContent = styled.div`
  max-width: 90rem;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50px;
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateX(-5px);
  }
`;

const Logo = styled(Link)`
  font-size: 1.75rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; color: white;
  &:hover { transform: scale(1.05); }
`;

const LogoIcon = styled.div`
  width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #9333ea); border-radius: 10px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; background-clip: text; color: transparent;
`;

// --- DOCS SPECIFIC LAYOUT ---
const DocsWrapper = styled.div`
  max-width: 90rem;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// --- SIDEBAR ---
const Sidebar = styled.aside`
  position: sticky;
  top: 7rem;
  height: calc(100vh - 9rem);
  overflow-y: auto;
  padding-right: 1rem;
  
  @media (max-width: 1024px) {
    display: none; 
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 4px; }
`;

const SidebarGroup = styled.div`
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h4`
  color: rgba(255,255,255,0.9);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SidebarLink = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  color: ${props => props.$active ? '#60a5fa' : 'rgba(255,255,255,0.6)'};
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  border-left: 2px solid ${props => props.$active ? '#60a5fa' : 'transparent'};
  border-radius: 0 10px 10px 0;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.05);
    padding-left: 1.25rem;
  }
`;

// --- MAIN CONTENT AREA ---
const MainContent = styled.main`
  min-width: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 3.5rem;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);

  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 20px rgba(0,0,0,0.3);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.4);
`;

const DocHeader = styled.header`
  margin-bottom: 3rem;
  animation: ${slideUp} 0.5s ease-out 0.1s both;
`;

const DocTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  animation: ${shimmer} 8s linear infinite;
`;

const DocSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
`;

// --- COMPONENTS ---
const CodeBlockContainer = styled.div`
  background: #0f172a;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  overflow: hidden;
  margin: 1.5rem 0 2.5rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: border-color 0.3s;
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: rgba(59, 130, 246, 0.05);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
`;

const WindowDots = styled.div`
  display: flex;
  gap: 6px;
  span {
    width: 10px; height: 10px; border-radius: 50%;
    &:nth-child(1) { background: #ef4444; }
    &:nth-child(2) { background: #eab308; }
    &:nth-child(3) { background: #22c55e; }
  }
`;

const Pre = styled.pre`
  padding: 1.5rem;
  overflow-x: auto;
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #e2e8f0;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 4px; }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.3));
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 50px; height: 50px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.25rem;
  color: #60a5fa;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: white;
`;

const FeatureText = styled.p`
  font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 2rem; font-weight: 800; margin: 4rem 0 1.5rem; display: flex; align-items: center; gap: 1rem; color: white;
  &::before { content: '#'; color: #60a5fa; opacity: 0.5; }
`;

const TechBadgeContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`;

const TechBadge = styled.span`
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  font-size: 0.85rem;
  color: #60a5fa;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// --- HELPER COMPONENTS ---
const CodeSnippet = ({ code, language = "json" }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <CodeBlockContainer>
      <CodeHeader>
        <WindowDots><span></span><span></span><span></span></WindowDots>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{language}</span>
        <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          {copied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
        </button>
      </CodeHeader>
      <Pre>{code}</Pre>
    </CodeBlockContainer>
  );
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageContainer>
      <StarField />
      <GridPattern />
      <FloatingOrb />
      <FloatingOrb />

      <Navigation>
        <NavContent>
          <Logo href="/">
            <LogoIcon><Sparkles size={24} color="white" /></LogoIcon>
            <LogoText>DevCompanion Docs</LogoText>
          </Logo>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
               <SidebarLink as="span">Support</SidebarLink>
            </Link>
            <BackButton href="/">
            <ArrowLeft size={18} />
            Back to Home
          </BackButton>
          </div>
        </NavContent>
      </Navigation>

      <DocsWrapper>
        {/* SIDEBAR */}
        <Sidebar>
          <SidebarGroup>
            <SidebarTitle><Zap size={16} /> Overview</SidebarTitle>
            <SidebarLink $active={activeSection === 'introduction'} onClick={() => scrollToSection('introduction')}>Introduction</SidebarLink>
            <SidebarLink $active={activeSection === 'tech-stack'} onClick={() => scrollToSection('tech-stack')}>Technology Stack</SidebarLink>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarTitle><Box size={16} /> Core Features</SidebarTitle>
            <SidebarLink $active={activeSection === 'analysis'} onClick={() => scrollToSection('analysis')}>AI Analysis</SidebarLink>
            <SidebarLink $active={activeSection === 'snapshots'} onClick={() => scrollToSection('snapshots')}>Snapshot System</SidebarLink>
            <SidebarLink $active={activeSection === 'languages'} onClick={() => scrollToSection('languages')}>Supported Languages</SidebarLink>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarTitle><Server size={16} /> Architecture</SidebarTitle>
            <SidebarLink $active={activeSection === 'architecture'} onClick={() => scrollToSection('architecture')}>System Design</SidebarLink>
            <SidebarLink $active={activeSection === 'api'} onClick={() => scrollToSection('api')}>API Reference</SidebarLink>
          </SidebarGroup>
          
           <SidebarGroup>
            <SidebarTitle><GitBranch size={16} /> Roadmap</SidebarTitle>
            <SidebarLink $active={activeSection === 'future'} onClick={() => scrollToSection('future')}>Future Scope</SidebarLink>
          </SidebarGroup>
        </Sidebar>

        {/* CONTENT */}
        <MainContent>
          <SearchContainer>
            <SearchIconWrapper><Search size={20} /></SearchIconWrapper>
            <SearchInput type="text" placeholder="Search docs (e.g., 'API Keys', 'Gemini Integration')" />
          </SearchContainer>

          <DocHeader id="introduction">
            <DocTitle>DevCompanion Documentation</DocTitle>
            <DocSubtitle>
               Your AI-driven personal code mentor[cite: 5]. DevCompanion isn't just a debugger; 
              it's an educational platform that analyzes, explains, and tracks your coding journey.
            </DocSubtitle>
          </DocHeader>

          <section id="introduction">
             <FeatureGrid>
              <FeatureCard>
                <FeatureIcon><Cpu size={24} /></FeatureIcon>
                <FeatureTitle>AI-Powered</FeatureTitle>
                 <FeatureText>Powered by Google's Gemini API (gemini-2.0-flash-exp) for context-aware code understanding[cite: 119].</FeatureText>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon><Book size={24} /></FeatureIcon>
                <FeatureTitle>Educational First</FeatureTitle>
                 <FeatureText>Unlike standard linters, we focus on explaining *why* code fails and *how* to improve it[cite: 168].</FeatureText>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon><Layers size={24} /></FeatureIcon>
                <FeatureTitle>Full History</FeatureTitle>
                 <FeatureText>Our Snapshot Versioning System keeps a permanent record of your coding evolution[cite: 40, 152].</FeatureText>
              </FeatureCard>
            </FeatureGrid>
          </section>

          <section id="tech-stack">
            <SectionTitle>Technology Stack</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
               Built using a modern MERN stack architecture optimized for performance and scalability[cite: 39, 239].
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                <CodeBlockContainer style={{ padding: '2rem', margin: 0 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>Frontend</h3>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#e2e8f0', lineHeight: '2' }}>
                         <li><Zap size={14} style={{ marginRight: '10px' }}/> React.js & Next.js [cite: 108]</li>
                         <li><Zap size={14} style={{ marginRight: '10px' }}/> Tailwind CSS [cite: 109]</li>
                         <li><Zap size={14} style={{ marginRight: '10px' }}/> Framer Motion [cite: 110]</li>
                    </ul>
                </CodeBlockContainer>
                <CodeBlockContainer style={{ padding: '2rem', margin: 0 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#a78bfa' }}>Backend & Data</h3>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#e2e8f0', lineHeight: '2' }}>
                         <li><Server size={14} style={{ marginRight: '10px' }}/> Node.js & Express.js [cite: 111]</li>
                         <li><Database size={14} style={{ marginRight: '10px' }}/> MongoDB Atlas [cite: 112]</li>
                         <li><Lock size={14} style={{ marginRight: '10px' }}/> Clerk Authentication [cite: 116]</li>
                    </ul>
                </CodeBlockContainer>
            </div>
          </section>

          <section id="analysis">
            <SectionTitle>Intelligent Analysis</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
              The core of DevCompanion is its 5-point structured feedback system.   [cite: 147]  When you submit code, the Gemini API returns a strictly formatted JSON response [cite: 150] containing:
            </p>
            <FeatureGrid>
                <FeatureCard>
                    <FeatureTitle>1. Explanation</FeatureTitle>
                    <FeatureText>A natural language summary of what your code achieves.</FeatureText>
                </FeatureCard>
                 <FeatureCard>
                    <FeatureTitle>2. Issues & Bugs</FeatureTitle>
                    <FeatureText>Identification of syntax errors, logical flaws, or inefficiencies.</FeatureText>
                </FeatureCard>
                 <FeatureCard>
                    <FeatureTitle>3. Suggestions</FeatureTitle>
                    <FeatureText>Actionable advice on how to optimize or refactor the code.</FeatureText>
                </FeatureCard>
                 <FeatureCard>
                    <FeatureTitle>4. Concept Tags</FeatureTitle>
                     <FeatureText>Tags (e.g., "Recursion", "OOP") to help you categorize your learning[cite: 174].</FeatureText>
                </FeatureCard>
                 <FeatureCard>
                    <FeatureTitle>5. Test Cases</FeatureTitle>
                     <FeatureText>Auto-generated inputs and expected outputs to validate your logic[cite: 150].</FeatureText>
                </FeatureCard>
            </FeatureGrid>
          </section>

          <section id="languages">
            <SectionTitle>Supported Languages</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
               DevCompanion supports 13 programming languages, ensuring feedback respects language-specific idioms[cite: 129].
            </p>
            <TechBadgeContainer>
                {["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"].map(lang => (
                    <TechBadge key={lang}><Code2 size={14} /> {lang}</TechBadge>
                ))}
            </TechBadgeContainer>
          </section>

          <section id="architecture">
            <SectionTitle>System Architecture</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
              The system follows a Three-Tier Architecture separating Presentation, Application, and Data layers.   [cite: 132, 136]
            </p>
            <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', listStyleType: 'disc', paddingLeft: '20px' }}>
                <li><strong>Presentation Layer:</strong> React components handle UI/UX and state.</li>
                 <li><strong>Application Layer:</strong> Stateless Express.js APIs handle business logic and AI prompts[cite: 360].</li>
                 <li><strong>Data Layer:</strong> MongoDB stores user snapshots with embedded analysis results[cite: 364].</li>
            </ul>
          </section>

          <section id="api">
            <SectionTitle>API Reference</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
              The backend exposes RESTful endpoints.  Authentication is handled via Bearer tokens (Clerk)[cite: 226].
            </p>

            <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#22c55e', color: 'black', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>POST</span> 
                /api/analyze
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                 Analyzes submitted code and returns structured feedback. [cite: 591]
            </p>
            <CodeSnippet 
              language="json" 
              code={`// Request Body
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}

// Response (200 OK)
{
  "ok": true,
  "analysis": {
    "explanation": "A simple function that adds two numbers...",
    "issues": ["No input validation", "Missing JSDoc comments"],
    "suggestions": ["Add parameter type checking"],
    "conceptTags": ["functions", "arithmetic"],
    "testCases": [{
      "description": "Test with positive integers",
      "input": { "a": 5, "b": 3 },
      "expectedOutput": 8
    }]
  }
}`} 
            />

            <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#3b82f6', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>GET</span> 
                /api/snapshots
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                 Retrieves user's code submission history[cite: 595].
            </p>
          </section>

          <section id="future">
            <SectionTitle>Roadmap & Future Scope</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
               Based on our priority matrix[cite: 651], the following features are in active development:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <CodeBlockContainer style={{ padding: '1.5rem', margin: 0, borderLeft: '4px solid #ef4444' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Immediate (0-3 Months)</h4>
                     <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Code Generator Module, Monaco Editor Integration[cite: 258, 260].</p>
                </CodeBlockContainer>
                <CodeBlockContainer style={{ padding: '1.5rem', margin: 0, borderLeft: '4px solid #eab308' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Medium Term (6-12 Months)</h4>
                     <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>VS Code Extension, Collaborative Team Features, Analytics Dashboard[cite: 264, 266].</p>
                </CodeBlockContainer>
                <CodeBlockContainer style={{ padding: '1.5rem', margin: 0, borderLeft: '4px solid #22c55e' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Long Term (1-2 Years)</h4>
                     <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Enterprise Deployment, Mobile Apps (iOS/Android)[cite: 268].</p>
                </CodeBlockContainer>
            </div>
          </section>

        </MainContent>
      </DocsWrapper>
    </PageContainer>
  );
}
