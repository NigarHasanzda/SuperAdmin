const PLACEHOLDER_IMAGE = "https://placehold.co/400x200/png?text=Ad";

const clone = (value) => JSON.parse(JSON.stringify(value));

const initial = {
  users: [
    {
      id: 101,
      name: "Nigar",
      surname: "Aliyeva",
      email: "nigar@example.com",
      phone: "+994501234567",
      birthday: "1995-03-12",
      hasBusiness: true,
    },
    {
      id: 102,
      name: "Kamal",
      surname: "Hasanova",
      email: "kamal@example.com",
      phone: "+994551112233",
      birthday: "1990-07-22",
      hasBusiness: false,
    },
  ],
  businesses: [
    {
      id: 1,
      companyName: "Otogo Service MMC",
      shopName: "Otogo Service MMC",
      tagline: "Auto service",
      businessCode: "OTG-001",
      tin: "1234567890",
      description: "Full-service auto repair shop.",
      status: "ACTIVE",
      tinStatus: "ACCEPTED",
      email: "info@otogo.az",
      phone: "+994123456789",
      branches: [],
    },
    {
      id: 2,
      companyName: "Baku Auto Wash",
      shopName: "Baku Auto Wash",
      tagline: "Premium wash",
      businessCode: "BAW-002",
      tin: "9876543210",
      description: "24/7 car wash service.",
      status: "PENDING",
      tinStatus: "PENDING",
      email: "contact@bakuwash.az",
      phone: "+994509876543",
      branches: [],
    },
    {
      id: 3,
      companyName: "Speed Tire",
      shopName: "Speed Tire",
      tagline: "Tires & balancing",
      businessCode: "ST-003",
      tin: "5555555555",
      description: "Tire sales and installation.",
      status: "INACTIVE",
      tinStatus: "REJECTED",
      email: "hello@speedtire.az",
      phone: "+994507778899",
      blockReason: "Document mismatch",
      branches: [],
    },
  ],
  roles: [
    { id: 1, name: "ADMIN", description: "Full access" },
    { id: 2, name: "MODERATOR", description: "Content moderation" },
  ],
  categories: [
    { id: 1, name: "Oils" },
    { id: 2, name: "Tires" },
    { id: 3, name: "Accessories" },
  ],
  ads: [
    {
      id: 1,
      link: "https://example.com/campaign",
      userId: 1,
      userName: "Admin",
      isActive: 1,
      pictureUrl: PLACEHOLDER_IMAGE,
    },
  ],
  products: [
    { id: 1, name: "Engine oil 5W-30", price: 45, category: "Oils" },
    { id: 2, name: "Summer tire 205/55 R16", price: 120, category: "Tires" },
    { id: 3, name: "Car sponge", price: 8, category: "Accessories" },
  ],
  profiles: [
    {
      id: 1,
      name: "Rashad",
      surname: "Mammadov",
      profession: "Mechanic",
      city: "Baku",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Laman",
      surname: "Quliyeva",
      profession: "Detailing",
      city: "Ganja",
      rating: 4.6,
    },
  ],
  notifications: [
    {
      id: 1,
      title: "System update",
      message: "Admin panel is running in static demo mode.",
      createdAt: new Date().toISOString(),
    },
  ],
  reports: [
    {
      id: 1,
      reportType: "fraud",
      reportStatus: "pending",
      reportCategoryId: 2,
      fromUserId: 101,
      subject: "Incorrect product information",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 2,
      reportType: "spam",
      reportStatus: "resolved",
      reportCategoryId: 1,
      fromUserId: 102,
      subject: "Repeated promotional messages",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 3,
      reportType: "other",
      reportStatus: "rejected",
      reportCategoryId: 3,
      fromUserId: 101,
      subject: "Duplicate listing",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ],
  logs: [
    {
      id: 1,
      type: "user_registered",
      action: "create",
      message: "New user registered",
      user: "nigar@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: "report_action",
      action: "update",
      message: "Report was answered",
      user: "admin@demo.com",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  nextId: 1000,
};

let db = clone(initial);

export const tick = () => new Promise((resolve) => setTimeout(resolve, 120));

function nextId() {
  db.nextId += 1;
  return db.nextId;
}

function paginate(items, page = 0, size = 10) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  return {
    content: items.slice(safePage * size, safePage * size + size),
    page: {
      number: safePage,
      totalPages,
      totalElements: items.length,
    },
  };
}

export async function getUsers() {
  await tick();
  return clone(db.users);
}

export async function deleteUser(id) {
  await tick();
  db.users = db.users.filter((u) => u.id !== id);
  return id;
}

export async function updateUser(id, userData) {
  await tick();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("No users found");
  db.users[index] = { ...db.users[index], ...userData, id };
  return clone(db.users[index]);
}

export async function getAllBusinesses() {
  await tick();
  return clone(db.businesses);
}

export async function getBusinessById(id) {
  await tick();
  const business = db.businesses.find((b) => b.id === id);
  if (!business) throw new Error("Business not found");
  return clone(business);
}

export async function getApprovedBusinesses() {
  await tick();
  return clone(db.businesses.filter((b) => b.status === "ACTIVE"));
}

export async function getPendingBusinesses() {
  await tick();
  return clone(db.businesses.filter((b) => b.status === "PENDING"));
}

export async function searchBusinesses(companyName, approved) {
  await tick();
  const term = companyName.toLowerCase();
  const pool = db.businesses.filter((b) =>
    approved ? b.status === "ACTIVE" : b.status === "PENDING"
  );
  return clone(
    pool.filter((b) => b.companyName?.toLowerCase().includes(term))
  );
}

export async function patchBusiness(id, patch) {
  await tick();
  const business = db.businesses.find((b) => b.id === id);
  if (!business) throw new Error("Business not found");
  Object.assign(business, patch);
  return clone(business);
}

export async function getRoles() {
  await tick();
  return clone(db.roles);
}

export async function addRole(roleData) {
  await tick();
  const role = { id: nextId(), ...roleData };
  db.roles.push(role);
  return clone(role);
}

export async function updateRole(roleData) {
  await tick();
  const index = db.roles.findIndex((r) => r.id === roleData.id);
  if (index === -1) throw new Error("Role not found");
  db.roles[index] = { ...db.roles[index], ...roleData };
  return clone(db.roles[index]);
}

export async function deleteRole(id) {
  await tick();
  db.roles = db.roles.filter((r) => r.id !== id);
  return id;
}

export async function getCategories() {
  await tick();
  return clone(db.categories);
}

export async function getLocalizedCategories() {
  await tick();
  return { productCategoryResponses: clone(db.categories) };
}

export async function addCategory(categoryData) {
  await tick();
  const category = { id: nextId(), name: categoryData.name };
  db.categories.push(category);
  return clone(category);
}

export async function updateCategory(categoryData) {
  await tick();
  const index = db.categories.findIndex((c) => c.id === categoryData.id);
  if (index === -1) throw new Error("Category not found");
  db.categories[index] = { ...db.categories[index], ...categoryData };
  return clone(db.categories[index]);
}

export async function deleteCategory(id) {
  await tick();
  db.categories = db.categories.filter((c) => c.id !== id);
  return id;
}

export async function getCategoryById(id) {
  await tick();
  const category = db.categories.find((c) => c.id === id);
  if (!category) throw new Error("Category not found");
  return clone(category);
}

export async function getAds() {
  await tick();
  return clone(db.ads);
}

export async function addAd(adData) {
  await tick();
  const ad = { id: nextId(), pictureUrl: "", isActive: 1, ...adData };
  db.ads.push(ad);
  return clone(ad);
}

export async function updateAd(id, updatedFields) {
  await tick();
  const index = db.ads.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Ad not found");
  db.ads[index] = { ...db.ads[index], ...updatedFields, id };
  return clone(db.ads[index]);
}

export async function deleteAd(id) {
  await tick();
  db.ads = db.ads.filter((a) => a.id !== id);
  return id;
}

export async function uploadAdImage(id, file) {
  await tick();
  const ad = db.ads.find((a) => a.id === id);
  if (!ad) throw new Error("Ad not found");
  const objectUrl =
    file instanceof File || file instanceof Blob
      ? URL.createObjectURL(file)
      : PLACEHOLDER_IMAGE;
  ad.pictureUrl = objectUrl;
  return { id, uuidName: objectUrl };
}

export async function downloadFilePlaceholder() {
  await tick();
  return new Blob(["Static demo fayl"], { type: "text/plain" });
}

export async function getProducts(page = 0) {
  await tick();
  return paginate(db.products, page, 10);
}

export async function getProductById(id) {
  await tick();
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new Error("No products found");
  return clone(product);
}

export async function getProfiles(page = 0) {
  await tick();
  return paginate(db.profiles, page, 10);
}

export async function getProfileById(id) {
  await tick();
  const profile = db.profiles.find((p) => p.id === id);
  if (!profile) throw new Error("No profiles found");
  return clone(profile);
}

export async function getNotifications() {
  await tick();
  return clone(db.notifications);
}

export async function sendNotification(data) {
  await tick();
  const item = {
    id: nextId(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  db.notifications.unshift(item);
  return clone(item);
}

export async function deleteNotification(id) {
  await tick();
  db.notifications = db.notifications.filter((n) => n.id !== id);
  return id;
}

export async function getReports() {
  await tick();
  return clone(db.reports);
}

export async function answerReport(reportTransactionId, message) {
  await tick();
  const report = db.reports.find((r) => r.id === reportTransactionId);
  if (report) {
    report.reportStatus = "resolved";
    report.adminMessage = message;
  }
  return clone(
    report || { id: reportTransactionId, reportStatus: "resolved" }
  );
}

export async function getLogs() {
  await tick();
  return clone(db.logs);
}
