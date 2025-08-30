import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

const ForkJoinNode = ({ data, selected, id}) => {
  const [isHovered, setIsHovered] = useState(false);
  const positions = [0.25, 0.5, 0.75]; // Using decimals instead of percentages

  return (
    <div 
      className="drag-handle__label"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        width: `100%`,
        height: `100%`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "black",
        borderRadius: '2px',
      }}
    >
      <NodeResizer
        color="#ff0071"
        width='100%'
        height='100%'
        keepAspectRatio={false}
        isVisible={selected}
        minWidth={30}
        minHeight={10}
      />

      {/* Vertical line */}
      {data?.orientation === "VerticalLine" && (
        <>
          {/* Left Handles */}
          {positions.map((pos, index) => (
            <Handle 
              key={`left-${index}`}
              type='source'
              id={`left-${index}`}
              position={Position.Left}
              style={{ 
                top: `${pos * 100}%`,
                backgroundColor: "black", 
                opacity: isHovered || selected ? 1 : 0, 
                pointerEvents: 'auto',
              }}  
            />
          ))}

          {/* Right Handles */}
          {positions.map((pos, index) => (
            <Handle 
              key={`right-${index}`}
              type='source'
              id={`right-${index}`}
              position={Position.Right}
              style={{ 
                top: `${pos * 100}%`,
                backgroundColor: "black", 
                opacity: isHovered || selected ? 1 : 0, 
                pointerEvents: 'auto',
              }}  
            />
          ))}
        </>
      )}
  
      {/* Horizontal line */}
      {data?.orientation === "HorizontalLine" && (
        <>
          {/* Top Handles */}
          {positions.map((pos, index) => (
            <Handle 
              key={`top-${index}`}
              type='source'
              id={`top-${index}`}
              position={Position.Top}
              style={{ 
                left: `${pos * 100}%`,
                backgroundColor: "black", 
                opacity: isHovered || selected ? 1 : 0, 
                pointerEvents: 'auto',
              }}  
            />
          ))}

          {/* Bottom Handles */}
          {positions.map((pos, index) => (
            <Handle 
              key={`bottom-${index}`}
              type='source'
              id={`bottom-${index}`}
              position={Position.Bottom}
              style={{ 
                left: `${pos * 100}%`,
                backgroundColor: "black", 
                opacity: isHovered || selected ? 1 : 0, 
                pointerEvents: 'auto',
              }}  
            />
          ))}
        </>
      )}
    </div>
  );
};

export default memo(ForkJoinNode);