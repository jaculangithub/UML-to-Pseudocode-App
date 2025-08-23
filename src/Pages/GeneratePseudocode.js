// Node class for each element in the list
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// LinkedList class
class LinkedList {
  constructor() {
    this.head = null;
  }

  // Add node at the end
  append(data) {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  // Add node at the start
  prepend(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }

  // Print all nodes
  printList() {
    let current = this.head;
    let output = "";
    while (current) {
      output += current.data + " -> ";
      current = current.next;
    }
    console.log(output + "null");
  }
}

// // Example usage:
// const list = new LinkedList();
// list.append(10);
// list.append(20);
// list.append(30);
// list.prepend(5);

// list.printList(); // 5 -> 10 -> 20 -> 30 -> null


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
        addLine(`\n//Conditions:`)
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
        // if (indentLevel > 0) indentLevel--;
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

  
    // nodes.forEach(node => {
    //   node.numberOfVisitedSource = 0;
    // });

  if(!nodes || nodes.length === 0){
    return "" //empty diagram
  }
  console.log("satrt")

  // adding new line
  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += "  ".repeat(indentLevel) + text;
  }

  function dfs(node, prevNode){
    if(!node || visited.has(node.id)) return;
    console.log("Current Node: ", node.id, "Node type: ", node.type)
    
    if(node.type !== "MergeNode"){
      visited.add(node.id);
    }

    //rules 
    switch (node.type)  {
      case "StartNode":
        addLine("BEGIN");
        indentLevel++;
        break;
      
      case "ActionNode": 
        addLine(`DO: ${node.data?.label}`)
        break;
      
      case "DecisionNode":
        addLine(`\n//Conditions:`)
        
        for(const target of node.targets) {
          addLine(`IF(${target.startLabel})`)
          indentLevel++;
          const targetNode = nodes.find(n => n.id === target.nodeId);
          dfs(targetNode, node);
          indentLevel--;
        }
        break;

      case "DestructionNode":
        addLine(`Process Terminated/Cancel`)
        break;
      
      case "MergeNode":
        // node.numberOfVisitedSource++
        // console.log("Number of visited sources ", node.numberOfVisitedSource, 
        //             " number of sources:", node.sources.length)

        // if(node.numberOfVisitedSource === node.sources.length){
        //   visited.add(node.id);
        //   console.log("Current n of source: ", node.numberOfVisitedSource)
        //   console.log("Merge Node addedd to set")
        //   indentLevel--;
        //   break;
        // }else {

        //   console.log("Merge Node not added to set")
        //   return;
        // }
      
      case "EndNode":
        hasEndNode =  true;
        break;

      case "DestructionNode":
        addLine('Program Terminated/Cancelled!');
        break;
      default: 
        addLine("Undefined node type");
        break;
    }

    if(node.targets && node.type !== "DecisionNode"){
      for(const target of node.targets) {
        const targetNode = nodes.find(n => n.id === target.nodeId);
        dfs(targetNode, node);
      }
    }

  }

  //findding initial/start node
  const startNode = nodes.find(node => node.type === "StartNode");

  if(startNode){
    dfs(startNode, null);

    if(hasEndNode){
      indentLevel = 0;
      addLine("END");
    }
  } else {
    pseudocode = "//No StartNode found"
  }

  console.log("hello")

  

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

export function SequenceDiagram({nodes, edges}) {

  function getActor(nodeId){
    let node = nodes.find(n => n.id === nodeId)
    return node.parentId;
  }

  let pseudocode = "";
  let inLoop = false;

  edges.map(edge => {
    // console.log(edge.loopNodeId)
    if(edge.data.loopNodeId && !inLoop){
      console.log(true)
      inLoop = true
      pseudocode += "  Loop (condition) \n"
    }else{
       console.log(false)
      inLoop = false;
    }

    let replyMessage = edge.data.lineStyle === "line" ? false : true

    pseudocode += `${inLoop? `  `: ''} ${getActor(edge.source)} ${replyMessage? "Reply: " : ""} ${edge.data.middleLabel} ${getActor(edge.target)} \n`;
 
  });

  return (
    <div className="sequence-pseudocode">
      <pre>
        {pseudocode}
      </pre>
    </div>
  );
}

export function StateDiagram ({nodes}) {





    return(
        ""
    )

}

export function ClassDiagram({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return "// No classes defined";
  }

  let pseudocode = "";

  nodes.forEach(element => {
    
  });

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5',
      padding: '12px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px'
    }}>
      {pseudocode}
    </pre>
  );

}