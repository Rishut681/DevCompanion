"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import styled from "styled-components";

const PageContainer = styled.div`
  max-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // overflow: hidden;
`;

const BackgroundBlobs = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(80px);
  opacity: 0.2;
  animation: blob 7s infinite;

  &:nth-child(1) {
    top: -10rem;
    right: -10rem;
    width: 20rem;
    height: 20rem;
    background: #a855f7;
  }

  &:nth-child(2) {
    bottom: -10rem;
    left: -10rem;
    width: 20rem;
    height: 20rem;
    background: #3b82f6;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20rem;
    height: 20rem;
    background: #ec4899;
    animation-delay: 4s;
  }

  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 28rem;
`;

const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 1rem;
  // margin-bottom: 1rem;
  margin-top: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);

  svg {
    width: 2rem;
    height: 2rem;
    color: white;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #d1d5db;
  font-size: 1.125rem;
`;

const CardWrapper = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
`;

const FooterText = styled.div`
  margin-top: 1.5rem;
  text-align: center;

  p {
    color: #9ca3af;
    font-size: 0.875rem;
  }
`;

const GlobalClerkStyles = styled.div`
  /* Clerk component styling */
  .cl-rootBox {
    width: 100%;
  }

  .cl-card {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .cl-headerTitle {
    color: white !important;
    font-size: 1.5rem !important;
    font-weight: 700 !important;
  }

  .cl-headerSubtitle {
    color: #d1d5db !important;
  }

  .cl-socialButtonsBlockButton {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    transition: all 0.3s ease !important;
  }

  .cl-socialButtonsBlockButton:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-2px);
  }

  .cl-formFieldInput {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }

  .cl-formFieldInput::placeholder {
    color: #9ca3af !important;
  }

  .cl-formFieldLabel {
    color: #e5e7eb !important;
  }

  .cl-formButtonPrimary {
    background: linear-gradient(to right, #a855f7, #ec4899) !important;
    transition: all 0.3s ease !important;
  }

  .cl-formButtonPrimary:hover {
    background: linear-gradient(to right, #9333ea, #db2777) !important;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3) !important;
  }

  .cl-footerActionLink {
    color: #d8b4fe !important;
  }

  .cl-footerActionLink:hover {
    color: #e9d5ff !important;
  }

  .cl-dividerLine {
    background: rgba(255, 255, 255, 0.2) !important;
  }

  .cl-dividerText {
    color: #d1d5db !important;
  }

  .cl-identityPreviewText {
    color: white !important;
  }

  .cl-internal-b3fm6y {
    color: #d1d5db !important;
  }
`;

export default function SignInPage() {
  return (
    <PageContainer>
      <BackgroundBlobs>
        <Blob />
        <Blob />
        <Blob />
      </BackgroundBlobs>

      <ContentWrapper>
        <BrandSection>
          <LogoBox>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </LogoBox>
          <Title>DevCompanion</Title>
          <Subtitle>Welcome back, developer</Subtitle>
        </BrandSection>

        <CardWrapper>
          <GlobalClerkStyles>
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/model"
            />
          </GlobalClerkStyles>
        </CardWrapper>

        <FooterText>
          <p>🔒 Secure authentication powered by Clerk</p>
        </FooterText>
      </ContentWrapper>
    </PageContainer>
  );
}