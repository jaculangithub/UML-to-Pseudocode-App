
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
    if(!node || visited.has(node.id)){
      if(node.type === "ActionNode"){
        addLine(`DO: ${node.data?.label}`)
      }else if (node.type === "DestructionNode"){
        addLine("Program Terminated/Cancel")
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

export function StateDiagram( {nodes} ){
  console.log(nodes)
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
    
    if(!node || visited.has(node.id)){
      return;
    }
    if(node.type !== "StateNode"){
      visited.add(node.id);
    }
    //rules 
    switch (node.type)  {
      case "StartNode":     
        if(node.targets && node.targets.length > 0){
          if(node.targets.length === 1){
            indentLevel++;
            const targetId = node.targets[0].nodeId;
            addLine(`Initial State = ${nodes.find(node => node.id === targetId)?.data.label}`)
            addLine(`while running do`)
            indentLevel++;
            dfs(nodes.find(node => node.id === targetId));
            
          }
          else{
            addLine(`//Invalid Diagram. Start Node has multiple targets, please check the diagram.`)
            return;
          }
        }
        break;
      
      case "StateNode": 
        addLine(`IF STATE = ${node.data?.label} THEN`)
        visited.add(node.id);
        if(node.targets){
           indentLevel++;
          for(const target of node.targets) {
            const targetNode = nodes.find(n => n.id === target.nodeId);
            //print transition  
            if(node.type !== "StartNode"){  
              addLine(`IF event = ${target.middleLabel} THEN`)
              indentLevel++;
              addLine(`state = ${targetNode.data.label}`)
              dfs(targetNode);
            }else{
              dfs(targetNode);
            }
            indentLevel--;
          } 
          addLine(`END IF`) 
        }
        
        indentLevel--;
        addLine(`END IF`)
        break;

      case "CompositeStateNode":
        addLine(`IF State: ${node.data?.label} //Composite State Start`)
        indentLevel++;
      
        const strt = node.data?.substate?.find(n => n.type === "StartNode");
       
        const strtNode = nodes.find(n => n.id === strt?.id);
       
        if(strtNode){
          dfs(strtNode);
        }  
       indentLevel--; 
        addLine(`Composite State ${node.data?.label} End`)
        break;
      
      case "EndNode":
        hasEndNode =  true;
        break;
        
      default: 
        addLine("Undefined node type");
        break;
    }
  }

  //finding initial/start node
  const startNode = nodes.find(node => node.type === "StartNode");

  if(startNode){
    addLine("START");
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


export function SequenceDiagram({ edges, nodes }) {
  console.log(nodes)
  const startTime = performance.now();
  let pseudocode = "";
  let indentLevel = 0;

  function addLine(text) {
    if (pseudocode.length > 0) {
      pseudocode += "\n";
    }
    pseudocode += "  ".repeat(indentLevel) + text;
  }

  function message(edgeData) {
    let messageType = "";

    if (edgeData.endSymbol === "closed arrow") {
      if (edgeData.middleLabel.includes("<<create>>")) {
        addLine(`${edgeData.source} creates ${edgeData.target}`);
        messageType = "create message";
      } else if (edgeData.targetNodeType === "ShadedCircle") {
        addLine(`${edgeData.source} ${edgeData.middleLabel} to External Entity`);
        messageType = "lost message";
      } else if (edgeData.sourceNodeType === "ShadedCircle") {
        addLine(`External Entity ${edgeData.middleLabel} ${edgeData.target}`);
        messageType = "found message";
      } else if (edgeData.targetNodeType === "DestroyMessage") {
        addLine(`${edgeData.source} Destroys ${edgeData.target}`);
        messageType = "destroy message";
      } else if (edgeData.lineStyle === "line") {
        addLine(`${edgeData.source} ${edgeData.middleLabel} to ${edgeData.target}`);
        messageType = "synchronous";
      } else {
        addLine("Unknown message type");
      }
    } else if (edgeData.endSymbol === "open arrow") {
      if (edgeData.source === edgeData.target) {
        addLine(`${edgeData.source} will ${edgeData.middleLabel}`);
        messageType = "self message";
      } else if (edgeData.lineStyle === "line") {
        addLine(`${edgeData.source} ${edgeData.middleLabel} to ${edgeData.target} //asynchronous`);
        messageType = "asynchronous";
      } else if (edgeData.lineStyle === "dashLine") {
        addLine(`${edgeData.source} Replies: ${edgeData.middleLabel} to ${edgeData.target}`);
        messageType = "reply";
      } else {
        addLine("Unknown message type");
      }
    } else {
      addLine("Unknown message type");
    }
  }

  let activeNodes = [];
  let currentConditionBranch = null; // Track current branch: "if" or "else"
  
  // Sort edges by vertical position
  const sortedEdges = [...edges].sort((a, b) => a.data.sourceY - b.data.sourceY);
  
  sortedEdges.forEach(edge => {
    // Find enclosing nodes for both source and target
    const sourceEnclosingNodes = nodes.filter(node => 
      edge.data.sourceX >= node.position.x &&
      edge.data.sourceX <= node.position.x + node.width &&
      edge.data.sourceY >= node.position.y &&
      edge.data.sourceY <= node.position.y + node.height
    );

    const targetEnclosingNodes = nodes.filter(node => 
      edge.data.targetX >= node.position.x &&
      edge.data.targetX <= node.position.x + node.width &&
      edge.data.targetY >= node.position.y &&
      edge.data.targetY <= node.position.y + node.height
    );

    // Combine and sort by Y position (lowest Y first = higher on screen)
    const allEnclosingNodes = [...new Set([...sourceEnclosingNodes, ...targetEnclosingNodes])];
    const enclosingNodes = allEnclosingNodes.sort((a, b) => a.position.y - b.position.y);

    // Close nodes that are no longer enclosing
    while (activeNodes.length > 0) {
      const lastActiveNode = activeNodes[activeNodes.length - 1];
      if (!enclosingNodes.includes(lastActiveNode)) {
        const closingNode = activeNodes.pop();
        indentLevel = activeNodes.length;
        
        if (closingNode.type !== "ActivationBar") {
          // Reset condition branch when closing a condition node
          if (closingNode.type === "ConditionNode") {
            currentConditionBranch = null;
          }
          addLine(`End${closingNode.type}`);
        }
      } else {
        break;
      }
    }

    // Open new nodes
    enclosingNodes.forEach(node => {
      if (!activeNodes.includes(node)) {
        indentLevel = activeNodes.length;
        
        // Skip ActivationBar nodes for structural pseudocode
        if (node.type === "ActivationBar") {
          return;
        }
        
        if (node.type === "LoopNode") {
          const condition = node.data.condition || "condition";
          addLine(`Loop while ${condition}`);
        } else if (node.type === "ConditionNode") {
          // For ConditionNode, detect which branch this edge belongs to using 60/40 split
          // BUT only when we first enter the condition node
          const conditionNode = node;
          const headerHeight = conditionNode.height * 0.1; // First 10% for header
          const ifAreaHeight = conditionNode.height * 0.5; // Next 50% for if area
          const elseAreaHeight = conditionNode.height * 0.4; // Remaining 40% for else area
          
          const ifAreaStart = conditionNode.position.y + headerHeight;
          const ifAreaEnd = ifAreaStart + ifAreaHeight;
          const elseAreaStart = ifAreaEnd;
          const elseAreaEnd = elseAreaStart + elseAreaHeight;
          
          // Check which area the edge falls into
          if (edge.data.sourceY >= ifAreaStart && edge.data.sourceY <= ifAreaEnd) {
            // In IF branch (50% of the area after header)
            const ifCondition = conditionNode.data.ifCondition || "condition";
            addLine(`If (${ifCondition})`);
            currentConditionBranch = "if";
          } else if (edge.data.sourceY >= elseAreaStart && edge.data.sourceY <= elseAreaEnd) {
            // In ELSE branch (40% of the area)
            const elseCondition = conditionNode.data.elseCondition || "condition";
            addLine(`Else (${elseCondition})`);
            currentConditionBranch = "else";
          } else {
            // Default to if if we can't determine
            const ifCondition = conditionNode.data.ifCondition || "condition";
            addLine(`If (${ifCondition})`);
            currentConditionBranch = "if";
          }
        } else {
          const condition = node.data.condition || "condition";
          addLine(`${node.type} (${condition})`);
        }
        
        activeNodes.push(node);
      }
    });

    // Set indent level and add message
    indentLevel = activeNodes.length;
    
    // Check if we're currently inside a ConditionNode and need to switch branches
    const currentConditionNode = activeNodes.find(node => node.type === "ConditionNode");
    if (currentConditionNode && currentConditionNode.type === "ConditionNode") {
      const headerHeight = currentConditionNode.height * 0.1;
      const ifAreaHeight = currentConditionNode.height * 0.5;
      const elseAreaHeight = currentConditionNode.height * 0.3;
      
      const ifAreaStart = currentConditionNode.position.y + headerHeight;
      const ifAreaEnd = ifAreaStart + ifAreaHeight;
      const elseAreaStart = ifAreaEnd;
      const elseAreaEnd = elseAreaStart + elseAreaHeight;
      
      // Determine the correct branch for this specific edge
      let correctBranch = null;
      if (edge.data.sourceY >= ifAreaStart && edge.data.sourceY <= ifAreaEnd) {
        correctBranch = "if";
      } else if (edge.data.sourceY >= elseAreaStart && edge.data.sourceY <= elseAreaEnd) {
        correctBranch = "else";
      }
      
      // If we need to switch branches, close the current one and open the new one
      if (correctBranch && correctBranch !== currentConditionBranch) {
        // Close the current branch
        if (currentConditionBranch === "if") {
          indentLevel--
          // addLine(`EndIf`);
         
        } 
        // else if (currentConditionBranch === "else") {
        //   // addLine(`EndElse`);
        //   // indentLevel --
        // }
        
        // Open the new branch
        if (correctBranch === "if") {
          const ifCondition = currentConditionNode.data.ifCondition || "condition";
          addLine(`Else If (${ifCondition})`);
        } else if (correctBranch === "else") {
          const elseCondition = currentConditionNode.data.elseCondition || "condition";
          addLine(`Else (${elseCondition})`);
          indentLevel = activeNodes.length;
        }
        
        currentConditionBranch = correctBranch;

      }
    }
    
    message(edge.data);
  });

  // Close remaining nodes
  while (activeNodes.length > 0) {
    const closingNode = activeNodes.pop();
    indentLevel = activeNodes.length;
    
    if (closingNode.type !== "ActivationBar") {
      // Reset condition branch when closing a condition node
      if (closingNode.type === "ConditionNode") {
        currentConditionBranch = null;
      
      }
      addLine(`End${closingNode.type}`);
    }
  }

  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(5);
  console.log(`Algorithm executed in ${executionTime} milliseconds`);

  return (
    <div className="sequence-pseudocode">
      <pre>{pseudocode}</pre>
    </div>
  );
}


export function ClassDiagram({ nodes }) {
  if (!nodes || nodes.length === 0) {
    return "// No classes defined";
  }

  console.log("Class Nodes: " +  nodes)
  console.log("Start")
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
    let attributes = ""
    let c = 0
    node.data.attributes.forEach(attribute => {
    
      if (!attribute.value || attribute.value.trim() === "") return;
      
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
      if (!method.value || method.value.trim() === "") return;
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
    let attribute = "";

    // determine relationship multiplicity to attributes
    function getMultiplicity(className, multiplicity){
      console.log("Class Name: ", className)
      console.log("Multiplicity: ", multiplicity)
      if(multiplicity.trim() === "0..1" || multiplicity.trim() === "1"){
        attribute += `private ${className?.toLowerCase()}: ${className}\n`
      }else if(multiplicity.trim() === "0..*" || multiplicity.trim() === "1..*"){
        attribute += `private ${className?.toLowerCase()}s: List<${className}>\n`
      }
    }

    node.targets.forEach(target => {
      const targetClass = target.targetClass;
      if(target.endSymbol === "closed arrow" && target.lineStyle === "line"){
        relationship += `inherits ${targetClass} `; //inheritance
      }else if(target.endSymbol === "closed arrow" && target.lineStyle === "dashLine"){
        relationship += `implements ${targetClass} `; //realization
      }else if(target.endSymbol === "open arrow" && target.lineStyle === "line"){ //directed association
        relationship += `${target.middleLabel} ${targetClass} `;
        getMultiplicity(target.targetClass, target.startLabel)
      }else if(target.endSymbol === "open arrow" && target.lineStyle === "dashLine"){
        relationship += `depends on ${targetClass} `; //dependency
        getMultiplicity(target.targetClass, target.startLabel)
      }else if(target.endSymbol === "none" && target.lineStyle === "line"){
        relationship += `${target.middleLabel !== " " ? target.middleLabel + " " + targetClass : ""}`;
        getMultiplicity(target.targetClass, target.startLabel)
      }
    })

    node.sources.forEach(source => {
      const sourceClass = source.sourceClass
      if(source.endSymbol === "open diamond"){
        relationship += `has-a ${sourceClass} `; //aggregation 
        getMultiplicity(source.sourceClass, source.endLabel)
      }else if(source.endSymbol === "filled diamond"){
        relationship += `OWNS ${sourceClass} `; //composition
        getMultiplicity(source.sourceClass, source.endLabel)
      }else if(source.endSymbol === "none" && source.lineStyle === "line"){
        relationship += `${source.middleLabel !== " " ? source.middleLabel + " " + sourceClass : ""}`;
        getMultiplicity(source.sourceClass, source.endLabel)
      }

    })

    return [relationship, attribute];

  }

  nodes.forEach(node => {
    
    let [classRelationships, attribute] = getRelationship(node);
    addLine(`CLASS ${node.data.className} ${classRelationships}`)
    indentLevel++;

    //printing attributes and methods
    printAttributes(node);
    if(attribute) addLine(attribute);
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

