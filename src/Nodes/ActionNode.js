import { memo, useState } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";

const ActionNode = ({ data, selected }) => {
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
        }}
      >
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={40}
          minHeight={40}
        />

        {/* This box will stretch with resizing */}
        <div
          style={{
            width: '100%',
            height: '100%',
        
            borderRadius: "10px",
            border: selected ? "green" : "2px solid #334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: selected ? "0 0 8px rgba(255, 0, 113, 0.3)" : "none",
            // backgroundColor: 'white',
          }}
        >
          {data.label}
        </div>

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
          position={Position.Top}
          id="top"
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

      </div>
  );
};

export default memo(ActionNode);
