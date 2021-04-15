import React, { useRef, useState } from "react";
import ToggleButton from "./ToggleButton/ToggleButton";
import InputNumber from "./InputNumber/InputNumber";
import Button from "./Button/Button";

function Menu(props) {
    const menu = useRef(null);
    const inputNumber = useRef(null);
    const [errorContent, setErrorContent] = useState("");
    const maxNumberPoints = 10000;

    const toggleMenuHandler = () => {
        menu.current.classList.toggle("toggle-menu");
    };

    const generatePointsHandler = () => {
        let value = +inputNumber.current.value;

        if (value && value <= maxNumberPoints) {
            props.generate(value);
            setErrorContent("");
        } else {
            setErrorContent(
                `Заполните поле. (диапазон от 1 до ${maxNumberPoints})`
            );
        }
    };

    return (
        <div ref={menu} className="menu">
            <ToggleButton onClick={toggleMenuHandler} />
            <InputNumber
                element={inputNumber}
                min="0"
                max={maxNumberPoints}
                placeholder="Введите количество точек"
                errorContent={errorContent}
            />
            <Button onClick={generatePointsHandler}>Сгенерировать точки</Button>
            <Button onClick={props.clustering}>Кластеризовать точки</Button>
        </div>
    );
}

export default Menu;
