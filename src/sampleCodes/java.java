/**
 * Java Sample Code
 * Demonstrates various syntax features and token types
 */
package com.example.demo;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.stream.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

// Annotation definition
@interface Logged {
    String value() default "";
}

// Enum with fields and methods
enum Status {
    PENDING("waiting"),
    RUNNING("in progress"),
    COMPLETED("done"),
    FAILED("error");

    private final String description;

    Status(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

// Record (Java 16+)
record Point(double x, double y) {
    // Compact constructor
    public Point {
        if (Double.isNaN(x) || Double.isNaN(y)) {
            throw new IllegalArgumentException("Coordinates cannot be NaN");
        }
    }

    public double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
}

// Sealed class (Java 17+)
sealed interface Shape permits Circle, Rectangle, Triangle {
    double area();
}

final class Circle implements Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

final class Rectangle implements Shape {
    private final double width, height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}

non-sealed class Triangle implements Shape {
    protected double base, height;

    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    public double area() {
        return 0.5 * base * height;
    }
}

// Generic interface
interface Repository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}

// Abstract class
abstract class BaseEntity {
    protected Long id;
    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;

    public abstract void validate();
}

// Main class with annotations
@Logged("UserService")
public class Main {
    // Constants
    private static final double PI = 3.14159265359;
    private static final int MAX_SIZE = 0xFF;
    private static final long HEX_VALUE = 0xDEAD_BEEFFL;
    private static final double SCIENTIFIC = 1.5e10;

    // Regular expression
    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    // Generic method
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) > 0 ? a : b;
    }

    // Varargs method
    public static int sum(int... numbers) {
        return Arrays.stream(numbers).sum();
    }

    // Lambda and functional interface
    public static List<Integer> processNumbers(List<Integer> numbers) {
        return numbers.stream()
            .filter(n -> n > 0)
            .map(n -> n * 2)
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());
    }

    // Method with exception handling
    public static String readData(String source) throws Exception {
        try (var scanner = new Scanner(System.in)) {
            if (source == null || source.isEmpty()) {
                throw new IllegalArgumentException("Source cannot be empty");
            }
            return scanner.nextLine();
        } catch (NoSuchElementException e) {
            throw new Exception("No input available", e);
        }
    }

    // Async operation with CompletableFuture
    public static CompletableFuture<String> fetchDataAsync(String url) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulated delay
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Data from " + url;
        });
    }

    // Pattern matching (Java 21+)
    public static String describeShape(Shape shape) {
        return switch (shape) {
            case Circle c -> "Circle with area: " + c.area();
            case Rectangle r -> "Rectangle with area: " + r.area();
            case Triangle t -> "Triangle with area: " + t.area();
        };
    }

    // Main method
    public static void main(String[] args) {
        // Variable declarations
        var message = "Hello, Java!";
        final int count = 42;

        // Text block (Java 15+)
        var json = """
            {
                "name": "Alice",
                "age": 30,
                "email": "alice@example.com"
            }
            """;

        // Collection literals with factory methods
        var numbers = List.of(1, 2, 3, 4, 5);
        var map = Map.of("key1", "value1", "key2", "value2");
        var set = Set.of("a", "b", "c");

        // Stream operations
        var result = numbers.stream()
            .filter(n -> n % 2 == 0)
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0);

        System.out.printf("Average: %.2f%n", result);

        // Enhanced for loop
        for (var entry : map.entrySet()) {
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }

        // Control flow
        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) continue;
            System.out.println(i);
        }

        // Switch expression
        Status status = Status.RUNNING;
        String statusMessage = switch (status) {
            case PENDING -> "Waiting to start";
            case RUNNING -> "Currently running";
            case COMPLETED, FAILED -> "Finished";
        };

        // Try-with-resources and instanceof pattern
        Object obj = "test string";
        if (obj instanceof String s && s.length() > 0) {
            System.out.println("String of length: " + s.length());
        }

        // Date/Time API
        var now = LocalDateTime.now();
        var formatted = now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        System.out.println("Current time: " + formatted);

        // Concurrent operations
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        try {
            var future = executor.submit(() -> "Task result");
            System.out.println(future.get());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } finally {
            executor.shutdown();
        }
    }
}
