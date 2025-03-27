"use client"

import * as React from "react"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
  BarElement,
  Filler,
  TimeScale,
  type ChartOptions,
  type ChartType,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Define types for our chart data
export type ChartData<T extends ChartType = ChartType> = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
    tension?: number
    borderWidth?: number
    borderDash?: number[]
    pointBackgroundColor?: string
    pointBorderColor?: string
    pointBorderWidth?: number
    pointRadius?: number
    pointHoverRadius?: number
  }[]
}

// Re-export chart.js elements for convenience
export { LineElement, PointElement, BarElement, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend, Filler }

export interface ChartProps {
  type: ChartType
  data: ChartData
  options?: ChartOptions<any>
  height?: number
  width?: number
  className?: string
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: number, name: string) => string
  labelFormatter?: (label: string) => string
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  contentClassName?: string
  itemClassName?: string
  valueClassName?: string
}

export function Chart({ type, data, options, height, width, className }: ChartProps) {
  const defaultOptions = React.useMemo<ChartOptions<any>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
      },
      elements: {
        point: {
          radius: 2,
          hoverRadius: 4,
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          padding: 10,
          titleFont: {
            size: 12,
          },
          bodyFont: {
            size: 12,
          },
          footerFont: {
            size: 12,
          },
          callbacks: {
            title: (context) => {
              return context[0].label
            },
            label: (context) => {
              return context.formattedValue
            },
          },
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
          },
        },
      },
    }),
    [],
  )

  const chartOptions = { ...defaultOptions, ...options }

  switch (type) {
    case "line":
      return <Line data={data as any} options={chartOptions} height={height} width={width} className={className} />
    case "bar":
      return <Bar data={data as any} options={chartOptions} height={height} width={width} className={className} />
    default:
      return null
  }
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className,
  wrapperClassName,
  labelClassName,
  contentClassName,
  itemClassName,
  valueClassName,
}: ChartTooltipProps) {
  if (!active || !payload) return null

  return (
    <div className={`rounded-lg border bg-background p-2 shadow-md ${wrapperClassName || ""} ${className || ""}`}>
      <div className={`text-sm font-medium ${labelClassName || ""}`}>
        {labelFormatter ? labelFormatter(label || "") : label}
      </div>
      <div className={`mt-1 ${contentClassName || ""}`}>
        {payload.map((item, index) => (
          <div key={`tooltip-item-${index}`} className={`flex items-center ${itemClassName || ""}`}>
            <div className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="mr-2">{item.name}:</span>
            <span className={`font-medium ${valueClassName || ""}`}>
              {formatter ? formatter(item.value, item.name) : item.value.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

