import React from 'react';
import { ReactFlow, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const defaultNodes = [
  {
    id: 'A',
    position: { x: 20, y: 20 },
    data: { label: 'A' },
  },
  {
    id: 'B',
    position: { x: 100, y: 200 },
    data: { label: 'B' },
  },
  {
    id: 'C',
    position: { x: 300, y: 20 },
    data: { label: 'C' },
  },
  {
    id: 'D',
    position: { x: 300, y: 170 },
    data: { label: 'D' },
  },
  {
    id: 'E',
    position: { x: 250, y: 300 },
    data: { label: 'E' },
  },
  {
    id: 'F',
    position: { x: 250, y: 450 },
    data: { label: 'F' },
  },
  {
    id: 'G',
    position: { x: 20, y: 450 },
    data: { label: 'G' },
  },
];

const defaultEdges = [
  {
    id: 'A->B',
    source: 'A',
    target: 'B',
    markerEnd: {
      type: MarkerType.Arrow,
    },
    label: 'default arrow',
  },
  {
    id: 'C->D',
    source: 'C',
    target: 'D',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    label: 'default closed arrow',
  },
  {
    id: 'D->E',
    source: 'D',
    target: 'E',
    type: 'straight',
    markerEnd: 'generalization',
    label: 'marker start and masrker end',
  },
  {
    id: 'E->F',
    source: 'E',
    target: 'F',
    type: 'straight',
    markerEnd: 'diamond',
    style: {
      strokeDasharray: '5 5',
    },
    label: 'custom marker',
  },
  {
    id: 'B->G',
    source: 'B',
    target: 'G',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#FF0072',
    },
    label: 'marker size and color',
    style: {
      strokeWidth: 2,
      stroke: '#FF0072',
    },
  },
];

export default function MarkersExample() {
  return (
    <>

      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
            <marker
                id="generalization"
                viewBox="0 0 60 60"
                markerWidth="12"
                markerHeight="12"
                refX="60"
                refY="20"
                orient="auto-start-reverse"
            >
                <path
                d="M 20 0 L 60 20 L 20 40 Z"
                fill="white"
                stroke="#1A192B"
                strokeWidth="2"
                />
            </marker>
            </defs>
      </svg>

      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            id="diamond"
            viewBox="0 0 40 40"
            markerWidth="12"
            markerHeight="12"
            refX="40"
            refY="20"
            orient="auto-start-reverse"
          >
            <path
              d="M20 0 L40 20 L20 40 L0 20 Z"
              fill="white"
              stroke="#1A192B"
              strokeWidth="2"
            />
          </marker>
        </defs>
      </svg>




      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        fitView
      >
        <Background />
      </ReactFlow>
    </>
  );
}
