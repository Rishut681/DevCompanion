"use client";

// --- NEXT.JS STANDARD IMPORTS ---
// Assuming you have 'framer-motion' installed: npm install framer-motion
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
// FIX: Changing to simple relative paths, assuming the compiler treats them as siblings 
// due to the nature of the development environment.
import Dashboard from '../components/Dashboard';
import LoadingScreen from '../components/LoadingScreen';

// --- TIMING CONSTANTS ---
const MIN_LOAD_TIME = 3000; // Minimum time (2 seconds)
const MAX_LOAD_TIME = 5000; // Maximum time (3 seconds)

// In a real Next.js app, external libraries like Three.js are typically imported
// into the components that need them (Dashboard or LoadingScreen), not loaded 
// via script tags here. Since Framer Motion is the only global one needed for the transition,
// we only manage its imports directly.

const HomePage = () => {
    // State for the main components and loading progress
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    
    const startTime = useRef(Date.now());
    
    // 1. Simulate Asset Loading and Progress Bar
    useEffect(() => {
        // Set up the progress bar interval
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev < 95) {
                    // Update progress based on elapsed time for smooth progression
                    const elapsedTime = Date.now() - startTime.current;
                    const newProgress = (elapsedTime / MAX_LOAD_TIME) * 95;
                    return Math.min(newProgress, 95);
                }
                return prev;
            });
        }, 50);

        // Simulate initial asset/data fetching time (e.g., initial API calls)
        // For demonstration, we use a simple timeout, but in a real app, this would be 
        // a Promise.all() waiting for your actual data fetching to resolve.
        const simulatedAssetLoad = setTimeout(() => {
            setInitialLoadComplete(true);
        }, 1000); // Assume real assets take 1 second to load

        // Safety net: Force completion after MAX_LOAD_TIME
        const maxLoadTimeout = setTimeout(() => {
            setInitialLoadComplete(true);
        }, MAX_LOAD_TIME);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(simulatedAssetLoad);
            clearTimeout(maxLoadTimeout);
        };
    }, []); 

    // 2. Final Transition Effect (Enforces Min Load Time)
    useEffect(() => {
        if (initialLoadComplete) {
            const elapsed = Date.now() - startTime.current;
            // Calculate how much time is left before the MIN_LOAD_TIME is reached
            const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsed);
            
            // Wait for the remaining time, then transition out of the loading screen
            const transitionTimeout = setTimeout(() => {
                setProgress(100);
                setIsLoading(false);
            }, remainingTime);

            return () => clearTimeout(transitionTimeout);
        }
    }, [initialLoadComplete]);


    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                // Displays the award-winning loading screen
                // progress is now the only required prop
                <LoadingScreen key="loading" progress={progress} />
            )}
            {!isLoading && (
                // Fades in the dashboard after loading is complete
                <motion.div 
                    key="dashboard" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.8 }} 
                    className="h-full w-full"
                >
                    <Dashboard />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HomePage;
