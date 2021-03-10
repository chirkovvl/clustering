import React, { useRef } from "react";

function ToggleButton(props) {
    const toggleButton = useRef(null);

    const clickHandler = () => {
        toggleButton.current.classList.toggle("fa-angle-double-left");
        toggleButton.current.classList.toggle("fa-angle-double-right");

        props.onClick();
    };

    return (
        <i
            ref={toggleButton}
            onClick={clickHandler}
            className="fa fa-angle-double-left toggle-button"
        ></i>
    );
}

export default ToggleButton;
