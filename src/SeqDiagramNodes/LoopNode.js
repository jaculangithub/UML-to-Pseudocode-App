import { memo, useEffect, useState } from "react"
import { NodeResizer } from "@xyflow/react"

const LoopNode = ({selected, data}) => {

    const [condition, setCondition] = useState("Condition")
    const [inputValue, setInputValue] = useState(`Condition`)
    const [debounceTimer, setDebounceTimer] = useState(null)

    useEffect(() => {
        data.condition = condition
    })

    const handleLabelChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if(debounceTimer){
            clearTimeout(debounceTimer);
        }

        setDebounceTimer(
            setTimeout(() => {
                setCondition(newValue? newValue : "");
            }, 1000)
        )
    }

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
                    fontSize: "24px",
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
                <input
                    type="text"
                    placeholder="Loop Condition" 
                    value={inputValue}
                    onChange={handleLabelChange}
                    style={{ 
                        margin: 0, 
                        outline: "none",
                        border: 'none',
                        background: 'transparent',
                        width: '200px',
                        fontSize: '24px',
                    }}>
                        
                </input>
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
