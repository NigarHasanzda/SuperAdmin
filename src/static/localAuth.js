const USERS_KEY = "static_registered_users";

const defaultUsers = [
  {
    id: 1,
    email: "admin@demo.com",
    password: "admin123",
    name: "Admin",
    role: "ADMIN",
  },
];

function readUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return [...defaultUsers];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...defaultUsers];
  } catch {
    return [...defaultUsers];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ email, password, name }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("This email is already registered");
  }
  const user = {
    id: Date.now(),
    email: normalizedEmail,
    password,
    name: name?.trim() || "Admin",
    role: "ADMIN",
  };
  users.push(user);
  writeUsers(users);
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export function authenticateUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );
  if (!match) {
    throw new Error("Invalid email or password");
  }
  const token = `static-token-${match.id}-${Date.now()}`;
  const user = {
    id: match.id,
    email: match.email,
    name: match.name,
    role: match.role,
  };
  return { token, user, refreshToken: null };
}

export function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("refreshToken");
}
