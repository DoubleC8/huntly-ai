"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ResumeMatchScoreProps = {
  matchScore?: number; // Future AI-driven value (0–100)
};

export function ResumeMatchScore({ matchScore }: ResumeMatchScoreProps) {
  const score = typeof matchScore === "number" ? matchScore : 40; // Fallback for now
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
      className="mx-auto aspect-square max-h-[250px]"
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
          innerRadius={60}
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {score}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-sm"
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
