"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// === Advanced Animations ===
const orbitRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const orbitRotateReverse = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const pulseRing = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) rotate(360deg); opacity: 0; }
`;

const dataStream = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const glitchEffect = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

// === Styled Components ===
const Screen = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: radial-gradient(ellipse at center, #0f172a 0%, #020617 70%, #000000 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 1;
`;

const ParticleContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
`;

const Particle = styled.div`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  background: ${p => p.color};
  border-radius: 50%;
  box-shadow: 0 0 ${p => p.size * 2}px ${p => p.color};
  animation: ${particleFloat} ${p => p.duration}s ease-in-out infinite;
  animation-delay: ${p => p.delay}s;
  left: ${p => p.x}%;
  top: ${p => p.y}%;
  --tx: ${p => p.tx}px;
  --ty: ${p => p.ty}px;
`;

const DataStream = styled.div`
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, ${p => p.color}, transparent);
  animation: ${dataStream} ${p => p.duration}s linear infinite;
  animation-delay: ${p => p.delay}s;
  left: ${p => p.x}%;
  opacity: 0.6;
  filter: blur(1px);
`;

const CoreWrapper = styled(motion.div)`
  position: relative;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  @media (min-width: 768px) {
    width: 24rem;
    height: 24rem;
  }
`;

const OuterRing = styled.div`
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(45deg, #3b82f6, #9333ea, #ec4899) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ${orbitRotate} 8s linear infinite;
  opacity: 0.5;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 10px;
    height: 10px;
    background: #3b82f6;
    border-radius: 50%;
    box-shadow: 0 0 20px #3b82f6;
    transform: translateX(-50%);
  }
`;

const MiddleRing = styled.div`
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 1px solid rgba(147, 51, 234, 0.4);
  animation: ${pulseRing} 3s ease-in-out infinite;
  box-shadow: 
    0 0 30px rgba(147, 51, 234, 0.3),
    inset 0 0 30px rgba(147, 51, 234, 0.1);
`;

const InnerRing = styled.div`
  position: absolute;
  inset: 30px;
  border-radius: 50%;
  border: 1px solid rgba(59, 130, 246, 0.4);
  animation: ${orbitRotateReverse} 12s linear infinite;
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.3),
    inset 0 0 30px rgba(59, 130, 246, 0.1);

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 50%;
    width: 8px;
    height: 8px;
    background: #9333ea;
    border-radius: 50%;
    box-shadow: 0 0 15px #9333ea;
    transform: translateX(50%);
  }
`;

const CenterCore = styled(motion.div)`
  position: relative;
  width: 140px;
  height: 140px;
  background: 
    radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3), transparent 50%),
    radial-gradient(circle at center, rgba(0, 0, 0, 0.95), rgba(15, 23, 42, 0.8));
  border: 3px solid rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 40px rgba(59, 130, 246, 0.4),
    0 0 80px rgba(147, 51, 234, 0.3),
    inset 0 0 40px rgba(59, 130, 246, 0.1);
  animation: ${float} 4s ease-in-out infinite;

  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

const AIText = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
  letter-spacing: 0.1em;
  position: relative;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }

  &::before {
    content: 'AI';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: blur(10px);
    opacity: 0.7;
  }
`;

const Title = styled(motion.h1)`
  margin-top: 3rem;
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${shimmer} 3s linear infinite;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 10;

  @media (min-width: 768px) {
    font-size: 4rem;
  }

  span {
    display: inline-block;
    background: linear-gradient(135deg, #a855f7, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Subtitle = styled(motion.p)`
  color: rgba(156, 163, 175, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-top: 0.5rem;
  text-align: center;
`;

const ProgressSection = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 3rem;
  z-index: 10;
  padding: 0 1rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(59, 130, 246, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(59, 130, 246, 0.1) 50%, 
      transparent 100%);
    animation: ${shimmer} 2s linear infinite;
  }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #9333ea, #ec4899);
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.6),
    0 0 40px rgba(147, 51, 234, 0.4);
  position: relative;
  border-radius: 1rem;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent);
    animation: ${shimmer} 1.5s linear infinite;
  }
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
`;

const StatusCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
`;

const StatusLabel = styled.div`
  color: rgba(148, 163, 184, 0.7);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const StatusValue = styled.div`
  color: #60a5fa;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
`;

const MainStatus = styled(motion.p)`
  color: rgba(156, 163, 175, 0.9);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1.5rem;
  letter-spacing: 0.05em;
`;

const GlitchText = styled.span`
  display: inline-block;
  animation: ${glitchEffect} 0.3s ease-in-out;
`;

// === Main Component ===
const LoadingScreen = ({ progress = 0 }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing Neural Networks");
  const [systemStats, setSystemStats] = useState({
    nodes: 0,
    throughput: "0.0",
    latency: "0",
    quantum: "0"
  });

  useEffect(() => {
    // Smooth progress animation
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.1) return progress;
        return prev + diff * 0.1;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    // Dynamic status messages
    const messages = [
      "Initializing Neural Networks",
      "Calibrating Quantum Processors",
      "Synchronizing Data Streams",
      "Optimizing AI Modules",
      "Loading Knowledge Base",
      "Establishing Secure Connection",
      "Activating Intelligence Layer"
    ];

    const index = Math.floor((displayProgress / 100) * (messages.length - 1));
    setStatusMessage(messages[index]);

    // Simulate system stats
    setSystemStats({
      nodes: Math.floor(displayProgress * 12.8),
      throughput: (displayProgress * 0.958).toFixed(1),
      latency: Math.max(1, Math.floor(50 - displayProgress * 0.45)),
      quantum: Math.floor(displayProgress * 0.99)
    });
  }, [displayProgress]);

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    color: ['rgba(59, 130, 246, 0.6)', 'rgba(147, 51, 234, 0.6)', 'rgba(236, 72, 153, 0.6)'][i % 3],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 5,
    tx: (Math.random() - 0.5) * 200,
    ty: (Math.random() - 0.5) * 200
  }));

  // Generate data streams
  const dataStreams = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    color: ['#3b82f6', '#9333ea', '#ec4899'][i % 3],
    x: (i + 1) * 11 + Math.random() * 5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3
  }));

  const exitVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.7, ease: [0.76, 0.0, 0.24, 1.0] },
    },
  };

  return (
    <Screen
      variants={exitVariants}
      initial={{ opacity: 1, scale: 1 }}
      exit="exit"
    >
      <GridOverlay />
      
      <ParticleContainer>
        {particles.map(p => (
          <Particle key={p.id} {...p} />
        ))}
        {dataStreams.map(s => (
          <DataStream key={s.id} {...s} />
        ))}
      </ParticleContainer>

      <CoreWrapper
        initial={{ opacity: 0, scale: 0.5, rotateX: 180 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ 
          duration: 1.5, 
          type: "spring", 
          stiffness: 50,
          delay: 0.2 
        }}
      >
        <OuterRing />
        <MiddleRing />
        <InnerRing />
        <CenterCore
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AIText>AI</AIText>
        </CenterCore>
      </CoreWrapper>

      <Title
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Dev<span>Companion</span>
      </Title>

      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        Next-Gen Intelligence
      </Subtitle>

      <ProgressSection>
        <ProgressBarContainer>
          <ProgressFill
            initial={{ width: "0%" }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </ProgressBarContainer>

        <StatusGrid>
          <StatusCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <StatusLabel>Active Nodes</StatusLabel>
            <StatusValue>{systemStats.nodes}/1280</StatusValue>
          </StatusCard>

          <StatusCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <StatusLabel>Throughput</StatusLabel>
            <StatusValue>{systemStats.throughput} GB/s</StatusValue>
          </StatusCard>

          <StatusCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <StatusLabel>Latency</StatusLabel>
            <StatusValue>{systemStats.latency} ms</StatusValue>
          </StatusCard>

          <StatusCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <StatusLabel>Quantum Sync</StatusLabel>
            <StatusValue>{systemStats.quantum}%</StatusValue>
          </StatusCard>
        </StatusGrid>

        <MainStatus
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <GlitchText key={statusMessage}>{statusMessage}</GlitchText>
          {" "}• {Math.round(displayProgress)}%
        </MainStatus>
      </ProgressSection>
    </Screen>
  );
};

export default LoadingScreen;