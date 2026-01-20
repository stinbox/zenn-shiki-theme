"""
Python Sample Code
Demonstrates various syntax features and token types
"""

import asyncio
import re
from dataclasses import dataclass, field
from typing import (
    Any,
    Callable,
    Generic,
    List,
    Optional,
    TypeVar,
    Union,
    Dict,
)
from enum import Enum, auto
from functools import wraps
from contextlib import contextmanager

# Constants
PI: float = 3.14159265359
MAX_SIZE: int = 0xFF
SCIENTIFIC: float = 1.5e10
HEX_COLOR: int = 0xDEADBEEF

# Regular expression
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
URL_PATTERN = re.compile(r'https?://[\w\-]+(\.[\w\-]+)+', re.IGNORECASE)

# Enum definition
class Status(Enum):
    PENDING = auto()
    RUNNING = "running"
    COMPLETED = 2
    FAILED = -1


# Type variables for generics
T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')


# Decorator
def logged(func: Callable[..., T]) -> Callable[..., T]:
    """Decorator that logs function calls"""
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        print(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper


# Dataclass with field options
@dataclass(frozen=True)
class Point:
    x: float
    y: float
    label: str = ""

    def distance_from_origin(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5


@dataclass
class User:
    id: int
    name: str
    email: str
    roles: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not EMAIL_PATTERN.match(self.email):
            raise ValueError(f"Invalid email: {self.email}")


# Generic class
class Repository(Generic[T]):
    def __init__(self) -> None:
        self._items: Dict[int, T] = {}
        self._counter: int = 0

    def save(self, item: T) -> int:
        self._counter += 1
        self._items[self._counter] = item
        return self._counter

    def find_by_id(self, id: int) -> Optional[T]:
        return self._items.get(id)

    def find_all(self) -> List[T]:
        return list(self._items.values())


# Context manager
@contextmanager
def timer(label: str):
    """Context manager for timing code blocks"""
    import time
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f} seconds")


# Async function
async def fetch_data(url: str, timeout: float = 30.0) -> Dict[str, Any]:
    """Async function to fetch data from URL"""
    async with asyncio.timeout(timeout):
        # Simulated async operation
        await asyncio.sleep(0.1)
        return {"url": url, "status": "ok", "data": [1, 2, 3]}


# Generator function
def fibonacci(limit: int):
    """Generator that yields Fibonacci numbers"""
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b


# Class with multiple inheritance
class Loggable:
    def log(self, message: str) -> None:
        print(f"[{self.__class__.__name__}] {message}")


class Serializable:
    def to_dict(self) -> Dict[str, Any]:
        return self.__dict__.copy()


class Service(Loggable, Serializable):
    """Service class demonstrating multiple inheritance"""

    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.config = config or {}
        self._running = False

    async def start(self) -> None:
        self.log(f"Starting service: {self.name}")
        self._running = True
        await asyncio.sleep(0)

    async def stop(self) -> None:
        self.log(f"Stopping service: {self.name}")
        self._running = False

    @property
    def is_running(self) -> bool:
        return self._running

    @staticmethod
    def create_default() -> "Service":
        return Service("default", {"debug": True})

    @classmethod
    def from_config(cls, config: Dict[str, Any]) -> "Service":
        return cls(config.get("name", "unnamed"), config)


# Main execution
async def main() -> None:
    # List comprehension
    squares = [x ** 2 for x in range(10) if x % 2 == 0]

    # Dict comprehension
    word_lengths = {word: len(word) for word in ["hello", "world", "python"]}

    # Set comprehension
    unique_chars = {char.lower() for char in "Hello World" if char.isalpha()}

    # Walrus operator
    if (n := len(squares)) > 5:
        print(f"Got {n} squares")

    # Match statement (Python 3.10+)
    status = Status.COMPLETED
    match status:
        case Status.PENDING:
            print("Waiting...")
        case Status.RUNNING:
            print("In progress...")
        case Status.COMPLETED | Status.FAILED:
            print("Done!")
        case _:
            print("Unknown status")

    # Exception handling
    try:
        data = await fetch_data("https://api.example.com/data")
        print(data)
    except asyncio.TimeoutError:
        print("Request timed out")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print("Cleanup completed")


if __name__ == "__main__":
    asyncio.run(main())
