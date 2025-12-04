"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
  Sparkles,
  ArrowLeft,
  Play,
  Terminal,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Code2,
  Zap,
  Download,
  Copy,
  Share2,
  History,
  Settings,
  Loader2,
  FileCode,
  ChevronDown,
  Tag,
  Clock,
  User,
  TrendingUp
} from 'lucide-react';

// === Keyframes ===
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const slideInFromBottom = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// === Global Styles ===
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

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

// === Layout ===
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
  opacity: 0.15;
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

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;

  &:hover {
    color: white;
    background: rgba(59, 130, 246, 0.1);
  }
`;

const NavTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

// === Main Content ===
const MainContent = styled.main`
  padding-top: 7rem;
  padding-bottom: 4rem;
  position: relative;
  z-index: 10;
  max-width: 95rem;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const EditorSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1280px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LanguageSelector = styled.div`
  position: relative;
`;

const Select = styled.select`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
  color: white;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  font-family: 'JetBrains Mono', monospace;
  appearance: none;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.5);
  }

  &:focus {
    border-color: rgba(59, 130, 246, 0.7);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  option {
    background: #1e293b;
    color: white;
  }
`;

const SelectIcon = styled(ChevronDown)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(255, 255, 255, 0.5);
`;

const CodeEditor = styled.textarea`
  width: 100%;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  color: #e2e8f0;
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  ${props => props.$variant === 'primary' && `
    background: linear-gradient(135deg, #3b82f6, #9333ea);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);

    &:hover:not(:disabled) {
      box-shadow: 0 6px 25px rgba(59, 130, 246, 0.6);
      transform: translateY(-2px);
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: white;

    &:hover:not(:disabled) {
      background: rgba(59, 130, 246, 0.2);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(Loader2)`
  animation: ${rotate} 1s linear infinite;
`;

// === Results Section ===
const ResultsSection = styled(motion.div)`
  display: grid;
  gap: 1.5rem;
`;

const ResultCard = styled(Card)`
  animation: ${slideInFromBottom} 0.5s ease-out;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
`;

const ExplanationText = styled.p`
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  font-size: 1rem;
`;

const IssuesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const IssueItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateX(5px);
  }
`;

const SuggestionItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.75rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.5);
    transform: translateX(5px);
  }
`;

const ItemIcon = styled.div`
  flex-shrink: 0;
  margin-top: 0.1rem;
`;

const ItemText = styled.div`
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  flex: 1;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagBadge = styled.span`
  padding: 0.35rem 0.85rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50px;
  font-size: 0.85rem;
  color: #60a5fa;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.25);
    transform: scale(1.05);
  }
`;

const TestCaseItem = styled(motion.div)`
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.4);
  }
`;

const TestCaseTitle = styled.div`
  font-weight: 600;
  color: #60a5fa;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TestCaseContent = styled.pre`
  background: rgba(0, 0, 0, 0.5);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
`;

const EmptyStateSubtext = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.4);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-3px);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

// === Analyzer Page Component ===
const AnalyzerPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState<string |null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('https://devcompanion.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze code. Please check your backend connection.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (results) {
      navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    }
  };

  const handleClear = () => {
    setCode('');
    setResults(null);
    setError(null);
  };

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <PageWrapper>
      <GlobalStyle />

      {/* Animated Background */}
      <AnimatedBackground>
        <GridPattern />
        <GlowOrb
          style={{
            top: '20%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <GlowOrb
          style={{
            bottom: '20%',
            right: '10%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent 70%)',
          }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
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
          <BackButton href="/model">
            <ArrowLeft size={20} />
            Back to Dashboard
          </BackButton>
          <NavTitle>
            <Terminal size={24} style={{ display: 'inline', verticalAlign: 'middle' }} />
            {' '}Code Analyzer
          </NavTitle>
          <div style={{ width: '150px' }} /> {/* Spacer for centering */}
        </NavContainer>
      </Nav>

      {/* Main Content */}
      <MainContent>
        <EditorSection>
          {/* Code Input Card */}
          <Card
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardHeader>
              <CardTitle>
                <Code2 size={24} color="#60a5fa" />
                Code Input
              </CardTitle>
              <LanguageSelector>
                <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                </Select>
                <SelectIcon size={16} />
              </LanguageSelector>
            </CardHeader>

            <CodeEditor
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your ${language} code here...\n\nfunction example() {\n  // Your code\n}`}
            />

            <ActionBar>
              <Button
                $variant="primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Analyze Code
                  </>
                )}
              </Button>

              <Button
                $variant="secondary"
                onClick={handleClear}
                disabled={isAnalyzing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear
              </Button>
            </ActionBar>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.75rem',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <AlertTriangle size={20} />
                {error}
              </motion.div>
            )}
          </Card>

          {/* Quick Stats */}
          {results && (
            <Card
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardHeader>
                <CardTitle>
                  <TrendingUp size={24} color="#a78bfa" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>

              <StatsGrid>
                <StatCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <StatIcon>
                    <AlertTriangle size={24} color="#f87171" />
                  </StatIcon>
                  <StatContent>
                    <StatLabel>Issues Found</StatLabel>
                    <StatValue>{results.issues?.length || 0}</StatValue>
                  </StatContent>
                </StatCard>

                <StatCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <StatIcon>
                    <Lightbulb size={24} color="#4ade80" />
                  </StatIcon>
                  <StatContent>
                    <StatLabel>Suggestions</StatLabel>
                    <StatValue>{results.suggestions?.length || 0}</StatValue>
                  </StatContent>
                </StatCard>

                <StatCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <StatIcon>
                    <Tag size={24} color="#60a5fa" />
                  </StatIcon>
                  <StatContent>
                    <StatLabel>Concepts</StatLabel>
                    <StatValue>{results.conceptTags?.length || 0}</StatValue>
                  </StatContent>
                </StatCard>

                <StatCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <StatIcon>
                    <CheckCircle2 size={24} color="#a78bfa" />
                  </StatIcon>
                  <StatContent>
                    <StatLabel>Test Cases</StatLabel>
                    <StatValue>{results.testCases?.length || 0}</StatValue>
                  </StatContent>
                </StatCard>
              </StatsGrid>
            </Card>
          )}
        </EditorSection>

        {/* Results Section */}
        {results && (
          <ResultsSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Explanation */}
            <ResultCard>
              <SectionTitle>
                <FileCode size={24} color="#60a5fa" />
                Code Explanation
              </SectionTitle>
              <ExplanationText>{results.explanation}</ExplanationText>
            </ResultCard>

            {/* Issues */}
            {results.issues && results.issues.length > 0 && (
              <ResultCard>
                <SectionTitle>
                  <AlertTriangle size={24} color="#f87171" />
                  Issues & Bugs ({results.issues.length})
                </SectionTitle>
                <IssuesList>
                  {results.issues.map((issue, index) => (
                    <IssueItem
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ItemIcon>
                        <XCircle size={20} color="#f87171" />
                      </ItemIcon>
                      <ItemText>{issue}</ItemText>
                    </IssueItem>
                  ))}
                </IssuesList>
              </ResultCard>
            )}

            {/* Suggestions */}
            {results.suggestions && results.suggestions.length > 0 && (
              <ResultCard>
                <SectionTitle>
                  <Lightbulb size={24} color="#4ade80" />
                  Suggestions & Improvements ({results.suggestions.length})
                </SectionTitle>
                <IssuesList>
                  {results.suggestions.map((suggestion, index) => (
                    <SuggestionItem
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ItemIcon>
                        <CheckCircle2 size={20} color="#4ade80" />
                      </ItemIcon>
                      <ItemText>{suggestion}</ItemText>
                    </SuggestionItem>
                  ))}
                </IssuesList>
              </ResultCard>
            )}

            {/* Concept Tags */}
            {results.conceptTags && results.conceptTags.length > 0 && (
              <ResultCard>
                <SectionTitle>
                  <Tag size={24} color="#60a5fa" />
                  Concepts & Topics
                </SectionTitle>
                <TagsContainer>
                  {results.conceptTags.map((tag, index) => (
                    <TagBadge key={index}>
                      <Sparkles size={14} />
                      {tag}
                    </TagBadge>
                  ))}
                </TagsContainer>
              </ResultCard>
            )}

            {/* Test Cases */}
            {results.testCases && results.testCases.length > 0 && (
              <ResultCard>
                <SectionTitle>
                  <CheckCircle2 size={24} color="#a78bfa" />
                  Test Cases ({results.testCases.length})
                </SectionTitle>
                <IssuesList>
                  {results.testCases.map((testCase, index) => (
                    <TestCaseItem
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TestCaseTitle>
                        <Terminal size={16} />
                        {testCase.description || `Test Case ${index + 1}`}
                      </TestCaseTitle>
                      {testCase.input && (
                        <TestCaseContent>
                          <div style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>Input:</div>
                          {JSON.stringify(testCase.input, null, 2)}
                        </TestCaseContent>
                      )}
                      {testCase.expectedOutput !== undefined && (
                        <TestCaseContent>
                          <div style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Expected Output:</div>
                          {JSON.stringify(testCase.expectedOutput, null, 2)}
                        </TestCaseContent>
                      )}
                    </TestCaseItem>
                  ))}
                </IssuesList>
              </ResultCard>
            )}

            {/* Action Buttons */}
            <ResultCard>
              <ActionBar>
                <Button
                  $variant="secondary"
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={18} />
                  Copy Results
                </Button>
                <Button
                  $variant="secondary"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `analysis-${Date.now()}.json`;
                    a.click();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={18} />
                  Download JSON
                </Button>
              </ActionBar>
            </ResultCard>
          </ResultsSection>
        )}

        {/* Empty State */}
        {!results && !isAnalyzing && !error && (
          <Card>
            <EmptyState>
              <EmptyStateIcon>
                <Terminal size={80} color="rgba(59, 130, 246, 0.3)" />
              </EmptyStateIcon>
              <EmptyStateText>Ready to Analyze Your Code</EmptyStateText>
              <EmptyStateSubtext>
                Paste your code above and click &quot;"Analyze Code"&quot; to get AI-powered insights
              </EmptyStateSubtext>
            </EmptyState>
          </Card>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default AnalyzerPage;
