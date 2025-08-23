import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

const DestructionNode = ({ data, selected, id, width = 50, height = 50 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="drag-handle__label"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: `100%`,
        height: `100%`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={30}
        minHeight={30}
        keepAspectRatio={true}
      />

      {/* Outer circle */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: "white",
          borderRadius: '50%',
          border: selected ? "2px solid #ff0071" : "2px solid black",
          boxShadow: selected ? "0 0 8px rgba(255, 0, 113, 0.3)" : "none",
        }}
      />

      {/* Inner X symbol */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '3px',
            backgroundColor: 'black',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '3px',
            backgroundColor: 'black',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>

      {/* Handles - only source handles since destruction typically terminates flows */}
      <Handle 
        type="source"
        id = "top" 
        position={Position.Top}
        style={{ backgroundColor: "black", opacity: isHovered || selected ? 1 : 0, pointerEvents: 'auto' }}

      />
      <Handle 
        type="source" 
        id = "bottom"
        position={Position.Bottom}
        style={{ backgroundColor: "black", opacity: isHovered || selected ? 1 : 0, pointerEvents: 'auto' }}

      />
      <Handle 
        type="source"
        id = "left" 
        position={Position.Left}
        style={{ backgroundColor: "black", opacity: isHovered || selected ? 1 : 0, pointerEvents: 'auto' }}

      />
      <Handle
        id = "right" 
        type="source" 
        position={Position.Right}
        style={{ backgroundColor: "black", opacity: isHovered || selected ? 1 : 0, pointerEvents: 'auto' }}

      />
    </div>
  );
};

export default memo(DestructionNode);