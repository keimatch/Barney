import { style } from "@vanilla-extract/css";

const styles = {
  app: style({ display: "flex", height: "100%" }),
  leftPane: style({
    width: "50%",
    height: "100%",
    overflow: "hidden",
  }),
  iframe: style({
    boxSizing: "border-box",
    border: "none",
    height: "100%",
  }),
  rightPane: style({
    display: "flex",
    flexDirection: "column",
    width: "50%",
    height: "100%",
  }),
  button: style({
    width: 200,
  }),
};
export default styles;
