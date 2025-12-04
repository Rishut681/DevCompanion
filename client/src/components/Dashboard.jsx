import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { MessageSquare, Code, Settings, Zap, Users, User, Clock, Sparkles, Terminal, Cpu, Shield, Rocket, ChevronDown } from 'lucide-react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import Link from "next/link";
import { useRouter } from 'next/navigation';

// === Advanced Keyframes ===
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { opacity: 1; box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  50% { transform: translateY(-100px) translateX(50px); opacity: 0.8; }
`;

const slideDown = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// === Global Styles ===
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: #000;
    color: white;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: rgba(59, 130, 246, 0.3);
    color: white;
  }
`;

// === Shared Styles ===
const MainLayout = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 50%, #000000 100%);
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

// === Animated Background ===
const AnimatedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
`;

const FloatingParticle = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.4;
  animation: ${particleFloat} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
  pointer-events: none;
`;

// === Navigation ===
const StyledNav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s;

  ${props => props.$scrolled && css`
    background: rgba(0, 0, 0, 0.95);
    box-shadow: 0 4px 30px rgba(59, 130, 246, 0.1);
  `}
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  position: relative;
`;

const Logo = styled(Link)`
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 2.5rem;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #9333ea);
    transition: width 0.3s;
  }

  &:hover {
    color: white;
    &::after {
      width: 100%;
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StyledButton = styled(motion.button)`
  padding: 0.65rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  ${props => props.$variant === 'outline' ? css`
    background: transparent;
    border: 1px solid rgba(59, 130, 246, 0.5);
    color: white;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover::before {
      opacity: 1;
    }
  ` : css`
    background: linear-gradient(135deg, #3b82f6, #9333ea);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);

    &:hover {
      box-shadow: 0 6px 25px rgba(59, 130, 246, 0.6);
      transform: translateY(-2px);
    }
  `}
`;

// === Hero Section ===
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rem;
  position: relative;
  z-index: 10;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const HeroText = styled.div`
  flex: 1;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
    max-width: 600px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 40px rgba(59, 130, 246, 0.3);

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 600px;

  @media (min-width: 768px) {
    font-size: 1.35rem;
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }

  & button {
    padding: 1rem 2.5rem;
    font-size: 1.05rem;
  }
`;

const HeroVisual = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ThreeDContainer = styled.div`
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  position: relative;
`;

const ThreeDCard = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 2rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 80px rgba(59, 130, 246, 0.2),
    inset 0 0 80px rgba(59, 130, 246, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent 50%, rgba(147, 51, 234, 0.1));
    animation: ${rotateGlow} 10s linear infinite;
  }
`;

const ThreeDTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  z-index: 10;
`;

const ThreeDBoxWrapper = styled.div`
  width: 200px;
  height: 200px;
  z-index: 10;
`;

const ThreeDSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 1rem;
  z-index: 10;
`;

// === Features Section ===
const FeaturesSection = styled.section`
  padding: 6rem 0;
  position: relative;
  z-index: 10;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.5rem;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0;
    transition: opacity 0.4s;
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);

    &::before {
      opacity: 1;
    }
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  flex: 1;
`;

const BetaBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const FeatureActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// === Problem/Solution Section ===
const ProblemSolutionSection = styled.section`
  padding: 6rem 0;
  position: relative;
  z-index: 10;
`;

const PSGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PSCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.5);
  border-radius: 1.5rem;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.$gradient};
    border-radius: 1.5rem;
    z-index: -1;
    opacity: 0.5;
  }
`;

const PSTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.$color};
`;

const PSList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PSListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 1rem;

  &::before {
    content: '${props => props.$icon}';
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
`;

// === CTA Section ===
const CTASection = styled.section`
  padding: 8rem 0;
  position: relative;
  z-index: 10;
`;

const CTAContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 2rem;
  padding: 4rem 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 70%);
  }
`;

const CTATitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #60a5fa, #ffffff, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const CTASubtitle = styled(motion.p)`
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2.5rem;
`;

const CTAActions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  & button {
    padding: 1rem 2.5rem;
    font-size: 1.05rem;
  }
`;

// === Footer ===
const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  padding: 3rem 0 1.5rem;
  position: relative;
  z-index: 10;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const FooterColumn = styled.div`
  ${props => props.$span && css`
    grid-column: span 2;
    
    @media (min-width: 768px) {
      grid-column: span 1;
    }
  `}
`;

const FooterTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;

  &:hover {
    color: #60a5fa;
  }
`;

const FooterBottom = styled.div`
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

// === Three.js Component ===
const ThreeDBox = () => {
  const mountRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!mountRef.current || isRendered) return;
    setIsRendered(true);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const lightA = new THREE.PointLight(0x3b82f6, 50, 100);
    lightA.position.set(5, 3, 5);
    scene.add(lightA);

    const lightB = new THREE.PointLight(0x9333ea, 50, 100);
    lightB.position.set(-5, -3, -5);
    scene.add(lightB);

    const ambient = new THREE.AmbientLight(0x202020);
    scene.add(ambient);

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.error('Cleanup error:', e);
        }
        renderer.dispose();
      }
    };
  }, [isRendered]);

  return <ThreeDBoxWrapper ref={mountRef} />;
};

// === Main Dashboard Component ===
const Dashboard = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    color: ['rgba(59, 130, 246, 0.5)', 'rgba(147, 51, 234, 0.5)', 'rgba(236, 72, 153, 0.5)'][i % 3],
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

  return (
    <MainLayout>
      <GlobalStyle />

      {/* Animated Background */}
      <AnimatedBackground>
        <GridPattern />
        {particles.map(p => (
          <FloatingParticle key={p.id} {...p} style={{ left: p.left, top: p.top }} />
        ))}
        <GlowOrb
          style={{
            top: '10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)',
          }}
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <GlowOrb
          style={{
            bottom: '10%',
            right: '10%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent 70%)',
          }}
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </AnimatedBackground>

      {/* Navigation */}
      <StyledNav
        $scrolled={scrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <ContentContainer>
          <NavContent>
            <Logo href="/">
              <LogoIcon>
                <Sparkles size={24} color="white" />
              </LogoIcon>
              <LogoText>DevCompanion</LogoText>
            </Logo>

            <NavLinks>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/docs">Docs</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </NavLinks>

            <NavActions>
              <Link href="/sign-in" passHref legacyBehavior>
                <a style={{ textDecoration: 'none' }}>
                  <StyledButton $variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Login
                  </StyledButton>
                </a>
              </Link>
              <Link href="/sign-up" passHref legacyBehavior>
                <a style={{ textDecoration: 'none' }}>
                  <StyledButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Rocket size={18} />
                    Get Started
                  </StyledButton>
                </a>
              </Link>
            </NavActions>
          </NavContent>
        </ContentContainer>
      </StyledNav>

      {/* Main Content */}
      <main style={{ paddingTop: '5rem' }}>
        {/* Hero Section */}
        <HeroSection>
          <ContentContainer>
            <HeroContent>
              <HeroText>
                <HeroTitle
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Engineer Smarter, Not Harder.
                </HeroTitle>
                <HeroSubtitle
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  DevCompanion is your AI co-pilot, transforming messy ideas into clean, efficient, and production-ready code instantly.
                </HeroSubtitle>
                <HeroActions
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link href="/sign-up" passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <StyledButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Zap size={20} />
                        Start Free Trial
                      </StyledButton>
                    </a>
                  </Link>
                  <Link href="/docs" passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <StyledButton $variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Code size={20} />
                        View Docs
                      </StyledButton>
                    </a>
                  </Link>
                </HeroActions>
              </HeroText>

              <HeroVisual
                initial={{ opacity: 0, x: 100, rotateY: 30 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <ThreeDContainer>
                  <ThreeDCard
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ThreeDTitle>AI Neural Core</ThreeDTitle>
                    <ThreeDBox />
                    <ThreeDSubtitle>Real-time processing engine</ThreeDSubtitle>
                  </ThreeDCard>
                </ThreeDContainer>
              </HeroVisual>
            </HeroContent>
          </ContentContainer>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection id="features">
          <ContentContainer>
            <SectionTitle
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Core Products
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Powerful AI-driven tools designed for modern developers
            </SectionSubtitle>

            <FeaturesGrid>
              <FeatureCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureHeader>
                  <FeatureIcon>
                    <Terminal size={32} color="#60a5fa" />
                  </FeatureIcon>
                  <FeatureTitle>Code Analyzer & Improver</FeatureTitle>
                </FeatureHeader>
                <FeatureDescription>
                  Submit any code snippet, large or small, and our AI instantly debugs, optimizes, and refactors it for performance, security, and readability.
                </FeatureDescription>
                <FeatureActions>
                  <Link href="/analyzer" passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <StyledButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Try Now
                      </StyledButton>
                    </a>
                  </Link>
                  <Link href="/pricing" passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <StyledButton $variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        View Pricing
                      </StyledButton>
                    </a>
                  </Link>
                </FeatureActions>
              </FeatureCard>

              <FeatureCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <FeatureHeader>
                  <FeatureIcon>
                    <Cpu size={32} color="#a78bfa" />
                  </FeatureIcon>
                  <FeatureTitle>Code Generator</FeatureTitle>
                  <BetaBadge>Beta</BetaBadge>
                </FeatureHeader>
                <FeatureDescription>
                  Describe the function you need in plain English and receive production-ready code in your language of choice (Python, JS, Go, etc.).
                </FeatureDescription>
                <FeatureActions>
                  <Link href="/generator" passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <StyledButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Try Beta
                      </StyledButton>
                    </a>
                  </Link>
                  <Link href="/pricing" passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <StyledButton $variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        View Pricing
                      </StyledButton>
                    </a>
                  </Link>
                </FeatureActions>
              </FeatureCard>
            </FeaturesGrid>
          </ContentContainer>
        </FeaturesSection>

        {/* Problem/Solution Section */}
        <ProblemSolutionSection>
          <ContentContainer>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <motion.p
                style={{
                  color: '#60a5fa',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: '0.9rem'
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Why DevCompanion?
              </motion.p>
              <SectionTitle
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Tackling the Real Challenges of Modern Coding
              </SectionTitle>
            </div>

            <PSGrid>
              <PSCard
                $gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.1))"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <PSTitle $color="#f87171">
                  <Shield size={32} />
                  The Problem
                </PSTitle>
                <PSList>
                  <PSListItem $icon="⚠️">
                    <strong>Debugging Fatigue:</strong> Hours lost tracking down obscure bugs and inconsistencies in codebases.
                  </PSListItem>
                  <PSListItem $icon="⚠️">
                    <strong>Technical Debt:</strong> Functional but poorly structured code that causes future headaches and slow performance.
                  </PSListItem>
                  <PSListItem $icon="⚠️">
                    <strong>Inconsistent Standards:</strong> Struggle to maintain unified code style and quality across large teams.
                  </PSListItem>
                </PSList>
              </PSCard>

              <PSCard
                $gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.1))"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <PSTitle $color="#4ade80">
                  <Sparkles size={32} />
                  The Solution
                </PSTitle>
                <PSList>
                  <PSListItem $icon="✅">
                    <strong>Instant Optimization:</strong> AI-driven analysis provides refactors that boost performance and efficiency.
                  </PSListItem>
                  <PSListItem $icon="✅">
                    <strong>Automated Quality Control:</strong> Enforce secure coding standards and prevent technical debt automatically.
                  </PSListItem>
                  <PSListItem $icon="✅">
                    <strong>One-Click Generation:</strong> Convert user stories and specs directly into functional code skeletons.
                  </PSListItem>
                </PSList>
              </PSCard>
            </PSGrid>
          </ContentContainer>
        </ProblemSolutionSection>

        {/* CTA Section */}
        <CTASection>
          <ContentContainer>
            <CTAContainer>
              <CTATitle
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to Ship Better Code, Faster?
              </CTATitle>
              <CTASubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of elite developers already leveraging DevCompanion.
              </CTASubtitle>
              <CTAActions
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="/sign-up" passHref legacyBehavior>
                  <a style={{ textDecoration: 'none' }}>
                    <StyledButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Rocket size={20} />
                      Get Started Free
                    </StyledButton>
                  </a>
                </Link>
                <Link href="/pricing" passHref legacyBehavior>
                  <a style={{ textDecoration: 'none' }}>
                    <StyledButton $variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      View All Plans
                    </StyledButton>
                  </a>
                </Link>
              </CTAActions>
            </CTAContainer>
          </ContentContainer>
        </CTASection>

        {/* Footer */}
        <Footer>
          <ContentContainer>
            <FooterGrid>
              <FooterColumn $span>
                <FooterTitle>DevCompanion</FooterTitle>
                <FooterText>
                  AI co-pilot for professional development workflows. Build better, ship faster.
                </FooterText>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Product</FooterTitle>
                <FooterLinks>
                  <li><FooterLink href="/analyzer">Analyzer</FooterLink></li>
                  <li><FooterLink href="/generator">Generator</FooterLink></li>
                  <li><FooterLink href="/pricing">Pricing</FooterLink></li>
                  <li><FooterLink href="/changelog">Changelog</FooterLink></li>
                </FooterLinks>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Resources</FooterTitle>
                <FooterLinks>
                  <li><FooterLink href="/docs">Documentation</FooterLink></li>
                  <li><FooterLink href="/blog">Blog</FooterLink></li>
                  <li><FooterLink href="/tutorials">Tutorials</FooterLink></li>
                  <li><FooterLink href="/api">API Reference</FooterLink></li>
                </FooterLinks>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Company</FooterTitle>
                <FooterLinks>
                  <li><FooterLink href="/about">About Us</FooterLink></li>
                  <li><FooterLink href="/careers">Careers</FooterLink></li>
                  <li><FooterLink href="/contact">Contact</FooterLink></li>
                  <li><FooterLink href="/press">Press Kit</FooterLink></li>
                </FooterLinks>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Legal</FooterTitle>
                <FooterLinks>
                  <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
                  <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
                  <li><FooterLink href="/security">Security</FooterLink></li>
                </FooterLinks>
              </FooterColumn>
            </FooterGrid>

            <FooterBottom>
              &copy; 2025 DevCompanion AI. All rights reserved. | Built with 💙 for developers worldwide.
            </FooterBottom>
          </ContentContainer>
        </Footer>
      </main>
    </MainLayout>
  );
};

export default Dashboard;