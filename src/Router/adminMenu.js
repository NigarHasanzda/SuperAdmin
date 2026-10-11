import {
  FiLayout,
  FiBell,
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiPackage,
  FiMessageSquare,
  FiTool,
  FiBarChart2,
  FiFileText,
} from "react-icons/fi";

export const ADMIN_MENU = [
  { id: "dashboard", path: "", label: "Dashboard", Icon: FiLayout },
  { id: "ads", path: "ads", label: "Ads", Icon: FiBell },
  { id: "category", path: "category", label: "Categories", Icon: FiGrid },
  { id: "roles", path: "roles", label: "Roles", Icon: FiUsers },
  { id: "persons", path: "persons", label: "Persons", Icon: FiUsers },
  { id: "businesses", path: "businesses", label: "Businesses", Icon: FiBriefcase },
  { id: "products", path: "products", label: "Products", Icon: FiPackage },
  { id: "notification", path: "notifications", label: "Notifications", Icon: FiMessageSquare },
  { id: "profiles", path: "profiles", label: "Service providers", Icon: FiTool },
  { id: "report", path: "reports", label: "Reports", Icon: FiBarChart2 },
  { id: "logs", path: "logs", label: "Logs", Icon: FiFileText },
];

export function adminPath(path) {
  return path ? `/admin/${path}` : "/admin";
}

export function titleFromPathname(pathname) {
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0] || "";
  const item = ADMIN_MENU.find((m) => m.path === segment);
  return item?.label ?? "Dashboard";
}
