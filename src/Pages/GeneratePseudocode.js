
export function ActivityDiagram( {nodes} ){

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

          if(!visited.has(source.nodeId)){
            allSourceVisited = false; 
            break;
          }
        }
        
        if(allSourceVisited){
          // console.log(`All node that go to ${node.id} is visited`)
          addLine("//PARALLEL Execution End")
          visited.add(node.id)
          break; //assuming all of its source node/s is visited, go to the next nodes after the join node

        }else{
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

export function StateDiagram( {nodes} ){
  console.log("Start")
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
      // if(node.type === "ActionNode"){
      //   addLine(`State: ${node.data?.label}`)
      // }
      // console.log("Node: ", node.id)
      return;
    }

    //rules 
    switch (node.type)  {
      case "StartNode":
        addLine("BEGIN");
        indentLevel++;
        break;
      
      case "StateNode": 
        break;

      case "CompositeStateNode":
        addLine(`Composite State: ${node.data?.label}`)
        indentLevel++;
        // console.log("Substate data: ", node.data?.substate)
        const strt = node.data?.substate?.find(n => n.type === "StartNode");
        // console.log("Substate", strt?.id)
        const strtNode = nodes.find(n => n.id === strt?.id);
        // console.log("Strt Node: ", strtNode)
        if(strtNode){
          dfs(strtNode);
        }  
       indentLevel--; 
        addLine("Composite State End")
        break;
      
      case "EndNode":
        hasEndNode =  true;
        break;
        
      default: 
        addLine("Undefined node type");
        break;
    }

    if(node.targets){
      for(const target of node.targets) {
        const targetNode = nodes.find(n => n.id === target.nodeId);

        //print transition
        if(node.type !== "StartNode"){
          addLine(`${node.data.label}--[${target.middleLabel? target.middleLabel: " "}]-->${targetNode.data.label}`)
        }
        dfs(targetNode);
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

export function SequenceDiagram({edges}) {

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

export function ClassDiagram({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return "// No classes defined";
  }
  
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
        relationship += `OWNS ${sourceClass} `; //composition
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