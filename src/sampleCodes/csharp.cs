/**
 * C# Sample Code
 * Demonstrates various syntax features and token types
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Demo;

// Constants
public static class Constants
{
    public const double PI = 3.14159265359;
    public const int MaxSize = 0xFF;
    public const uint HexValue = 0xDEADBEEF;
    public const double Scientific = 1.5e10;
}

// Enum with attributes
[Flags]
public enum Permission
{
    None = 0,
    Read = 1 << 0,
    Write = 1 << 1,
    Delete = 1 << 2,
    Admin = Read | Write | Delete
}

public enum Status
{
    Pending,
    Running,
    Completed,
    Failed
}

// Record type (C# 9+)
public record Point(double X, double Y)
{
    public double DistanceFromOrigin => Math.Sqrt(X * X + Y * Y);
}

// Record struct (C# 10+)
public readonly record struct Color(byte R, byte G, byte B, byte A = 255);

// Interface with default implementation
public interface IRepository<T> where T : class
{
    Task<T?> FindByIdAsync(int id);
    Task<IEnumerable<T>> FindAllAsync();
    Task SaveAsync(T entity);
    Task DeleteAsync(int id);

    async Task<bool> ExistsAsync(int id)
    {
        var entity = await FindByIdAsync(id);
        return entity is not null;
    }
}

// Generic class with constraints
public class InMemoryRepository<T> : IRepository<T> where T : class, new()
{
    private readonly Dictionary<int, T> _items = new();
    private readonly object _lock = new();
    private int _counter;

    public Task<T?> FindByIdAsync(int id)
    {
        lock (_lock)
        {
            return Task.FromResult(_items.GetValueOrDefault(id));
        }
    }

    public Task<IEnumerable<T>> FindAllAsync()
    {
        lock (_lock)
        {
            return Task.FromResult<IEnumerable<T>>(_items.Values.ToList());
        }
    }

    public Task SaveAsync(T entity)
    {
        lock (_lock)
        {
            _items[++_counter] = entity;
        }
        return Task.CompletedTask;
    }

    public Task DeleteAsync(int id)
    {
        lock (_lock)
        {
            _items.Remove(id);
        }
        return Task.CompletedTask;
    }
}

// Class with properties and events
public class User
{
    private string _email = string.Empty;

    // Auto-implemented properties
    public int Id { get; init; }
    public required string Name { get; set; }

    // Property with validation
    public string Email
    {
        get => _email;
        set
        {
            if (!Regex.IsMatch(value, @"^[^@]+@[^@]+\.[^@]+$"))
                throw new ArgumentException("Invalid email format");
            _email = value;
        }
    }

    // Collection property
    public List<string> Roles { get; } = new();
    public Dictionary<string, object> Metadata { get; } = new();

    // Event
    public event EventHandler<string>? RoleAdded;

    // Method with expression body
    public void AddRole(string role)
    {
        Roles.Add(role);
        RoleAdded?.Invoke(this, role);
    }

    // Deconstruct method
    public void Deconstruct(out int id, out string name, out string email)
        => (id, name, email) = (Id, Name, Email);

    // Override ToString
    public override string ToString() => $"User({Id}, {Name}, {Email})";
}

// Static class with extension methods
public static class Extensions
{
    public static string Truncate(this string str, int maxLength)
        => str.Length <= maxLength ? str : str[..maxLength] + "...";

    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class
        => source.Where(x => x is not null).Select(x => x!);

    public static async Task<T> WithTimeout<T>(this Task<T> task, TimeSpan timeout)
    {
        var delayTask = Task.Delay(timeout);
        var completedTask = await Task.WhenAny(task, delayTask);
        if (completedTask == delayTask)
            throw new TimeoutException();
        return await task;
    }
}

// Attribute
[AttributeUsage(AttributeTargets.Method)]
public class LoggedAttribute : Attribute
{
    public string? Message { get; init; }
}

// Abstract class
public abstract class BaseService
{
    protected readonly ILogger Logger;

    protected BaseService(ILogger logger) => Logger = logger;

    public abstract Task InitializeAsync();

    protected virtual void OnError(Exception ex)
        => Logger.Error($"Error: {ex.Message}");
}

// Interface for logging
public interface ILogger
{
    void Info(string message);
    void Error(string message);
}

// Main program
public class Program
{
    // Regular expression
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        RegexOptions.Compiled);

    public static async Task Main(string[] args)
    {
        // Object initialization
        var user = new User
        {
            Id = 1,
            Name = "Alice",
            Email = "alice@example.com"
        };
        user.AddRole("admin");

        // Deconstruction
        var (id, name, email) = user;
        Console.WriteLine($"User: {name} <{email}>");

        // Pattern matching
        object value = 42;
        var result = value switch
        {
            int i when i > 0 => $"Positive: {i}",
            int i => $"Non-positive: {i}",
            string s => $"String: {s}",
            null => "Null",
            _ => "Unknown"
        };

        // LINQ query
        var numbers = Enumerable.Range(1, 100);
        var processed = numbers
            .Where(n => n % 2 == 0)
            .Select(n => n * n)
            .Take(10)
            .ToList();

        // Parallel processing
        await Parallel.ForEachAsync(processed, async (n, ct) =>
        {
            await Task.Delay(10, ct);
            Console.WriteLine(n);
        });

        // Tuple
        var point = (X: 10, Y: 20);
        Console.WriteLine($"Point: ({point.X}, {point.Y})");

        // Nullable reference types
        string? nullableString = null;
        var length = nullableString?.Length ?? 0;

        // Raw string literal (C# 11+)
        var json = """
            {
                "name": "Alice",
                "age": 30,
                "roles": ["admin", "user"]
            }
            """;

        // Collection expression (C# 12+)
        int[] array = [1, 2, 3, 4, 5];
        List<int> list = [..array, 6, 7, 8];

        // Using declaration
        await using var stream = new MemoryStream();
        await stream.WriteAsync(new byte[] { 1, 2, 3 });

        // Exception handling
        try
        {
            await ProcessDataAsync();
        }
        catch (TimeoutException ex)
        {
            Console.WriteLine($"Timeout: {ex.Message}");
        }
        catch (Exception ex) when (ex.InnerException is not null)
        {
            Console.WriteLine($"Inner error: {ex.InnerException.Message}");
        }
        finally
        {
            Console.WriteLine("Cleanup completed");
        }
    }

    [Logged(Message = "Processing data")]
    private static async Task ProcessDataAsync()
    {
        await Task.Delay(100);
        Console.WriteLine("Data processed");
    }
}
