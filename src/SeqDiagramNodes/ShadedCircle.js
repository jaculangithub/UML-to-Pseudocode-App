//asda
import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

const ShadedCircle = ({ data, selected, id, width = 40, height = 40 }) => {
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
        
        <Handle 
        type="source"
        id = "left-1" 
        position={Position.Left}
        style={{ backgroundColor: "black", opacity: 0, pointerEvents: 'auto', 
            top: 0, left: "30%",
        }}
        />

        <Handle 
            type="source"
            id = "left-2" 
            position={Position.Right}
            style={{ backgroundColor: "black", opacity: 0, pointerEvents: 'auto', 
                top: 0, right: "30%",
            }}
        />

        <Handle
            id = "right-1" 
            type="source" 
            position={Position.Right}
            style={{ backgroundColor: "black", opacity: 0, pointerEvents: 'auto', 
                right: "30%", top: "100%", 
            }}
        />

        <Handle
            id = "right-2" 
            type="source" 
            position={Position.Right}
            style={{ backgroundColor: "black", opacity: 0, pointerEvents: 'auto', 
                right: "70%", top: "100%", 
            }}
        />


        <Handle 
            type="source" 
            id = "right"
            position={Position.Right}
            style={{ backgroundColor: "black", opacity: 0, pointerEvents: 'auto' }}

        />
        <Handle 
            type="source"
            id = "left" 
            position={Position.Left}
            style={{ backgroundColor: "black", opacity: 0, pointerEvents: 'auto' }}

        />
 
    </div>
  );
};

export default memo(ShadedCircle);