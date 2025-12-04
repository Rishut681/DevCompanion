"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Sparkles, Check, Zap, ArrowLeft, Rocket, Shield, Code, Cpu, Star } from "lucide-react";
import Link from "next/link";

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  50% { transform: translateY(-100px) translateX(50px); opacity: 0.8; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 60px rgba(59, 130, 246, 0.8); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 50%, #000000 100%);
  position: relative;
  overflow-x: hidden;
  padding: 0;
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
    box-shadow: 
      ${Array.from({ length: 100 }, () => 
        `${Math.random() * 2000 - 1000}px ${Math.random() * 2000}px white`
      ).join(', ')};
    animation: ${float} ${Math.random() * 10 + 20}s ease-in-out infinite;
  }
  
  &::after {
    animation-delay: -10s;
  }
`;

const GridPattern = styled.div`
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
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
  
  &:nth-child(1) {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%);
    top: 10%;
    left: -10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.4), transparent 70%);
    top: 50%;
    right: -10%;
    animation-delay: -5s;
  }
  
  &:nth-child(3) {
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%);
    bottom: 10%;
    left: 30%;
    animation-delay: -10s;
  }
`;

const Navigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
`;

const NavContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
`;

const Logo = styled(Link)`
  font-size: 1.75rem;
  font-weight: 900;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
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

const ContentWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
  position: relative;
  z-index: 10;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding-top: 2rem;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50px;
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  animation: ${pulse} 3s ease-in-out infinite;
`;

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 8s linear infinite;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 0 80px rgba(59, 130, 246, 0.3);
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
`;

const ToggleLabel = styled.span`
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
`;

const ToggleSwitch = styled.button`
  width: 80px;
  height: 40px;
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.4);
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #3b82f6, #9333ea);
    border-radius: 50%;
    top: 2px;
    left: ${props => props.isYearly ? '42px' : '2px'};
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
  }
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.8);
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
  }
`;

const SaveBadge = styled.span`
  background: linear-gradient(135deg, #a855f7, #ec4899);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

const PricingCard = styled.div`
  background: ${props => props.featured 
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))' 
    : 'rgba(15, 23, 42, 0.5)'};
  backdrop-filter: blur(20px);
  border: 2px solid ${props => props.featured 
    ? 'rgba(59, 130, 246, 0.5)' 
    : 'rgba(59, 130, 246, 0.2)'};
  border-radius: 30px;
  padding: 3rem 2rem;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 30px;
    padding: 2px;
    background: ${props => props.featured 
      ? 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899, #3b82f6)' 
      : 'transparent'};
    background-size: 400% 400%;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: ${props => props.featured ? '1' : '0'};
    animation: ${props => props.featured ? shimmer : 'none'} 8s linear infinite;
    pointer-events: none;
  }
  
  &:hover {
    transform: scale(1.08) translateY(-10px);
    box-shadow: 0 30px 60px rgba(59, 130, 246, 0.4);
    border-color: rgba(59, 130, 246, 0.8);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -15px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${glow} 3s ease-in-out infinite;
`;

const PlanIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
`;

const PlanName = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const PlanDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  font-size: 0.95rem;
  text-align: center;
`;

const PriceWrapper = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  .currency {
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 700;
  }
  
  .amount {
    font-size: 4rem;
    font-weight: 900;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .period {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.5);
  }
`;

const PriceNote = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  
  svg {
    flex-shrink: 0;
    margin-top: 0.1rem;
    color: #60a5fa;
  }
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #3b82f6, #9333ea)' 
    : 'rgba(59, 130, 246, 0.1)'};
  border: 2px solid ${props => props.primary 
    ? 'transparent' 
    : 'rgba(59, 130, 246, 0.3)'};
  border-radius: 15px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px ${props => props.primary 
      ? 'rgba(59, 130, 246, 0.5)' 
      : 'rgba(59, 130, 246, 0.2)'};
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`;

const FAQSection = styled.div`
  max-width: 900px;
  margin: 6rem auto 0;
`;

const FAQTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FAQGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const FAQItem = styled.div`
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(15, 23, 42, 0.7);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateX(10px);
  }
`;

const FAQQuestion = styled.h4`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FAQAnswer = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: <Code size={28} />,
      description: "Perfect for learning and small projects",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "100 AI code generations/month",
        "Basic code mentoring",
        "Community support",
        "Standard response time",
        "Access to core features",
        "Code analysis tools",
      ],
      cta: "Get Started Free",
      primary: false,
    },
    {
      name: "Pro",
      icon: <Rocket size={28} />,
      description: "For professional developers and teams",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "Unlimited AI code generations",
        "Advanced code mentoring",
        "Priority support (24/7)",
        "Lightning-fast responses",
        "Custom code templates",
        "Team collaboration tools",
        "Advanced debugging assistance",
        "API access",
        "Custom integrations",
      ],
      cta: "Upgrade to Pro",
      primary: true,
      popular: true,
    },
    {
      name: "Enterprise",
      icon: <Shield size={28} />,
      description: "Custom solutions for large organizations",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Everything in Pro",
        "Dedicated AI model training",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "On-premise deployment option",
        "Advanced security features",
        "Custom billing",
        "White-label solutions",
      ],
      cta: "Contact Sales",
      primary: false,
    },
  ];

  const faqs = [
    {
      icon: <Sparkles size={20} />,
      question: "What makes DevCompanion different?",
      answer: "DevCompanion uses cutting-edge AI to not just generate code, but to mentor you through the entire development process. It's like having a senior developer available 24/7, understanding your context and providing personalized guidance."
    },
    {
      icon: <Zap size={20} />,
      question: "Can I upgrade or downgrade anytime?",
      answer: "Absolutely! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle. No hidden fees or penalties."
    },
    {
      icon: <Code size={20} />,
      question: "What programming languages are supported?",
      answer: "DevCompanion supports all major programming languages including JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, and many more. Our AI is continuously learning new languages and frameworks."
    },
    {
      icon: <Shield size={20} />,
      question: "Is my code secure and private?",
      answer: "Yes! We use enterprise-grade encryption and never store your code permanently. Your intellectual property remains yours, always. We're SOC 2 compliant and follow industry best practices for data security."
    },
  ];

  return (
    <PageContainer>
      <StarField />
      <GridPattern />
      <FloatingOrb />
      <FloatingOrb />
      <FloatingOrb />
      
      <Navigation>
        <NavContent>
          <Logo href="/">
            <LogoIcon>
              <Sparkles size={24} color="white" />
            </LogoIcon>
            <LogoText>DevCompanion</LogoText>
          </Logo>
          
          <BackButton href="/">
            <ArrowLeft size={18} />
            Back to Home
          </BackButton>
        </NavContent>
      </Navigation>

      <ContentWrapper>
        <HeroSection>
          <Badge>✨ AI-Powered Coding Excellence</Badge>
          <MainTitle>Choose Your Power Level</MainTitle>
          <Subtitle>
            Transform your coding journey with DevCompanion's AI mentor. 
            Get expert guidance, generate flawless code, and level up your skills faster than ever.
          </Subtitle>
          
          <ToggleWrapper>
            <ToggleLabel active={!isYearly}>Monthly</ToggleLabel>
            <ToggleSwitch 
              isYearly={isYearly} 
              onClick={() => setIsYearly(!isYearly)}
            />
            <ToggleLabel active={isYearly}>
              Yearly <SaveBadge>Save 20%</SaveBadge>
            </ToggleLabel>
          </ToggleWrapper>
        </HeroSection>

        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard key={index} featured={plan.popular}>
              {plan.popular && (
                <PopularBadge>
                  <Star size={16} fill="currentColor" />
                  Most Popular
                </PopularBadge>
              )}
              
              <PlanIcon>{plan.icon}</PlanIcon>
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              
              <PriceWrapper>
                <Price>
                  {typeof plan.monthlyPrice === 'number' ? (
                    <>
                      <span className="currency">$</span>
                      <span className="amount">
                        {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="period">/{isYearly ? 'year' : 'month'}</span>
                    </>
                  ) : (
                    <span className="amount" style={{ fontSize: '2.5rem' }}>
                      {plan.monthlyPrice}
                    </span>
                  )}
                </Price>
                {typeof plan.monthlyPrice === 'number' && isYearly && plan.monthlyPrice > 0 && (
                  <PriceNote>Billed ${plan.yearlyPrice} annually</PriceNote>
                )}
              </PriceWrapper>
              
              <FeatureList>
                {plan.features.map((feature, i) => (
                  <Feature key={i}>
                    <Check size={20} />
                    <span>{feature}</span>
                  </Feature>
                ))}
              </FeatureList>
              
              <Link href="/sign-up" style={{ textDecoration: 'none' }}>
                <CTAButton primary={plan.primary}>
                  <span>{plan.cta}</span>
                  {plan.primary && <Rocket size={18} />}
                </CTAButton>
              </Link>
            </PricingCard>
          ))}
        </PricingGrid>

        <FAQSection>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          
          <FAQGrid>
            {faqs.map((faq, index) => (
              <FAQItem key={index}>
                <FAQQuestion>
                  {faq.icon}
                  {faq.question}
                </FAQQuestion>
                <FAQAnswer>{faq.answer}</FAQAnswer>
              </FAQItem>
            ))}
          </FAQGrid>
        </FAQSection>
      </ContentWrapper>
    </PageContainer>
  );
}