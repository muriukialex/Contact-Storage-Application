import React, { useContext } from "react";

import AlertContext from "../../context/alert/alertContext";

const Alerts = () => {
  const alertContext = useContext(AlertContext);

  const { alerts } = alertContext;
  return (
    //length of alerts array is greater than 0, map through each alert
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i class="fas fa-info-circle" /> &nbsp; {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
