import { memo, useEffect } from 'react';
import { NodeResizer }  from '@xyflow/react';
import { useState } from 'react';

const ObjectNode = ({ id, selected, data }) => {
  
  const [objName, setObjName] = useState(data.objectName || "Object1");
  const [inputValue, setInputValue] = useState(data.objectName || `Object1`);
  const [debounceTimer, setDebounceTimer] = useState(null);


  const handleObjectNameChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if(debounceTimer){
      clearTimeout(debounceTimer);
    }

    setDebounceTimer(
      setTimeout(() => {
        setObjName(newValue? newValue : "");
      }, 1000)
    )
  }


  useEffect(() => {
    data.objectName = objName
  })
  
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column', // stack vertically
        alignItems: 'center',
        minWidth: "40px"
      }}
    >
      <div
        className = "drag-handle__label"
        style={{
            maxHeight: "300px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            border: "2px solid black",
            padding: '2px 2px',
        }}
      >
        <input 
          type="text"
          value={inputValue}
          onChange={handleObjectNameChange}
          placeholder= "Obj"
          style={{
            border: `none`,
            background: `transparent`,
            outline: `none`,
            textAlign: `center`,
            width: `90%`,
            backgroundColor: "white"
          }}
        />

      </div>

      {/* Vertical dashed line */}
      <div
        style={{
          marginTop: "8px",
          height: "100%",      // adjust length of line
          borderLeft: "2px dashed black",
        }}
      />

      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={80}
        minHeight={40}
        maxWidth={120}
      />
    </div>
  );
};

export default memo(ObjectNode);
