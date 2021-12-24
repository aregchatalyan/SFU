import React from "react";
import "./style.scss";
export default function Spinner({ loading }) {
  return (
    <div className={loading ? "ldsRing" : "disaled"}>
      <div className="passive"></div>
      <div className="active"></div>
      <div className="active"></div>
      <div className="active"></div>
    </div>
  );
}
