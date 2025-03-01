import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-muted rounded-lg" >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">user Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,234.56</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>
      {/* Add more cards for other metrics */}
    </div>
  )
}

