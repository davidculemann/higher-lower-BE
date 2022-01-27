drop table if exists scores;
drop table if exists users;

create table users (
user_id serial PRIMARY KEY,
name varchar(16) CHECK (LENGTH(name) > 0 ) unique CHECK (name NOT LIKE '% %'));

create table scores (
score int NOT NULL,
time timestamp default now(),
user_id int NOT NULL,
category text NOT NULL,
FOREIGN KEY(user_id)
REFERENCES users (user_id) ON DELETE CASCADE);

insert into users (name)
values ('David'), ('Bob'), ('Watty');

insert into scores (score, user_id, category)
values (4, 2, 'Geography (area)');