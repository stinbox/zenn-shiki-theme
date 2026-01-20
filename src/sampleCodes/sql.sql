-- SQL Sample Code
-- Demonstrates various syntax features and token types

-- ============================================
-- Database and Schema Creation
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS sample_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sample_db;

-- Create schema (PostgreSQL style)
CREATE SCHEMA IF NOT EXISTS app;

-- ============================================
-- Table Definitions
-- ============================================

-- Users table with various constraints
CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36) NOT NULL UNIQUE,
    username        VARCHAR(50) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    date_of_birth   DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    role            ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    balance         DECIMAL(15, 2) DEFAULT 0.00,
    metadata        JSON,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP NULL,

    -- Constraints
    CONSTRAINT chk_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT chk_balance CHECK (balance >= 0),

    -- Indexes
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Posts table with foreign key
CREATE TABLE posts (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    content         TEXT,
    excerpt         VARCHAR(500),
    status          ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count      INT UNSIGNED DEFAULT 0,
    published_at    TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tags table
CREATE TABLE tags (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    slug        VARCHAR(50) NOT NULL UNIQUE,
    color       CHAR(7) DEFAULT '#000000'
);

-- Many-to-many relationship table
CREATE TABLE post_tags (
    post_id     BIGINT UNSIGNED NOT NULL,
    tag_id      INT UNSIGNED NOT NULL,

    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ============================================
-- Insert Statements
-- ============================================

-- Single insert
INSERT INTO users (uuid, username, email, password_hash, first_name, last_name)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'alice', 'alice@example.com',
        '$2b$12$hash...', 'Alice', 'Smith');

-- Multiple insert
INSERT INTO tags (name, slug, color) VALUES
    ('Technology', 'technology', '#3B82F6'),
    ('Design', 'design', '#10B981'),
    ('Business', 'business', '#F59E0B'),
    ('Science', 'science', '#8B5CF6');

-- Insert with subquery
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p, tags t
WHERE p.slug = 'my-first-post' AND t.slug = 'technology';

-- ============================================
-- Select Queries
-- ============================================

-- Basic select with aliases
SELECT
    u.id AS user_id,
    u.username,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name
FROM users u
WHERE u.is_active = TRUE
ORDER BY u.created_at DESC
LIMIT 10 OFFSET 0;

-- Complex select with joins
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    u.username AS author,
    GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tags,
    COUNT(DISTINCT c.id) AS comment_count
FROM posts p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.status = 'published'
    AND p.published_at <= NOW()
    AND p.deleted_at IS NULL
GROUP BY p.id, p.title, p.slug, p.view_count, u.username
HAVING comment_count > 0
ORDER BY p.published_at DESC
LIMIT 20;

-- Subquery in SELECT
SELECT
    u.*,
    (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count,
    (SELECT MAX(published_at) FROM posts WHERE user_id = u.id) AS last_post_date
FROM users u
WHERE u.is_active = TRUE;

-- EXISTS and NOT EXISTS
SELECT u.username, u.email
FROM users u
WHERE EXISTS (
    SELECT 1 FROM posts p
    WHERE p.user_id = u.id AND p.status = 'published'
);

-- CASE expression
SELECT
    username,
    CASE role
        WHEN 'admin' THEN 'Administrator'
        WHEN 'moderator' THEN 'Moderator'
        ELSE 'Regular User'
    END AS role_display,
    CASE
        WHEN balance >= 10000 THEN 'Premium'
        WHEN balance >= 1000 THEN 'Standard'
        ELSE 'Basic'
    END AS tier
FROM users;

-- Window functions
SELECT
    p.title,
    u.username,
    p.view_count,
    ROW_NUMBER() OVER (ORDER BY p.view_count DESC) AS rank,
    RANK() OVER (PARTITION BY u.id ORDER BY p.view_count DESC) AS user_rank,
    SUM(p.view_count) OVER (PARTITION BY u.id) AS user_total_views,
    AVG(p.view_count) OVER () AS avg_views
FROM posts p
JOIN users u ON p.user_id = u.id;

-- Common Table Expression (CTE)
WITH active_users AS (
    SELECT id, username, email
    FROM users
    WHERE is_active = TRUE AND is_verified = TRUE
),
user_post_counts AS (
    SELECT user_id, COUNT(*) AS post_count
    FROM posts
    WHERE status = 'published'
    GROUP BY user_id
)
SELECT
    au.username,
    au.email,
    COALESCE(upc.post_count, 0) AS published_posts
FROM active_users au
LEFT JOIN user_post_counts upc ON au.id = upc.user_id
ORDER BY published_posts DESC;

-- Recursive CTE
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 1 AS level
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;

-- ============================================
-- Update and Delete
-- ============================================

-- Update with join
UPDATE posts p
INNER JOIN users u ON p.user_id = u.id
SET p.status = 'archived'
WHERE u.is_active = FALSE;

-- Conditional update
UPDATE users
SET
    balance = balance * 1.1,
    updated_at = NOW()
WHERE role = 'user'
    AND created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Soft delete
UPDATE posts
SET deleted_at = NOW()
WHERE id = 123;

-- Hard delete with limit
DELETE FROM posts
WHERE status = 'draft'
    AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
LIMIT 100;

-- ============================================
-- Stored Procedure
-- ============================================

DELIMITER //

CREATE PROCEDURE get_user_stats(IN p_user_id BIGINT)
BEGIN
    DECLARE v_post_count INT DEFAULT 0;
    DECLARE v_total_views BIGINT DEFAULT 0;

    SELECT COUNT(*), COALESCE(SUM(view_count), 0)
    INTO v_post_count, v_total_views
    FROM posts
    WHERE user_id = p_user_id AND status = 'published';

    SELECT
        p_user_id AS user_id,
        v_post_count AS post_count,
        v_total_views AS total_views;
END //

DELIMITER ;

-- ============================================
-- Transaction
-- ============================================

START TRANSACTION;

UPDATE users SET balance = balance - 100 WHERE id = 1;
UPDATE users SET balance = balance + 100 WHERE id = 2;

INSERT INTO transactions (from_user, to_user, amount, created_at)
VALUES (1, 2, 100, NOW());

COMMIT;
-- Or ROLLBACK; if error
