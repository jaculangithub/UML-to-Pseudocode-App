import { memo, useEffect } from 'react';
import actorImage from './Actor.png'; 
import { NodeResizer }  from '@xyflow/react';

const Actor = ({ selected, data }) => {

  useEffect(() => {

    data.actorName = "User";
    
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
      {/* Actor image */}
      <div
        className = "drag-handle_label"
        style={{
          maxHeight: "100px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={actorImage}
          alt="Actor"
          style={{
            maxHeight: "100px",
            width: "100%",
            objectFit: "fill"
          }}
        />
      </div>

      {/* Vertical dashed line */}
      <div
        style={{
          marginTop: "8px",
          height: "100%",      // adjust length of line
          borderLeft: "4px dashed black",
        }}
      />

      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={40}
        minHeight={40}
        maxWidth={80}
      />
    </div>
  );
};

export default memo(Actor);
