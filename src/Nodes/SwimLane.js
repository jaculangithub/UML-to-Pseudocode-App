import React, { memo, useEffect, useState } from 'react';
import { NodeResizer } from '@xyflow/react';

const Swimlane = ({ selected, data,  }) => {
  const [numberOfActors, setNumberOfActor] = useState(data.numberOfActors);

  useEffect( () => {
    setNumberOfActor(data.numberOfActors)
    console.log("Number of actors", numberOfActors)
  })

  return (
    <div 
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: selected ? "2px solid #4299e1" : "2px solid black",
        zIndex: -1,
      }}
    >
      {/* Lanes container */}
      <div 
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {Array.from({ length: numberOfActors }).map((_, index) => (
          <React.Fragment key={index}>
            <div 
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Lane header */}
              <div 
                style={{ 
                  height: "50px", 
                  backgroundColor: "white", 
                  display: "flex",
                  justifyContent: "center", 
                  alignItems: "center",
                  borderBottom: "1px solid black",
                }}
              >
                <input 
                  placeholder={`Lane ${index + 1}`}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                    width: "100%",
                    pointerEvents: "all",
                    fontSize: "26px"
                  }}
                />
              </div>
              {/* Lane body */}
              <div style={{ flex: 1 }}></div>
            </div>
            
            {/* Vertical separator - only between lanes */}
            {index < numberOfActors - 1 && (
              <div 
                style={{
                  width: "1px",
                  backgroundColor: "#ccc",
                  height: "100%",
                  position: 'absolute',
                  left: `${(index + 1) * (100 / numberOfActors)}%`,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <NodeResizer 
        isVisible={selected} 
        color="#4299e1" 
        minWidth={100} 
        minHeight={100}
      />
    </div>
  );
};

export default memo(Swimlane);