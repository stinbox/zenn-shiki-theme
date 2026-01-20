/**
 * C++ Sample Code
 * Demonstrates various syntax features and token types
 */

#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <memory>
#include <functional>
#include <algorithm>
#include <optional>
#include <variant>
#include <thread>
#include <mutex>
#include <concepts>
#include <ranges>
#include <format>
#include <array>
#include <atomic>

// Namespace
namespace demo {

// Constants
constexpr double PI = 3.14159265359;
constexpr int MAX_SIZE = 0xFF;
constexpr unsigned int HEX_VALUE = 0xDEADBEEF;
constexpr double SCIENTIFIC = 1.5e10;

// Concept definition (C++20)
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};

// Enum class
enum class Status {
    Pending,
    Running,
    Completed,
    Failed
};

// Struct with default member initializers
struct Point {
    double x = 0.0;
    double y = 0.0;

    constexpr double distance_from_origin() const {
        return std::sqrt(x * x + y * y);
    }

    auto operator<=>(const Point&) const = default;
};

// Template class
template<typename T, size_t N>
class FixedArray {
private:
    std::array<T, N> data_{};
    size_t size_ = 0;

public:
    constexpr void push_back(const T& value) {
        if (size_ < N) {
            data_[size_++] = value;
        }
    }

    constexpr T& operator[](size_t index) {
        return data_[index];
    }

    constexpr const T& operator[](size_t index) const {
        return data_[index];
    }

    constexpr size_t size() const { return size_; }
    constexpr auto begin() { return data_.begin(); }
    constexpr auto end() { return data_.begin() + size_; }
};

// Abstract base class
class IRepository {
public:
    virtual ~IRepository() = default;
    virtual void save(int id, const std::string& data) = 0;
    virtual std::optional<std::string> find(int id) = 0;
};

// Class with RAII and rule of five
class User {
private:
    int id_;
    std::string name_;
    std::string email_;
    std::vector<std::string> roles_;
    std::map<std::string, std::string> metadata_;

public:
    // Constructors
    User() = default;

    User(int id, std::string name, std::string email)
        : id_(id)
        , name_(std::move(name))
        , email_(std::move(email)) {}

    // Copy constructor and assignment
    User(const User&) = default;
    User& operator=(const User&) = default;

    // Move constructor and assignment
    User(User&&) noexcept = default;
    User& operator=(User&&) noexcept = default;

    // Destructor
    ~User() = default;

    // Getters
    [[nodiscard]] int id() const { return id_; }
    [[nodiscard]] const std::string& name() const { return name_; }
    [[nodiscard]] const std::string& email() const { return email_; }

    // Fluent interface
    User& add_role(std::string role) {
        roles_.push_back(std::move(role));
        return *this;
    }

    User& set_metadata(const std::string& key, std::string value) {
        metadata_[key] = std::move(value);
        return *this;
    }

    // Friend function for streaming
    friend std::ostream& operator<<(std::ostream& os, const User& user) {
        return os << std::format("User({}, {}, {})", user.id_, user.name_, user.email_);
    }
};

// Template function with concepts
template<Numeric T>
T sum(const std::vector<T>& values) {
    T result{};
    for (const auto& v : values) {
        result += v;
    }
    return result;
}

// Variadic template
template<typename... Args>
void print_all(Args&&... args) {
    ((std::cout << args << " "), ...);
    std::cout << "\n";
}

// Lambda with capture
auto create_counter(int start = 0) {
    return [count = start]() mutable {
        return count++;
    };
}

// Coroutine-like generator (simplified)
class Range {
public:
    class Iterator {
        int current_;
        int step_;
    public:
        Iterator(int val, int step) : current_(val), step_(step) {}
        int operator*() const { return current_; }
        Iterator& operator++() { current_ += step_; return *this; }
        bool operator!=(const Iterator& other) const {
            return current_ < other.current_;
        }
    };

    Range(int start, int end, int step = 1)
        : start_(start), end_(end), step_(step) {}

    Iterator begin() const { return Iterator(start_, step_); }
    Iterator end() const { return Iterator(end_, step_); }

private:
    int start_, end_, step_;
};

// Thread-safe singleton
class Config {
private:
    std::map<std::string, std::string> settings_;
    mutable std::mutex mutex_;

    Config() = default;

public:
    Config(const Config&) = delete;
    Config& operator=(const Config&) = delete;

    static Config& instance() {
        static Config instance;
        return instance;
    }

    void set(const std::string& key, const std::string& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        settings_[key] = value;
    }

    std::optional<std::string> get(const std::string& key) const {
        std::lock_guard<std::mutex> lock(mutex_);
        if (auto it = settings_.find(key); it != settings_.end()) {
            return it->second;
        }
        return std::nullopt;
    }
};

} // namespace demo

// Main function
int main() {
    using namespace demo;
    using namespace std::string_literals;

    // Smart pointers
    auto user = std::make_unique<User>(1, "Alice", "alice@example.com");
    user->add_role("admin").add_role("user");

    std::shared_ptr<User> shared_user = std::move(user);

    // Structured bindings
    std::map<std::string, int> scores{{"Alice", 95}, {"Bob", 87}};
    for (const auto& [name, score] : scores) {
        std::cout << std::format("{}: {}\n", name, score);
    }

    // std::variant and std::visit
    std::variant<int, double, std::string> value = "hello"s;
    std::visit([](auto&& arg) {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, int>) {
            std::cout << "int: " << arg << "\n";
        } else if constexpr (std::is_same_v<T, double>) {
            std::cout << "double: " << arg << "\n";
        } else {
            std::cout << "string: " << arg << "\n";
        }
    }, value);

    // Ranges (C++20)
    std::vector<int> numbers{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    auto result = numbers
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });

    for (int n : result) {
        std::cout << n << " ";
    }
    std::cout << "\n";

    // Thread
    std::atomic<int> counter{0};
    std::vector<std::thread> threads;

    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&counter]() {
            for (int j = 0; j < 100; ++j) {
                counter.fetch_add(1, std::memory_order_relaxed);
            }
        });
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Counter: " << counter.load() << "\n";

    // Raw string literal
    auto raw = R"(
        This is a raw string
        with "quotes" and \\ backslashes
    )";
    std::cout << raw;

    return 0;
}
