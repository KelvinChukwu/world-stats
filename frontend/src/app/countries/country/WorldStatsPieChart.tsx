"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a legend"

export function WorldStatsPieChart<TData>({chartData, chartConfig, dataKey, nameKey}: {chartData: TData[], chartConfig: ChartConfig, dataKey: string, nameKey: string}) {
  return (
      <ChartContainer
        config={chartConfig}
      >
        <PieChart>
          <Pie data={chartData} dataKey={dataKey} />
          <ChartLegend
            content={<ChartLegendContent nameKey={nameKey} />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
  )
}
