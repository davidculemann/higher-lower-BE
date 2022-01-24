drop table if exists users;
drop table if exists scores;

create table users (
user_id serial PRIMARY KEY,
name text CHECK (LENGTH(name) > 0 ) unique);

create table scores (
score int NOT NULL,
time timestamp default now(),
user_id int,
category text,
sub_category text,
FOREIGN KEY(user_id)
REFERENCES users (user_id) ON DELETE CASCADE);

insert into users (name)
values ('David'), ('Bob'), ('Watty');

insert into scores (score, user_id, category, sub_category)
values (4, 2, 'Geography', 'Area');