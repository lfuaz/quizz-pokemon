import { FaInfoCircle } from "react-icons/fa";
import { useRef, useState } from "react";

export default function Notif({ message, type }) {
  const icon = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotif = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`notif ${type}`} onClick={toggleNotif}>
        <div className={"notif-icon " + isOpen} ref={icon}>
          <FaInfoCircle />
        </div>
        {isOpen && <div className="notif-content">{message}</div>}
      </div>
    </>
  );
}
