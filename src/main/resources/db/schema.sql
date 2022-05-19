DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE kinds_of_sport
(
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE league
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(128)  UNIQUE NOT NULL,
    kinds_of_sport_id BIGINT       NOT NULL REFERENCES kinds_of_sport(id) ON DELETE CASCADE
);

CREATE TABLE news
(
    id               BIGSERIAL PRIMARY KEY,
    title            VARCHAR(255) UNIQUE NOT NULL,
    description      TEXT         NOT NULL,
    news_date        TIMESTAMP,
    publication_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    alternative_text VARCHAR(128) NOT NULL,
    caption          VARCHAR(128) NOT NULL,
    image            VARCHAR(128),
    league_id        BIGINT       NOT NULL REFERENCES league (id) ON DELETE CASCADE
);



CREATE TABLE users
(
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(60) UNIQUE NOT NULL,
    first_name    VARCHAR(128)       NOT NULL,
    last_name     VARCHAR(128)       NOT NULL,
    password      VARCHAR(128)       NOT NULL
);

CREATE TABLE users_kind_of_sport
(
    users_id          BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    kinds_of_sport_id BIGINT NOT NULL REFERENCES kinds_of_sport (id) ON DELETE CASCADE,
    PRIMARY KEY (users_id, kinds_of_sport_id)
);

CREATE TABLE roles
(
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE permissions
(
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE permission_roles
(
    role_id BIGINT NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES  permissions (id) ON DELETE CASCADE,
    PRIMARY KEY (role_id,  permission_id)
);

CREATE TABLE user_roles
(
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);



CREATE TABLE team
(
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(128) UNIQUE NOT NULL,
    coach VARCHAR(128),
    image_url VARCHAR(128),
    state VARCHAR(64),
    league_id        BIGINT       NOT NULL REFERENCES league (id) ON DELETE CASCADE
);

CREATE TABLE comments
(
    id   BIGSERIAL PRIMARY KEY,
    text VARCHAR(128) NOT NULL
);

CREATE TABLE user_comments
(
    user_id    BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    comment_id BIGINT NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE team_news
(
    news_id BIGINT NOT NULL REFERENCES news (id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES team (id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, team_id)
);

CREATE TABLE user_team
(
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES team (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE user_league
(
    user_id   BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    league_id BIGINT NOT NULL REFERENCES league (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, league_id)
);

CREATE TABLE survey
(
    id    BIGSERIAL PRIMARY KEY,
    topic VARCHAR(128) NOT NULL,
    text  VARCHAR(128) NOT NULL
);

CREATE TABLE user_survey
(
    user_id   BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    survey_id BIGINT NOT NULL REFERENCES survey (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, survey_id)
);
