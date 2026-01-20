/**
 * TypeScript Sample Code
 * Demonstrates type system and advanced features
 */

// Primitive types and literals
const PI: number = 3.14159265359;
const HEX_VALUE: number = 0xdeadbeef;
const BIG_INT: bigint = 9007199254740991n;
const isEnabled: boolean = true;
const message: string = "Hello, TypeScript!";

// Union and intersection types
type Status = "pending" | "fulfilled" | "rejected";
type ID = string | number;

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface Named {
  name: string;
}

type NamedWithTimestamps = Named & Timestamps;

// Generic types
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

type AsyncResult<T> = Promise<Result<T>>;

// Mapped types and utility types
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Conditional types
type MyNonNullable<T> = T extends null | undefined ? never : T;
type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

// Template literal types
type EventName = `on${Capitalize<"click" | "focus" | "blur">}`;
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;

// Class with decorators pattern
function logged(
  target: unknown,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
  return descriptor;
}

abstract class BaseRepository<T extends { id: ID }> {
  protected items: Map<ID, T> = new Map();

  abstract validate(item: T): boolean;

  async save(item: T): Promise<Result<T>> {
    if (!this.validate(item)) {
      return { success: false, error: new Error("Validation failed") };
    }
    this.items.set(item.id, item);
    return { success: true, data: item };
  }

  findById(id: ID): T | undefined {
    return this.items.get(id);
  }
}

// Interface with index signature and methods
interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number;
  roles: readonly string[];
  metadata: Record<string, unknown>;
  greet(): string;
}

// Implementation with access modifiers
class UserRepository extends BaseRepository<User> {
  private static instance: UserRepository;
  #connectionString: string;

  private constructor(connectionString: string) {
    super();
    this.#connectionString = connectionString;
  }

  static getInstance(connectionString: string): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(connectionString);
    }
    return UserRepository.instance;
  }

  validate(user: User): boolean {
    return user.name.length > 0 && user.email.includes("@");
  }

  async findByEmail(email: string): Promise<User | undefined> {
    for (const user of this.items.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }
}

// Enum types
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

const enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalError = 500,
}

// Type guards and narrowing
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number | null): string {
  if (value === null) {
    return "null";
  }
  if (isString(value)) {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// Async generators
async function* paginate<T>(
  fetcher: (page: number) => Promise<T[]>,
  maxPages: number = 10
): AsyncGenerator<T[], void, unknown> {
  for (let page = 1; page <= maxPages; page++) {
    const items = await fetcher(page);
    if (items.length === 0) break;
    yield items;
  }
}

// Namespace
namespace Validation {
  export interface Rule<T> {
    validate(value: T): boolean;
    message: string;
  }

  export function required(value: unknown): boolean {
    return value !== null && value !== undefined;
  }
}

// Module augmentation
declare module "./types" {
  interface Config {
    debug: boolean;
  }
}

// Export
export type { User, Result, AsyncResult };
export { UserRepository, Direction, HttpStatus, Validation };
