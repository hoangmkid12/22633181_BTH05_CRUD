# Supplier & Product MVC (Node.js + Express + MongoDB)

- Views use **EJS** with **Bootstrap**.
- Configuration via **.env**.
- **Swagger** available at `/api-docs`.
- CRUD for **Suppliers** and **Products**.
- Home page supports **search by product name** and **filter by supplier**.

## Setup
```bash
npm install
npm run seed # optional: load demo data
npm run dev  # start with nodemon
# or npm start
```
Create `.env` (already provided example):
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/supplier_product_db
SESSION_SECRET=supersecret
```

Open: http://localhost:3000

## Scripts
- `npm run dev` – start with nodemon
- `npm run seed` – seed sample data

## Folder Structure
```
node-mvc-crud-product-supplier/
  app.js
  models/
  controllers/
  routes/
  views/
  public/
  seed.js
```
