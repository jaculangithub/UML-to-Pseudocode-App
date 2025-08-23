import { NodeResizer, Handle, Position } from "@xyflow/react";
import { memo, useState } from "react";

const ActivationBar = ({selected}) => {
    
    const [isHovered, setIsHovered] = useState(false);
    const handlePosition = [0, 25, 50, 75, 100];

    return (

        <div    
            className = "drag-handle__label"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} 
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "5px",
            }}
        >   
            {/* Left handles */}
            {handlePosition.map((pos, index) => (
                <Handle 
                    key={`${pos}-${index}`}             // 👈 add a unique key for React
                    type="source"
                    id={`left-${index}`}         // 👈 make sure id is unique per handle
                    position={Position.Left}
                    style={{ 
                        width: "1px",
                        height: "1px",
                        backgroundColor: "black", 
                        opacity: 0, 
                        pointerEvents: 'auto',
                        top: `${pos}%`
                    }}
                />
            ))}

            {/* Right handles */}
            {handlePosition.map((pos, index) => (
                <Handle 
                    key={`${pos}-${index}`}             // 👈 add a unique key for React
                    type="source"
                    id={`right-${index}`}         // 👈 make sure id is unique per handle
                    position={Position.Right}
                    style={{ 
                        width: "1px",
                        height: "1px",
                        backgroundColor: "black", 
                        opacity: 0, 
                        pointerEvents: 'auto',
                        top: `${pos}%`
                    }}
                />
            ))}

            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={20}
                minHeight={20}
                maxWidth={40}
            />
        </div>
    )

}

export default memo(ActivationBar);