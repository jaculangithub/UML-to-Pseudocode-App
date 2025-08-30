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

export function ActivityDiagram( {nodes} ){
  // console.time(`RunActivityDiagram`); // REMOVED
  const startTime = performance.now(); // ADDED
  let visited = new Set();
  let pseudocode = "";
  let indentLevel = 0;
  let hasEndNode = false;
  
  if(!nodes || nodes.length === 0){
    return "" //empty diagram
  }
  

  // adding new line
  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += "  ".repeat(indentLevel) + text;
  }

  function dfs(node){
    console.log("Current Node: ", node.id, "Node type: ", node.type)
    if(!node || visited.has(node.id)){
      if(node.type === "ActionNode"){
        addLine(`DO: ${node.data?.label}`)
      }
      console.log("Node: ", node.id)
      return;
    } 
    
    
    if(node.type !== "MergeNode" && node.type !== "JoinNode"){
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
        addLine(`//Conditions:`)
        node.targets.forEach((target) => {
          addLine(`IF(${target.startLabel})`)
          indentLevel++;
          const targetNode = nodes.find(n => n.id === target.nodeId);
          dfs(targetNode);
          indentLevel--;
        });
        break;

      case "DestructionNode":
        addLine(`Process Terminated/Cancel`)
        break;
      
      case "MergeNode":
        break;
      
      case "EndNode":
        hasEndNode =  true;
        break;

      case "DestructionNode":
        addLine('Program Terminated/Cancelled!');
        break;
      
      case "ForkNode":
        addLine("//Parallel Execution Start")
        break;
      
      case "JoinNode":
        let allSourceVisited = true;
        for(const source of node.sources){
          // console.log("For Loop==================================")
          // console.log(`Source: ${source.nodeId}`)
          // console.log("IsVisited? ", visited.has(source.nodeId))

          if(!visited.has(source.nodeId)){
            allSourceVisited = false; 
            // console.log("Unvisited Node: ", source.nodeId)
            break;
          }
        }
        
        if(allSourceVisited){
          // console.log(`All node that go to ${node.id} is visited`)
          addLine("//PARALLEL Execution End")
          visited.add(node.id)
          break; //assuming all of its source node/s is visited, go to the next nodes after the join node
        }else{
          // console.log("returning..")
          return; //backtrack, dont continue going deep
        }

      default: 
        addLine("Undefined node type");
        break;

    }

    if(node.targets && node.type !== "DecisionNode"){
      for(const target of node.targets) {
        const targetNode = nodes.find(n => n.id === target.nodeId);
        // console.log("Target: ", targetNode.id)
        dfs(targetNode);
        // console.log("back to ", targetNode.id, "Type ", targetNode.type, " ", targetNode.data?.label)
      }
    }

  }

  //findding initial/start node
  const startNode = nodes.find(node => node.type === "StartNode");

  if(startNode){
    dfs(startNode);

    if(hasEndNode){
      indentLevel = 0;
      addLine("END");
    }
    console.log("asdadadlst")

  } else {
    pseudocode = "//No StartNode found"
  }

  // console.timeEnd(`RunActivityDiagram`); // REMOVED
  const endTime = performance.now(); // ADDED
  const executionTime = (endTime - startTime).toFixed(5); // ADDED
  console.log(`Algorithm executed in ${executionTime} milliseconds`); // ADDED

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

  // console.log("GEn. ", edges)
  const startTime = performance.now(); // ADDED
  let pseudocode = "";
  let inLoop = false;
  let indentLevel = 0;

  

  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += text;
  }

  function message(edgeData) {
    let messageType = ""

    if(edgeData.endSymbol === "closed arrow"){
      if(edgeData.middleLabel.includes("<<create>>")){  
        addLine(`${edgeData.source} cresaates ${edgeData.target}`)
        messageType = "create message"; // create message
      }
      else if(edgeData.targetNodeType === "ShadedCircle"){
        addLine(`${edgeData.source} ${edgeData.middleLabel} to External Entity`)
        messageType = "lost message" //Lost message 
      }else if(edgeData.sourceNodeType === "ShadedCircle"){
        addLine(`External Entity ${edgeData.middleLabel} ${edgeData.target}`)
        messageType = "found message" //found message
      }else if(edgeData.targetNodeType === "DestroyMessage"){
        addLine(`${edgeData.source} Destroys ${edgeData.target}`)
        messageType = "destroy message"; //destroy message
      }else if(edgeData.lineStyle === "line"){
        addLine(`${edgeData.source} ${edgeData.middleLabel} ${edgeData.target}`)
        messageType = "synchronous"; //synchronous message
      } else {
        addLine("Unknown message type")
      }
    }else if (edgeData.endSymbol === "open arrow"){
      if(edgeData.source === edgeData.target){
        addLine(`${edgeData.source} will ${edgeData.middleLabel}`)
        messageType = "self message" //self message 
      }else if(edgeData.lineStyle === "line"){
        addLine(`${edgeData.source} ${edgeData.middleLabel} ${edgeData.target} //asynchronous`)
        messageType = "asynchronous" //asynch message
      }else if(edgeData.lineStyle === "dashLine"){
        addLine(`${edgeData.source} Replies: ${edgeData.middleLabel} to ${edgeData.target}`)
        messageType = "reply" //reply message 
      }else {
        addLine("Unknown message type")
      }
    } else {
      addLine("Unknown message type")
    }


    // if(edgeData.endSymbol === "closed arrow" && edgeData.lineStyle === "line"){ //message is synchronous
    //   addLine(`${edgeData.source} ${edgeData.middleLabel} ${edgeData.target}`)
    // }
    // else if (edgeData.endSymbol === "open arrow" && edgeData.lineStyle === "line"){ //asynch message
    //   addLine(`${edgeData.source} ${edgeData.middleLabel} ${edgeData.target} //asynchronous`)
    // }
    // else if (edgeData.endSymbol === "open arrow" && edgeData.lineStyle === "dashLine"){ //reply message
    //   addLine(`${edgeData.source} Replies: ${edgeData.middleLabel} to ${edgeData.target}`) 
    // }
    // else if (edgeData.source === edgeData.target) { //self message
    //   addLine(`${edgeData.source} will ${edgeData.middleLabel}`)
    // }
    // else if (edgeData.middleLabel.includes("<<create>>") && edgeData.endSymbol === "closed arrow"){ //create message
    //   addLine(`${edgeData.source} create ${edgeData.target}`)
    // }
    // else if(edgeData.endSymbol === "closed arrow" && edgeData.targetNodeType === "DestroyMessage"){ //delete message
    //   addLine(`${edgeData.source} Destroys ${edgeData.target}`)
    // }
    // else if(edgeData.endSymbol === "closed arrow" && edgeData.sourceNodeType === "ShadedCircle"){ //found message
    //   addLine(`External Entity ${edgeData.middleLabel} ${edgeData.target}`)
    // }
    // else if(edgeData.endSymbol === "closed arrow" && edgeData.targetNodeType === "ShadedCircle"){ //lost message
    //   addLine(`${edgeData.source} ${edgeData.middleLabel} to External Entity`)
    // }
   
  }

  edges.map(edge => {
    // console.log(edge.loopNodeId)
    if(edge.data.loopNodeId && !inLoop){
      // console.log(true)
      inLoop = true
      pseudocode += "  Loop (condition) \n"
      indentLevel++;
    }else{
      // console.log(false)
      inLoop = false;
      indentLevel--;
    }
    
    message(edge.data);

  });

  const endTime = performance.now(); // ADDED
  const executionTime = (endTime - startTime).toFixed(5); // ADDED
  console.log(`Algorithm executed in ${executionTime} milliseconds`); // ADDED

  return (
    <div className="sequence-pseudocode">
      <pre>
        {pseudocode}
      </pre>
    </div>
  );
}

// export function SequenceDiagram({nodes, edges}) {
//   console.log("Generating edges, " , edges)
// }
export function StateDiagram ({nodes}) {





    return(
        ""
    )

}

export function ClassDiagram({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return "// No classes defined";
  }
  console.log("start")
  console.log(nodes)
  const startTime = performance.now(); // ADDED

  let pseudocode = "";
  let indentLevel = 1;

  //addign na new line with
  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += "  ".repeat(indentLevel) + text;
  }


  
  function printAttributes(node){
    node.data.attributes.forEach(attribute => {
      let accessModifier;
      switch (attribute.access){
        case "+":
          accessModifier = "public";
          break;
        case "-": 
          accessModifier = "private";
          break;
        case "#":
          accessModifier = "protected";
          break;
        default: 
          accessModifier = "default";
          break;
      }
      addLine(`${accessModifier} ${attribute.value}`)
    })
  }

  function printMethods(node){
    node.data.methods.forEach(method => {
      let accessModifier;
      switch (method.access){
        case "+":
          accessModifier = "public";
          break;
        case "-": 
          accessModifier = "private";
          break;
        case "#":
          accessModifier = "protected";
          break;
        default: 
          accessModifier = "default";
          break;
      }
      addLine(`${accessModifier} ${method.value}`)
    })
  }

  const getRelationship = (node) => {
    if(!node.targets) return ""
    let relationship = "";

    node.targets.forEach(target => {
      const targetClass = target.targetClass;
    
      if(target.endSymbol === "closed arrow" && target.lineStyle === "line"){
        relationship += `inherits ${targetClass} `; //inheritance
      }else if(target.endSymbol === "closed arrow" && target.lineStyle === "dashLine"){
        relationship += `implements ${targetClass} `; //realization
      }else if(target.endSymbol === "open arrow" && target.lineStyle === "line"){ //directed association
        relationship += `${target.middleLabel} ${targetClass} `; 
      }else if(target.endSymbol === "open arrow" && target.lineStyle === "dashLine"){
        relationship += `depends on ${targetClass} `; //dependency
      }
    })

    node.sources.forEach(source => {
      const sourceClass = source.sourceClass
      if(source.endSymbol === "open diamond"){
        relationship += `has-a ${sourceClass} `; //aggregation 
      }else if(source.endSymbol === "filled diamond"){
        relationship += `composed of ${sourceClass} `; //composition
      }
    })

    return relationship;


  }

  nodes.forEach(node => {
    
    let classRelationships = getRelationship(node);

    addLine(`CLASS ${node.data.className} ${classRelationships}`)
    indentLevel++;
    
    //printing attributes and methods
    printAttributes(node);
    printMethods(node);

    indentLevel--;

    addLine("");

  })

  const endTime = performance.now(); // ADDED
  const executionTime = (endTime - startTime).toFixed(5); // ADDED
  console.log(`Algorithm executed in ${executionTime} milliseconds`); // ADDED

  return (
    <p style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5',
      padding: '12px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px'
    }}>
      {pseudocode}
    </p>
  );

}