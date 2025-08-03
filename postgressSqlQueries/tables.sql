-- USER ROLE TABLE

CREATE TABLE user_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255),
    CONSTRAINT CHK_RoleName CHECK (role_name IN ('admin', 'seller', 'customer','hybrid','owner'))
);

-- USERS TABLE

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    login_attempts INT NOT NULL DEFAULT 0,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    login_count INT NOT NULL DEFAULT 0,
    verification_code VARCHAR(255),
    code_timestamp TIMESTAMP,
    code_expiration TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_token_timestamp TIMESTAMP,
    reset_password_token_expiration TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

-- USER ROLES TABLE START

-- CUSTOMERS TABLE

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- SELLERS TABLE

CREATE TABLE sellers (
    seller_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    stripe_account_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- HYBRIDS TABLE

CREATE TABLE hybrids (
    hybrid_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    stripe_account_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- For sellers table
ALTER TABLE sellers
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'unverify' CHECK (status IN ('verified', 'unverify'));

-- For hybrids table
ALTER TABLE hybrids
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'unverify' CHECK (status IN ('verified', 'unverify'));


-- ADMIN TABLE

CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- OWNER TABLE

CREATE TABLE owners (
    owner_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- USER ROLES TABLE END

-- SESSIONS TABLE

CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- Product related tables

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE conditions (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) UNIQUE NOT NULL, -- 'any', 'refurbished', etc.
    label VARCHAR(100) NOT NULL
);



CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);



CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stripe_product_id TEXT NULL,
    stripe_price_id TEXT NULL,
    tierOne_price NUMERIC(10,2) DEFAULT NULL CHECK (tierOne_price >= 0),
    tierTwo_price NUMERIC(10,2) DEFAULT NULL CHECK (tierOne_price >= 0),
    tierThree_price NUMERIC(10,2) DEFAULT NULL CHECK (tierOne_price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    seller_id INTEGER REFERENCES sellers(seller_id) ON DELETE CASCADE,
    hybrid_id INTEGER REFERENCES hybrids(hybrid_id) ON DELETE CASCADE,
    CHECK (
        (seller_id IS NOT NULL AND hybrid_id IS NULL) OR
        (seller_id IS NULL AND hybrid_id IS NOT NULL)
    ),
    condition_id INTEGER REFERENCES conditions(id),
    average_rating NUMERIC(2,1) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products ADD COLUMN tierOne_price NUMERIC(10,2) DEFAULT NULL CHECK (tierOne_price >= 0);


ALTER TABLE products Drop COLUMN price 

CREATE TABLE product_brands (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, brand_id)
);


CREATE TABLE product_features (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, feature_id)
);


CREATE TABLE product_manufacturers (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, manufacturer_id)
);


CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, user_id)
);

CREATE TABLE category_brands (
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, brand_id)
);


CREATE TABLE category_features (
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, feature_id)
);

CREATE TABLE category_manufacturers (
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, manufacturer_id)
);

-- CREATE TABLE product_quantity_pricing (
--     id SERIAL PRIMARY KEY,
--     product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
--     min_qty INTEGER NOT NULL CHECK (min_qty > 0),
--     max_qty INTEGER NOT NULL CHECK (max_qty > min_qty),
--     price_per_unit NUMERIC(10,2) NOT NULL CHECK (price_per_unit >= 0)
-- );

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- Carts

CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    customer_id INT NULL,           -- For a logged-in user who is only a customer
    hybrid_id INT NULL,             -- For a logged-in user who is a seller (and implicitly a customer)
    session_id VARCHAR(255) NULL,   -- For guest users
    payment_status VARCHAR(10) NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (hybrid_id) REFERENCES hybrids(hybrid_id),

    CONSTRAINT CHK_UserOrSession CHECK (
        (customer_id IS NOT NULL) OR (hybrid_id IS NOT NULL) OR (session_id IS NOT NULL)
    ),
    CONSTRAINT CHK_UserRoleExclusivity CHECK (
        (customer_id IS NULL AND hybrid_id IS NOT NULL) OR 
        (customer_id IS NOT NULL AND hybrid_id IS NULL) OR 
        (customer_id IS NULL AND hybrid_id IS NULL)
    ),
    CONSTRAINT CHK_PaymentStatus CHECK (
        payment_status IN ('paid', 'unpaid')
    )
);


CREATE TABLE cart_items (
    item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


ALTER TABLE cart_items
ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'canceled', 'returned'));




CREATE TABLE save_for_later_lists (
    list_id SERIAL PRIMARY KEY,
    customer_id INT NULL,
    hybrid_id INT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (hybrid_id) REFERENCES hybrids(hybrid_id),
    CONSTRAINT CHK_UserRoleExclusivity CHECK (
        (customer_id IS NOT NULL AND hybrid_id IS NULL) OR
        (customer_id IS NULL AND hybrid_id IS NOT NULL)
    )
);


CREATE TABLE save_for_later_items (
    item_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (list_id) REFERENCES save_for_later_lists(list_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);



