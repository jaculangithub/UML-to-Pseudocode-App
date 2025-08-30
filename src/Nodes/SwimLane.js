import React, { memo, useEffect, useState, useRef } from "react";
import { NodeResizer } from "@xyflow/react";

const Swimlane = ({ selected, data }) => {
  const [numberOfActors, setNumberOfActors] = useState(data.numberOfActors);
  const [listOfActors, setListOfActors] = useState([]); // final debounced values
  const debounceTimers = useRef([]); // store timers per input

  useEffect(() => {
    setNumberOfActors(data.numberOfActors);
    setListOfActors((prev) => {
      // keep old values, add "" for new lanes
      const newArr = [...prev];
      while (newArr.length < data.numberOfActors) newArr.push("");
      return newArr.slice(0, data.numberOfActors); // trim if lanes reduced
    });
  }, [data.numberOfActors]);

  useEffect(() => {
    data.actors = listOfActors
  }, [listOfActors])

  const handleActorChange = (index, value) => {
    // clear old timer for this lane
    if (debounceTimers.current[index]) {
      clearTimeout(debounceTimers.current[index]);
    }

    // wait 1 second after typing stops
    debounceTimers.current[index] = setTimeout(() => {
      setListOfActors((prev) => {
        const updatedActors = [...prev];
        updatedActors[index] = value;
        // console.log("Updated actor list:", updatedActors);
        return updatedActors;
      });
    }, 1000);
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        border: selected ? "2px solid #4299e1" : "2px solid black",
        zIndex: -1,
      }}
    >
      {/* Lanes container */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {Array.from({ length: numberOfActors }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Lane header */}
              <div
                style={{
                  height: "50px",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                }}
              >
                <input
                  placeholder={`Lane ${index + 1}`}
                  defaultValue={listOfActors[index] || ""}
                  onChange={(e) => handleActorChange(index, e.target.value)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                    width: "100%",
                    pointerEvents: "all",
                    fontSize: "26px",
                  }}
                />
              </div>
              {/* Lane body */}
              <div style={{ flex: 1 }}></div>
            </div>

            {/* Vertical separator - only between lanes */}
            {index < numberOfActors - 1 && (
              <div
                style={{
                  width: "1px",
                  backgroundColor: "#ccc",
                  height: "100%",
                  position: "absolute",
                  left: `${(index + 1) * (100 / numberOfActors)}%`,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <NodeResizer
        isVisible={selected}
        color="#4299e1"
        minWidth={100}
        minHeight={100}
      />
    </div>
  );
};

export default memo(Swimlane);
