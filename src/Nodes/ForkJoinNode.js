import { memo, useEffect } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { useState } from "react";

const ForkJoinNode = ({ data, selected, id, width = 10, height = 300 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);

  const handleRotation = () => {
    setIsRotated(!isRotated);
  };

  useEffect(() => {
    if (isRotated) {
      setCurrentWidth(height);
      setCurrentHeight(width);
    } else {
      setCurrentWidth(width);
      setCurrentHeight(height);
    }
  }, [isRotated, width, height]);

  // Handle positions need to adjust based on rotation
  const getHandlePositions = () => {
    if (isRotated) {
      return {
        left: ['25%', '50%', '75%'], // Now these are horizontal positions
        right: ['75%', '50%', '25%']  // Now these are horizontal positions
      };
    }
    return {
      left: ['75%', '50%', '25%'], // Vertical positions
      right: ['25%', '50%', '75%'] // Vertical positions
    };
  };

  const { left, right } = getHandlePositions();

  return (
    <div 
      className="drag-handle__label"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "black",
        borderRadius: '20px',
        transition: 'width 0.1s ease, height 0.1s ease',
      }}
    >
      <NodeResizer
        color="#ff0071"
        width= '100%'
        height= '100%'
        keepAspectRatio={false}
        isVisible={selected}
        minWidth={10}
        minHeight={30}
      />

      <button 
        onClick={handleRotation}
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          fontSize: 12,
          padding: "2px 5px",
          backgroundColor: "#ff0071",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        ⟳
      </button>

      <>
        {left.map((pos, index) => (
          <Handle 
            key={`left-${index}`}
            type='source'
            id={`left-${index}`}
            position={isRotated ? Position.Top : Position.Left}
            style={{ 
              [isRotated ? 'left' : 'top']: pos, 
              backgroundColor: "black", 
              opacity: isHovered || selected ? 1 : 0, 
              pointerEvents: 'auto',
            }}  
          />
        ))}

        {right.map((pos, index) => (
          <Handle 
            key={`right-${index}`}
            type='source'
            id={`right-${index}`}
            position={isRotated ? Position.Bottom : Position.Right}
            style={{ 
              [isRotated ? 'left' : 'top']: pos, 
              backgroundColor: "black", 
              opacity: isHovered || selected ? 1 : 0, 
              pointerEvents: 'auto',
            }}  
          />
        ))}
      </>
    </div>
  );
};

export default memo(ForkJoinNode);