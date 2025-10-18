import { memo, useEffect, useState } from "react"
import { NodeResizer } from "@xyflow/react"
// import { data } from "react-router-dom"

const ConditionNode = ({data, selected }) => {

    const [ifConditition, setIfCondition] = useState("If Condition")
    const [elseCondition, setElseCondition] = useState("Else Condition")
    const [inputIfValue, setIfInputValue] = useState(`If Condition`)
    const [inputElseValue, setElseInputValue] = useState(`Else Condition`)
    const [debounceTimer, setDebounceTimer] = useState(null)

    useEffect(() => {
        data.ifCondition = ifConditition
        data.elseCondition = elseCondition
    })

    const handleLabelChange = (e, condition) => {
        const newValue = e.target.value;
        if(condition === "if"){
            setIfInputValue(newValue);
        }else {
            setElseInputValue(newValue);
        }
       
        if(debounceTimer){
            clearTimeout(debounceTimer);
        }

        setDebounceTimer(
            setTimeout(() => {
                if(condition === "if"){
                    setIfCondition(newValue? newValue : "");
                }else{
                    setElseCondition(newValue? newValue : "");
                }
            }, 1000)
        )
    }

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
                <input
                    type = "text"
                    placeholder="If Condition"
                    value={inputIfValue}
                    onChange={(e) => handleLabelChange(e, "if")}
                    style={{ 
                        margin: 0, 
                        outline: "none",
                        border: 'none',
                        background: 'transparent',
                        width: '200px',
                        fontSize: '24px',
                    }}>

                </input>
                
                {/* <span style={{ 
                    backgroundColor: "#666", 
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                }}>
                    [If]
                </span> */}
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
                {/* <span style={{ 
                    backgroundColor: "#666", 
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                }}>
                    [Else]
                </span> */}
                <input
                    type = "text"
                    placeholder="Else Condition"
                    value={inputElseValue}
                    onChange={(e) => handleLabelChange(e, "else")}
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

export default memo(ConditionNode)