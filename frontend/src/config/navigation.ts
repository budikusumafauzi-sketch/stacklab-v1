import {
  LayoutDashboard,
  Settings
} from "./icons";
import { ElementType } from "react";
import { labsConfig } from "./labs";

export interface NavigationItem {
  name: string;
  href: string;
  icon: ElementType;
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

export const navigationConfig: NavigationSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Developer Labs",
    items: labsConfig.map(lab => ({
      name: lab.title,
      href: lab.path,
      icon: lab.icon,
    })),
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
