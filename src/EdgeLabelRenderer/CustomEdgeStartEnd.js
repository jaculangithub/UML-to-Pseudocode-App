import React, { useState, useEffect, useCallback, use } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  getStraightPath,
  MarkerType,
  getSmoothStepPath,
} from '@xyflow/react';

// Relationship symbols for class diagrams
import { DiamondMarker, ArrowMarker } from '../Markers/RelationshipSymbol';
import { FaIgloo } from 'react-icons/fa';

function EdgeLabel({ transform, label, onChange,}) {
  const [inputValue, setInputValue] = useState(label);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer (1-second delay)
    setDebounceTimer(
      setTimeout(() => {
        onChange(newValue? newValue : ' ');
      }, 1000)
    );
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div
      style={{
        position: 'absolute',
        padding: '5px 10px',
        color: '#ff5050',
        fontSize: 12,
        fontWeight: 700,
        transform,
        pointerEvents: 'all',
        zIndex: 1000,
      }}
      className="nodrag nopan"
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={label}
        style={{
          border: 'none',
          background: 'transparent',
          outline: 'none',
          textAlign: 'center',
          width: '100px',
        }}
      />
    </div>
  );
}

const CustomEdgeStartEnd = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {



  const edge = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }

  //  const [edgeType, setEdgeType] = useState(data.relationshipType.toLowerCase())
  
  useEffect(() => {
    // console.log("Edge Data: ",   id,
    //   "SourceX", sourceX,
    //   "SourceY", sourceY,
    //   "TargetX", targetX,
    //   "TargetY", targetY,
    //   "sourcePosition", sourcePosition,
    //   "targetPositiion", targetPosition,
    //   "Data", data,
    //   "LabelX ", labelX,
    //   "labelY ", labelY)
  })

  const [stepPath, labelX, labelY] = getSmoothStepPath(edge);

  data.sourceX = sourceX;
  data.sourceY = sourceY;
  data.targetX = targetX; 
  data.targetY = targetY;


  function straightLine(){
    return `
      M ${sourceX} ${sourceY} 
      L ${targetX} ${targetY}
      `
  }

  const edgePath = data.stepLine? stepPath: straightLine();

  // const [dashLine, setDashline] = useState((edgeType === 'dependency' || edgeType === 'realization'));
  //symbols
  const [startLabel, setStartLabel] = useState(data.startLabel);
  const [startSymbol, setStartSymbol] = useState(data.startSymbol);
  //labesl
  const [middleLabel, setMiddleLabel] = useState(data.middleLabel);
  const [endLabel, setEndLabel] = useState(data.endLabel);
  const [endSymbol, setEndSymbol] = useState(data.endSymbol);


  const handleDataChange = useCallback(
    (position, newData) => {
      if (data.onSetLabel) {
        data.onSetLabel(position, newData, id); // call parent updater
      }

      // still update local state for instant UI feedback
      if (position === "start") {
        setStartLabel(newData);
      } else if (position === "end") {
        setEndLabel(newData);
      } else {
        setMiddleLabel(newData);
      }
    },
    [data, id]
  );


  useEffect(() => {
    // console.log('Start:', startLabel, 'End:', endLabel);
    // console.log("Relationship type: ", edgeType)
    // console.log("Data: ", data);
    setStartSymbol(data.startSymbol);
    setEndSymbol(data.endSymbol);
  })

  return (
    <>
      <BaseEdge id={id} path={edgePath} 
        style = {{
          strokeDasharray: data.lineStyle === "dashLine"? '4, 8': undefined,
          stroke: 'black',
          strokeWidth: '1',
        }} />
      <EdgeLabelRenderer>

        {(
          <>
            {startSymbol.includes('diamond') ? (
              <DiamondMarker 
                x={sourceX} 
                y={sourceY} 
                symbol = {data.startSymbol}
                handlePosition={data.sourceHandle}
              />
            ) : startSymbol.includes('arrow') ? (
              <ArrowMarker 
                x1={sourceX} 
                y1={sourceY} 
                x2={targetX} 
                y2={targetY}
                handlePosition={data.sourceHandle} 
                edgeType={data.stepLine ? "step" : "straight"}
                symbol = {data.startSymbol}
              />
            ) : null /* Default case (optional) */}

            {startLabel && (
                <EdgeLabel
                transform={`translate(-50%, ${data.sourceHandle === 'bottom'? `30`: '-130'}%) 
                  translate(${sourceX}px,${sourceY}px)`}
                label={startLabel}
                onChange={(newData) => handleDataChange('start', newData)}
              />
            )}
            
          </>
        )}

        {middleLabel && (
          <>
            <EdgeLabel
              transform={`translate(-50%, -50%) translate(${labelX}px, ${labelY - (data.diagramType === "sequence" ? 10 : 0)}px)`}
              label={middleLabel}
              onChange={(newData) => handleDataChange('middle', newData)}
            />
          </>
        )}
        {/* end symbol and label */}
        {(
          <>
            {endSymbol.includes('diamond') ? (
              <DiamondMarker 
                x={targetX} 
                y={targetY} 
                handlePosition={data.targetHandle}
                symbol = {data.endSymbol}
              />
            ) : endSymbol.includes('arrow') ? (
              <ArrowMarker 
                x1={targetX} y1={targetY} x2 = {sourceX} y2 = {sourceY}
                handlePosition={data.targetHandle} edgeType={data.stepLine? "step": "straight"}
                symbol = {data.endSymbol}
              />
            ) : null /* Default case (optional) */}
            {endLabel && (
              <EdgeLabel
                transform={`translate(-50%, ${data.targetHandle === 'bottom'? `30`: '-130'}%) 
                  translate(${targetX}px,${targetY}px)`}
                label={endLabel}
                onChange={(newData) => handleDataChange('end', newData)}
            />
            )}
      
          </>
        )}

      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdgeStartEnd;
