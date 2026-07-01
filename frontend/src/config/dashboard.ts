import { labsConfig } from "./labs";
import { STATUSES } from "../constants/status";

export const dashboardConfig = {
  hero: {
    title: "Welcome to StackLab",
    description: "Your modern developer tools and learning playground. Explore the interactive labs below to enhance your skills and productivity.",
  },
  get quickAccess() {
    return labsConfig.map(lab => ({
      id: lab.id,
      title: lab.title,
      description: lab.description,
      icon: lab.icon,
      status: lab.status,
      path: lab.path,
    }));
  },
  get statistics() {
    const available = labsConfig.filter(l => l.status === STATUSES.AVAILABLE).length;
    const beta = labsConfig.filter(l => l.status === STATUSES.BETA).length;
    const experimental = labsConfig.filter(l => l.status === STATUSES.EXPERIMENTAL).length;
    const upcoming = labsConfig.filter(l => l.status === STATUSES.COMING_SOON).length;

    return [
      { label: "Available Labs", value: available.toString() },
      { label: "Beta Labs", value: beta.toString() },
      { label: "Experimental", value: experimental.toString() },
      { label: "Coming Soon", value: upcoming.toString() },
    ];
  },
  recentActivity: [
    { id: 1, text: "System initialized successfully", time: "2 hours ago" },
    { id: 2, text: "New UI components added to library", time: "1 day ago" },
    { id: 3, text: "StackLab Phase 2 deployment", time: "3 days ago" },
  ],
  tipsAndDocs: [
    { title: "Keyboard Shortcuts", description: "Press Cmd+K or Ctrl+K to quickly open the global search." },
    { title: "Getting Started", description: "Navigate to the Labs section in the sidebar to view available tools." },
    { title: "Developer Tips", description: "Use the UI Components page to inspect the design system." },
  ]
};
