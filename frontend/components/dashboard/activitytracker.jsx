"use client";

import React, { useMemo } from "react";

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
function generateDummyData(dates) {
  const activity = {};
  for (const date of dates) {
    activity[date] = Math.floor(Math.random() * 10); // 0–9 activities
  }
  return activity;
}

// Helper: Color scale like GitHub
const getColor = (count) => {
  if (count === 0) return "#ebedf0";
  if (count < 3) return "#c6e48b";
  if (count < 5) return "#7bc96f";
  if (count < 7) return "#239a3b";
  return "#196127";
};

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
        })
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Activity Tracker (Last 365 Days)
      </h2>
      <div className="flex gap-[3px] overflow-x-auto">
        {grid.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[3px]">
            {week.map((date, dayIdx) => {
              if (!date)
                return <div key={dayIdx} className="w-3 h-3 bg-white" />;
              const count = activityData[date] ?? 0;
              return (
                <div
                  key={dayIdx}
                  className="w-3 h-3 rounded-sm"
                  title={`${date}: ${count} activities`}
                  style={{
                    backgroundColor: getColor(count),
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">
          Each square represents a day of activity.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: "#ebedf0" }}
            ></div>
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: "#c6e48b" }}
            ></div>
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: "#7bc96f" }}
            ></div>
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: "#239a3b" }}
            ></div>
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: "#196127" }}
            ></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
