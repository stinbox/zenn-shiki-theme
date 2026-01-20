/**
 * Kotlin Sample Code
 * Demonstrates various syntax features and token types
 */

package com.example.demo

import java.time.LocalDateTime
import java.util.UUID
import kotlin.math.sqrt
import kotlin.properties.Delegates
import kotlin.reflect.KProperty

// Constants
const val PI = 3.14159265359
const val MAX_SIZE = 0xFF
const val HEX_VALUE = 0xDEADBEEFL
const val SCIENTIFIC = 1.5e10

// Enum class
enum class Status(val label: String) {
    PENDING("Waiting"),
    RUNNING("In Progress"),
    COMPLETED("Done"),
    FAILED("Error");

    fun isFinished() = this == COMPLETED || this == FAILED
}

// Sealed class
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String, val cause: Throwable? = null) : Result<Nothing>()
    data object Loading : Result<Nothing>()

    fun <R> map(transform: (T) -> R): Result<R> = when (this) {
        is Success -> Success(transform(data))
        is Error -> this
        Loading -> Loading
    }
}

// Interface with default implementation
interface Repository<T, ID> {
    suspend fun save(entity: T): T
    suspend fun findById(id: ID): T?
    suspend fun findAll(): List<T>
    suspend fun delete(id: ID)

    suspend fun exists(id: ID): Boolean = findById(id) != null
}

// Data class
data class Point(val x: Double, val y: Double) {
    val distanceFromOrigin: Double
        get() = sqrt(x * x + y * y)

    operator fun plus(other: Point) = Point(x + other.x, y + other.y)
    operator fun times(scalar: Double) = Point(x * scalar, y * scalar)

    companion object {
        val ZERO = Point(0.0, 0.0)
    }
}

// Class with primary constructor and properties
class User(
    val id: UUID = UUID.randomUUID(),
    var name: String,
    email: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
) : Comparable<User> {
    // Backing field property
    var email: String = email
        set(value) {
            require(value.contains("@")) { "Invalid email: $value" }
            field = value
        }

    // Observable property
    var status: Status by Delegates.observable(Status.PENDING) { _, old, new ->
        println("Status changed from $old to $new")
    }

    // Lazy property
    val roles: MutableList<String> by lazy { mutableListOf() }
    val metadata: MutableMap<String, Any> = mutableMapOf()

    // Init block
    init {
        require(name.isNotBlank()) { "Name cannot be blank" }
        instanceCount++
    }

    // Secondary constructor
    constructor(name: String, email: String) : this(
        id = UUID.randomUUID(),
        name = name,
        email = email
    )

    fun addRole(role: String) = apply {
        if (role !in roles) {
            roles += role
        }
    }

    fun hasRole(role: String) = role in roles

    override fun compareTo(other: User) = name.compareTo(other.name)

    override fun toString() = "User(id=$id, name=$name, email=$email)"

    companion object {
        private var instanceCount = 0

        fun getInstanceCount() = instanceCount

        // Factory function
        fun create(name: String, email: String) = User(name, email)
    }
}

// Generic class with reified type parameter
class InMemoryRepository<T : Any> : Repository<T, UUID> {
    private val items = mutableMapOf<UUID, T>()

    override suspend fun save(entity: T): T {
        val id = (entity as? User)?.id ?: UUID.randomUUID()
        items[id] = entity
        return entity
    }

    override suspend fun findById(id: UUID) = items[id]

    override suspend fun findAll() = items.values.toList()

    override suspend fun delete(id: UUID) {
        items.remove(id)
    }
}

// Extension functions
fun String.truncate(maxLength: Int, trailing: String = "...") =
    if (length > maxLength) take(maxLength) + trailing else this

fun <T> List<T>.secondOrNull() = if (size >= 2) this[1] else null

inline fun <reified T> List<*>.filterIsInstanceTo(): List<T> =
    filterIsInstance<T>()

// Property delegate
class LoggingDelegate<T>(private var value: T) {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
        println("Getting '${property.name}': $value")
        return value
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, newValue: T) {
        println("Setting '${property.name}' to $newValue")
        value = newValue
    }
}

// Higher-order function with lambda
inline fun <T, R> T.runCatching(block: T.() -> R): Result<R> {
    return try {
        Result.Success(block())
    } catch (e: Throwable) {
        Result.Error(e.message ?: "Unknown error", e)
    }
}

// Regular expression
val EMAIL_REGEX = Regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")

// Annotation
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Logged(val message: String = "")

// Object declaration (singleton)
object Config {
    var debug = false
    val settings = mutableMapOf<String, String>()

    fun get(key: String, default: String = "") = settings[key] ?: default
}

// Main function
suspend fun main() {
    // List operations with lambdas
    val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    val evens = numbers.filter { it % 2 == 0 }
    val squares = numbers.map { it * it }
    val sum = numbers.fold(0) { acc, n -> acc + n }

    println("Evens: $evens")
    println("Squares: $squares")
    println("Sum: $sum")

    // Scope functions
    val user = User.create("Alice", "alice@example.com").apply {
        addRole("admin")
        addRole("user")
        metadata["department"] = "Engineering"
    }

    with(user) {
        println("User: $name <$email>")
        println("Roles: $roles")
    }

    val nameLength = user.let { it.name.length }
    val upperName = user.run { name.uppercase() }

    // When expression
    val status: Status = Status.RUNNING
    val message = when (status) {
        Status.PENDING -> "Waiting to start"
        Status.RUNNING -> "Currently running"
        Status.COMPLETED, Status.FAILED -> "Finished"
    }

    // Pattern matching with when
    val result: Result<String> = Result.Success("Hello")
    when (result) {
        is Result.Success -> println("Success: ${result.data}")
        is Result.Error -> println("Error: ${result.message}")
        Result.Loading -> println("Loading...")
    }

    // Null safety
    val nullableString: String? = null
    val length = nullableString?.length ?: 0
    val upper = nullableString?.uppercase() ?: "DEFAULT"

    // Elvis operator with throw
    fun requireName(user: User?): String =
        user?.name ?: throw IllegalArgumentException("User required")

    // String templates
    val name = "World"
    val greeting = "Hello, $name!"
    val multiline = """
        |This is a
        |multiline string
        |with value: ${1 + 2}
    """.trimMargin()

    println(greeting)
    println(multiline)

    // Destructuring
    val (x, y) = Point(3.0, 4.0)
    println("Point: ($x, $y)")

    // Try-catch expression
    val parsed = try {
        "42".toInt()
    } catch (e: NumberFormatException) {
        0
    }

    println("Parsed: $parsed")
}
