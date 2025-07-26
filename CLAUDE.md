# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mission Statement Success Calculator** - A sophisticated Next.js application that analyzes company mission statements using Fortune 500 standards. The app provides comprehensive scoring across 5 key metrics (Clarity, Specificity, Impact, Authenticity, Memorability) with real-time analysis, detailed reporting, and professional recommendations.

## Development Commands

**Core Commands:**
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server  
- `npm run lint` - Run Next.js linting

**Working Directory:** Always work from `/Users/coreynew/mission-statement-analyzer/`

## Architecture & Code Structure

**Next.js App Router Pattern:**
- Single-page application using app/ directory structure
- Server components with client-side interactivity
- Built-in TypeScript support with strict configuration

**Key Files:**
- `app/page.tsx` - Main analyzer component (1,490 lines) with complete feature set
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/globals.css` - Global styles and Tailwind CSS imports
- `components/ui/` - Complete shadcn/ui component library (30+ components)

**Analysis Engine:**
- **Scoring Algorithms:** 5 weighted metrics with complex calculations
- **Real-time Analysis:** Live feedback as user types (20+ character threshold)
- **Benchmarking:** Comparison against Tesla, Google, Microsoft examples
- **Report Generation:** Multi-step email capture → complete strategic analysis

**Key Features:**
- **Live Quality Check:** Real-time analysis of length, action verbs, impact, buzzwords
- **Animated Score Display:** Circular progress indicators with 2-second animations
- **Email Capture Flow:** Lead generation with form validation
- **Complete Report:** Executive summary, metric breakdown, alternative rewrites, next steps
- **Fortune 500 Examples:** Interactive examples with click-to-analyze

## Technical Stack

**Frontend:**
- Next.js 15.2.4 with App Router
- React 19 with TypeScript 5
- Tailwind CSS 3.4.17 with custom dark theme
- shadcn/ui component library (Radix UI primitives)

**Styling Approach:**
- Dark theme (`#0a0e1a` background, `#111827` cards)
- Blue accent colors (`#3b82f6`, `#1d4ed8`)
- Gradient buttons and animated elements
- Mobile-first responsive design

**State Management:**
- React useState for local component state
- useMemo for performance optimization of calculations
- useCallback for event handler optimization
- Custom hooks for form validation

**Key Calculations:**
- **Clarity:** Word count optimization (8-35 words ideal), buzzword penalties
- **Specificity:** Action verb detection, industry terminology scoring
- **Impact:** Global scope detection, transformation focus analysis
- **Authenticity:** Corporate speak penalties, genuine purpose detection
- **Memorability:** Length optimization (6-12 words ideal), structure analysis

## Development Guidelines

**Component Pattern:**
- Single large component (MissionStatementAnalyzer) with multiple sections
- Extensive use of conditional rendering based on state
- Heavy use of useMemo/useCallback for performance
- Inline styles with Tailwind classes

**Animation System:**
- Custom CSS animations with @keyframes
- Staggered animations with delay properties
- Score counting animations with easing functions
- Smooth scroll behavior for section navigation

**Form Handling:**
- Custom validation logic with real-time feedback
- Email regex validation
- Multi-step form flow with loading states
- Error state management

**Accessibility Features:**
- ARIA labels and descriptions
- Focus management and keyboard navigation
- Screen reader support with live regions
- High contrast mode support
- Reduced motion support

**Testing Strategy:**
No existing tests - when adding tests, focus on:
- Scoring algorithm accuracy
- Form validation logic  
- Animation state management
- Responsive behavior