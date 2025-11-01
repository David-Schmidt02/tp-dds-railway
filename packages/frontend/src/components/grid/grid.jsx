import React from "react";
import "./grid.css";

const Grid = ({ items }) => {
  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div className="box" key={index}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default Grid;

