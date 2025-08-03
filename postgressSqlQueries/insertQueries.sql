INSERT INTO user_roles (role_name) VALUES
('owner'),
('admin'),
('seller'),
('customer'),
('hybrid')


INSERT INTO users (username, email, password, role_id, created_at)
VALUES ('Owner', 'owner@gmail.com', '$2b$10$Jb84g0OOJdmamCyzhZSCqOopIM638oTGlN1HOt2saAgzbwUeswJJa', 1, NOW());

INSERT INTO users (username, email, password, role_id, created_at)
VALUES ('Admin', 'admin@gmail.com', '$2b$10$Jb84g0OOJdmamCyzhZSCqOopIM638oTGlN1HOt2saAgzbwUeswJJa', 2, NOW());


INSERT INTO categories (name) 
VALUES ('Electronics'),('Mobile Accessory'),('Smart Phones')('Modern Tech')

select * from categories


INSERT INTO conditions (value, label) 
VALUES 
  ('any', 'Any'),
  ('refurbished', 'Refurbished'),
  ('brandNew', 'Brand New'),
  ('oldItems', 'Old Items');


INSERT INTO brands (name) VALUES ('Sony');
INSERT INTO features (name) VALUES ('Noise Cancellation');
INSERT INTO manufacturers (name) VALUES ('Sony Corp');

-- Assuming Electronics category has id = 1 and brand Sony has id = 1
INSERT INTO category_brands (category_id, brand_id) VALUES (1, 1);
INSERT INTO category_features (category_id, feature_id) VALUES (1, 1);
INSERT INTO category_manufacturers (category_id, manufacturer_id) VALUES (1, 1);



INSERT INTO products (
    title,
    description,
    price,
    discount,
    stock,
    category_id,
    seller_id,
    condition_id,
    average_rating,
    rating_count,
    is_active
) VALUES (
    'Wireless Earbuds X200',
    'High-quality wireless earbuds with noise cancellation and long battery life.',
    99.99,                -- Base unit price
    10.00,                -- 10% discount
    150,                  -- Stock available
    1,                    -- category_id (ensure this ID exists)
    2,                    -- seller_id (user ID 2 must exist and be a seller)
    1,                    -- condition_id (e.g., 'any', 'brand new' etc.)
    0,                    -- average_rating
    0,                    -- rating_count
    TRUE                  -- is_active
);



INSERT INTO product_quantity_pricing (product_id, min_qty, max_qty, unit_price) VALUES
(1, 1, 100, 99.00),
(1, 101, 500, 59.00),
(1, 501, 1500, 49.00);


-- // for detail page
SELECT 
  p.id AS product_id,
  p.title,
  p.description,
  p.price,
  p.discount,
  p.stock,
  p.average_rating,
  p.rating_count,
  p.created_at,
  p.updated_at,

  -- Images (as array if supported, otherwise multiple rows)
  pi.image_url,

  -- Brands
  b.name AS brand_name,

  -- Features
  f.name AS feature_name,

  -- Manufacturers
  m.name AS manufacturer_name

FROM products p

-- Join images (limit 6 per product can be handled in app logic)
LEFT JOIN product_images pi ON pi.product_id = p.id

-- Join brands
LEFT JOIN product_brands pb ON pb.product_id = p.id
LEFT JOIN brands b ON b.id = pb.brand_id

-- Join features
LEFT JOIN product_features pf ON pf.product_id = p.id
LEFT JOIN features f ON f.id = pf.feature_id

-- Join manufacturers
LEFT JOIN product_manufacturers pm ON pm.product_id = p.id
LEFT JOIN manufacturers m ON m.id = pm.manufacturer_id

ORDER BY p.created_at DESC;


-- for seller

SELECT
  p.id AS product_id,
  p.title,
  p.description,
  p.price,
  b.name AS brand,
  f.name AS feature,
  m.name AS manufacturer,
  pi.image_url
FROM products p
LEFT JOIN product_brands pb ON p.id = pb.product_id
LEFT JOIN brands b ON pb.brand_id = b.id
LEFT JOIN product_features pf ON p.id = pf.product_id
LEFT JOIN features f ON pf.feature_id = f.id
LEFT JOIN product_manufacturers pm ON p.id = pm.product_id
LEFT JOIN manufacturers m ON pm.manufacturer_id = m.id
LEFT JOIN LATERAL (
    SELECT image_url
    FROM product_images
    WHERE product_id = p.id
    ORDER BY created_at ASC
    LIMIT 1
) pi ON true;







INSERT INTO products (
    title, description, price, discount, stock, category_id,
    seller_id, condition_id, average_rating, rating_count, is_active
) VALUES 
-- Product 2
('Bluetooth Speaker Z500', 'Portable speaker with rich bass and Bluetooth 5.0 connectivity.', 79.99, 5.00, 200, 1, 2, 1, 0, 0, TRUE),

-- Product 3
('Smartwatch Pro S3', 'Stylish smartwatch with fitness tracking and notification support.', 149.99, 15.00, 100, 1, 2, 1, 0, 0, TRUE),

-- Product 4
('Gaming Headset G400', 'Over-ear gaming headset with surround sound and noise-canceling mic.', 89.99, 10.00, 80, 1, 2, 1, 0, 0, TRUE),

-- Product 5
('Mechanical Keyboard MK900', 'RGB backlit mechanical keyboard with tactile switches.', 119.99, 20.00, 120, 1, 2, 1, 0, 0, TRUE),

-- Product 6
('Portable Charger 20000mAh', 'High-capacity power bank with fast charging and dual USB ports.', 49.99, 5.00, 300, 1, 2, 1, 0, 0, TRUE),

-- Product 7
('HD Webcam W1080', 'Full HD webcam with built-in microphone and low-light correction.', 59.99, 8.00, 90, 1, 2, 1, 0, 0, TRUE),

-- Product 8
('USB-C Hub Multiport Adapter', '7-in-1 USB-C hub for laptop expansion and fast data transfer.', 39.99, 10.00, 170, 1, 2, 1, 0, 0, TRUE),

-- Product 9
('Noise Cancelling Headphones NC700', 'Premium headphones with ANC and 20-hour battery life.', 199.99, 12.00, 60, 1, 2, 1, 0, 0, TRUE),

-- Product 10
('Smart LED Desk Lamp', 'Adjustable LED lamp with touch control and USB charging port.', 29.99, 5.00, 250, 1, 2, 1, 0, 0, TRUE);


