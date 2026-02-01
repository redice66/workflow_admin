import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Plus } from 'lucide-react'
import { StateItem } from '@/types/workflow-state'
import { getAvailableStates } from '@/lib/api/workflow-state-api'
import { useToast } from "@/components/ui/use-toast"

interface AddStateModalProps {
  visible: boolean              // 是否显示Modal
  onCancel: () => void         // 取消回调
  onSubmit: (stateIds: string[]) => Promise<void> // 提交回调
  loading?: boolean            // 加载状态
  existingStateIds?: string[]  // 已存在的状态ID列表
}

/**
 * 添加状态Modal组件
 * 
 * 功能：
 * 1. 从状态管理页面获取可用状态列表
 * 2. 多选状态添加到工作流配置中
 * 3. 过滤已存在的状态
 */
export const AddStateModal: React.FC<AddStateModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  existingStateIds = []
}) => {
  const [availableStates, setAvailableStates] = useState<StateItem[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([])
  const { toast } = useToast()

  // 获取可用状态列表
  const fetchAvailableStates = async () => {
    setLoadingStates(true)
    try {
      const response = await getAvailableStates()
      if (response.success && response.data) {
        // 过滤掉已存在的状态
        const filteredStates = response.data.filter(
          state => !existingStateIds.includes(state.id)
        )
        setAvailableStates(filteredStates)
      } else {
        toast({
          title: "加载失败",
          description: response.message || '获取状态列表失败',
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "加载失败", 
        description: '获取状态列表失败',
        variant: "destructive",
      })
      console.error('获取状态列表失败:', error)
    } finally {
      setLoadingStates(false)
    }
  }

  // 当Modal打开时获取状态列表
  useEffect(() => {
    if (visible) {
      fetchAvailableStates()
      setSelectedStateIds([]) // 重置选择
    }
  }, [visible, existingStateIds])

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      if (selectedStateIds.length === 0) {
        toast({
          title: "提示",
          description: '请至少选择一个状态',
          variant: "destructive",
        })
        return
      }
      
      // 调用提交回调
      await onSubmit(selectedStateIds)
      
      // 重置表单
      setSelectedStateIds([])
      
      toast({
        title: "添加成功",
        description: '状态添加成功',
      })
    } catch (error) {
      toast({
        title: "添加失败",
        description: error instanceof Error ? error.message : '添加状态失败',
        variant: "destructive",
      })
    }
  }

  // 处理取消
  const handleCancel = () => {
    setSelectedStateIds([])
    onCancel()
  }

  // 处理状态选择变化
  const handleStateToggle = (stateId: string, checked: boolean) => {
    if (checked) {
      setSelectedStateIds([...selectedStateIds, stateId])
    } else {
      setSelectedStateIds(selectedStateIds.filter(id => id !== stateId))
    }
  }

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStateIds(availableStates.map(state => state.id))
    } else {
      setSelectedStateIds([])
    }
  }

  const isAllSelected = availableStates.length > 0 && selectedStateIds.length === availableStates.length

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            添加状态
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>从状态管理页面选择已启用的状态添加到工作流配置中。</p>
            <p>已添加的状态将不会在列表中显示。</p>
          </div>

          {loadingStates ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">加载状态中...</span>
            </div>
          ) : availableStates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>暂无可添加的状态</p>
              <p className="text-xs mt-1">
                所有启用的状态都已添加到配置中，或者状态管理页面暂无启用状态。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  可选状态 ({availableStates.length} 个可用)
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    {isAllSelected ? '取消全选' : '全选'}
                  </Label>
                </div>
              </div>
              
              <ScrollArea className="h-48 w-full rounded-md border p-3">
                <div className="space-y-2">
                  {availableStates.map((state) => (
                    <div key={state.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted">
                      <Checkbox
                        id={`state-${state.id}`}
                        checked={selectedStateIds.includes(state.id)}
                        onCheckedChange={(checked) => 
                          handleStateToggle(state.id, !!checked)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label 
                          htmlFor={`state-${state.id}`} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {state.name}
                        </Label>
                        {state.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {state.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {selectedStateIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">已选择:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedStateIds.map(stateId => {
                      const state = availableStates.find(s => s.id === stateId)
                      return state ? (
                        <Badge key={stateId} variant="secondary" className="text-xs">
                          {state.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            disabled={loading}
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || loadingStates || selectedStateIds.length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 