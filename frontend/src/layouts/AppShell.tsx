import { Outlet } from "react-router-dom";
import GlobalLayout from "./GlobalLayout";

export default function AppShell() {
  return (
    <GlobalLayout>
      <Outlet />
    </GlobalLayout>
  );
}
