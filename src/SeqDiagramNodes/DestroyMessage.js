import { memo } from "react";
import DestroyNode from "./DestroyNode.png"
import { NodeResizer, Handle, Position } from "@xyflow/react";

const DestroyMessage = ({selected}) =>{

    return (
        <div
            className="drag-handle__label"
            style={{
                width: "100%",
                height: "100%",
            }}   
        >

            <img src = {DestroyNode} 
                style={{
                    maxHeight: "100px",
                    width: "100%",
                    objectFit: "fill"
                }}
            />

            <Handle
                id = "left"
                type = "source"
                position= {Position.Left}
                style={{
                    opacity: 0,
                    left: "30%"
                }}
            />

            <Handle
                id = "right"
                type = "source"
                position= {Position.Right}
                style={{
                    opacity: 0,
                    right: "30%"
                }}
            />
            
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={40}
                minHeight={40}
                maxWidth={80}
                keepAspectRatio = {true}
            />

            


        </div>

    )

}

export default memo(DestroyMessage);