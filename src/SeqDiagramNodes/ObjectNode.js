import { memo, useEffect } from 'react';
import { NodeResizer }  from '@xyflow/react';

const ObjectNode = ({ id, selected, data }) => {
  
  useEffect(() => {
    data.actorName = `Object ${id}`
  })
  
  return (
    <div
     
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column', // stack vertically
        alignItems: 'center',
        minWidth: "40px"
      }}
    >
      <div
        className = "drag-handle__label"
        style={{
            maxHeight: "200px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            border: "2px solid black",
            padding: '2px 2px',
        }}
      >
        Object
      </div>

      {/* Vertical dashed line */}
      <div
        style={{
          marginTop: "8px",
          height: "100%",      // adjust length of line
          borderLeft: "2px dashed black",
        }}
      />

      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={80}
        minHeight={40}
        maxWidth={120}
      />
    </div>
  );
};

export default memo(ObjectNode);
