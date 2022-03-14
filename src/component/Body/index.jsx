import React from "react";
import "./index.css";
import RiderDetails from "./RiderDetailes";
import { useState, useEffect } from "react";
import { BsFilterLeft } from "react-icons/bs";
import Axios from "axios";
import Header from "../Header";

const Index = () => {
  // states
  const [rideDetails, setRideDetails] = useState([]);
  const [details, setDetails] = useState([]);
  const [active, setActive] = useState("nearest_rides");
  const [validStates, setValidStates] = useState([]);
  const [validCities, setValidCities] = useState([]);
  const [display, setDisplay] = useState(false);
  const [user, setUser] = useState({});
  const [userStationCode, setUserStationCode] = useState("");

  let msg = "Loading...";

  const getClosestNumber = (arr, check) => {
    const bigger = [];
    const smaller = [];
    arr.forEach((x) => {
      if (x >= check) {
        bigger.push(x);
      } else if (x < check) {
        smaller.push(x);
      }
    });
    const bNumber = bigger.sort().shift() || Number.POSITIVE_INFINITY;
    const sNumber = smaller.sort().pop() || Number.NEGATIVE_INFINITY;

    if (bNumber - check < check - sNumber) {
      return bNumber - check;
    } else if (check - sNumber < bNumber - check) {
      return check - sNumber;
    } else {
      return bNumber - check;
    }
  };

  let setDOM = details.map((a, i) => {
    const distance = getClosestNumber(a.station_path, userStationCode);
    return <RiderDetails key={i} {...a} distance={distance} />;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await Axios.get("https://assessment.api.vweb.app/rides");
        const data = info.data;

        const user = await Axios.get("https://assessment.api.vweb.app/user");
        const usersData = user.data;
        setUser(usersData);
        setUserStationCode(usersData.station_code);

        setRideDetails(data);
        setDetails(data);

        getAllStates(data);
        getAllCities(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const setUpcoming = () => {
    const data = [...rideDetails];
    const filtered = data.filter((arr) => {
      const comingDate = new Date(arr.date);
      const dateNow = new Date();
      return comingDate > dateNow;
    });
    setDetails(filtered);
  };

  const setNearest = () => {
    setDetails(rideDetails);
  };

  const setPrev = () => {
    const data = [...rideDetails];
    const filtered = data.filter((arr) => {
      const comingDate = new Date(arr.date);
      const dateNow = new Date();
      return dateNow > comingDate;
    });
    setDetails(filtered);
  };

  const filterState = (event) => {
    const currState = event.target.value;

    const filteredData = details.filter((a) => {
      return a.state === currState;
    });

    filteredData.lenght > 0
      ? setDetails(filteredData)
      : setDetails(filteredData);
    msg = "no rider available in this state";
  };
  const filterCity = (event) => {
    const currCity = event.target.value;
    const filteredData = rideDetails.filter((a) => {
      return a.city === currCity;
    });

    filteredData.lenght > 0
      ? setDetails(filteredData)
      : setDetails(filteredData);
  };

  const getAllStates = (data) => {
    let states = [];
    data.map((a) => {
      return states.includes(a.state) ? states : states.push(a.state);
    });
    setValidStates(states);
  };
  const getAllCities = (data) => {
    let cities = [];
    data.map((a) => {
      return cities.includes(a.city) ? cities : cities.push(a.city);
    });
    setValidCities(cities);
  };

  return (
    <>
      <Header {...user} />
      <section>
        <div className="top">
          <div className="titles">
            <h4
              onClick={() => {
                setNearest();
                setActive("nearest_rides");
              }}
              className={active === "nearest_rides" ? "active" : ""}
            >
              Nearest rides
            </h4>
            <h4
              onClick={() => {
                setUpcoming();
                setActive("upcoming_rides");
              }}
              className={active === "upcoming_rides" ? "active" : ""}
            >
              Upcoming rides
            </h4>
            <h4
              onClick={() => {
                setPrev();
                setActive("past_rides");
              }}
              className={active === "past_rides" ? "active" : ""}
            >
              Past rides
            </h4>
          </div>
          <div className="filter">
            <div className="form">
              <label className="labelSC" htmlFor="yourStaionCode">
                your station code:
              </label>
              <input
                name="yourStaionCode"
                className="stationcode-input"
                type="number"
                value={userStationCode}
                onChange={(e) => {
                  setUserStationCode(e.target.value);
                }}
              />
            </div>
            <div
              onClick={() => {
                setDisplay((prev, next) => {
                  return !prev;
                });
              }}
              className="filter_title"
            >
              <BsFilterLeft className="filter__icon" />
              <span>Filter</span>
            </div>
            {display ? (
              <div className="filter__drop-down">
                <h5>Filters</h5>
                <div>
                  <select
                    onChange={(e) => filterState(e)}
                    name="state"
                    id="state"
                  >
                    <option>State</option>
                    {validStates.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select onChange={(e) => filterCity(e)} name="city" id="city">
                    <option>City</option>
                    {validCities.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="rider__details-list">
          {details.length < 1
            ? msg
            : setDOM.sort((a, b) => a.props.distance - b.props.distance)}
        </div>
      </section>
    </>
  );
};

export default Index;
