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

/** Sidebar + URL uyğunluğu — path boşdursa /admin (dashboard) */
export const ADMIN_MENU = [
  { id: "dashboard", path: "", label: "Dashboard", Icon: FiLayout },
  { id: "ads", path: "ads", label: "Reklamlar", Icon: FiBell },
  { id: "category", path: "category", label: "Kateqoriyalar", Icon: FiGrid },
  { id: "roles", path: "roles", label: "Rollar", Icon: FiUsers },
  { id: "persons", path: "persons", label: "Şəxslər", Icon: FiUsers },
  { id: "businesses", path: "businesses", label: "Bizneslər", Icon: FiBriefcase },
  { id: "products", path: "products", label: "Məhsullar", Icon: FiPackage },
  { id: "notification", path: "notifications", label: "Bildirişlər", Icon: FiMessageSquare },
  { id: "profiles", path: "profiles", label: "Xidmət göstərənlər", Icon: FiTool },
  { id: "report", path: "reports", label: "Hesabatlar", Icon: FiBarChart2 },
  { id: "logs", path: "logs", label: "Loglar", Icon: FiFileText },
];

export function adminPath(path) {
  return path ? `/admin/${path}` : "/admin";
}

export function titleFromPathname(pathname) {
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0] || "";
  const item = ADMIN_MENU.find((m) => m.path === segment);
  return item?.label ?? "Dashboard";
}
