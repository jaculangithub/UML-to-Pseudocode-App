import { memo, useState, useRef, useEffect } from 'react';

const SwimLane2 = ({ selected }) => {
  const [leftWidth, setLeftWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const startResizing = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsDragging(false);
  };

  const resize = (e) => {
    if (!isDragging) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = e.clientX - containerRect.left;
    
    // Apply min and max constraints
    const constrainedWidth = Math.max(
      100, // min width
      Math.min(
        containerRect.width * 0.9, // max width (90% of container)
        newLeftWidth
      )
    );
    
    setLeftWidth(constrainedWidth);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left Column */}
      <div
        style={{
          width: `${leftWidth}px`,
          minWidth: '100px',
          backgroundColor: '#fff',
          overflow: 'auto',
        }}
      ></div>

      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        style={{
          width: '5px',
          cursor: 'col-resize',
          backgroundColor: isDragging ? '#4299e1' : '#ccc',
          height: '100%',
          position: 'absolute',
          left: `${leftWidth}px`,
          zIndex: 10,
        }}
      />

      {/* Right Column */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#fff',
          overflow: 'auto',
        }}
      ></div>
    </div>

      //     <span 
      //   style={{
      //     width: '50%', // initial width
      //     height: '100%',
      //     display: 'inline-block',
      //     resize: 'horizontal',
      //     overflow: 'auto',
      //     minWidth: '300px', // minimum width
      //     maxWidth: '70%', // maximum width to prevent overlapping
      //     border: '1px solid black',
      //   }}
      // >
      //   <div 
      //     style={{
      //       height: '70px',
      //       backgroundColor: 'yellow',
      //       border: '1px solid black',
      //     }}
      //   >
      //     Lane 1
      //   </div>
      // </span>

      // <span

      //   style={{
      //     flex: 1, // takes remaining space
      //     height: '100%',
      //     display: 'inline-block',
      //     minWidth: '30%', // minimum width
      //     border: '1px solid black',
          
      //   }}
      // >
      //   <div 
      //     style={{
      //       height: '70px',
      //       backgroundColor: 'yellow',
      //       border: '1px solid black',
      //     }}
      //   >
      //     Lane 2
      //   </div>
      // </span> 

      // const lane1Ref = useRef(null);
      // const lane2Ref = useRef(null);
      // const [dimensions, setDimensions] = useState({
      //   lane1: { width: '50%', height: '100%' },
      //   lane2: { width: 'auto', height: '100%' }
      // });
    
      // // Track resize events using ResizeObserver
      // useEffect(() => {
      //   console.log("Swimlane Nodes: ", nodes);
      //   const observer = new ResizeObserver((entries) => {
      //     entries.forEach(entry => {
      //       const { width, height } = entry.contentRect;
      //       if (entry.target === lane1Ref.current) {
      //         setDimensions(prev => ({
      //           ...prev,
      //           lane1: { ...prev.lane1, width: `${width}px` }
      //         }));
      //       } else if (entry.target === lane2Ref.current) {
      //         setDimensions(prev => ({
      //           ...prev,
      //           lane2: { ...prev.lane2, width: `${width}px` }
      //         }));
      //       }
      //     });
      //   });
    
      //   if (lane1Ref.current) observer.observe(lane1Ref.current);
      //   if (lane2Ref.current) observer.observe(lane2Ref.current);
    
      //   return () => {
      //     observer.disconnect();
      //   };
      // }, []);
    
      // return (
      //   <div
      //     style={{
      //       width: '100%',
      //       height: '100%',
      //       backgroundColor:'transparent',
      //       border: '2px solid #333',
      //       borderRadius: '8px',
      //       minWidth: '100px',
      //       minHeight: '100px',
      //       overflow: 'hidden',
      //       zIndex: selected ? 2 : -1, // Ensure this node is above the first one
      //     }}
      //   >
      //     <NodeResizer isVisible={selected} color="#4299e1" minWidth={100} minHeight={100}/>
          
      //     <div style={{
      //       display: 'flex',
      //       width: '100%',
      //       height: '100%',
      //     }}>
      //       {/* First Lane - Resizable */}
      //       <div
      //         ref={lane1Ref}
      //         style={{
      //           width: dimensions.lane1.width,
      //           height: dimensions.lane1.height,
      //           borderRight: '1px dashed #888',
      //           resize: 'horizontal',
      //           overflow: 'auto',
      //           minWidth: '100px',
      //         }}
      //       >
      //         <div 
      //           className="drag-handle__label"
      //           style={{
      //             height: '30px',
      //             borderBottom: '1px solid #ccc',
      //             display: 'flex',
      //             alignItems: 'center',
      //             justifyContent: 'center',
      //             fontWeight: 'bold',
      //             backgroundColor: 'white',
      //             overflow: 'hidden',
      //           }}
      //         > 
      //           <input 
      //             placeholder='Lane 1' 
      //             value={`Width: ${parseInt(dimensions.lane1.width)}px`}
      //             readOnly
      //             style={{
      //               overflow: 'hidden',
      //               textAlign: 'center',
      //               border: 'none',
      //               outline: 'none',
      //               width: '100%',
      //               background: 'transparent',
      //             }}
      //           />
      //         </div>
      //       </div> 
    
      //       {/* Second Lane - Fills remaining space */}
      //       <div
      //         ref={lane2Ref}
      //         style={{
      //           flex: 1,
      //           height: '100%',
      //           minWidth: '100px',
      //           overflow: 'hidden',
      //         }}
      //       >
      //         <div 
      //           className="drag-handle__label"
      //           style={{
      //             height: '30px',
      //             backgroundColor: 'white',
      //             borderBottom: '1px solid #ccc',
      //             display: 'flex',
      //             alignItems: 'center',
      //             justifyContent: 'center',
      //             fontWeight: 'bold',
      //           }}
      //         >
      //           <input 
      //             placeholder='Lane 2' 
      //             value={`Width: ${parseInt(dimensions.lane2.width)}px`}
      //             readOnly
      //             style={{
      //               overflow: 'hidden',
      //               textAlign: 'center',
      //               border: 'none',
      //               outline: 'none',
      //               width: '100%',
      //               background: 'transparent',
      //             }}
      //           />
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // );
          


  );
};

export default memo(SwimLane2);