export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null

  const debouncedFunction = (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }

  return debouncedFunction as T
}

/**
 * 强制布局优化 - 确保节点完全不重叠
 * 使用线性布局算法，节点水平均匀分布
 */
export function autoLayoutNodes(nodes: any[], edges: any[]): any[] {
  if (!nodes || nodes.length === 0) return []
  
  // 检查是否所有节点都在同一水平线上
  const allSameY = nodes.every(node => node.position.y === nodes[0].position.y)
  if (allSameY && nodes.length > 1) {
    // 强制线性布局，避免重叠
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: 150 + index * 300, // 水平间距300px
        y: 200 // 统一y坐标
      }
    }))
  }

  // 创建邻接表和入度表
  const adjacencyList = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  // 初始化
  nodes.forEach(node => {
    adjacencyList.set(node.id, [])
    inDegree.set(node.id, 0)
  })

  // 构建图结构
  edges.forEach(edge => {
    if (adjacencyList.has(edge.source)) {
      adjacencyList.get(edge.source)!.push(edge.target)
    }
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  })

  // 拓扑排序和分层
  const layers: string[][] = []
  const visited = new Set<string>()
  const queue: string[] = []

  // 找到所有入度为0的节点（起始节点）
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId)
    }
  })

  // 分层布局
  while (queue.length > 0) {
    const level: string[] = []
    const levelSize = queue.length
    
    for (let i = 0; i < levelSize; i++) {
      const nodeId = queue.shift()!
      level.push(nodeId)
      visited.add(nodeId)
      
      // 处理后继节点
      const successors = adjacencyList.get(nodeId) || []
      successors.forEach(successorId => {
        inDegree.set(successorId, inDegree.get(successorId)! - 1)
        if (inDegree.get(successorId) === 0) {
          queue.push(successorId)
        }
      })
    }
    
    if (level.length > 0) {
      layers.push(level)
    }
  }

  // 处理剩余的节点（可能是循环依赖）
  inDegree.forEach((degree, nodeId) => {
    if (degree > 0 && !visited.has(nodeId)) {
      if (layers.length === 0) layers.push([])
      layers[layers.length - 1].push(nodeId)
    }
  })

  // 计算节点位置
  const nodeWidth = 180
  const nodeHeight = 80
  const levelGap = 300 // 水平间距
  const nodeGap = 120  // 垂直间距
  const padding = 100  // 边距

  return nodes.map(node => {
    let levelIndex = -1
    let nodeIndex = -1
    
    // 找到节点在哪个层级
    for (let i = 0; i < layers.length; i++) {
      const index = layers[i].indexOf(node.id)
      if (index !== -1) {
        levelIndex = i
        nodeIndex = index
        break
      }
    }
    
    // 如果没找到，放在最后一层
    if (levelIndex === -1) {
      levelIndex = layers.length - 1
      nodeIndex = 0
    }

    // 计算位置，确保节点在中心
    const layerNodeCount = layers[levelIndex].length
    const totalLayerHeight = (layerNodeCount - 1) * nodeGap
    const startY = 200 - totalLayerHeight / 2
    
    const x = levelIndex * levelGap + padding
    const y = startY + nodeIndex * nodeGap

    return {
      ...node,
      position: { x, y }
    }
  })
}

/**
 * 检测并避免节点重叠
 */
export function avoidNodeOverlap(nodes: any[], spacing = 50): any[] {
  if (!nodes || nodes.length < 2) return nodes

  const positionedNodes = [...nodes]
  
  // 按位置分组检测重叠
  for (let i = 0; i < positionedNodes.length; i++) {
    for (let j = i + 1; j < positionedNodes.length; j++) {
      const node1 = positionedNodes[i]
      const node2 = positionedNodes[j]
      
      const dx = node1.position.x - node2.position.x
      const dy = node1.position.y - node2.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // 检测重叠（假设节点宽度180，高度80）
      const minDistance = 200 // 节点宽度 + 间距
      
      if (distance < minDistance) {
        // 调整位置避免重叠
        const angle = Math.atan2(dy, dx)
        const offset = (minDistance - distance) / 2
        
        node1.position.x += Math.cos(angle) * offset
        node1.position.y += Math.sin(angle) * offset
        node2.position.x -= Math.cos(angle) * offset
        node2.position.y -= Math.sin(angle) * offset
      }
    }
  }
  
  return positionedNodes
}

/**
 * 计算流程图的最佳视图范围
 */
export function calculateBounds(nodes: any[]): { minX: number; minY: number; maxX: number; maxY: number } {
  if (!nodes || nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 600 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach(node => {
    const x = node.position.x
    const y = node.position.y
    
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + 180) // 假设节点宽度180
    maxY = Math.max(maxY, y + 80)  // 假设节点高度80
  })

  // 添加边距
  const padding = 100
  return {
    minX: minX - padding,
    minY: minY - padding,
    maxX: maxX + padding,
    maxY: maxY + padding
  }
}
