import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  MiniMap,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { set, throttle } from 'lodash'
import {ActivityDiagram1, ActivityDiagram, SequenceDiagram, StateDiagram, ClassDiagram} from "./GeneratePseudocode";

// Action
import ActionNode from '../Nodes/ActionNode';
import DecisionNode from '../Nodes/DecisionNode';
import StartNode from '../Nodes/StartNode';
import EndNode from '../Nodes/EndNode';
import DestructionNode from '../Nodes/DestructionNode';
import ForkJoinNode from '../Nodes/ForkJoinNode';
import SwimLane from '../Nodes/SwimLane';

// images
import SwitchArrow from './switch-arrow.png';

// Sequence diagram nodes
import ConditionNode from '../SeqDiagramNodes/ConditionNode';
import LoopNode from '../SeqDiagramNodes/LoopNode';
import Actor from '../SeqDiagramNodes/Actor'; // Import Actor node for sequence diagrams
import ObjectNode from '../SeqDiagramNodes/ObjectNode';
import ActivationBar from '../SeqDiagramNodes/ActivationBar';
import ShadedCircle from '../SeqDiagramNodes/ShadedCircle';
import DestroyMessage from '../SeqDiagramNodes/DestroyMessage';

//Class diagram
import ClassNode from '../Nodes/ClassNode';

// custom edge
import CustomEdgeStartEnd from '../EdgeLabelRenderer/CustomEdgeStartEnd';
// import { type } from '@testing-library/user-event/dist/type';

//for state diagram
import CompositeStateNode from '../StateDiagram/CompositeState';
import StateNode from '../StateDiagram/StateNode';
import { type } from '@testing-library/user-event/dist/type';

const nodeTypes = {
  // Activity
  ActionNode,
  DecisionNode,
  StartNode,
  EndNode,
  DestructionNode,
  ForkJoinNode,
  SwimLane,

  // Class
  ClassNode,

  // Sequence
  Actor, // Add Actor node type for sequence diagrams
  LoopNode,
  ObjectNode,
  ActivationBar,
  ShadedCircle,
  ConditionNode,
  DestroyMessage,

  // State
  StateNode,
  CompositeStateNode,
};

const edgeTypes = {
  "edge": CustomEdgeStartEnd,
}

const sequenceDiagramGuidelines = (
  <>
    To add an Activation Bar or Destroy Message (X), follow these steps:
      <br />
      <br />
    1. First, CLICK the object (lifeline) you want to apply the interaction to.  <br />
    2. After selecting the object, choose 'Activation Bar' or 'Destroy (X)' from the left panel. <br />
    3. Make sure the object is highlighted before applying to ensure it attaches correctly. <br />
    4. If nothing happens, reselect the object and try again. <br />
    5. To delete a notation or arrow line, select the element first (either a node or edge), then click the delete button. <br />
    
    Tip: The feature will only work if an object is currently active/selected.
  </>
)

const activityDiagramGuidelines = (
  <>
    Please follow the guidelines below to ensure a smooth experience and avoid confusion. <br />

    1. To add text to a line, use the input field that appears at the beginning of the arrow line. <br/>
    2. Deselect the Swimlane or click another notation to enable to select the arrow line. <br/>
    3. The pseudocode will not generate if there is no Start Node present. <br/>
    4. To delete a notation or arrow line, select the element first (either a node or edge), then click the delete button.
  </>
);

const classDiagramGuidelines = (
  <>
    Please follow the guidelines below to ensure a smooth experience and avoid confusion. <br />

    1. When you click the access modifier, a drop-down menu will appear to let you change the access level of the selected attribute or method. <br/>
    2. Use the proper relationship connectors (e.g., Association, Inheritance) to maintain a correct and organized structure. <br/>
    3. Click the delete icon to remove an attribute or method, and use the plus (+) icon to add a new one. <br/>
    4. To delete a notation or arrow line, select the element first (either a node or edge), then click the delete button. <br/>
  </>
);

const stateDiagramGuidelines = (
  <>
    Please follow the guidelines below to ensure a smooth experience and avoid confusion. <br />

    1. To add a substate into the Composite State, select teh composite State first to add a state inside the composite state, otherwise it will display outside <br/>
    2. No StartNode will not Display Pseudocode. Same with composite state, not starting with a startnode inside it will not display the substate <br/>
    3. To add transition labels, click the transition line and enter the text in the input field in the beginning of the line. <br/>
    4. To delete a notation or arrow line, select the element first (either a node or edge), then click the delete button. <br/>
  </>
);

export default function UMLEditorField() {
  const navigate = useNavigate();
  const { type: diagramType } = useParams(); // Get the type from URL parameters
  // const diagramType = type || "activity"; //activity, class, sequence state
  const [numberOfLane, setNumberOfLane] = useState(2);
  const [structuredData, setStructuredData] = useState(null);
  const [lastObjectSelected, setLastObjectSelected] = useState(null)
  const [showGuideline, setShowGuideline] = useState(false);

  const [colorMode, setColorMode] = useState('light');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null); //for changing the edge's properties (marker type, etc.)
  const [showPseudocode, setShowPseudocode] = useState(false);

  const activityDiagramNodes = [
    'ActionNode', 
    'DecisionNode', 
    // 'StartNode', 
    'EndNode', 
    'DestructionNode', 
    'VerticalLine',
    `HorizontalLine`,

  ]
  
  const classDiagramNodes = [
    "ClassNode",
  ]

  const sequenceDiagramNodes = [
    "Actor",
    "ActivationBar",
    "ObjectNode",
    "LoopNode",
    "ConditionNode",
    "ShadedCircle",
    "DestroyMessage",
  ]

  const stateDiagramNodes = [
    "StateNode",
    "CompositeStateNode",
    "StartNode",
    "EndNode",
  ]

  const getInitialNodes = () => {
    if (diagramType === "activity") {
      return [
        {
          id: 'Swimlane1',
          type: 'SwimLane',
          position: { x: 0, y: 0 },
          style: {
            width: 800,
            height: 600,
          },
          data: {
            numberOfActors: 2,
          },
          dragHandle: '.drag-handle__label'
        },   
        {
          id: 'node1',
          type: 'StartNode',
          data: { label: 'Action Node 1' },
          position: { x: 100, y: 100 }, 
          style: {
            width: 50,
            height: 50,
          },
          dragHandle: '.drag-handle__label',
          parentId: 'Swimlane1',
          extent: 'parent',
        }
      ];
    } else if (diagramType === "sequence") {
      return [
        {
          id: 'act1',
          type: 'Actor',
          position: { x: 0, y: 0 },
          data: { },
          style: { width: 50, height: 200 },
          dragHandle: '.drag-handle__label'
        },
        {
          id: "obj1",
          type: 'ObjectNode',
          data: { },
          position: { x: 300, y: 0 },
          style: { width: 50, height: 200 },
          dragHandle: '.drag-handle__label'
        }
      ];
    } else if (diagramType === "class") {
      return [
        {
          id: 'class1',
          type: 'ClassNode',
          position: { x: 0, y: 100 },
          data: { 
            className: 'ClassNode',
            // attributes: ['attribute1: string', 'attribute2: number'],
            // methods: ['method1(): void', 'method2(param: string): boolean']
          },
          style: { width: 300, height: 150 },
          dragHandle: '.drag-handle__label'
        }
      ];
    } else if (diagramType === "state") {
      return [
        {
          id: 'state1',
          type: 'StateNode',
          position: { x: 100, y: 100 },
          data: { label: 'Initial State' },
          style: { width: 100, height: 60 }
        }
      ];
    }
    return []; // Default empty nodes
  };


  const initialEdges = [
  ];

  const [n, numberOfNodes] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [lastSelected, setLastSelected] = useState(null)

  //array of marker type
  const markerTypes = ["none", "open arrow", "closed arrow", "open diamond", "filled diamond"];
  useEffect(() => {
    console.log("Nodes ", nodes)
    console.log("Edges ", edges)
  }, [nodes])

  const throttledOnNodesChange = useMemo(() => {
    const options = { passive: true };
    // console.log("Throttled onNodesChange called");
    return throttle((changes) => {
      onNodesChange(changes);
    }, 200, options);
  }, [onNodesChange]);

  const onNodeClick = useCallback((event, node) => {
    //set the selected object in seqs diagram
    if(node.type === "Actor" || node.type === "ObjectNode"){
      setLastObjectSelected(node)
    }
    // setSelectedNodeId(node.id);
  }, []);

  // const addNode = (nodeType) => {

  //   console.log(nodeType)
  //   numberOfNodes(n + 1);
  //   let ID = `${nodeType === "ObjectNode" ? `obj` : "Node"} ${n}`;

  //   const newNode = {
  //     id: ID,
  //     type: (nodeType === "VerticalLine" || nodeType === "HorizontalLine") && diagramType === "activity"? "ForkJoinNode": nodeType,
  //     data: {
  //       nodes: nodeType === "SwimLane" ? nodes : undefined,
  //       label: `${nodeType === "EndNode"? "End" : `Node ${n}`}`,
  //       orientation: nodeType,
  //       className: "Class",
  //     },
  //     position: {
  //       x: nodeType === "DestroyMessage" || nodeType === "Activationbar"? 0 : 200,
  //       y: nodeType === "DestroyMessage" || nodeType === "ActivationBar"? 0 : 200,
  //     },
  //     style: {
  //       width: 
  //           nodeType === "CompositeStateNode" ? 200 :
  //           nodeType === "ActivationBar" ? 20 : 
  //           diagramType === "class" ? 300 : 
  //           nodeType === "LoopNode" || nodeType === "ConditionNode" ? 400 : 
  //           nodeType === "VerticalLine" ? 20 : 
  //           nodeType === "HorizontalLine" ? 200 : 
  //           50,
  //       height:
  //           nodeType === "CompositeStateNode" ? 300 :
  //           nodeType === "ActivationBar" ? 40 : 
  //           diagramType === "class" ? 200: 
  //           nodeType === "LoopNode" ||  nodeType === "ConditionNode" ? 500 : 
  //           nodeType === "VerticalLine" ? 200 : 
  //           nodeType === "HorizontalLine" ? 20 : 
  //           50,
  //       zIndex: nodeType === "SwimLane" || 
  //               nodeType === "LoopNode" || 
  //               nodeType === "ConditionNode" || 
  //               nodeType === "Actor" || 
  //               nodeType === "ObjectNode" || 
  //               nodeType === "CompositeStateNode"? -1 : "1000", // Ensure this node is above the first one
  //     },
  //     dragHandle: '.drag-handle__label',
  //     parentId: 
  //         diagramType === 'activity' ? 'Swimlane1' : 
  //         nodeType === "ActivationBar" || nodeType === "DestroyMessage" ? lastObjectSelected.id :
  //         selectedNodeId && (nodes.find(node => node.id === selectedNodeId)?.type === "CompositeStateNode")? selectedNodeId : 
  //         undefined,
  //     extent: 
  //         diagramType === 'activity' || nodeType === "ActivationBar" || nodeType === "DestroyMessage"? 'parent' : 
  //         selectedNodeId && (nodes.find(node => node.id === selectedNodeId)?.type === "CompositeStateNode")? 'parent' :
  //         undefined,

  //   };
  //   if (nodeType === 'SwimLane') {
  //     setNodes((nds) => [newNode, ...nds]);
  //   }
  //   else{
  //     setNodes((nds) => [...nds, newNode]);
  //   }
  // };


  // const addNode = (nodeType) => {
  //   console.log(nodeType);
  //   numberOfNodes(n + 1);
  //   let ID = `${nodeType === "ObjectNode" ? `obj` : "Node"} ${n}`;

  //   // ✅ Check if Swimlane1 still exists before assigning parent
  //   const swimlaneExists = nodes.some(node => node.id === 'Swimlane1');
  //   const selectedComposite =
  //     selectedNodeId && nodes.find(node => node.id === selectedNodeId)?.type === "CompositeStateNode"
  //       ? selectedNodeId
  //       : null;

  //   const newNode = {
  //     id: ID,
  //     type:
  //       (nodeType === "VerticalLine" || nodeType === "HorizontalLine") && diagramType === "activity"
  //         ? "ForkJoinNode"
  //         : nodeType,
  //     data: {
  //       nodes: nodeType === "SwimLane" ? nodes : undefined,
  //       label: `${nodeType === "EndNode" ? "End" : `Node ${n}`}`,
  //       orientation: nodeType,
  //       className: "Class",
  //     },
  //     position: {
  //       x: nodeType === "DestroyMessage" || nodeType === "Activationbar" ? 0 : 200,
  //       y: nodeType === "DestroyMessage" || nodeType === "ActivationBar" ? 0 : 200,
  //     },
  //     style: {
  //       width:
  //         nodeType === "CompositeStateNode" ? 200 :
  //         nodeType === "ActivationBar" ? 20 :
  //         diagramType === "class" ? 300 :
  //         nodeType === "LoopNode" || nodeType === "ConditionNode" ? 400 :
  //         nodeType === "VerticalLine" ? 20 :
  //         nodeType === "HorizontalLine" ? 200 :
  //         50,
  //       height:
  //         nodeType === "CompositeStateNode" ? 300 :
  //         nodeType === "ActivationBar" ? 40 :
  //         diagramType === "class" ? 200 :
  //         nodeType === "LoopNode" || nodeType === "ConditionNode" ? 500 :
  //         nodeType === "VerticalLine" ? 200 :
  //         nodeType === "HorizontalLine" ? 20 :
  //         50,
  //       zIndex:
  //         nodeType === "SwimLane" ||
  //         nodeType === "LoopNode" ||
  //         nodeType === "ConditionNode" ||
  //         nodeType === "Actor" ||
  //         nodeType === "ObjectNode" ||
  //         nodeType === "CompositeStateNode"
  //           ? -1
  //           : "1000",
  //     },
  //     dragHandle: ".drag-handle__label",

  //     // ✅ Safe parent assignment
  //     parentId:
  //       diagramType === "activity" && swimlaneExists
  //         ? "Swimlane1"
  //         : nodeType === "ActivationBar" || nodeType === "DestroyMessage"
  //         ? lastObjectSelected?.id
  //         : selectedComposite
  //         ? selectedComposite
  //         : undefined,

  //     extent:
  //       diagramType === "activity" && swimlaneExists
  //         ? "parent"
  //         : nodeType === "ActivationBar" || nodeType === "DestroyMessage"
  //         ? "parent"
  //         : selectedComposite
  //         ? "parent"
  //         : undefined,
  //   };

  //   if (nodeType === "SwimLane") {
  //     setNodes((nds) => [newNode, ...nds]);
  //   } else {
  //     setNodes((nds) => [...nds, newNode]);
  //   }
  // };

  const addNode = (nodeType) => {
    console.log(nodeType);
    numberOfNodes(n + 1);
    let ID = `${nodeType === "ObjectNode" ? `obj` : "Node"} ${n}`;

    // ✅ Check if Swimlane1 still exists before assigning parent
    const swimlaneExists = nodes.some(node => node.id === 'Swimlane1');
    const selectedComposite =
      selectedNodeId && nodes.find(node => node.id === selectedNodeId)?.type === "CompositeStateNode"
        ? selectedNodeId
        : null;

    // If we're in activity diagram mode and Swimlane doesn't exist, create it first
    if (diagramType === "activity" && !swimlaneExists && nodeType !== "SwimLane") {
      const swimlaneNode = {
        id: 'Swimlane1',
        type: 'SwimLane',
        position: { x: 0, y: 0 },
        style: {
          width: 800,
          height: 600,
        },
        data: {
          numberOfActors: 2,
        },
        dragHandle: '.drag-handle__label'
      };
      setNodes((nds) => [swimlaneNode, ...nds]);
    }

    const newNode = {
      id: ID,
      type:
        (nodeType === "VerticalLine" || nodeType === "HorizontalLine") && diagramType === "activity"
          ? "ForkJoinNode"
          : nodeType,
      data: {
        nodes: nodeType === "SwimLane" ? nodes : undefined,
        label: `${nodeType === "EndNode" ? "End" : `Node ${n}`}`,
        orientation: nodeType,
        className: "Class",
      },
      position: {
        x: nodeType === "DestroyMessage" || nodeType === "ActivationBar" ? 0 : 200 + Math.random() * 100,
        y: nodeType === "DestroyMessage" || nodeType === "ActivationBar" ? 0 : 200 + Math.random() * 100,
      },
      style: {
        width:
          nodeType === "CompositeStateNode" ? 200 :
          nodeType === "ActivationBar" ? 20 :
          diagramType === "class" ? 300 :
          nodeType === "LoopNode" || nodeType === "ConditionNode" ? 400 :
          nodeType === "VerticalLine" ? 20 :
          nodeType === "HorizontalLine" ? 200 :
          50,
        height:
          nodeType === "CompositeStateNode" ? 300 :
          nodeType === "ActivationBar" ? 40 :
          diagramType === "class" ? 200 :
          nodeType === "LoopNode" || nodeType === "ConditionNode" ? 500 :
          nodeType === "VerticalLine" ? 200 :
          nodeType === "HorizontalLine" ? 20 :
          50,
        zIndex:
          nodeType === "SwimLane" ||
          nodeType === "LoopNode" ||
          nodeType === "ConditionNode" ||
          nodeType === "Actor" ||
          nodeType === "ObjectNode" ||
          nodeType === "CompositeStateNode"
            ? -1
            : "1000",
      },
      dragHandle: ".drag-handle__label",

      // ✅ Safe parent assignment with real-time checking
      parentId:
        diagramType === "activity" && nodes.some(node => node.id === 'Swimlane1')
          ? "Swimlane1"
          : (nodeType === "ActivationBar" || nodeType === "DestroyMessage") && lastObjectSelected?.id
          ? lastObjectSelected.id
          : selectedComposite
          ? selectedComposite
          : undefined,

      extent:
        diagramType === "activity" && nodes.some(node => node.id === 'Swimlane1')
          ? "parent"
          : (nodeType === "ActivationBar" || nodeType === "DestroyMessage") && lastObjectSelected?.id
          ? "parent"
          : selectedComposite
          ? "parent"
          : undefined,
    };

    if (nodeType === "SwimLane") {
      setNodes((nds) => [newNode, ...nds]);
    } else {
      setNodes((nds) => [...nds, newNode]);
    }
  };

  const onDelete = () => {
    console.log("=== DELETE OPERATION ===");
    console.log("Selected Node ID:", selectedNodeId);
    console.log("Selected Edge:", selectedEdge?.id);
    console.log("Current nodes before:", nodes.map(n => ({ id: n.id, type: n.type })));
    console.log("Current edges before:", edges.map(e => ({ id: e.id, source: e.source, target: e.target })));

    if (selectedNodeId) {
      setNodes((nds) => {
        const newNodes = nds.filter((node) => node.id !== selectedNodeId);
        console.log("Nodes after deletion:", newNodes.map(n => n.id));
        return newNodes;
      });
      setSelectedNodeId(null);
    } 
    else if (selectedEdge) {
      setEdges((eds) => {
        const newEdges = eds.filter((edge) => edge.id !== selectedEdge.id);
        console.log("Edges after deletion:", newEdges.map(e => e.id));
        console.log("Remaining nodes after edge deletion:", nodes.map(n => n.id));
        return newEdges;
      });
      setSelectedEdge(null);
    }
    
    console.log("=== DELETE OPERATION END ===");
  };


  const toggleColorMode = () => {
    setColorMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const onConnect = useCallback((params) => {
    console.log(diagramType)
  
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          id: `${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`,
          type: 'edge', // Use your custom edge component
          reconnectable: false,
          data: {
            diagramType: diagramType,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
            startLabel: diagramType === "sequence" || diagramType === "state"? undefined : " ",
            endLabel:  diagramType === "class" ? " " : undefined, 
            middleLabel: diagramType === "activity" ? undefined : " ",
            startSymbol: 'none',
            endSymbol: diagramType === "class"? "none":  'open arrow',
            relationshipType: 'directedAssociation', // Add if needed
            // stepLine: params.source === params.target ? true : false, // Add if needed
            stepLine: true,
            lineStyle: "line",
            onSetLabel: setLabel,
          },
          style: {
            // stroke: '#f6ab6c',
            // strokeDasharray: '5 5',
            zIndex: 100, // Ensure the edge is above the nodes
          },
          selectable: true,
        },
        eds
      )
    );

    // console.log('Params: ', params);
    console.log("Edges: ", edges)
  }, [setEdges]);

  const onReconnect = useCallback((oldEdge, newConnection) => {
    setEdges((els) =>
      els.map((e) =>
        e.id === oldEdge.id
          ? { ...e, ...newConnection, id: oldEdge.id, 
            data: { // udpating inner data for referencing
              ...e.data, // Keep existing data
              sourceHandle: newConnection.sourceHandle, // Update sourceHandle
              targetHandle: newConnection.targetHandle  // Update targetHandle
            }
          }
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

      setSelectedEdge(clickedEdge);
      setSelectedNodeId(null);
    
      // Push the clicked edge to the end
      return [...updatedEdges, clickedEdge];
    });
  }, []);

  const getParent = (node, swimLane) => {
    if(node.type === 'SwimLane') {
      return ""
    }

    const swimLaneWidth = swimLane.width || 800;
    const nodeX = node.position.x;
    const laneWidth = swimLaneWidth / swimLane.data.numberOfActors;
    
    const lane = Math.floor(nodeX / laneWidth);
    return `${swimLane.data.actors[lane]}` 
    // return `Lane ${lane + 1}`;

  }

  const restructureData = (nodes, edges) => {
    // console.log("Resadads Node", nodes)
    if(diagramType === 'activity'){
      return reStructureActivityDiagram(nodes, edges);
    } else if(diagramType === 'class'){
      return reStructureClassDiagram(nodes, edges); 
    }else if(diagramType === 'sequence'){
      return reStructureSequenceDiagram(edges, nodes);
    }else if(diagramType === 'state'){
      return reStructureStateDiagram(nodes, edges);
    }

  }

  const reStructureStateDiagram = (nodes, edges) => {
    const enhancedState = nodes.map(node => ({
      id: node.id,
      type: node.type,
      data: node.data || {},           // Preserve original node data
      sources: [],                     // Nodes that point TO this node (incoming)
      targets: [],                     // Nodes this node points TO (outgoing)
    }))

     // Create a map for quick node access
    const nodeMap = new Map();
    enhancedState.forEach(node => nodeMap.set(node.id, node));
    
    enhancedState.map(node => {
      if(node.type === "CompositeStateNode"){
        //find all children of this composite state
        const children = nodes.filter(n => n.parentId === node.id);
        node.data.substate = children.map(child => ({
          id: child.id,
          type: child.type,
          ...(child.data || {})   // Include any child data
        }))
      }
    })
    
    // Process all edges to build connections
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (sourceNode && targetNode) {
        // Add to source node's targets (outgoing edges)
        sourceNode.targets.push({
          nodeId: targetNode.id,
          edgeId: edge.id,
          ...(edge.data || {})   // Include any edge data
        });

        // Add to target node's sources (incoming edges)
        targetNode.sources.push({
          nodeId: sourceNode.id,
          edgeId: edge.id,
          ...(edge.data || {})   // Include any edge data
        });
      }
    });

    console.log("State: ", enhancedState)
    setStructuredData(enhancedState);
  } 

    // restructure data for easily convertion to pseudocode
  const reStructureActivityDiagram = (nodes, edges) => {
    // Create enhanced nodes with edge connections
    const swimLane = nodes[0];
    console.log("SwimLane", swimLane)
  
    const enhancedNodes = nodes.map(node => ({
        id: node.id,
        type: `${node.type === "DecisionNode" ? 'MergeNode': node.type === "ForkJoinNode" ? "JoinNode" : node.type}`,    // Default type if not specified
        data: node.data || {},           // Preserve original node data
        sources: [],                     // Nodes that point TO this node (incoming)
        targets: [],                     // Nodes this node points TO (outgoing)
        actor: node.type === 'SwimLane' ? undefined: getParent(node, swimLane),
    }));

    // Create a map for quick node access
    const nodeMap = new Map();
    enhancedNodes.forEach(node => nodeMap.set(node.id, node));

    // Process all edges to build connections
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (sourceNode && targetNode) {
        //if the source node has at least one element or target, it considered as DecisionNode
        if(sourceNode.targets?.length > 0){
          if(sourceNode.type === "MergeNode" || sourceNode.type === "DecisionNode"){
            sourceNode.type = 'DecisionNode'
          }else if(sourceNode.type === "ForkNode" || sourceNode.type === "JoinNode"){
            sourceNode.type = "ForkNode"
          }
        }

        // Add to source node's targets (outgoing edges)
        sourceNode.targets.push({
          nodeId: targetNode.id,
          edgeId: edge.id,
          ...(edge.data || {})   // Include any edge data
        });

        // Add to target node's sources (incoming edges)
        targetNode.sources.push({
          nodeId: sourceNode.id,
          edgeId: edge.id,
          ...(edge.data || {})   // Include any edge data
        });
      }
    });

    //find all the decisionNodes, is this correct?
    // enhancedNodes.forEach(node => {
    //   if (node.nodeType === "DecisionNode") {
    //     // I want to rearrange the array of node.targets
    //     // check if the node.targets.startLabel starts with "IF" with a blank space to not match with "ifs"
    //   }
    // });
    
    console.log("Nodess: ", enhancedNodes)
    setStructuredData(enhancedNodes)
    // return enhancedNodes;
  
  };

  const reStructureSequenceDiagram = (edges) => {
    console.log("Initial Nodessss: ", nodes) 
    // console.log("Restructiasdndasdas")
    let conditionalNodes = [];

    // Collect LoopNode and ConditionNode
    nodes.forEach(node => {
      if (node.type === "LoopNode" || node.type === "ConditionNode") {
        conditionalNodes.push(node);
      }
    });

    // Sort by Y axis first, then by X axis
    conditionalNodes.sort((a, b) => {
      const yDiff = a.position.y - b.position.y;
      if (yDiff !== 0) return yDiff;

      // If y is the same, compare x
      return a.position.x - b.position.x;
    });

    // console.log("Sorted conditional nodes:", conditionalNodes);
 
    const getActor = (nodeId) => {
      const activationBar = nodes.find(node => node.id === nodeId);
      const parent = nodes.find(node => node.id === activationBar.parentId);
      return parent?.data?.actorName || parent?.data?.objectName || null;
    }

    const edgesCopy = edges.map(edge => {
      // Create a clean copy of the edge
      console.log(edge.source, "source -  targte ", edge.target)
      const edgeCopy = {
        ...edge, 
        data: { 
          ...edge.data,
          source: getActor(edge.source),
          target: getActor(edge.target),
          sourceNodeType: nodes.find(node => node.id === edge.source)?.type,
          targetNodeType: nodes.find(node => node.id === edge.target)?.type,
        } // Clone data object
      };

      return edgeCopy;
    });

    // Sort the copied array
    edgesCopy.sort((a, b) => {
      // First compare by targetY
      const yDiff = a.data.sourceY - b.data.sourceY;
      if (yDiff !== 0) return yDiff;
      
      // Then compare by targetX if Y is equal
      return a.data.sourceX - b.data.sourceX;
    });

    // console.log("edges copy", edgesCopy)

    setStructuredData([edgesCopy, conditionalNodes]);

  };

  const reStructureClassDiagram = (nodes, edges) => {
    // console.log("sadasd")
    const classNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      data: node.data || {},           // Preserve original node data
      sources: [],                     // Nodes that point TO this node (incoming)
      targets: [],     
    })) 

    const nodeMap = new Map();
    classNodes.forEach(node => nodeMap.set(node.id, node));

    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (sourceNode && targetNode) {

        // Add to source node's targets (outgoing edges)
        sourceNode.targets.push({
          targetClass: nodes.find(node => node.id === targetNode.id)?.data?.className,
          nodeId: targetNode.id,
          edgeId: edge.id,
          ...(edge.data || {})   // Include any edge data
        });

        // Add to target node's sources (incoming edges)
        targetNode.sources.push({
          sourceClass: nodes.find(node => node.id === sourceNode.id)?.data?.className,
          nodeId: sourceNode.id,
          edgeId: edge.id,
          ...(edge.data || {})   // Include any edge data
        });
      }
    });

    console.log("Nodess: ", classNodes)
    setStructuredData(classNodes)
  }

  const handleLaneChange = useCallback((e) => {
    const newValue = e.target.value;

    setNodes(prevNodes => {
    // Only create new references for what changes
    const updatedNode = {
      ...prevNodes[0],
      data: {
        ...prevNodes[0].data,
        numberOfActors: newValue
      }
    };

    const newNodes = [...prevNodes];
    newNodes[0] = updatedNode;
    
    return newNodes;
    
    })
  
  }, [])

  //subject to change for optimization
  const setLabel = useCallback((position, newLabel, id) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...edge.data,
                [`${position}Label`]: newLabel, // dynamically set startLabel, middleLabel, or endLabel
              },
            }
          : edge
      )
    );
  }, []);

  const onSelectionChange = (selection) => {
    
    if(selection.nodes[0]){
      setSelectedNodeId(selection.nodes[0]?.id || null);
      setSelectedEdge(null);
    }
    // console.log("Selected: ", selectedNodeId? selectedNodeId: selectedEdge? selectedEdge: "none")
  }

// new
  // const onDelete = () => {
  //   if (selectedNodeId) {
  //     setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
  //     setSelectedNodeId(null);
  //   } 
  //   else if (selectedEdge) {
  //     setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
  //     setSelectedEdge(null);
  //   }
  // };


  return (
    <div
      className="react-flow-container"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundColor: colorMode === 'dark' ? '#1a202c' : 'white'
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={throttledOnNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onReconnect={onReconnect}
        onSelectionChange={onSelectionChange}
        minZoom={0.2}
        maxZoom={4}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        edgeTypes={edgeTypes}
        connectionMode='loose'
        connectionLineType="step" 
        defaultEdgeOptions={{
          zIndex: 1000,
          style: { stroke: '#000', strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color={colorMode === 'dark' ? '#4a5568' : 'green'}
          gap={16}
        />
        <Controls />
        <MiniMap
          pannable = "true" zoomable="true"
          style={{
            backgroundColor: colorMode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            border: colorMode === 'dark' ? '1px solid #4a5568' : '1px solid #ddd',
          }}
          nodeColor={() => colorMode === 'dark' ? '#4a5568' : '#e2e8f0'}
          nodeStrokeColor={() => colorMode === 'dark' ? '#718096' : '#94a3b8'}
          nodeBorderRadius={4}
          maskColor={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(200, 200, 200, 0.3)'}
          position="bottom-right"
        />

      </ReactFlow>


      {/* Menu Tab */}
      <div
        style={{
          width: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
          backgroundColor: colorMode === 'dark' ? '#2D3748' : '#EDF2F7',
          padding: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          zIndex: '1000',
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: '13px'
        }}
      > 
        {/* Go back to diagram selection button */}
      <button
        onClick={() => navigate("/select-diagram")}
        style={{
          position: 'absolute',
          left: '10px',
          padding: '6px 12px',
          background: colorMode === 'dark' ? '#4A5568' : '#FFF',
          border: '1px solid #ccc',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}
      >
        ← Back
      </button>


        {/* Generate pseudocode */}
        <button 
          onClick={() => {
            restructureData(nodes, edges);
            setShowPseudocode(true);
          }}
          style={{
            padding: '6px 12px',
            background: colorMode === 'dark' ? '#4A5568' : '#FFF',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Generate
        </button>

        {/* Line & Dashline Dropdown */}
        <select
          value={selectedEdge?.data?.lineStyle || "line"}
          onChange={(e) => {
            setEdges(eds => eds.map(edge => {
              if (edge.id === selectedEdge?.id) {
                const updatedEdge = {
                  ...edge,
                  data: { ...edge.data, lineStyle: e.target.value },
                };
                setSelectedEdge(updatedEdge);
                return updatedEdge;
              }
              return edge;
            }));
          }}
          style={{
            padding: '6px 10px',
            backgroundColor: colorMode === 'dark' ? '#4A5568' : '#FFF',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <option value="line">Line ─</option>
          <option value="dashLine">Dash ┄</option>
        </select>

        {/* Marker Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {/* Start Symbol Dropdown (disabled) */}
          <select
            value={selectedEdge?.data?.startSymbol || "none"}
            disabled
            style={{
              padding: '6px 10px',
              backgroundColor: colorMode === 'dark' ? '#4A5568' : '#FFF',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'not-allowed',
              opacity: '0.6'
            }}
          >
            {markerTypes.map((type, index) => (
              <option key={index} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>

          {/* Switch Button */}
          <button
            onClick={() => {
              setEdges(eds => eds.map(edge => {
                if (edge.id === selectedEdge?.id) {
                  const updatedEdge = {
                    ...edge,
                    target: edge.source,
                    source: edge.target,
                    sourceHandle: edge.targetHandle,
                    targetHandle: edge.sourceHandle,
                    data: {
                      ...edge.data,
                      sourceHandle: edge.targetHandle,
                      targetHandle: edge.sourceHandle,
                    }
                  };
                  setSelectedEdge(updatedEdge);
                  return updatedEdge;
                }
                return edge;
              }));
            }}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <img src={SwitchArrow} alt="Switch" style={{ width: '22px', height: '22px' }} />
          </button>

          {/* End Symbol Dropdown */}
          <select
            value={selectedEdge?.data?.endSymbol || "none"}
            onChange={(e) => {
              setEdges(eds => eds.map(edge => {
                if (edge.id === selectedEdge?.id) {
                  const updatedEdge = { ...edge, data: { ...edge.data, endSymbol: e.target.value } };
                  setSelectedEdge(updatedEdge);
                  return updatedEdge;
                }
                return edge;
              }));
            }}
            style={{
              padding: '6px 10px',
              backgroundColor: colorMode === 'dark' ? '#4A5568' : '#FFF',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {markerTypes.map((type, index) => (
              <option key={index} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>


        {/* Lane Selector (only for Activity diagram) */}
        {diagramType === "activity" && (
          <select 
            onChange={handleLaneChange}
            style={{
              padding: '6px 10px',
              backgroundColor: colorMode === 'dark' ? '#4A5568' : '#FFF',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <option value={2}>2 Lane</option>
            <option value={3}>3 Lane</option>
            <option value={4}>4 Lane</option>
            <option value={5}>5 Lane</option>
          </select>
        )}

        {/* Delete Button (Icon) */}
        <button
          onClick={onDelete}
          style={{
            padding: '6px 12px',
            background: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🗑 Delete
        </button>
          
          {/* Guideline Button */}
        <button
          onClick={() => setShowGuideline(true)}
          style={{
            padding: '6px 10px',
            background: colorMode === 'dark' ? '#4A5568' : '#FFF',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '15px',
            fontWeight: 'bold',
            boxShadow: '0 0 6px rgba(255,0,0,0.6)', // subtle glow to catch attention
          }}
          title="View Guidelines"
        >
          ❓
        </button>


        {/* Color Mode Toggle */}
        <button
          onClick={toggleColorMode}
          disabled
          style={{
            padding: '6px 12px',
            background: colorMode === 'dark' ? '#4a5568' : '#FFF',
            color: colorMode === 'dark' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            opacity: 0,
          }}
        >
          {colorMode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

      </div>


      {/* Node creation buttons */}
      <div
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 10
        }}
      >
        {diagramType === "activity" && (activityDiagramNodes.map((nodeType) => (
          <button
            key={nodeType}
            onClick={() => addNode(nodeType)}
            style={{
              padding: '8px 16px',
              background: colorMode === 'dark' ? '#2d3748' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            {nodeType === 'ActionNode' && 'Action Node'}
            {nodeType === 'DecisionNode' && 'Decision/Merge Node'}
            {nodeType === 'EndNode' && 'Final State'}
            {nodeType === 'DestructionNode' && 'Destruction Node'}
            {nodeType === 'VerticalLine' && 'ForkJoinNode Vertical'}
            {nodeType === 'HorizontalLine' && 'ForkJoinNode Horizontal'}

          
          </button>

        )))}

        {diagramType === "class" && (classDiagramNodes.map((nodeType => (

          <button
            key={nodeType}
            onClick={() => addNode(nodeType)}
            style={{
              padding: '8px 16px',
              background: colorMode === 'dark' ? '#2d3748' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            {nodeType === 'ClassNode' && 'Class Node'}
          </button>
        ))))}

        {diagramType === "sequence" && (sequenceDiagramNodes.map((nodeType => (
          <button
            key={nodeType}
            onClick={() => addNode(nodeType)}
            style={{
              padding: '8px 16px',
              background: colorMode === 'dark' ? '#2d3748' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            {nodeType === 'Actor' && 'Actor'}
            {nodeType === 'ActivationBar' && 'Activation Bar'}
            {nodeType === 'ShadedCircle' && 'Shaded Circle'}
            {nodeType === "ObjectNode" && "Object Node"}
            {nodeType === "ConditionNode" && "Condition Node"}
            {nodeType === "LoopNode" && "Loop Node"}
            {nodeType === "DestroyMessage" && "Destroy Message"}
          </button>
        ))))}

        {diagramType === "state" && (stateDiagramNodes.map((nodeType => (
          <button
            key={nodeType}
            onClick={() => addNode(nodeType)}
            style={{
              padding: '8px 16px',
              background: colorMode === 'dark' ? '#2d3748' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '150px',
            }}
          >
            {nodeType === 'StateNode' && 'State'}
            {nodeType === 'StartNode' && 'Initial State'}
            {nodeType === "CompositeStateNode" && "Composite State"}
            {nodeType === "EndNode" && "End Node"}
          </button>
        ))))}


      </div>

      {/* <ActivityDiagram nodes = {structuredData} /> */}
      {showPseudocode && structuredData && (
        <div
          style={{
             position: 'fixed',
  top: '70px', // ✅ Always 200px from top — no shifting
  right: '10px', // ✅ Sticks to the right side
  // ❌ Remove transform to prevent vertical centering shift
  width: '400px',
  maxWidth: '80vh',
  maxHeight: '400px',
  overflowY: 'auto',
  backgroundColor: colorMode === 'dark' ? '#2D3748' : 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  border: colorMode === 'dark' ? '1px solid #4A5568' : '1px solid #E2E8F0'
          }}

        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            color: colorMode === 'dark' ? 'white' : 'black'
          }}>
            <h3 style={{ margin: 0 }}>Generated Pseudocode:</h3>
            <button 
              onClick={() => setShowPseudocode(false)}
              style={{
                background: 'none',
                border: 'none',
                color: colorMode === 'dark' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
          {diagramType === "activity" && <ActivityDiagram nodes={structuredData} />}
          {diagramType === 'class' && <ClassDiagram nodes={structuredData}/> }
          {diagramType === 'sequence' && <SequenceDiagram edges = {structuredData[0]} nodes = {structuredData[1]} />}
          {diagramType === 'state' && <StateDiagram nodes = {structuredData} />}

        </div>
      )}

      {/* Show guideline */}
      {showGuideline && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: colorMode === 'dark' ? '#2D3748' : '#FFF',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: '2000',
            width: '400px',
            // textAlign: 'center',
            fontFamily: "'Segoe UI', Arial, sans-serif",
          }}
        >
          <h3 style={{ 
            whiteSpace: "pre-line", 
            fontSize: '14px', 
            opacity: '0.9',
            textAlign: 'left',
            lineHeight: '1.5'
          }}>📌 {diagramType.toUpperCase()} Diagram Guidelines</h3>

          <p style={{ fontSize: '14px', opacity: '0.9' }}>
            {diagramType === "activity" && activityDiagramGuidelines}
            {diagramType === "class" && classDiagramGuidelines}
            {diagramType === "sequence" && sequenceDiagramGuidelines}
            {diagramType === "state" && stateDiagramGuidelines}
          </p>

          <button
            onClick={() => setShowGuideline(false)}
            style={{
              marginTop: '15px',
              padding: '6px 12px',
              background: '#3182CE',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}



    </div>
  );
}
