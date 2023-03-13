import { IMenuItem } from "@/types/article";
import React from "react";

export const MenuContext = React.createContext({
  menu: [] as IMenuItem[]
})