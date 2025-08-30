import { useEffect } from "react";

export function DiamondMarker({x, y, relationshipType, handlePosition, symbol}) {

  useEffect(() =>{
        // console.log("RelationshipType: ", relationshipType)
        // console.log("Diamond Handle position: ", handlePosition)
        // console.log("Symbol: ", symbol)
  })

  function getPosition(handlePosition){
    if(handlePosition.includes('right')){
      return `translate(${x + 4}px, ${y}px) translate(-50%, -50%)`
    } else if (handlePosition.includes('left')){
      return `translate(${x - 4}px, ${y}px) translate(-50%, -50%)`
      
    } else if (handlePosition.includes('top')){
      return `translate(${x}px, ${y - 4}px) translate(-50%, -50%)`
     
    } else if (handlePosition.includes('bottom')){
      return `translate(${x}px, ${y + 4}px) translate(-50%, -50%)`
    }

  }

  return (
    <svg
      style={{
        position: 'absolute',
        transform: getPosition(handlePosition),
        overflow: 'visible',
        zIndex: 2000, // Ensure the marker is above the edge
        }}
      width="8"
      height="8"
      viewBox="0 0 8 8"
    >

      <path
        d="M 0 4 L 4 0 L 8 4 L 4 8 Z"
        fill= {symbol.includes("filled") ? 'black': "white"}
        stroke="#1A192B"
        strokeWidth="1"
      />

    </svg>
  );
}

export function ArrowMarker({
  x1, y1, x2, y2,
  handlePosition, 
  edgeType, 
  relationshipType,
  symbol,
  diagramType,
  }) {  

  function getAngle(){
    // console.log("Handle position: ", handlePosition)
    
    if(edgeType !== `straight`){
      if(handlePosition.includes('top')) {
        return -90; // Rotate 90 degrees for start marker
      }else if(handlePosition.includes('bottom')){
        return 90;
      }else if(handlePosition.includes('left')){
        return 180;
      }
      else {
        return 0; // Default direction
      }
    }
    else{
      return (Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI));
    }
  }

  function isOpenArrow(){
    if(symbol.includes("open")){
        return true;
    }else{
        return false;
    }
  }

  // useEffect(() =>{
  //  console.log("Arrow type: ", isOpenArrow())
  // })

  return(
    <>
      <svg
        style={{
          position: 'absolute',
          transform: `translate(${x1}px, ${y1}px) 
                      translate(-50%, -50%)
                      rotate(${getAngle()}deg)`,
          overflow: 'visible',
          zIndex: 2000, // Ensure the marker is above the edge
        }}
        width="8"
        height="8"
        viewBox="0 0 8 8"
      >

        <path
          d = {isOpenArrow()? 'M 7 0 L 0 4 L 7 8' : 'M 7 0 L 0 4 L 7 8 Z'} // Adjust path for generalization
          fill= {isOpenArrow()? 'none' : diagramType === "sequence"? `black`: 'white'}
          stroke="#1A192B"
          strokeWidth="1"
        />
      </svg>

    </>
  )

}