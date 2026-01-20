 /**
  * User Management Module
  * Demonstrates TypeScript refactoring with diff
  */

 // Type definitions
-interface User {
-  id: number;
-  name: string;
-  email: string;
-}
+interface User {
+  readonly id: number;
+  name: string;
+  email: string;
+  createdAt: Date;
+  updatedAt: Date;
+}

-type UserRole = "admin" | "user";
+type UserRole = "admin" | "moderator" | "user" | "guest";

 // Utility functions
-function validateEmail(email: string): boolean {
-  return email.includes("@");
-}
+function validateEmail(email: string): boolean {
+  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
+  return emailRegex.test(email);
+}

-function formatUserName(user: User): string {
-  return user.name;
-}
+function formatUserName(user: User, includeEmail = false): string {
+  if (includeEmail) {
+    return `${user.name} <${user.email}>`;
+  }
+  return user.name;
+}

 // User class implementation
-class UserService {
-  private users: User[] = [];
+class UserService {
+  private users: Map<number, User> = new Map();
+  private nextId = 1;

-  addUser(name: string, email: string): User {
-    const user: User = {
-      id: this.users.length + 1,
-      name,
-      email,
-    };
-    this.users.push(user);
-    return user;
-  }
+  addUser(name: string, email: string): User | null {
+    if (!validateEmail(email)) {
+      console.error("Invalid email format");
+      return null;
+    }
+
+    const now = new Date();
+    const user: User = {
+      id: this.nextId++,
+      name,
+      email,
+      createdAt: now,
+      updatedAt: now,
+    };
+
+    this.users.set(user.id, user);
+    return user;
+  }

-  findUser(id: number): User | undefined {
-    return this.users.find((u) => u.id === id);
-  }
+  findUser(id: number): User | undefined {
+    return this.users.get(id);
+  }

-  getAllUsers(): User[] {
-    return this.users;
-  }
-}
+  updateUser(id: number, updates: Partial<Omit<User, "id" | "createdAt">>): User | null {
+    const user = this.users.get(id);
+    if (!user) {
+      return null;
+    }
+
+    const updatedUser: User = {
+      ...user,
+      ...updates,
+      updatedAt: new Date(),
+    };
+
+    this.users.set(id, updatedUser);
+    return updatedUser;
+  }
+
+  deleteUser(id: number): boolean {
+    return this.users.delete(id);
+  }
+
+  getAllUsers(): User[] {
+    return Array.from(this.users.values());
+  }
+
+  getUserCount(): number {
+    return this.users.size;
+  }
+}

 // Usage example
 const service = new UserService();
-const user = service.addUser("John", "john@example.com");
-console.log(user);
+const user = service.addUser("John Doe", "john@example.com");
+if (user) {
+  console.log(`Created user: ${formatUserName(user, true)}`);
+  service.updateUser(user.id, { name: "John Smith" });
+}

+// Export for module usage
+export { UserService, validateEmail, formatUserName };
+export type { User, UserRole };
