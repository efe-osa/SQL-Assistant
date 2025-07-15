-- Drop all tables
DROP TABLE IF EXISTS Customer_Ownership;
DROP TABLE IF EXISTS Dealer_Brand;
DROP TABLE IF EXISTS Car_Vins;
DROP TABLE IF EXISTS Car_Options;
DROP TABLE IF EXISTS Car_Parts;
DROP TABLE IF EXISTS Models;
DROP TABLE IF EXISTS Brands;
DROP TABLE IF EXISTS Dealers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Manufacture_Plants;

-- Create the tables
CREATE TABLE Brands (
    brand_id INTEGER PRIMARY KEY,
    brand_name TEXT NOT NULL
);

CREATE TABLE Models (
    model_id INTEGER PRIMARY KEY,
    model_name TEXT NOT NULL,
    brand_id INTEGER,
    FOREIGN KEY (brand_id) REFERENCES Brands(brand_id)
);

CREATE TABLE Manufacture_Plants (
    manufacture_plant_id INTEGER PRIMARY KEY,
    plant_name TEXT NOT NULL,
    plant_type TEXT NOT NULL,
    plant_location TEXT,
    company_owned BOOLEAN NOT NULL
);

CREATE TABLE Car_Parts (
    part_id INTEGER PRIMARY KEY,
    part_name TEXT NOT NULL,
    manufacture_plant_id INTEGER,
    manufacture_start_date DATE NOT NULL,
    manufacture_end_date DATE,
    part_recall BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (manufacture_plant_id) REFERENCES Manufacture_Plants(manufacture_plant_id)
);

CREATE TABLE Car_Options (
    option_set_id INTEGER PRIMARY KEY,
    model_id INTEGER,
    engine_id INTEGER,
    transmission_id INTEGER,
    chassis_id INTEGER,
    premium_sound_id INTEGER,
    color TEXT NOT NULL,
    option_set_price INTEGER NOT NULL,
    FOREIGN KEY (model_id) REFERENCES Models(model_id),
    FOREIGN KEY (engine_id) REFERENCES Car_Parts(part_id),
    FOREIGN KEY (transmission_id) REFERENCES Car_Parts(part_id),
    FOREIGN KEY (chassis_id) REFERENCES Car_Parts(part_id),
    FOREIGN KEY (premium_sound_id) REFERENCES Car_Parts(part_id)
);

CREATE TABLE Car_Vins (
    vin INTEGER PRIMARY KEY,
    model_id INTEGER,
    option_set_id INTEGER,
    manufactured_date DATE,
    manufactured_plant_id INTEGER,
    FOREIGN KEY (model_id) REFERENCES Models(model_id),
    FOREIGN KEY (option_set_id) REFERENCES Car_Options(option_set_id),
    FOREIGN KEY (manufactured_plant_id) REFERENCES Manufacture_Plants(manufacture_plant_id)
);

CREATE TABLE Dealers (
    dealer_id INTEGER PRIMARY KEY,
    dealer_name TEXT NOT NULL,
    dealer_address TEXT NOT NULL
);

CREATE TABLE Dealer_Brand (
    dealer_id INTEGER,
    brand_id INTEGER,
    PRIMARY KEY (dealer_id, brand_id),
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id),
    FOREIGN KEY (brand_id) REFERENCES Brands(brand_id)
);

CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    household_income INTEGER,
    birthdate DATE NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT
);

CREATE TABLE Customer_Ownership (
    customer_id INTEGER,
    vin INTEGER,
    purchase_date DATE NOT NULL,
    purchase_price INTEGER NOT NULL,
    warantee_expire_date DATE,
    dealer_id INTEGER,
    PRIMARY KEY (customer_id, vin),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (vin) REFERENCES Car_Vins(vin),
    FOREIGN KEY (dealer_id) REFERENCES Dealers(dealer_id)
);

-- Insert sample data
INSERT INTO Brands (brand_id, brand_name) VALUES
(1, 'Scania');

INSERT INTO Models (model_id, model_name, brand_id) VALUES
(1, 'R 500', 1),
(2, 'R 450', 1),
(3, 'G 410', 1),
(4, 'P 320', 1),
(5, 'P 280', 1),
(6, 'K 320', 1),
(7, 'K 280', 1),
(8, 'S 730', 1),
(9, 'S 580', 1),
(10, 'S 500', 1);

INSERT INTO Manufacture_Plants (manufacture_plant_id, plant_name, plant_type, plant_location, company_owned) VALUES
(1, 'Scania Södertälje', 'Assembly', 'Södertälje, Sweden', TRUE),
(2, 'Scania Zwolle', 'Assembly', 'Zwolle, Netherlands', TRUE),
(3, 'Scania Angers', 'Assembly', 'Angers, France', TRUE),
(4, 'Scania Słupsk', 'Assembly', 'Słupsk, Poland', TRUE),
(5, 'Scania São Paulo', 'Assembly', 'São Paulo, Brazil', TRUE);

INSERT INTO Car_Parts (part_id, part_name, manufacture_plant_id, manufacture_start_date, manufacture_end_date, part_recall) VALUES
(1, 'DC16 500 V8 Engine', 1, '2020-01-01', NULL, FALSE),
(2, 'DC13 450 6-Cylinder Engine', 1, '2020-01-01', NULL, FALSE),
(3, 'DC13 410 6-Cylinder Engine', 1, '2020-01-01', NULL, FALSE),
(4, 'DC09 320 5-Cylinder Engine', 1, '2020-01-01', NULL, FALSE),
(5, 'DC09 280 5-Cylinder Engine', 1, '2020-01-01', NULL, FALSE),
(6, 'GRS905 12-Speed Manual', 1, '2020-01-01', NULL, FALSE),
(7, 'GRS905 12-Speed Automated', 1, '2020-01-01', NULL, FALSE),
(8, 'GRS905 12-Speed Opticruise', 1, '2020-01-01', NULL, FALSE),
(9, 'Standard Chassis', 1, '2020-01-01', NULL, FALSE),
(10, 'High Chassis', 1, '2020-01-01', NULL, FALSE),
(11, 'Premium Sound System', 1, '2020-01-01', NULL, FALSE),
(12, 'Basic Sound System', 1, '2020-01-01', NULL, FALSE);

INSERT INTO Car_Options (option_set_id, model_id, engine_id, transmission_id, chassis_id, premium_sound_id, color, option_set_price) VALUES
(1, 1, 1, 8, 9, 11, 'White', 25000),
(2, 2, 2, 8, 9, 12, 'Blue', 22000),
(3, 3, 3, 7, 10, 12, 'Red', 20000),
(4, 4, 4, 7, 9, 11, 'Silver', 18000),
(5, 5, 5, 6, 9, 12, 'Black', 16000),
(6, 6, 4, 7, 10, 11, 'Gray', 19000),
(7, 7, 5, 6, 9, 12, 'White', 17000),
(8, 8, 1, 8, 10, 11, 'Blue', 26000),
(9, 9, 2, 8, 10, 11, 'Silver', 24000),
(10, 10, 3, 7, 9, 11, 'Black', 21000);

INSERT INTO Car_Vins (vin, model_id, option_set_id, manufactured_date, manufactured_plant_id) VALUES
(1001, 1, 1, '2023-01-15', 1),
(1002, 2, 2, '2023-02-20', 1),
(1003, 3, 3, '2023-03-10', 2),
(1004, 4, 4, '2023-04-05', 2),
(1005, 5, 5, '2023-05-12', 3),
(1006, 6, 6, '2023-06-18', 3),
(1007, 7, 7, '2023-07-22', 4),
(1008, 8, 8, '2023-08-30', 4),
(1009, 9, 9, '2023-09-14', 5),
(1010, 10, 10, '2023-10-25', 5);

INSERT INTO Dealers (dealer_id, dealer_name, dealer_address) VALUES
(1, 'Scania Stockholm', '123 Truckvägen, Stockholm, Sweden'),
(2, 'Scania Gothenburg', '456 Lastbilgatan, Gothenburg, Sweden'),
(3, 'Scania Malmö', '789 Transportvägen, Malmö, Sweden'),
(4, 'Scania Oslo', '321 Lastbilveien, Oslo, Norway'),
(5, 'Scania Copenhagen', '654 Lastbilgade, Copenhagen, Denmark');

INSERT INTO Dealer_Brand (dealer_id, brand_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1);

INSERT INTO Customers (customer_id, first_name, last_name, gender, household_income, birthdate, phone_number, email) VALUES
(1, 'Anders', 'Nilsson', 'Male', 850000, '1985-06-15', '+46-70-123-4567', 'anders.nilsson@transport.se'),
(2, 'Maria', 'Andersson', 'Female', 950000, '1988-03-22', '+46-70-234-5678', 'maria.andersson@logistics.se'),
(3, 'Johan', 'Svensson', 'Male', 1200000, '1982-11-30', '+46-70-345-6789', 'johan.svensson@freight.se'),
(4, 'Emma', 'Johansson', 'Female', 780000, '1990-07-18', '+46-70-456-7890', 'emma.johansson@trucking.se'),
(5, 'Erik', 'Karlsson', 'Male', 1100000, '1987-09-25', '+46-70-567-8901', 'erik.karlsson@haulage.se');

INSERT INTO Customer_Ownership (customer_id, vin, purchase_date, purchase_price, warantee_expire_date, dealer_id) VALUES
(1, 1001, '2023-02-01', 350000, '2028-02-01', 1),
(2, 1004, '2023-05-01', 320000, '2028-05-01', 2),
(3, 1006, '2023-07-01', 450000, '2028-07-01', 3),
(4, 1008, '2023-09-01', 420000, '2028-09-01', 4),
(5, 1010, '2023-11-01', 380000, '2028-11-01', 5);
