import React, { useRef } from "react";
import ToggleButton from "./ToggleButton/ToggleButton";
import InputNumber from "./InputNumber/InputNumber";
import Button from "./Button/Button";

function Menu() {
    const menu = useRef(null);

    const toggleMenuHandler = () => {
        menu.current.classList.toggle("toggle-menu");
    };

    return (
        <div ref={menu} className="menu">
            <ToggleButton onClick={toggleMenuHandler} />
            <InputNumber />
            <Button>Сгенерировать точки</Button>
            <Button>Кластеризовать точки</Button>
        </div>
    );
}

export default Menu;
