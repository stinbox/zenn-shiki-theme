//! Rust Sample Code
//! Demonstrates various syntax features and token types

use std::collections::HashMap;
use std::fmt::{self, Display, Formatter};
use std::sync::{Arc, Mutex};
use std::marker::PhantomData;

// Constants and statics
const PI: f64 = 3.14159265359;
const MAX_SIZE: usize = 0xFF;
const HEX_VALUE: u32 = 0xDEAD_BEEF;
static GLOBAL_COUNTER: std::sync::atomic::AtomicUsize =
    std::sync::atomic::AtomicUsize::new(0);

// Enum with variants
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Status {
    Pending,
    Running { progress: u8 },
    Completed(String),
    Failed { code: i32, message: String },
}

// Struct with derive macros
#[derive(Debug, Clone, Default)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
    pub roles: Vec<String>,
    metadata: HashMap<String, String>,
}

// Implementation block
impl User {
    pub fn new(id: u64, name: impl Into<String>, email: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            email: email.into(),
            roles: Vec::new(),
            metadata: HashMap::new(),
        }
    }

    pub fn add_role(&mut self, role: &str) -> &mut Self {
        self.roles.push(role.to_string());
        self
    }

    pub fn with_metadata(mut self, key: &str, value: &str) -> Self {
        self.metadata.insert(key.to_string(), value.to_string());
        self
    }
}

// Trait definition
pub trait Repository<T> {
    type Error;

    fn save(&mut self, item: T) -> Result<(), Self::Error>;
    fn find_by_id(&self, id: u64) -> Option<&T>;
    fn find_all(&self) -> Vec<&T>;

    fn count(&self) -> usize {
        self.find_all().len()
    }
}

// Generic struct with lifetime and trait bounds
pub struct InMemoryRepository<'a, T>
where
    T: Clone + 'a,
{
    items: HashMap<u64, T>,
    _marker: PhantomData<&'a T>,
}

impl<'a, T: Clone> InMemoryRepository<'a, T> {
    pub fn new() -> Self {
        Self {
            items: HashMap::new(),
            _marker: PhantomData,
        }
    }
}

impl<'a, T: Clone> Repository<T> for InMemoryRepository<'a, T> {
    type Error = &'static str;

    fn save(&mut self, item: T) -> Result<(), Self::Error> {
        let id = GLOBAL_COUNTER.fetch_add(1, std::sync::atomic::Ordering::SeqCst) as u64;
        self.items.insert(id, item);
        Ok(())
    }

    fn find_by_id(&self, id: u64) -> Option<&T> {
        self.items.get(&id)
    }

    fn find_all(&self) -> Vec<&T> {
        self.items.values().collect()
    }
}

// Display trait implementation
impl Display for Status {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            Status::Pending => write!(f, "Pending"),
            Status::Running { progress } => write!(f, "Running: {}%", progress),
            Status::Completed(msg) => write!(f, "Completed: {}", msg),
            Status::Failed { code, message } => {
                write!(f, "Failed [{}]: {}", code, message)
            }
        }
    }
}

// Async function
pub async fn fetch_data(url: &str) -> Result<String, Box<dyn std::error::Error>> {
    // Simulated async operation
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    Ok(format!("Data from {}", url))
}

// Macro definition
macro_rules! create_function {
    ($name:ident, $body:expr) => {
        fn $name() -> i32 {
            $body
        }
    };
}

create_function!(answer, 42);

// Pattern matching
fn process_status(status: Status) -> &'static str {
    match status {
        Status::Pending => "waiting",
        Status::Running { progress } if progress > 50 => "almost done",
        Status::Running { .. } => "in progress",
        Status::Completed(_) => "done",
        Status::Failed { code, .. } if code < 0 => "critical error",
        Status::Failed { .. } => "error",
    }
}

// Iterator and closures
fn process_numbers(numbers: &[i32]) -> i32 {
    numbers
        .iter()
        .filter(|&&n| n > 0)
        .map(|&n| n * 2)
        .fold(0, |acc, n| acc + n)
}

// Generic function with where clause
fn compare_and_display<T, U>(a: T, b: U) -> String
where
    T: Display + PartialOrd<U>,
    U: Display,
{
    if a < b {
        format!("{} < {}", a, b)
    } else {
        format!("{} >= {}", a, b)
    }
}

// Main function
fn main() {
    // Variable bindings
    let mut user = User::new(1, "Alice", "alice@example.com");
    user.add_role("admin").add_role("user");

    // Pattern matching with destructuring
    let User { name, email, .. } = &user;
    println!("User: {} <{}>", name, email);

    // Control flow
    for i in 0..10 {
        if i % 2 == 0 {
            continue;
        }
        println!("{}", i);
    }

    // Loop with label
    'outer: loop {
        for j in 0..5 {
            if j == 3 {
                break 'outer;
            }
        }
    }

    // Option and Result handling
    let maybe_value: Option<i32> = Some(42);
    if let Some(v) = maybe_value {
        println!("Value: {}", v);
    }

    // Thread-safe counter
    let counter = Arc::new(Mutex::new(0));
    let counter_clone = Arc::clone(&counter);

    std::thread::spawn(move || {
        let mut num = counter_clone.lock().unwrap();
        *num += 1;
    });

    // Raw string literal
    let raw_string = r#"This is a "raw" string with \\ backslashes"#;
    let byte_string = b"byte string";

    println!("{}", raw_string);
    println!("{:?}", byte_string);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_creation() {
        let user = User::new(1, "Test", "test@test.com");
        assert_eq!(user.name, "Test");
    }
}
