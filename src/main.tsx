import React from "react";
import  ReactDOM from "react-dom/client";
import { Application } from "./app";

//Is sent to html for rendering, id="root" goes into body, script outside.
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<Application/>);
