import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCPS } from '@/contexts/CPSContext';
import { cn } from '@/lib/utils';

const CpsScoreWidget = () => {
    const { user, currentRole } = useAuth();
    const { getEntriesByFaculty } = useCPS();
    const [showScore, setShowScore] = useState(true);

    // Toggle between showing Score and Status/Percentage
    useEffect(() => {
        const interval = setInterval(() => {
            setShowScore((prev) => !prev);
        }, 3000); // 3-second interval
        return () => clearInterval(interval);
    }, []);

    if (!user || currentRole !== 'faculty') return null;

    const entries = getEntriesByFaculty(user.id);
    const approvedEntries = entries.filter((e) => e.status === 'approved');
    const totalScore = approvedEntries.reduce((sum, entry) => sum + entry.credits, 0);

    // Logic for status
    // < 30 : Low (Red)
    // 30 - 79 : Normal (Yellow)
    // >= 80 : Eligible (Green)

    let status: 'low' | 'normal' | 'eligible' = 'normal';
    if (totalScore < 30) status = 'low';
    else if (totalScore >= 80) status = 'eligible';

    const styles = {
        low: {
            border: "border-red-400",
            shadow: "shadow-[0_0_15px_rgba(239,68,68,0.5)]", // Red glow
            text: "text-red-600",
            label: "Low",
        },
        normal: {
            border: "border-yellow-400",
            shadow: "shadow-[0_0_15px_rgba(250,204,21,0.5)]", // Yellow glow
            text: "text-yellow-600",
            label: "Normal",
        },
        eligible: {
            border: "border-green-500",
            shadow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]", // Green glow
            text: "text-green-600",
            label: "Eligible",
        },
    };

    const currentStyle = styles[status];

    // Placeholder percentage logic
    const TARGET_SCORE = 100;
    const percentage = Math.min(Math.round((totalScore / TARGET_SCORE) * 100), 100);

    return (
        <div className="relative group">
            {/* The main circular button */}
            <div
                className={cn(
                    "relative flex items-center justify-center w-16 h-16 rounded-full cursor-pointer transition-all duration-500 transform hover:scale-105",
                    "bg-white border-2",
                    currentStyle.border,
                    currentStyle.shadow,
                    // Pulse effect for the glow
                    "animate-[pulse_3s_ease-in-out_infinite]"
                )}
            >
                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center transition-opacity duration-500">
                    {showScore ? (
                        <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                            <span className={cn(
                                "text-xl font-bold leading-none",
                                currentStyle.text
                            )}>
                                {totalScore}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">
                                CPS Score
                            </span>
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                            <span className={cn(
                                "text-[10px] font-bold uppercase leading-none",
                                currentStyle.text
                            )}>
                                {currentStyle.label}
                            </span>
                            {status === 'eligible' ? (
                                <span className="text-[9px] font-medium text-muted-foreground mt-0.5">
                                    Incr.
                                </span>
                            ) : (
                                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
                                    {percentage}%
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CpsScoreWidget;
