import React from "react";
import { css } from "emotion";

const Content = ({ children }) => (
    <div
        className={css`
      padding: 0 30px;
      margin: 50px auto;
    `}
    >
        {children}
    </div>
);

export default Content;
