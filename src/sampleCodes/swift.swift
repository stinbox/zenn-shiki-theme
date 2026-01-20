/**
 * Swift Sample Code
 * Demonstrates various syntax features and token types
 */

import Foundation

// MARK: - Constants

let PI: Double = 3.14159265359
let MAX_SIZE: Int = 0xFF
let HEX_VALUE: UInt32 = 0xDEADBEEF
let SCIENTIFIC: Double = 1.5e10

// MARK: - Enums

enum Status: String, Codable, CaseIterable {
    case pending = "pending"
    case running = "running"
    case completed = "completed"
    case failed = "failed"

    var label: String {
        switch self {
        case .pending: return "Waiting"
        case .running: return "In Progress"
        case .completed: return "Done"
        case .failed: return "Error"
        }
    }
}

enum Result<Success, Failure: Error> {
    case success(Success)
    case failure(Failure)

    func map<T>(_ transform: (Success) -> T) -> Result<T, Failure> {
        switch self {
        case .success(let value):
            return .success(transform(value))
        case .failure(let error):
            return .failure(error)
        }
    }
}

// MARK: - Protocols

protocol Repository {
    associatedtype Entity: Identifiable

    func save(_ entity: Entity) async throws
    func findById(_ id: Entity.ID) async -> Entity?
    func findAll() async -> [Entity]
    func delete(_ id: Entity.ID) async throws
}

protocol Loggable {
    var logPrefix: String { get }
    func log(_ message: String, level: LogLevel)
}

enum LogLevel: String {
    case debug, info, warning, error
}

extension Loggable {
    var logPrefix: String { String(describing: type(of: self)) }

    func log(_ message: String, level: LogLevel = .info) {
        let timestamp = ISO8601DateFormatter().string(from: Date())
        print("[\(timestamp)] [\(level.rawValue.uppercased())] [\(logPrefix)] \(message)")
    }
}

// MARK: - Structs

struct Point: Equatable, Hashable, Codable {
    var x: Double
    var y: Double

    static let zero = Point(x: 0, y: 0)

    var distanceFromOrigin: Double {
        sqrt(x * x + y * y)
    }

    func distance(to other: Point) -> Double {
        let dx = other.x - x
        let dy = other.y - y
        return sqrt(dx * dx + dy * dy)
    }

    static func + (lhs: Point, rhs: Point) -> Point {
        Point(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
    }
}

// MARK: - Classes

class User: Identifiable, Codable, CustomStringConvertible, Loggable {
    let id: UUID
    var name: String
    var email: String
    private(set) var roles: [String] = []
    var metadata: [String: String] = [:]
    let createdAt: Date

    private static var instanceCount = 0

    // Regular expression
    private static let emailRegex = try! NSRegularExpression(
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    )

    init(name: String, email: String) throws {
        guard Self.isValidEmail(email) else {
            throw ValidationError.invalidEmail(email)
        }
        self.id = UUID()
        self.name = name
        self.email = email
        self.createdAt = Date()
        Self.instanceCount += 1
    }

    deinit {
        Self.instanceCount -= 1
    }

    @discardableResult
    func addRole(_ role: String) -> Self {
        if !roles.contains(role) {
            roles.append(role)
            log("Added role: \(role)")
        }
        return self
    }

    func hasRole(_ role: String) -> Bool {
        roles.contains(role)
    }

    var description: String {
        "User(\(id), \(name), \(email))"
    }

    static var count: Int { instanceCount }

    private static func isValidEmail(_ email: String) -> Bool {
        let range = NSRange(email.startIndex..., in: email)
        return emailRegex.firstMatch(in: email, range: range) != nil
    }
}

enum ValidationError: Error, LocalizedError {
    case invalidEmail(String)
    case invalidName(String)

    var errorDescription: String? {
        switch self {
        case .invalidEmail(let email):
            return "Invalid email format: \(email)"
        case .invalidName(let name):
            return "Invalid name: \(name)"
        }
    }
}

// MARK: - Generic Repository

actor InMemoryRepository<Entity: Identifiable>: Repository where Entity.ID: Hashable {
    private var items: [Entity.ID: Entity] = [:]

    func save(_ entity: Entity) async {
        items[entity.id] = entity
    }

    func findById(_ id: Entity.ID) async -> Entity? {
        items[id]
    }

    func findAll() async -> [Entity] {
        Array(items.values)
    }

    func delete(_ id: Entity.ID) async {
        items.removeValue(forKey: id)
    }

    var count: Int {
        items.count
    }
}

// MARK: - Extensions

extension Array {
    func chunked(into size: Int) -> [[Element]] {
        stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}

extension String {
    var isBlank: Bool {
        trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    func truncated(to maxLength: Int, trailing: String = "...") -> String {
        count > maxLength ? prefix(maxLength) + trailing : self
    }
}

// MARK: - Property Wrappers

@propertyWrapper
struct Clamped<Value: Comparable> {
    var value: Value
    let range: ClosedRange<Value>

    init(wrappedValue: Value, _ range: ClosedRange<Value>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }

    var wrappedValue: Value {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }
}

// MARK: - Main

@main
struct App {
    static func main() async {
        // Closures and higher-order functions
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        let evens = numbers.filter { $0 % 2 == 0 }
        let squares = numbers.map { $0 * $0 }
        let sum = numbers.reduce(0, +)

        print("Evens: \(evens)")
        print("Squares: \(squares)")
        print("Sum: \(sum)")

        // Optional binding and guard
        func processUser(_ user: User?) -> String? {
            guard let user = user, !user.name.isBlank else {
                return nil
            }
            return "Processing: \(user.name)"
        }

        // Pattern matching
        let status: Status = .running
        switch status {
        case .pending:
            print("Waiting...")
        case .running:
            print("In progress...")
        case .completed, .failed:
            print("Finished")
        }

        // If-let and guard-let
        if let user = try? User(name: "Alice", email: "alice@example.com") {
            user.addRole("admin").addRole("user")
            print(user)

            // Key path
            let emails = [user].map(\.email)
            print("Emails: \(emails)")
        }

        // Async/await
        let repo = InMemoryRepository<User>()

        do {
            let user = try User(name: "Bob", email: "bob@example.com")
            await repo.save(user)

            if let found = await repo.findById(user.id) {
                print("Found: \(found)")
            }

            let all = await repo.findAll()
            print("Total users: \(all.count)")
        } catch {
            print("Error: \(error.localizedDescription)")
        }

        // Structured concurrency
        await withTaskGroup(of: Int.self) { group in
            for i in 1...5 {
                group.addTask {
                    try? await Task.sleep(nanoseconds: UInt64(i) * 100_000_000)
                    return i * 2
                }
            }

            for await result in group {
                print("Result: \(result)")
            }
        }

        // String interpolation
        let name = "World"
        let greeting = "Hello, \(name)!"
        let multiline = """
            This is a
            multiline string
            with interpolation: \(1 + 2)
            """

        print(greeting)
        print(multiline)

        // Defer
        func example() {
            print("Start")
            defer { print("End") }
            print("Middle")
        }
        example()
    }
}
