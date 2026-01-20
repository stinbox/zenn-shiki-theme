<?php

declare(strict_types=1);

/**
 * PHP Sample Code
 * Demonstrates various syntax features and token types
 */

namespace App\Demo;

use DateTime;
use DateTimeImmutable;
use Exception;
use InvalidArgumentException;
use JsonSerializable;
use Stringable;
use Generator;

// Constants
const PI = 3.14159265359;
const MAX_SIZE = 0xFF;
const HEX_VALUE = 0xDEADBEEF;
const SCIENTIFIC = 1.5e10;

// Enum (PHP 8.1+)
enum Status: string
{
    case Pending = 'pending';
    case Running = 'running';
    case Completed = 'completed';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Waiting',
            self::Running => 'In Progress',
            self::Completed => 'Done',
            self::Failed => 'Error',
        };
    }
}

// Interface
interface Repository
{
    public function save(object $entity): void;
    public function findById(int|string $id): ?object;
    public function findAll(): array;
    public function delete(int|string $id): void;
}

// Trait
trait Loggable
{
    protected function log(string $message, string $level = 'info'): void
    {
        $timestamp = date('Y-m-d H:i:s');
        echo "[{$timestamp}] [{$level}] {$message}\n";
    }

    protected function logError(Exception $e): void
    {
        $this->log("{$e->getMessage()} in {$e->getFile()}:{$e->getLine()}", 'error');
    }
}

trait Serializable
{
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR);
    }
}

// Attribute (PHP 8.0+)
#[\Attribute(\Attribute::TARGET_METHOD | \Attribute::TARGET_FUNCTION)]
class Logged
{
    public function __construct(
        public string $message = ''
    ) {}
}

// Class with typed properties and promoted constructor
readonly class Point
{
    public function __construct(
        public float $x,
        public float $y
    ) {}

    public function distanceFromOrigin(): float
    {
        return sqrt($this->x ** 2 + $this->y ** 2);
    }

    public function add(Point $other): Point
    {
        return new Point($this->x + $other->x, $this->y + $other->y);
    }
}

// Main class
class User implements JsonSerializable, Stringable
{
    use Loggable, Serializable;

    private static int $instanceCount = 0;

    private array $roles = [];
    private array $metadata = [];
    private DateTimeImmutable $createdAt;

    public function __construct(
        private readonly int $id,
        private string $name,
        private string $email
    ) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email: {$email}");
        }
        $this->createdAt = new DateTimeImmutable();
        self::$instanceCount++;
    }

    // Named arguments and null safe operator
    public static function create(
        string $name,
        string $email,
        ?int $id = null
    ): self {
        return new self(
            id: $id ?? random_int(1, 10000),
            name: $name,
            email: $email
        );
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function addRole(string $role): self
    {
        if (!in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
            $this->log("Role '{$role}' added to user {$this->id}");
        }
        return $this;
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles, true);
    }

    public function setMetadata(string $key, mixed $value): self
    {
        $this->metadata[$key] = $value;
        return $this;
    }

    public function getMetadata(string $key, mixed $default = null): mixed
    {
        return $this->metadata[$key] ?? $default;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles,
            'created_at' => $this->createdAt->format(DateTime::ATOM),
        ];
    }

    public function __toString(): string
    {
        return "User({$this->id}, {$this->name}, {$this->email})";
    }

    public static function getInstanceCount(): int
    {
        return self::$instanceCount;
    }
}

// Generic-like repository using union types
class InMemoryRepository implements Repository
{
    use Loggable;

    private array $items = [];

    public function save(object $entity): void
    {
        $id = $entity->getId();
        $this->items[$id] = $entity;
        $this->log("Saved entity with ID: {$id}");
    }

    public function findById(int|string $id): ?object
    {
        return $this->items[$id] ?? null;
    }

    public function findAll(): array
    {
        return array_values($this->items);
    }

    public function delete(int|string $id): void
    {
        unset($this->items[$id]);
    }

    public function count(): int
    {
        return count($this->items);
    }
}

// Generator function
function range_generator(int $start, int $end, int $step = 1): Generator
{
    for ($i = $start; $i <= $end; $i += $step) {
        yield $i;
    }
}

// Arrow function and first-class callable
$square = fn(int $n): int => $n * $n;
$double = fn(int $n): int => $n * 2;

// Higher-order function
function pipe(mixed $value, callable ...$functions): mixed
{
    return array_reduce(
        $functions,
        fn($carry, $func) => $func($carry),
        $value
    );
}

// Main execution
function main(): void
{
    // Create user
    $user = User::create(
        name: 'Alice',
        email: 'alice@example.com'
    );
    $user->addRole('admin')->addRole('user');
    $user->setMetadata('department', 'Engineering');

    echo $user . "\n";
    echo json_encode($user, JSON_PRETTY_PRINT) . "\n";

    // Repository
    $repo = new InMemoryRepository();
    $repo->save($user);

    // Array operations
    $numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    $evens = array_filter($numbers, fn($n) => $n % 2 === 0);
    $squares = array_map(fn($n) => $n ** 2, $numbers);
    $sum = array_reduce($numbers, fn($carry, $n) => $carry + $n, 0);

    // Spread operator
    $moreNumbers = [...$numbers, 11, 12, 13];

    // Match expression (PHP 8.0+)
    $status = Status::Running;
    $message = match ($status) {
        Status::Pending => 'Waiting to start',
        Status::Running => 'Currently running',
        Status::Completed, Status::Failed => 'Finished',
    };

    // Null coalescing and nullsafe operator
    $config = ['host' => 'localhost', 'port' => 8080];
    $host = $config['host'] ?? 'default';
    $timeout = $config['timeout'] ?? 30;

    // String interpolation and heredoc
    $name = 'World';
    $timestamp = date('c');
    $greeting = "Hello, {$name}!";
    $json = <<<JSON
    {
        "name": "{$name}",
        "timestamp": "{$timestamp}"
    }
    JSON;

    // Exception handling
    try {
        $result = performOperation();
    } catch (InvalidArgumentException $e) {
        echo "Validation error: {$e->getMessage()}\n";
    } catch (Exception $e) {
        echo "Error: {$e->getMessage()}\n";
    } finally {
        echo "Cleanup completed\n";
    }

    // Generator usage
    foreach (range_generator(1, 10, 2) as $odd) {
        echo "{$odd} ";
    }
    echo "\n";

    // Pipe function
    $result = pipe(
        5,
        fn($x) => $x * 2,
        fn($x) => $x + 3,
        fn($x) => $x ** 2
    );
    echo "Pipe result: {$result}\n";
}

#[Logged('Performing operation')]
function performOperation(): mixed
{
    // Simulated operation
    return ['success' => true, 'data' => []];
}

// Run main
main();
