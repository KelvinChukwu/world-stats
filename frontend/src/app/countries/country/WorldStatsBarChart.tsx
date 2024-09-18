"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a legend"

export function WorldStatsBarChart<TData>({ chartData, chartConfig, xAxisDataKey, yAxisDataKey }: { chartData: TData[], chartConfig: ChartConfig, xAxisDataKey: string, yAxisDataKey: string }) {
  return (
    <ChartContainer
      config={chartConfig}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          right: 40,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey={yAxisDataKey}
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey={xAxisDataKey} type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey={xAxisDataKey}
          layout="vertical"
          fill="var(--color-desktop)"
          radius={4}
        >
          <LabelList
            dataKey={yAxisDataKey}
            position="insideLeft"
            offset={8}
            className="fill-[--color-label]"
            fontSize={12}
          />
          <LabelList
            dataKey={xAxisDataKey}
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: number) => new Intl.NumberFormat('en', { style: "percent", minimumFractionDigits: 1 }).format(value / 100)} // TODO: render fractional percentages better
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
