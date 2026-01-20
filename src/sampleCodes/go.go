// Package main demonstrates various Go syntax features
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"regexp"
	"sync"
	"time"
)

// Constants
const (
	PI         = 3.14159265359
	MaxSize    = 0xFF
	HexValue   = 0xDEADBEEF
	Scientific = 1.5e10
)

// Iota enumeration
const (
	StatusPending Status = iota
	StatusRunning
	StatusCompleted
	StatusFailed
)

// Custom type
type Status int

// Struct with tags
type User struct {
	ID        int64             `json:"id" db:"user_id"`
	Name      string            `json:"name" validate:"required"`
	Email     string            `json:"email" validate:"email"`
	Roles     []string          `json:"roles,omitempty"`
	Metadata  map[string]string `json:"metadata,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
}

// Interface definition
type Repository[T any] interface {
	Save(ctx context.Context, item T) error
	FindByID(ctx context.Context, id int64) (*T, error)
	FindAll(ctx context.Context) ([]T, error)
}

// Generic struct
type InMemoryRepository[T any] struct {
	mu      sync.RWMutex
	items   map[int64]T
	counter int64
}

// Constructor function
func NewInMemoryRepository[T any]() *InMemoryRepository[T] {
	return &InMemoryRepository[T]{
		items: make(map[int64]T),
	}
}

// Method with pointer receiver
func (r *InMemoryRepository[T]) Save(ctx context.Context, item T) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
	}

	r.counter++
	r.items[r.counter] = item
	return nil
}

func (r *InMemoryRepository[T]) FindByID(ctx context.Context, id int64) (*T, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if item, ok := r.items[id]; ok {
		return &item, nil
	}
	return nil, errors.New("item not found")
}

func (r *InMemoryRepository[T]) FindAll(ctx context.Context) ([]T, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]T, 0, len(r.items))
	for _, item := range r.items {
		result = append(result, item)
	}
	return result, nil
}

// String method for Status
func (s Status) String() string {
	switch s {
	case StatusPending:
		return "pending"
	case StatusRunning:
		return "running"
	case StatusCompleted:
		return "completed"
	case StatusFailed:
		return "failed"
	default:
		return fmt.Sprintf("unknown(%d)", s)
	}
}

// Variadic function
func Sum(numbers ...int) int {
	total := 0
	for _, n := range numbers {
		total += n
	}
	return total
}

// Function returning multiple values
func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

// Higher-order function
func Filter[T any](items []T, predicate func(T) bool) []T {
	result := make([]T, 0)
	for _, item := range items {
		if predicate(item) {
			result = append(result, item)
		}
	}
	return result
}

// Regular expression
var (
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
)

// Validate email
func ValidateEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// Worker pool pattern
func ProcessItems(ctx context.Context, items []int, workers int) <-chan int {
	results := make(chan int, len(items))
	jobs := make(chan int, len(items))

	// Start workers
	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for job := range jobs {
				select {
				case <-ctx.Done():
					return
				case results <- job * 2:
				}
			}
		}(i)
	}

	// Send jobs
	go func() {
		for _, item := range items {
			jobs <- item
		}
		close(jobs)
	}()

	// Close results when done
	go func() {
		wg.Wait()
		close(results)
	}()

	return results
}

// Main function
func main() {
	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Create repository
	repo := NewInMemoryRepository[User]()

	// Create user
	user := User{
		Name:      "Alice",
		Email:     "alice@example.com",
		Roles:     []string{"admin", "user"},
		Metadata:  map[string]string{"department": "engineering"},
		CreatedAt: time.Now(),
	}

	// Save user
	if err := repo.Save(ctx, user); err != nil {
		log.Fatalf("Failed to save user: %v", err)
	}

	// JSON marshaling
	data, err := json.MarshalIndent(user, "", "  ")
	if err != nil {
		log.Printf("JSON error: %v", err)
	} else {
		fmt.Println(string(data))
	}

	// Anonymous function
	process := func(s string) string {
		return fmt.Sprintf("processed: %s", s)
	}
	fmt.Println(process("test"))

	// Defer, panic, recover
	defer func() {
		if r := recover(); r != nil {
			log.Printf("Recovered from panic: %v", r)
		}
	}()

	// Type switch
	var value interface{} = 42
	switch v := value.(type) {
	case int:
		fmt.Printf("Integer: %d\n", v)
	case string:
		fmt.Printf("String: %s\n", v)
	default:
		fmt.Printf("Unknown type: %T\n", v)
	}

	// Range over channel
	items := []int{1, 2, 3, 4, 5}
	for result := range ProcessItems(ctx, items, 2) {
		fmt.Println(result)
	}

	// Raw string literal
	rawSQL := `
		SELECT id, name, email
		FROM users
		WHERE status = 'active'
	`
	fmt.Println(rawSQL)
}
