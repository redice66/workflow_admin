"use client"

import React, { useEffect, useState } from 'react'
import { useNodeStore } from '@/lib/node-store'
import { autoLayoutNodes } from '@/lib/utils'

export function DebugLayout() {
  const { nodes, edges } = useNodeStore()
  const [isDebugging, setIsDebugging] = useState(false)
  
  const checkOverlaps = () => {
    if (nodes.length < 2) return []
    
    const overlaps = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i]
        const node2 = nodes[j]
        const dx = Math.abs(node1.position.x - node2.position.x)
        const dy = Math.abs(node1.position.y - node2.position.y)
        
        if (dx < 200 && dy < 80) {
          overlaps.push({
            node1: node1.id,
            node2: node2.id,
            distance: Math.sqrt(dx * dx + dy * dy)
          })
        }
      }
    }
    return overlaps
  }
  
  const overlaps = checkOverlaps()
  
  if (!isDebugging) {
    return (
      <button 
        onClick={() => setIsDebugging(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        调试布局
      </button>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-96 overflow-auto">
        <h3 className="text-lg font-bold mb-4">布局调试信息</h3>
        <div className="mb-4">
          <p className="text-sm">总节点数: {nodes.length}</p>
          <p className="text-sm">总边数: {edges.length}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">节点位置:</h4>
          {nodes.map(node => (
            <div key={node.id} className="text-sm">
              {node.id}: ({node.position.x}, {node.position.y})
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">重叠检测:</h4>
          {overlaps.length > 0 ? (
            overlaps.map((overlap, index) => (
              <div key={index} className="text-sm text-red-600">
                重叠: {overlap.node1} & {overlap.node2} (距离: {overlap.distance})
              </div>
            ))
          ) : (
            <p className="text-sm text-green-600">无重叠节点</p>
          )}
        </div>
        
        <button 
          onClick={() => setIsDebugging(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          关闭
        </button>
      </div>
    </div>
  )
}