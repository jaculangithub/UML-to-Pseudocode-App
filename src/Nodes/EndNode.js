//asdada
import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";
import endNode from "./End-Node.png";

const EndNode = ({ data, selected, id, width = 40, height = 40 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
      <div
        className="drag-handle__label"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          backgroundColor: "transparent",
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center', 
          display: 'flex',
          zIndex: selected ? 2 : -1, // Ensure this node is above the first one
        }}
      >
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={40}
          minHeight={40}
          keepAspectRatio
        />

        {/* This diamanond will stretch with resizing */}
      <img
        src={endNode}
        alt="Decision Node"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
        
        {/* <div
        style={{
          width: `${DiamondNodeSize * .7}px`,
          height: `${DiamondNodeSize * .7}px`,
          background: "white",
          border: selected ? " #ff0071" : " #334155",
          transform: "rotate(45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: selected ? "0 0 8px rgba(255, 0, 113, 0.3)" : "none",
          backgroundColor: 'blue',
        }}
      /> */}

        {/* Edge handles */}
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
          }}
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
          }}
        />

        <Handle
          type="source"
          position={Position.Top}
          id="top"
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
          
          }}
        />
      </div>
  );
};

export default memo(EndNode);