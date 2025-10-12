
// as of 1:22AM 7/30/2025
import { NodeResizer } from "@xyflow/react";
import { memo, useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Handle, Position } from "@xyflow/react";

const ClassNode = ({ selected, data }) => {
  const [className, setClassName] = useState(data.className);
  const [isHovered, setIsHovered] = useState(false);  

  const [attributes, setAttributes] = useState([
    { access: "+", value: "attribute: string" },
  ]);

  //the attributes nad methods will store or copy to data. data.attributes, data.method
  useEffect(() => {
    data.attributes = attributes
    data.methods = methods
    data.className = className;
  })

  const [methods, setMethods] = useState([
    { access: "+", value: "method(): void" },
  ]);

  const updateRow = (setFn, list, index, key, value) => {
    const newList = [...list];
    newList[index][key] = value; // Do NOT trim here, allow user to clear it
    setFn(newList);
  };


  const addRow = (setFn, list, newItem) => {
    // Check ONLY when adding a new row
    if (!newItem.value.trim()) return; // Prevent pushing empty strings
    setFn([...list, newItem]);
  };

  const deleteRow = (setFn, list, index) => {
    if (list.length > 1) {
      const newList = [...list];
      newList.splice(index, 1);
      setFn(newList);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#2d3748",
        border: selected ? "1px solid #4299e1" : "1px solid white",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", 
        color: "white",
        fontFamily: "monospace",
        pointerEvents: "auto",
        minWidth: 300,
      }}
    >
      <NodeResizer isVisible={selected} color="#4299e1" minWidth={300} minHeight={150} />
  
      {/* Class Name */}
      <div
        className="drag-handle__label"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          borderBottom: "1px solid white",
          backgroundColor: "#4a5568",
          fontSize: "20px",
          padding: "4px",
          minHeight: "50px",
        }}
      >
        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "16px",
            fontFamily: "monospace",
            textAlign: "center",
            maxWidth: "60%",
          }}
        />
      </div>

        {/* Attributes */}
      <div 
        style={{
          padding: "4px",
          borderBottom: "1px solid white",
          resize: "vertical",
          overflow: "auto",
          minHeight: `${attributes.length * 35}px`,
        }}
      >
        {attributes.map((attr, index) => (
          <div key={index} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
            <select
              value={attr.access}
              onChange={(e) =>  
                updateRow(setAttributes, attributes, index, "access", e.target.value)
              }
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundColor: "transparent",
                border: "none",
                padding: "5px",
                fontSize: "14px",
                cursor: "pointer",
                color: "white",
                maxHeight: "40px",
              }}
            >
              {["+", "-", "#", "~"].map((e) => (
                <option key={e} 
                    style={{ 
                    backgroundColor: "#2d3748", // fallback background for dropdown menu
                    color: "white",}}>
                  {e}
                </option>
              ))}
            </select>

            <input
              value={attr.value}
              onChange={(e) =>
                updateRow(setAttributes, attributes, index, "value", e.target.value)
              }
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "15px",
              }}
            />

            <button
              onClick={() => deleteRow(setAttributes, attributes, index)}
              style={{ background: "transparent", border: "none", color: "white" }}
              title="Delete"
              disabled={attributes.length === 1}
            >
              <FaTrash />
            </button>

            <button
              onClick={() =>
                addRow(setAttributes, attributes, { access: "+", value: "" })
              }
              style={{ background: "transparent", border: "none", color: "white" }}
              title="Add"
            >
              <FaPlus />
            </button>
          </div>
        ))}
      </div>

      {/* Methods */}
      <div
        style={{
          padding: "4px",
          // resize: "vertical",
          // overflow: "auto",
          minHeight: `${methods.length * 35}px`,
        }}
      >
        {methods.map((method, index) => (
          <div key={index} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
            <select
              value={method.access}
              onChange={(e) =>
                updateRow(setMethods, methods, index, "access", e.target.value)
              }
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundColor: "transparent",
                border: "none",
                padding: "5px",
                fontSize: "14px",
                cursor: "pointer",
                color: "white",
                maxHeight: "40px",
              }}
            >
              {["+", "-", "#", "~"].map((e) => (
                <option key={e} 
                style={{ 
                  backgroundColor: "#2d3748", // fallback background for dropdown menu
                  color: "white",
                }}>
                  {e}
                </option>
              ))}
            </select>

            <input
              value={method.value}
              onChange={(e) =>
                updateRow(setMethods, methods, index, "value", e.target.value)
              }
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "15px",
              }}
            />

            <button
              onClick={() => deleteRow(setMethods, methods, index)}
              style={{ background: "transparent", border: "none", color: "white" }}
              title="Delete"
              disabled={methods.length === 1}
            >
              <FaTrash />
            </button>
            <button
              onClick={() =>
                addRow(setMethods, methods, { access: "+", value: "" })
              }
              style={{ background: "transparent", border: "none", color: "white" }}
              title="Add"
            >
              <FaPlus />
            </button>
          </div>
        ))}
      </div>

        {/*Top handles  */}
      {[20, 40, 60, 80].map((pos, index) => (
        <Handle
          type="source"
          key = {`top-${index}`}
          position={Position.Top}
          id={`top-${index}`}
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
            left: `${pos}%`,
          }}
        />

      ))}

        {/*Left handles  */}
      {[20, 40, 60, 80].map((pos, index) => (
        <Handle
          type="source"
          key = {`left-${index}`}
          position={Position.Left}
          id={`left-${index}`}
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
            top: `${pos}%`,
          }}
        />

      ))}

      {/*Right handles  */}
      {[20, 40, 60, 80].map((pos, index) => (
        <Handle
          type="source"
          key = {`right-${index}`}
          position={Position.Right}
          id={`right-${index}`}
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
            top: `${pos}%`,
          }}
        />

      ))}

      {/*Bottom handles  */}
      {[20, 40, 60, 80].map((pos, index) => (
        <Handle
          type="source"
          key = {`bottom-${index}`}
          position={Position.Bottom}
          id={`bottom-${index}`}
          style={{
            background: '#555',
            borderRadius: '50%',
            opacity: selected || isHovered ? 1 : 0,
            pointerEvents: 'auto',
            left: `${pos}%`,
          }}
        />

      ))}

    </div>
  );
};

export default memo(ClassNode);
