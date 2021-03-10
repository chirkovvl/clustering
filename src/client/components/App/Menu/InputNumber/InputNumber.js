import React from "react";

function InputNumber() {
    return (
        <input
            className="control"
            type="number"
            min="0"
            placeholder="Введите количество точек"
        />
    );
}

export default InputNumber;
