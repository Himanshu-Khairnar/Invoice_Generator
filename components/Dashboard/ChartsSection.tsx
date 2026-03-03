"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartComponent } from "@/components/ui/bar-chart";
import { LineChartComponent } from "@/components/ui/line-chart";
import { PieChartComponent } from "@/components/ui/pie-chart";

interface ChartDataProps {
  groupedByDate: Array<{
    date: string;
    amount: number;
    count: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
}

export function ChartsSection({ groupedByDate, statusData }: ChartDataProps) {
  return (
    <>
      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {groupedByDate.length > 0 ? (
              <LineChartComponent
                data={groupedByDate}
                dataKey="amount"
                xAxisKey="date"
                stroke="var(--primary)"
                name="Revenue"
                height={300}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <PieChartComponent
                data={statusData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No invoices yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Count Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {groupedByDate.length > 0 ? (
            <BarChartComponent
              data={groupedByDate}
              dataKey="count"
              xAxisKey="date"
              fill="var(--primary)"
              name="Invoices Created"
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
