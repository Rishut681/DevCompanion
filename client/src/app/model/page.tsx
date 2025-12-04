"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Zap,
  Settings,
  CreditCard,
  User as UserIcon,
  LogOut,
  Crown,
  ChevronDown,
  Code,
  Rocket
} from 'lucide-react';

// === Keyframes ===
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const rotateGradient = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
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
    background: #000;
    color: white;
    overflow-x: hidden;
  }

  ::selection {
    background: rgba(59, 130, 246, 0.3);
    color: white;
  }
`;

// === Layout Components ===
const PageWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 50%, #000000 100%);
  position: relative;
  overflow: hidden;
`;

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
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
`;

// === Navigation ===
const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
`;

const NavContainer = styled.div`
  max-width: 90rem;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 900;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
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

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const AccountButton = styled(motion.button)`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(59, 130, 246, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AccountDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 1rem);
  right: 2rem;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 1rem;
  padding: 1rem;
  min-width: 280px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const DropdownAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DropdownUserName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
`;

const DropdownEmail = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
`;

const PlanBadge = styled.div`
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
`;

const DropdownMenu = styled.div`
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled(Link)`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s;
  font-size: 0.95rem;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: white;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
`;

const SignOutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f87171;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  font-family: inherit;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// === Main Content ===
const MainContent = styled.main`
  padding-top: 8rem;
  padding-bottom: 4rem;
  position: relative;
  z-index: 10;
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 2rem;
`;

const WelcomeSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const WelcomeTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const WelcomeSubtitle = styled(motion.p)`
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ModelCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 2rem;
  padding: 3rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(59, 130, 246, 0.1) 90deg,
      transparent 180deg
    );
    animation: ${rotateGradient} 6s linear infinite;
    opacity: 0;
    transition: opacity 0.4s;
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-10px);
    box-shadow: 0 30px 80px rgba(59, 130, 246, 0.3);

    &::before {
      opacity: 1;
    }
  }
`;

const ModelIconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
  animation: ${floatAnimation} 3s ease-in-out infinite;
  position: relative;
  z-index: 10;
`;

const ModelTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: white;
  position: relative;
  z-index: 10;
`;

const ModelDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 2rem;
  font-size: 1.05rem;
  position: relative;
  z-index: 10;
`;

const ModelFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 10;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;

  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: rgba(59, 130, 246, 0.2);
    border-radius: 50%;
    color: #60a5fa;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const TryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  position: relative;
  z-index: 10;
  width: fit-content;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 6px 25px rgba(59, 130, 246, 0.6);
  }
`;

const BetaBadge = styled.span`
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.35rem 0.85rem;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
  animation: ${pulseGlow} 2s ease-in-out infinite;
  z-index: 10;
`;

// === Dashboard Page Component ===
const ModelDashboard = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded || !user) {
    return null; // or loading spinner
  }

  const userName = user.firstName || user.username || 'User';
  const userEmail = user.primaryEmailAddress?.emailAddress || '';
  const userImage = user.imageUrl || '';

  return (
    <PageWrapper>
      <GlobalStyle />

      {/* Animated Background */}
      <AnimatedBackground>
        <GridPattern />
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
      <Nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <NavContainer>
          <Logo href="/">
            <LogoIcon>
              <Sparkles size={24} color="white" />
            </LogoIcon>
            <LogoText>DevCompanion</LogoText>
          </Logo>

          <NavRight>
            <AccountButton
              onClick={() => setShowDropdown(!showDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserAvatar>
                {userImage ? (
                  <Image src={userImage} alt={userName} />
                ) : (
                  <UserIcon size={18} />
                )}
              </UserAvatar>
              <span>{userName}</span>
              <ChevronDown size={16} style={{ 
                transition: 'transform 0.3s',
                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
              }} />
            </AccountButton>

            <AnimatePresence>
              {showDropdown && (
                <AccountDropdown
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownHeader>
                    <DropdownAvatar>
                      {userImage ? (
                        <img src={userImage} alt={userName} />
                      ) : (
                        <UserIcon size={28} />
                      )}
                    </DropdownAvatar>
                    <DropdownUserName>{userName}</DropdownUserName>
                    <DropdownEmail>{userEmail}</DropdownEmail>
                    <PlanBadge>
                      <Crown size={14} />
                      Free Plan
                    </PlanBadge>
                  </DropdownHeader>

                  <DropdownMenu>
                    <DropdownItem href="/account">
                      <UserIcon />
                      Account Settings
                    </DropdownItem>
                    <DropdownItem href="/subscription">
                      <CreditCard />
                      Manage Subscription
                    </DropdownItem>
                    <DropdownItem href="/pricing">
                      <Crown />
                      Upgrade Plan
                    </DropdownItem>
                    <DropdownItem href="/settings">
                      <Settings />
                      Preferences
                    </DropdownItem>

                    <DropdownDivider />

                    <SignOutButton onClick={handleSignOut}>
                      <LogOut />
                      Sign Out
                    </SignOutButton>
                  </DropdownMenu>
                </AccountDropdown>
              )}
            </AnimatePresence>
          </NavRight>
        </NavContainer>
      </Nav>

      {/* Main Content */}
      <MainContent>
        <Container>
          <WelcomeSection
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <WelcomeTitle>
              Welcome back, {userName}! 👋
            </WelcomeTitle>
            <WelcomeSubtitle>
              Choose an AI model to start building amazing code. Our powerful tools are ready to accelerate your development workflow.
            </WelcomeSubtitle>
          </WelcomeSection>

          <ModelsGrid>
            {/* Code Analyzer Card */}
            <ModelCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <ModelIconWrapper>
                <Terminal size={40} color="#60a5fa" />
              </ModelIconWrapper>
              
              <ModelTitle>Code Analyzer</ModelTitle>
              
              <ModelDescription>
                Submit any code snippet and get instant AI-powered analysis, debugging, optimization, and refactoring suggestions for peak performance.
              </ModelDescription>

              <ModelFeatures>
                <FeatureItem>Advanced bug detection & fixes</FeatureItem>
                <FeatureItem>Performance optimization</FeatureItem>
                <FeatureItem>Security vulnerability scanning</FeatureItem>
                <FeatureItem>Code quality improvements</FeatureItem>
                <FeatureItem>Best practices enforcement</FeatureItem>
              </ModelFeatures>

              <TryButton href="/analyzer">
                Try Now
                <ArrowRight size={20} />
              </TryButton>
            </ModelCard>

            {/* Code Generator Card */}
            <ModelCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <BetaBadge>Beta</BetaBadge>
              
              <ModelIconWrapper>
                <Cpu size={40} color="#a78bfa" />
              </ModelIconWrapper>
              
              <ModelTitle>Code Generator</ModelTitle>
              
              <ModelDescription>
                Describe what you need in plain English and watch as AI generates production-ready code in your preferred programming language.
              </ModelDescription>

              <ModelFeatures>
                <FeatureItem>Natural language to code</FeatureItem>
                <FeatureItem>Multi-language support</FeatureItem>
                <FeatureItem>Context-aware generation</FeatureItem>
                <FeatureItem>Unit tests included</FeatureItem>
                <FeatureItem>Documentation auto-generated</FeatureItem>
              </ModelFeatures>

              <TryButton href="/generator">
                Try Beta
                <Rocket size={20} />
              </TryButton>
            </ModelCard>
          </ModelsGrid>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default ModelDashboard;
