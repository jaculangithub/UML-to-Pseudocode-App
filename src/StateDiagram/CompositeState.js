import React, { memo, useEffect, useState } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";

function CompositeStateNode({ data, selected }) {
  const [label, setLabel] = useState("Composite State");

  useEffect(() => {
    data.label = label;
  }, [label, data]);

  return (
    <div
      style={{
        border: "2px solid #333",
        borderRadius: "12px",
        width: "200px",
        background: "transparent",
        height: '100%',
        width: '100%',
      }}
    >
      {/* Header with editable label */}
      <div
        className="drag-handle__label"
        style={{
          fontWeight: "bold",
          marginBottom: "6px",
          borderBottom: "1px solid #aaa",
          paddingBottom: "4px",
          height: "50px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
            display: "flex",
        }}
      >
        <input
          type="text"
          value={label}
          placeholder="Composite State"
          onChange={(e) => setLabel(e.target.value)}
          style={{
            textAlign: "left",
            width: "80%",
            border: "none",
            background: "transparent",
            color: "black",
            fontWeight: "bold",
            outline: "none",
          }}
        />
      </div>

        <Handle
            type="source"
            position={Position.Right}
            id="right"
            style={{
                opacity: selected? 1 : 0,

            }}
        />

        <Handle
            type="source"
            position={Position.Left}
            id="left"
            style={{
                opacity: selected? 1 : 0,

            }}
        />

        <Handle
            type="source"
            position={Position.Top}
            id="top"
            style={{
                opacity: selected? 1 : 0,

            }}
        />

        <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            style={{
                opacity: selected? 1 : 0,

            }}
        />

        <NodeResizer
            minWidth={200}
            minHeight={200}
            isVisible={selected}
            color="#ff0071"
            style={{ zIndex: 10 }}
        />


    </div>
  );
}

export default memo(CompositeStateNode);
