"use client";

import { useMemo } from "react";

// Helper: Get the past 365 days as ISO date strings
function getPastYearDates() {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
    }
    return dates.reverse(); // oldest to newest
}

// Helper: Generate dummy activity count (0–10) for each date
function generateDummyData(dates: string[]) {
    const activity: Record<string, number> = {};
    for (const date of dates) {
        activity[date] = Math.floor(Math.random() * 10); // 0–9 activities
    }
    return activity;
}

export default function ActivityTracker() {
    const dates = useMemo(() => getPastYearDates(), []);
    const activityData = useMemo(() => generateDummyData(dates), [dates]);

    // Transform into 7x52 grid format
    const grid = Array(52)
        .fill(null)
        .map((_, weekIdx) =>
            Array(7)
                .fill(null)
                .map((_, dayIdx) => {
                    const dateIndex = weekIdx * 7 + dayIdx;
                    return dates[dateIndex];
                }),
        );

    // Get color class based on activity count using theme colors
    const getColorClass = (count: number) => {
        if (count === 0) return "bg-muted";
        if (count < 3) return "bg-primary/20";
        if (count < 5) return "bg-primary/40";
        if (count < 7) return "bg-primary/60";
        return "bg-primary";
    };

    return (
        <div>
            <div className="flex gap-[3px] overflow-x-auto pb-2">
                {grid.map((week, weekIdx) => (
                    <div
                        key={week[0] || `week-${weekIdx}`}
                        className="flex flex-col gap-[3px]"
                    >
                        {week.map((date) => {
                            if (!date)
                                return (
                                    <div
                                        key={`empty-${week[0]}-${date}`}
                                        className="w-3 h-3 bg-transparent"
                                    />
                                );
                            const count = activityData[date] ?? 0;
                            return (
                                <div
                                    key={date}
                                    className={`w-3 h-3 rounded-sm transition-colors hover:ring-2 hover:ring-ring/50 ${getColorClass(count)}`}
                                    title={`${date}: ${count} activities`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                    Each square represents a day of activity.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-sm bg-muted"></div>
                        <div className="w-2 h-2 rounded-sm bg-primary/20"></div>
                        <div className="w-2 h-2 rounded-sm bg-primary/40"></div>
                        <div className="w-2 h-2 rounded-sm bg-primary/60"></div>
                        <div className="w-2 h-2 rounded-sm bg-primary"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
