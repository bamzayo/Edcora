import React from "react";
import "./index.css";

import Map from "../../../assets/Map.png";

const index = (props) => {
  return (
    <div className="rider_details">
      <div className="img__container">
        <img src={Map} alt="map" />
      </div>
      <div>
        <h5>
          Ride Id : <span>{props.id}</span>
        </h5>
        <h5>
          Origin Station : <span>{props.origin_station_code}</span>
        </h5>
        <h5>
          Station Path : <span>[{props.station_path.toString()}]</span>
        </h5>
        <h5>
          Date : <span>{props.date}</span>
        </h5>
        <h5>
          Distance : <span>{props.distance}</span>
        </h5>
      </div>
    </div>
  );
};

export default index;
