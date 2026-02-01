import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function DashboardHeader() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/20 p-1">
            <div className="h-full w-full rounded bg-primary" />
          </div>
          <span className="font-semibold">工作流</span>
          <span className="text-sm text-muted-foreground">Demo-tod_agent</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="搜索"
              className="h-9 rounded-md border border-input bg-background pl-8 pr-4 text-sm"
            />
          </div>
          <Button variant="ghost" size="sm">
            知识库
          </Button>
          <Button variant="ghost" size="sm">
            工具
          </Button>
          <Button variant="ghost" size="sm">
            插件
          </Button>
          <UserNav />
        </div>
      </div>
      <div className="flex h-10 items-center justify-between border-t px-4">
        <div className="text-sm text-muted-foreground">自动保存 10:28:02 · 已保存 1 分钟前</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            预览
          </Button>
          <Button variant="ghost" size="sm">
            功能
          </Button>
          <Button variant="primary" size="sm">
            发布
          </Button>
        </div>
      </div>
    </header>
  )
}
