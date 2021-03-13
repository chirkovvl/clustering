import React from "react";

function InputNumber(props) {
    let errorContent = null;

    if (props.errorContent) {
        errorContent = <i className="danger">{props.errorContent}</i>;
    }

    return (
        <>
            <input
                ref={props.element}
                className="control"
                type="number"
                min={props.min}
                max={props.max}
                placeholder={props.placeholder}
            />
            {errorContent}
        </>
    );
}

export default InputNumber;
