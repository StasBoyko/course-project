import React from "react";
import style from "./loaderCss.css";

export const Loader = (props) => {
            return(
                <div className="loader-container">
                     <div className="loader">
                        <div className="dot dot1"></div>
                        <div className="dot dot2"></div>
                        <div className="dot dot3"></div>
                     </div>
                     <p className="loader-text">{props.child}</p>
                </div>
        )
}