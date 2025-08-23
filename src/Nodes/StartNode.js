//asda
import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

const StartNode = ({ data, selected, id, width = 40, height = 40 }) => {
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
        justifyContent: 'center',
      }}
    >
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={20}
        minHeight={20}
        keepAspectRatio={true}
      />

      {/* UML Start Node - solid black circle */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: "black",
          borderRadius: '50%',
          border: selected ? "2px solid #ff0071" : "none",
          boxShadow: selected ? "0 0 8px rgba(255, 0, 113, 0.3)" : "none",
        }}
      />

      {/* Maintain all handles from DiamondNode but adjust positions */}
        
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

export default memo(StartNode);