export interface User {
  email: string;
  name: string;
  role: "ADMIN" | "VIEWER";
  roleName: "Administrator" | "Viewer";
}
