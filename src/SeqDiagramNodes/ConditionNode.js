import { memo } from "react"
import { NodeResizer } from "@xyflow/react"

const ConditionNode = ({ selected }) => {
    return (
        <div
            style={{
                border: "2px solid black",
                borderRadius: "6px",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Arial, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                className="drag-handle__label"
                style={{
                    backgroundColor: "transparent",
                    borderBottom: "2px solid black",
                    padding: "8px 12px",
                    fontWeight: "bold",
                    textAlign: "left",
                }}
            >
                Condition
            </div>

            {/* Condition Content */}
            <div
                style={{
                    flex: 1,
                    padding: "12px",
                    borderBottom: "1px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <span style={{ 
                    backgroundColor: "#666", 
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                }}>
                    [If]
                </span>
            </div>

            {/* Else Content */}
            <div
                style={{
                    flex: 1,
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <span style={{ 
                    backgroundColor: "#666", 
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                }}>
                    [Else]
                </span>
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

export default memo(ConditionNode)