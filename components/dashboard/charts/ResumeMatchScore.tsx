"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ResumeMatchScoreProps = {
  matchScore?: number;
};

export function ResumeMatchScore({ matchScore }: ResumeMatchScoreProps) {
  const score = typeof matchScore === "number" ? matchScore : 85; // Fallback for now
  const remaining = 100 - score;

  const fillColor =
    score >= 80
      ? "var(--app-green)"
      : score >= 50
      ? "var(--app-yellow)"
      : "var(--app-red)";

  const matchMessage =
    score >= 80 ? "Great Match" : score >= 50 ? "Decent Match" : "Needs Work";

  const chartData = [
    {
      name: "Match",
      value: score,
      fill: fillColor,
    },
    {
      name: "Remaining",
      value: remaining,
      fill: "var(--sidebar-ring)", // neutral color for unfilled segment
    },
  ];

  return (
    <ChartContainer
      config={{
        value: { label: "Match Score" },
      }}
      className="mx-auto min-h-[20vh] h-[20vh] flex items-end"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={54}
          outerRadius={58}
          strokeWidth={0}
          startAngle={90}
          endAngle={-270}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {score}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-xs"
                    >
                      {matchMessage}
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
