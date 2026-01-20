/**
 * C Sample Code
 * Demonstrates various syntax features and token types
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <math.h>
#include <pthread.h>
#include <stdarg.h>

/* Constants and macros */
#define PI 3.14159265359
#define MAX_SIZE 0xFF
#define HEX_VALUE 0xDEADBEEF
#define SCIENTIFIC 1.5e10

#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

#define LOG(fmt, ...) \
    fprintf(stderr, "[%s:%d] " fmt "\n", __FILE__, __LINE__, ##__VA_ARGS__)

/* Enum definition */
typedef enum {
    STATUS_PENDING = 0,
    STATUS_RUNNING = 1,
    STATUS_COMPLETED = 2,
    STATUS_FAILED = -1
} Status;

/* Struct definitions */
typedef struct {
    double x;
    double y;
} Point;

typedef struct Node {
    int data;
    struct Node *next;
    struct Node *prev;
} Node;

typedef struct {
    int64_t id;
    char name[64];
    char email[128];
    char *roles[8];
    size_t role_count;
    void *metadata;
} User;

/* Union type */
typedef union {
    int32_t i;
    float f;
    uint8_t bytes[4];
} DataUnion;

/* Function pointer typedef */
typedef int (*Comparator)(const void *, const void *);
typedef void (*Callback)(void *ctx, int result);

/* Static global variable */
static pthread_mutex_t global_mutex = PTHREAD_MUTEX_INITIALIZER;
static volatile int counter = 0;

/* Inline function */
static inline double distance(Point p1, Point p2) {
    double dx = p2.x - p1.x;
    double dy = p2.y - p1.y;
    return sqrt(dx * dx + dy * dy);
}

/* Function with pointer parameters */
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/* Function returning pointer */
char *string_duplicate(const char *str) {
    if (str == NULL) {
        return NULL;
    }
    size_t len = strlen(str) + 1;
    char *copy = (char *)malloc(len);
    if (copy != NULL) {
        memcpy(copy, str, len);
    }
    return copy;
}

/* Variadic function */
int sum(int count, ...) {
    va_list args;
    va_start(args, count);

    int total = 0;
    for (int i = 0; i < count; i++) {
        total += va_arg(args, int);
    }

    va_end(args);
    return total;
}

/* Linked list operations */
Node *list_create(int data) {
    Node *node = (Node *)malloc(sizeof(Node));
    if (node != NULL) {
        node->data = data;
        node->next = NULL;
        node->prev = NULL;
    }
    return node;
}

void list_insert(Node **head, int data) {
    Node *new_node = list_create(data);
    if (new_node == NULL) {
        return;
    }

    if (*head == NULL) {
        *head = new_node;
        return;
    }

    new_node->next = *head;
    (*head)->prev = new_node;
    *head = new_node;
}

void list_free(Node *head) {
    while (head != NULL) {
        Node *temp = head;
        head = head->next;
        free(temp);
    }
}

/* Comparison function for qsort */
int compare_int(const void *a, const void *b) {
    return (*(int *)a - *(int *)b);
}

/* Thread function */
void *worker_thread(void *arg) {
    int thread_id = *(int *)arg;

    pthread_mutex_lock(&global_mutex);
    counter++;
    printf("Thread %d: counter = %d\n", thread_id, counter);
    pthread_mutex_unlock(&global_mutex);

    return NULL;
}

/* User operations */
User *user_create(int64_t id, const char *name, const char *email) {
    User *user = (User *)calloc(1, sizeof(User));
    if (user == NULL) {
        return NULL;
    }

    user->id = id;
    strncpy(user->name, name, sizeof(user->name) - 1);
    strncpy(user->email, email, sizeof(user->email) - 1);
    user->role_count = 0;

    return user;
}

void user_add_role(User *user, const char *role) {
    if (user == NULL || user->role_count >= ARRAY_SIZE(user->roles)) {
        return;
    }
    user->roles[user->role_count++] = string_duplicate(role);
}

void user_free(User *user) {
    if (user == NULL) {
        return;
    }
    for (size_t i = 0; i < user->role_count; i++) {
        free(user->roles[i]);
    }
    free(user);
}

/* Main function */
int main(int argc, char *argv[]) {
    /* Variable declarations */
    int numbers[] = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    size_t n = ARRAY_SIZE(numbers);
    const char *message = "Hello, C!";
    char buffer[256] = {0};

    /* Bit operations */
    uint32_t flags = 0;
    flags |= (1 << 0);  /* Set bit 0 */
    flags |= (1 << 2);  /* Set bit 2 */
    flags &= ~(1 << 0); /* Clear bit 0 */
    bool is_set = (flags & (1 << 2)) != 0;

    /* Pointer arithmetic */
    int *ptr = numbers;
    int *end = numbers + n;
    while (ptr < end) {
        printf("%d ", *ptr++);
    }
    printf("\n");

    /* Sort array */
    qsort(numbers, n, sizeof(int), compare_int);

    /* Control flow */
    for (size_t i = 0; i < n; i++) {
        if (numbers[i] % 2 == 0) {
            continue;
        }
        printf("Odd: %d\n", numbers[i]);
    }

    /* Switch statement */
    Status status = STATUS_RUNNING;
    switch (status) {
        case STATUS_PENDING:
            puts("Pending");
            break;
        case STATUS_RUNNING:
            puts("Running");
            break;
        case STATUS_COMPLETED:
        case STATUS_FAILED:
            puts("Finished");
            break;
        default:
            puts("Unknown");
    }

    /* String formatting */
    snprintf(buffer, sizeof(buffer),
             "PI = %.6f, HEX = 0x%08X", PI, HEX_VALUE);
    puts(buffer);

    /* Dynamic memory and struct */
    User *user = user_create(1, "Alice", "alice@example.com");
    if (user != NULL) {
        user_add_role(user, "admin");
        user_add_role(user, "user");
        LOG("Created user: %s <%s>", user->name, user->email);
        user_free(user);
    }

    /* Threads */
    pthread_t threads[4];
    int thread_ids[4];

    for (int i = 0; i < 4; i++) {
        thread_ids[i] = i;
        pthread_create(&threads[i], NULL, worker_thread, &thread_ids[i]);
    }

    for (int i = 0; i < 4; i++) {
        pthread_join(threads[i], NULL);
    }

    /* Conditional compilation */
    #ifdef DEBUG
    LOG("Debug mode enabled");
    #endif

    #if defined(__GNUC__)
    LOG("Compiled with GCC version %d.%d", __GNUC__, __GNUC_MINOR__);
    #endif

    return EXIT_SUCCESS;
}
