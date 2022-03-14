import React from "react";
import "./index.css";

const index = (props) => {
  return (
    <header>
      <div className="header__content">
        <h3>Edvora</h3>
        <div>
          <h5>{props.name}</h5>
          <img src={props.url} alt="avatar" className="header__image" />
        </div>
      </div>
    </header>
  );
};

export default index;
