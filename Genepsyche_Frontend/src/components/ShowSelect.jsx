import React from "react";

const ShowSelect = ({ value, onChange, max = 100, step = 5 }) => {
  return (
    <div>
      Show:
      <select
        className="show-select"
        style={{ marginLeft: "10px" }}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {Array.from({ length: max / step }, (_, i) => (i + 1) * step).map(
          (num) => (
            <option key={num} value={num}>
              {num.toString().padStart(2, "0")}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default ShowSelect;
