# frozen_string_literal: true

##
# Ruby Sample Code
# Demonstrates various syntax features and token types
#

require 'json'
require 'date'
require 'securerandom'

# Constants
PI = 3.14159265359
MAX_SIZE = 0xFF
HEX_VALUE = 0xDEADBEEF
SCIENTIFIC = 1.5e10

# Regular expression
EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
URL_PATTERN = %r{https?://[\w\-]+(\.[\w\-]+)+}i

# Symbol array and string array literals
STATUSES = %i[pending running completed failed].freeze
ROLES = %w[admin user guest].freeze

# Module with mixins
module Loggable
  def log(message)
    puts "[#{self.class.name}] #{message}"
  end

  def log_error(error)
    warn "[ERROR] #{error.class}: #{error.message}"
    error.backtrace&.first(5)&.each { |line| warn "  #{line}" }
  end
end

module Serializable
  def to_hash
    instance_variables.each_with_object({}) do |var, hash|
      key = var.to_s.delete_prefix('@').to_sym
      hash[key] = instance_variable_get(var)
    end
  end

  def to_json(*args)
    to_hash.to_json(*args)
  end
end

# Class with attr accessors and class methods
class User
  include Loggable
  include Serializable

  attr_reader :id, :created_at
  attr_accessor :name, :email, :roles, :metadata

  @@instance_count = 0

  class << self
    attr_reader :instance_count

    def create(name:, email:)
      new(name: name, email: email)
    end
  end

  def initialize(name:, email:, id: nil)
    @id = id || SecureRandom.uuid
    @name = name
    @email = email
    @roles = []
    @metadata = {}
    @created_at = Time.now
    @@instance_count += 1
  end

  def add_role(role)
    raise ArgumentError, "Invalid role: #{role}" unless ROLES.include?(role)

    @roles << role unless @roles.include?(role)
    self
  end

  def admin?
    roles.include?('admin')
  end

  def valid?
    name&.length&.positive? && email&.match?(EMAIL_REGEX)
  end

  def to_s
    "User(#{id}, #{name}, #{email})"
  end

  alias inspect to_s

  protected

  def reset_roles
    @roles = []
  end

  private

  def generate_id
    SecureRandom.uuid
  end
end

# Generic Repository class
class Repository
  include Enumerable

  def initialize
    @items = {}
    @mutex = Mutex.new
  end

  def save(item)
    @mutex.synchronize do
      @items[item.id] = item
    end
    item
  end

  def find(id)
    @mutex.synchronize { @items[id] }
  end

  def find_all
    @mutex.synchronize { @items.values.dup }
  end

  def delete(id)
    @mutex.synchronize { @items.delete(id) }
  end

  def each(&block)
    find_all.each(&block)
  end

  def count
    @mutex.synchronize { @items.size }
  end
end

# Block and yield
def with_timing(label)
  start = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  result = yield
  elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - start
  puts "#{label}: #{elapsed.round(4)} seconds"
  result
end

# Proc and Lambda
square = ->(x) { x * x }
double = proc { |x| x * 2 }
add = lambda do |a, b|
  a + b
end

# Method with keyword arguments and defaults
def fetch_data(url, timeout: 30, retries: 3, **options)
  attempt = 0

  begin
    attempt += 1
    # Simulated fetch
    { status: :ok, url: url, attempt: attempt }
  rescue StandardError => e
    retry if attempt < retries
    { status: :error, message: e.message }
  end
end

# Struct
Point = Struct.new(:x, :y) do
  def distance_from_origin
    Math.sqrt(x**2 + y**2)
  end

  def +(other)
    Point.new(x + other.x, y + other.y)
  end
end

# OpenStruct alternative
Config = Struct.new(:host, :port, :ssl, keyword_init: true) do
  def url
    protocol = ssl ? 'https' : 'http'
    "#{protocol}://#{host}:#{port}"
  end
end

# Main execution
if __FILE__ == $PROGRAM_NAME
  # String interpolation and heredoc
  name = 'World'
  greeting = "Hello, #{name}!"
  multiline = <<~HEREDOC
    This is a
    multiline string
    with interpolation: #{1 + 2}
  HEREDOC

  # Array operations
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  evens = numbers.select(&:even?)
  squares = numbers.map { |n| n**2 }
  sum = numbers.reduce(0, :+)

  # Hash operations
  config = {
    host: 'localhost',
    port: 8080,
    ssl: false,
    tags: %w[api v2]
  }

  # Safe navigation and dig
  nested = { a: { b: { c: 1 } } }
  value = nested.dig(:a, :b, :c)
  optional = nil&.to_s&.upcase

  # Pattern matching (Ruby 3.0+)
  case config
  in { host:, port:, ssl: true }
    puts "Secure connection to #{host}:#{port}"
  in { host:, port:, **rest }
    puts "Connection to #{host}:#{port}"
  end

  # Begin/rescue/ensure
  begin
    user = User.create(name: 'Alice', email: 'alice@example.com')
    user.add_role('admin')
    puts user

    repo = Repository.new
    repo.save(user)
  rescue ArgumentError => e
    warn "Validation error: #{e.message}"
  rescue StandardError => e
    warn "Error: #{e.message}"
  ensure
    puts 'Cleanup completed'
  end

  # Thread
  threads = 4.times.map do |i|
    Thread.new(i) do |thread_id|
      sleep(rand * 0.1)
      puts "Thread #{thread_id} completed"
    end
  end
  threads.each(&:join)

  # Enumerable chain
  result = (1..100)
    .lazy
    .select { |n| n % 3 == 0 }
    .map { |n| n * 2 }
    .take(10)
    .to_a

  puts "Result: #{result.inspect}"
end
