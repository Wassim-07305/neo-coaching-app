"use client";

import { cn } from "@/lib/utils";
import type { MockFunnelStep } from "@/lib/mock-data";

interface BookingFunnelProps {
  data: MockFunnelStep[];
}

export function BookingFunnel({ data }: BookingFunnelProps) {
  const maxCount = data[0]?.count || 1;

  const colors = [
    "bg-primary",
    "bg-primary-medium",
    "bg-accent",
    "bg-success",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-6">
        Entonnoir de conversion
      </h3>

      <div className="space-y-4">
        {data.map((step, idx) => {
          const percentage = Math.round((step.count / maxCount) * 100);
          const conversionFromPrev =
            idx > 0
              ? Math.round((step.count / data[idx - 1].count) * 100)
              : 100;

          return (
            <div key={step.label}>
              {/* Conversion rate between steps */}
              {idx > 0 && (
                <div className="flex items-center gap-2 mb-2 ml-4">
                  <div className="w-0.5 h-4 bg-gray-200" />
                  <span className="text-xs text-gray-400">
                    {conversionFromPrev}% de conversion
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Label + count */}
                <div className="w-32 shrink-0">
                  <p className="text-sm font-medium text-dark">{step.label}</p>
                  <p className="text-xs text-gray-500">{step.count} personnes</p>
                </div>

                {/* Bar */}
                <div className="flex-1">
                  <div className="h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-3",
                        colors[idx % colors.length]
                      )}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-bold text-white">
                        {step.count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Percentage */}
                <span className="text-sm font-bold text-gray-600 w-12 text-right shrink-0">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall conversion */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Taux de conversion global
        </span>
        <span className="text-lg font-bold font-heading text-accent">
          {data.length >= 2
            ? Math.round((data[data.length - 1].count / data[0].count) * 100)
            : 0}
          %
        </span>
      </div>
    </div>
  );
}
