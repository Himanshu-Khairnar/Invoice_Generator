"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  stroke?: string;
  name?: string;
  height?: number;
  dot?: boolean;
}

export function LineChartComponent({
  data,
  dataKey,
  xAxisKey,
  stroke = "var(--primary)",
  name = dataKey,
  height = 350,
  dot = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey={xAxisKey} stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          name={name}
          dot={dot}
          isAnimationActive={true}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
