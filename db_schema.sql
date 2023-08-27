
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    body TEXT NOT NULL,
    date_created DATE NOT NULL,
    date_posted DATE,
    last_modified DATE,
    likes INTEGER DEFAULT 0,
    status BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    article_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_title TEXT NOT NULL,
    blog_subtitle TEXT,
    author TEXT
);

--insert default data (if necessary here)

INSERT INTO articles (title, subtitle, body, date_created, date_posted, likes, status) 
VALUES ('First Article', 'This is a subtitle', 'This is the body of the first article', '2022-01-01', '2022-01-02', 20, 1);
INSERT INTO comments (article_id, comment) 
VALUES (1, 'This is a great article!');
INSERT INTO blog (blog_title, blog_subtitle, author) 
VALUES ('Add Your Title', 'Add your Subtitle', 'ReadNation');
INSERT INTO comments (article_id, comment) 
VALUES (1, 'This is a great article!');
COMMIT;

