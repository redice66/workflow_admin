import { Tabs } from "@/components/tabs"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 overflow-hidden">
        <Tabs />
      </div>
    </div>
  )
}
