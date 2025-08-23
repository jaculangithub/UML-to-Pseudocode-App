import { memo } from "react"
import { NodeResizer } from "@xyflow/react"

const LoopNode = ({selected}) => {

    return (
        <div
        style={{
            border: "2px solid black",
            borderRadius: "6px",
            width: "200px",
            fontFamily: "Arial, sans-serif",
            width: "100%",
            height: "100%",
        }}
        >
            {/* Header */}
            <div
                className="drag-handle__label"
                style={{
                backgroundColor: "transparent",
                borderBottom: "2px solid black",
                padding: "4px 8px",
                fontWeight: "bold",
                textAlign: "left",
                overflow: "hidden",
            }}
            >
                Loop
            </div>

            {/* Content Area */}
            <div
            style={{
            padding: "16px",
            minHeight: "80px",
            // textAlign: "center",
            }}
        >
            {/* Placeholder for sequence messages */}
            <span style={{ margin: 0, color: "#555", 
                backgroundColor: "gray", 
                color: "white"}}>
                [condition]</span>
            </div>

            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minHeight={200}
                minWidth={300}
            />
        </div>
    )

}

export default memo(LoopNode)
