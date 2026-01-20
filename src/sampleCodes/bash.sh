#!/bin/bash

# =============================================================================
# Bash Sample Code
# Demonstrates various syntax features and token types
# =============================================================================

set -euo pipefail
IFS=$'\n\t'

# =============================================================================
# Constants and Variables
# =============================================================================

# Readonly constants
readonly PI=3.14159265359
readonly MAX_SIZE=255
readonly HEX_VALUE=0xDEADBEEF
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"

# Regular variables
counter=0
is_verbose=false
output_file=""

# Arrays
declare -a SUPPORTED_LANGS=("bash" "python" "ruby" "go" "rust")
declare -A CONFIG=(
    ["host"]="localhost"
    ["port"]="8080"
    ["debug"]="false"
)

# =============================================================================
# Color and Formatting
# =============================================================================

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# Functions
# =============================================================================

# Print colored message
log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

# Function with local variables and return value
calculate_sum() {
    local -i a=${1:-0}
    local -i b=${2:-0}
    local -i result=$((a + b))
    echo "$result"
}

# Function with nameref (bash 4.3+)
get_array_length() {
    local -n arr_ref=$1
    echo "${#arr_ref[@]}"
}

# Validate email using regex
validate_email() {
    local email="$1"
    local regex="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if [[ "$email" =~ $regex ]]; then
        return 0
    else
        return 1
    fi
}

# Function with default parameters
greet() {
    local name="${1:-World}"
    local greeting="${2:-Hello}"
    echo "$greeting, $name!"
}

# Process items with error handling
process_file() {
    local file="$1"

    if [[ ! -f "$file" ]]; then
        log_error "File not found: $file"
        return 1
    fi

    if [[ ! -r "$file" ]]; then
        log_error "File not readable: $file"
        return 1
    fi

    local line_count
    line_count=$(wc -l < "$file")
    log_info "Processing $file ($line_count lines)"

    # Process file line by line
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip empty lines and comments
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue

        # Process the line
        echo "  > $line"
    done < "$file"

    return 0
}

# =============================================================================
# Command-line Argument Parsing
# =============================================================================

usage() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTIONS] <command>

Options:
    -h, --help          Show this help message
    -v, --verbose       Enable verbose output
    -o, --output FILE   Write output to FILE
    -c, --config FILE   Use configuration file
    --dry-run           Run without making changes

Commands:
    start               Start the service
    stop                Stop the service
    status              Show service status
    deploy ENV          Deploy to environment (dev|staging|prod)

Examples:
    $SCRIPT_NAME --verbose start
    $SCRIPT_NAME -o output.log deploy prod
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                usage
                exit 0
                ;;
            -v|--verbose)
                is_verbose=true
                shift
                ;;
            -o|--output)
                if [[ -n "${2:-}" ]]; then
                    output_file="$2"
                    shift 2
                else
                    log_error "Option --output requires an argument"
                    exit 1
                fi
                ;;
            -c|--config)
                config_file="${2:-}"
                shift 2
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            --)
                shift
                break
                ;;
            -*)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                break
                ;;
        esac
    done

    # Remaining arguments
    ARGS=("$@")
}

# =============================================================================
# Control Flow Examples
# =============================================================================

# If-elif-else
check_number() {
    local num=$1

    if (( num > 0 )); then
        echo "Positive"
    elif (( num < 0 )); then
        echo "Negative"
    else
        echo "Zero"
    fi
}

# Case statement
handle_signal() {
    local signal="$1"

    case "$signal" in
        SIGINT|SIGTERM)
            echo "Received termination signal"
            cleanup
            exit 130
            ;;
        SIGHUP)
            echo "Reloading configuration..."
            reload_config
            ;;
        *)
            echo "Unhandled signal: $signal"
            ;;
    esac
}

# For loops
demonstrate_loops() {
    # C-style for loop
    for (( i = 0; i < 5; i++ )); do
        echo "Iteration: $i"
    done

    # Range-based
    for i in {1..5}; do
        echo "Number: $i"
    done

    # Array iteration
    for lang in "${SUPPORTED_LANGS[@]}"; do
        echo "Language: $lang"
    done

    # Associative array
    for key in "${!CONFIG[@]}"; do
        echo "$key = ${CONFIG[$key]}"
    done

    # Glob pattern
    for file in *.sh; do
        [[ -f "$file" ]] && echo "Script: $file"
    done
}

# While and until loops
demonstrate_while() {
    local count=0

    while (( count < 5 )); do
        echo "Count: $count"
        (( count++ ))
    done

    # Read from command output
    while read -r line; do
        echo "Line: $line"
    done < <(ls -la)
}

# =============================================================================
# String Operations
# =============================================================================

string_operations() {
    local str="Hello, World!"

    # Length
    echo "Length: ${#str}"

    # Substring
    echo "Substring: ${str:0:5}"

    # Replacement
    echo "Replace: ${str/World/Bash}"
    echo "Replace all: ${str//o/0}"

    # Case conversion
    echo "Uppercase: ${str^^}"
    echo "Lowercase: ${str,,}"

    # Default values
    local empty=""
    echo "Default: ${empty:-default_value}"
    echo "Assign default: ${empty:=assigned}"

    # Prefix/suffix removal
    local path="/home/user/file.txt"
    echo "Basename: ${path##*/}"
    echo "Directory: ${path%/*}"
    echo "Extension: ${path##*.}"
    echo "Without ext: ${path%.*}"
}

# =============================================================================
# Arithmetic
# =============================================================================

arithmetic_operations() {
    local -i a=10 b=3

    echo "Addition: $((a + b))"
    echo "Subtraction: $((a - b))"
    echo "Multiplication: $((a * b))"
    echo "Division: $((a / b))"
    echo "Modulo: $((a % b))"
    echo "Power: $((a ** b))"

    # Increment/decrement
    echo "Pre-increment: $((++a))"
    echo "Post-increment: $((b++))"

    # Bitwise
    echo "AND: $((a & b))"
    echo "OR: $((a | b))"
    echo "XOR: $((a ^ b))"
    echo "Left shift: $((a << 2))"
}

# =============================================================================
# Cleanup and Trap
# =============================================================================

cleanup() {
    log_info "Cleaning up..."
    [[ -n "${temp_file:-}" && -f "$temp_file" ]] && rm -f "$temp_file"
}

trap cleanup EXIT
trap 'handle_signal SIGINT' SIGINT
trap 'handle_signal SIGTERM' SIGTERM

# =============================================================================
# Main
# =============================================================================

main() {
    log_info "Starting $SCRIPT_NAME..."
    log_info "Script directory: $SCRIPT_DIR"

    # Parse command line arguments
    parse_args "$@"

    # Check dependencies
    for cmd in curl jq grep; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Required command not found: $cmd"
            exit 1
        fi
    done

    # Create temp file
    temp_file=$(mktemp)
    log_info "Created temp file: $temp_file"

    # Execute command
    if [[ ${#ARGS[@]} -gt 0 ]]; then
        case "${ARGS[0]}" in
            start)
                log_info "Starting service..."
                ;;
            stop)
                log_info "Stopping service..."
                ;;
            status)
                log_info "Checking status..."
                ;;
            deploy)
                local env="${ARGS[1]:-dev}"
                log_info "Deploying to $env..."
                ;;
            *)
                log_error "Unknown command: ${ARGS[0]}"
                exit 1
                ;;
        esac
    else
        usage
    fi

    log_success "Done!"
}

# Run main function
main "$@"
