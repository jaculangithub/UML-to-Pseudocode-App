import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  useEdgesState,
  useNodesState,
  reconnectEdge,
  MiniMap,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import CustomEdge from './CustomEdge';
import CustomEdgeStartEnd from './CustomEdgeStartEnd';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    style: { background: 'none'}
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: 0, y: 300 },
    style: { background: 'none'}
  },
  { id: '3', data: { label: 'Node 3' }, position: { x: 200, y: 0 },
    style: { background: 'none'} },
  { id: '4', data: { label: 'Node 4' }, position: { x: 200, y: 300 },
    style: { background: 'none'} },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    data: {
      label: 'edge label',
    },
    type: 'step',
    reconnectable: false,
    markerEnd:{
      type: MarkerType.Arrow,
    },
    data: {
      startLabel: 'start edge label',
      endLabel: 'end edge label',
    },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    data: {
      startLabel: 'start edge label',
      endLabel: 'end edge label',
      relationshipType: 'directedAssociation', 
      //  composition, aggregation, directedAssociation, Association
      //  Dependency, Generalization, Realization
      stepLine: false,
    },
    type: 'custom2',
    reconnectable: false,
  },
];

const edgeTypes = {
  custom1: CustomEdge,
  custom2: CustomEdgeStartEnd,
};

const EdgesFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    console.log('Edges:', edges);
  })

  const onReconnect = useCallback((oldEdge, newConnection) => {
    setEdges((els) =>
      els.map((e) =>
        e.id === oldEdge.id
          ? { ...e, ...newConnection, id: oldEdge.id }
          : e
      )
    );
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setEdges((eds) => {
      // Separate the clicked edge and the rest
      const updatedEdges = eds
        .filter((e) => e.id !== edge.id)
        .map((e) => ({ ...e, reconnectable: false })); // reset others

      const clickedEdge = {
        ...edge,
        reconnectable: true,
      };

      // Push the clicked edge to the end
      return [...updatedEdges, clickedEdge];
    });
  }, []);


  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        onReconnect={onReconnect}
        onEdgeClick={onEdgeClick}
        fitView
        colorMode='dark'
        connectionLineType='linear'
        connectionMode="strict"
      >
        <Controls />
        <Background />
        <MiniMap bgColor='green'/>
      </ReactFlow>    
    
    </>

  );
};

export default EdgesFlow;