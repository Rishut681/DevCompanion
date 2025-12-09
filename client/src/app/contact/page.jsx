"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Twitter,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Clock,
  Zap,
  Code,
  Users
} from "lucide-react";
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

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 50%, #000000 100%);
  position: relative;
  overflow-x: hidden;
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
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 8s linear infinite;
  margin-bottom: 1.5rem;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 3vw, 1.35rem);
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

const FormSection = styled.div`
  animation: ${slideUp} 0.6s ease-out;
`;

const FormCard = styled.div`
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 30px;
  padding: 3rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.25rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 1rem 1.25rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  option {
    background: #0f172a;
    color: white;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  border: none;
  border-radius: 15px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  
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
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1));
  border: 2px solid rgba(34, 197, 94, 0.5);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${slideUp} 0.5s ease-out;
  
  svg {
    color: #4ade80;
    flex-shrink: 0;
  }
`;

const SuccessText = styled.div`
  h3 {
    color: white;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }
`;

const InfoSection = styled.div`
  animation: ${slideUp} 0.6s ease-out 0.2s both;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 25px;
  padding: 2.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateX(10px);
    box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
`;

const InfoTitle = styled.h3`
  color: white;
  font-size: 1.35rem;
  font-weight: 700;
`;

const InfoContent = styled.div`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  font-size: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    color: #60a5fa;
    flex-shrink: 0;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled.a`
  width: 45px;
  height: 45px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 600;
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 5000);
  };

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
          <Badge>💬 Get in Touch</Badge>
          <MainTitle>Let's Build Something Amazing Together</MainTitle>
          <Subtitle>
            Have questions about DevCompanion? Want to discuss enterprise solutions? 
            We're here to help you unlock the full potential of AI-powered development.
          </Subtitle>
        </HeroSection>

        <MainGrid>
          <FormSection>
            <FormCard>
              {!isSuccess ? (
                <FormContainer>
                  <FormGroup>
                    <Label>
                      <Mail size={18} />
                      Your Name
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Mail size={18} />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <MessageSquare size={18} />
                      Category
                    </Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Code size={18} />
                      Subject
                    </Label>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <MessageSquare size={18} />
                      Message
                    </Label>
                    <TextArea
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send size={20} />
                  </SubmitButton>
                </FormContainer>
              ) : (
                <SuccessMessage>
                  <CheckCircle2 size={48} />
                  <SuccessText>
                    <h3>Message Sent Successfully! 🎉</h3>
                    <p>
                      Thank you for reaching out! Our team will review your message and get back to you within 24 hours.
                    </p>
                  </SuccessText>
                </SuccessMessage>
              )}
            </FormCard>
          </FormSection>

          <InfoSection>
            <InfoGrid>
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <Zap size={24} color="#60a5fa" />
                  </InfoIcon>
                  <InfoTitle>Quick Response</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  <InfoItem>
                    <Clock size={20} />
                    <span>Average response time: 4 hours</span>
                  </InfoItem>
                  <InfoItem>
                    <Mail size={20} />
                    <span>support@devcompanion.ai</span>
                  </InfoItem>
                  <InfoItem>
                    <Phone size={20} />
                    <span>+1 (555) 123-4567</span>
                  </InfoItem>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <MapPin size={24} color="#a78bfa" />
                  </InfoIcon>
                  <InfoTitle>Our Location</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  <InfoItem>
                    <MapPin size={20} />
                    <span>San Francisco, CA 94102</span>
                  </InfoItem>
                  <InfoItem>
                    <Clock size={20} />
                    <span>Mon - Fri: 9:00 AM - 6:00 PM PST</span>
                  </InfoItem>
                  <InfoItem>
                    <Users size={20} />
                    <span>Global remote team available 24/7</span>
                  </InfoItem>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <Users size={24} color="#ec4899" />
                  </InfoIcon>
                  <InfoTitle>Connect With Us</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  <p style={{ marginBottom: '1rem' }}>
                    Follow us on social media for updates, tips, and developer insights.
                  </p>
                  <SocialLinks>
                    <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Twitter size={20} />
                    </SocialLink>
                    <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github size={20} />
                    </SocialLink>
                    <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} />
                    </SocialLink>
                  </SocialLinks>
                </InfoContent>
              </InfoCard>
            </InfoGrid>

            <StatsGrid>
              <StatCard>
                <StatNumber>10k+</StatNumber>
                <StatLabel>Active Users</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>24/7</StatNumber>
                <StatLabel>Support</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>99.9%</StatNumber>
                <StatLabel>Uptime</StatLabel>
              </StatCard>
            </StatsGrid>
          </InfoSection>
        </MainGrid>
      </ContentWrapper>
    </PageContainer>
  );
}
