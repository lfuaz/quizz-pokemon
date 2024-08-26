import { FaInfoCircle } from "react-icons/fa";
import { useRef } from "react";

export default function Notif({ message, type }) {
  const icon = useRef(null);

  return (
    <>
      <div
        className={`notif ${type}`}
        onMouseOver={() => {
          icon.current.style.visibility = "none";
        }}
        onMouseOut={() => {
          icon.current.style.visibility = "visible";
        }}

        // Add an onMouseUp event listener to the div element
      >
        <div className="notif-icon" ref={icon}>
          <FaInfoCircle />
        </div>
        <div className="notif-content">{message}</div>
      </div>
    </>
  );
}
