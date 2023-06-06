import { SkeletonElement } from './styles'
import React from 'react'

export interface SkeletonProps {
  type: 'title' | 'text' | 'image' | 'thumbnail'
}

export function Skeleton({ type }: SkeletonProps) {
  return <SkeletonElement type={type} />
}
