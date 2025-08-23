import { FaBuildingCircleExclamation } from "react-icons/fa6";
import DecisionNode from "../Nodes/DecisionNode";

export function ActivityDiagram1({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return "// Empty diagram - no nodes found";
  }

  let visited = new Set();
  let pseudocode = "";
  let indentLevel = 0;
  let hasEndNode = false;

  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += "  ".repeat(indentLevel) + text;
  }

  function dfs(node, targetIndex) {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);

    switch (node.type) {
      case "StartNode":
        addLine("BEGIN");
        indentLevel++;
        break;

      case "ActionNode":
        addLine(`DO: ${node.data?.label || node.id}`);
        break;

      case "DecisionNode":
        // console.log(node.targets.startLabel)
        console.log("Node", node, "Targets:", node.targets)
        addLine(`IF [${node.targets[targetIndex]?.startLabel || "condition"}] THEN`);
        indentLevel++;
        
        if (node.targets?.[0]) {
          const trueNode = nodes.find(n => n.id === node.targets[0].nodeId);
          dfs(trueNode);
        }
        indentLevel--;

        for (let i = 1; i < node.targets.length; i++) {
          const branchLabel = node.targets[i].edgeLabel || 
                           (i === node.targets.length - 1 ? "ELSE" : `ELSE IF [condition_${i}]`);
          addLine(branchLabel);
          indentLevel++;
          const branchNode = nodes.find(n => n.id === node.targets[i].nodeId);
          dfs(branchNode, i);
          indentLevel--;
        }
        break;

      case "MergeNode":
        break;

      case "EndNode":
        hasEndNode = true;
        if (indentLevel > 0) indentLevel--;
        break;
      
      case "DestructionNode":
        addLine('Terminate Progress')

      default:
        addLine(`[UNHANDLED NODE TYPE: ${node.type}]: ${node.id}`);
    }

    if (node.targets) {
      for (const target of node.targets) {
        const targetNode = nodes.find(n => n.id === target.nodeId);
        dfs(targetNode);
      }
    }
  }

  const startNode = nodes.find(node => node.type === "StartNode");
  if (startNode) {
    dfs(startNode, 0);
    
    if (hasEndNode) {
      if (indentLevel > 0) indentLevel--;
      addLine("END");
    }
  } else {
    pseudocode = "// No StartNode found in the diagram!";
  }

  return (
    <pre style={{
      margin: 0,
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word'
    }}>
      {pseudocode}
    </pre>
  );
}

export function ActivityDiagram( {nodes} ){

  let visited = new Set();
  let pseudocode = "";
  let indentLevel = 0;
  let hasEndNode = false;

  // adding new line
  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += "  ".repeat(indentLevel) + text;
  }

  if(!nodes || nodes.length === 0){
    return "" //empty diagram
  }

  function dfs(node){
    
  }

  //findding initial/start node
  const startNode = nodes.find(node => node.type === "StartNode");

  if(startNode){
    dfs(startNode);
  }

  return (
    <pre style={{
      margin: 0,
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word'
    }}>
      {pseudocode}
    </pre>
  );


}

export function SequenceDiagram ({nodes}) {





    return(
        ""
    )

}

export function StateDiagram ({nodes}) {





    return(
        ""
    )

}

export function ClassDiagram ({nodes}) {





    return(
        ""
    )

}