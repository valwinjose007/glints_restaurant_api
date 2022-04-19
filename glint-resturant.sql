CREATE TABLE  restaurants
(
    restaurant_id integer GENERATED ALWAYS AS IDENTITY,
    restaurant_name text NOT NULL,
    opening_hours text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at date NOT NULL DEFAULT now(),
    CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id)
);

CREATE TABLE schedule
(
    schedule_id integer GENERATED ALWAYS AS IDENTITY,
    restaurant_id integer NOT NULL,
    opening_days text[] NOT NULL,
    opening_time time without time zone NOT NULL,
    closing_time time without time zone NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at date NOT NULL DEFAULT now(),
    CONSTRAINT schedule_pkey PRIMARY KEY (schedule_id),
    CONSTRAINT fk_restaurant_id FOREIGN KEY (restaurant_id)
        REFERENCES restaurants (restaurant_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE collection
(
    collection_id integer GENERATED ALWAYS AS IDENTITY,
    collection_name text NOT NULL,
    restaurants integer[] NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at date NOT NULL DEFAULT now(),
    CONSTRAINT collection_pkey PRIMARY KEY (collection_id)
);