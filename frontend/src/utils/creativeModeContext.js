import { createContext } from "react";

// Lets every page render <Sidebar /> without passing creativeMode through props.
export const CreativeModeContext = createContext(false);
