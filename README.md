<div align="center">

# 🍽️ The Grand Table

### A complete restaurant ordering & management system — beautifully designed, zero backend required.

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

---

*One file. Two experiences. Endless elegance.*

</div>

---

## ✨ What is The Grand Table?

**The Grand Table** is a fully self-contained restaurant solution built with pure HTML, CSS, and JavaScript. A single `index.html` file powers two complete experiences:

- 🧑‍💼 **Admin Dashboard** — Manage your entire restaurant from one sleek panel
- 📱 **Customer Menu** — A beautiful QR-scan ordering experience for your guests

No frameworks. No build tools. No backend server needed. Just open the file and go.

---

## 🚀 Features

### 🛡️ Admin Dashboard
| Feature | Description |
|---------|-------------|
| 📊 **Live Overview** | Real-time stats — orders, revenue, tables, and waiter calls at a glance |
| 🍔 **Menu Management** | Add, edit, delete products with images, prices, sizes & extras |
| 🗂️ **Category Control** | Create and reorder menu categories with drag-friendly controls |
| 🪑 **Table Management** | Add tables and auto-generate unique QR codes for each |
| 📦 **Order Tracking** | View all incoming orders and update statuses in real time |
| 🔔 **Waiter Alerts** | Live bell notifications when a customer calls for service |
| 🖨️ **QR Print Cards** | Print-ready QR code cards for every table |

### 👤 Customer Menu (Table View)
| Feature | Description |
|---------|-------------|
| 🏷️ **Category Browsing** | Filter menu by category with smooth tab navigation |
| 🌟 **Popular Items** | Highlighted bestsellers, chef specials & rated dishes |
| 📐 **Sizes & Extras** | Customers can customize size and add-ons per item |
| 🛒 **Smart Cart** | Persistent cart with item quantities, subtotals & order notes |
| 💳 **Payment Options** | Choose payment method at checkout |
| 🛎️ **Call Waiter** | One-tap waiter request button from any table |
| 📋 **Order History** | View past orders placed at the same table |

---

## 🗂️ Project Structure

```
The Grand Table/
│
├── index.html          # 🏠 Main file — Admin Dashboard + Customer Menu (dual mode)
├── store.js            # 🧠 Shared data layer — localStorage + Supabase integration
├── qrcode.min.js       # 📷 QR code generation library
└── supabase-schema.sql # 🗄️ Database schema for Supabase (optional, for real-time sync)
```

---

## ⚡ Quick Start

### Option 1 — Local (No setup needed)

1. **Clone or download** this repository
   ```bash
   git clone https://github.com/the-grand-table/the-grand-table.git
   ```
2. Open the folder and **double-click `index.html`** in your browser
3. That's it! The app seeds itself with demo data on first run

> 💡 Open the same file in **two browser tabs** — Admin in one, and append `?table=01` to the URL in the other to see both experiences side-by-side.

### Option 2 — With Real-Time Sync (Supabase)

For orders to sync across devices in real time (e.g., kitchen tablet + waiter phone):

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Database → SQL Editor** and run the contents of `supabase-schema.sql`
3. Open `store.js` and fill in your credentials:
   ```js
   const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';
   ```
4. Deploy the files anywhere (GitHub Pages, Netlify, etc.) and share the QR codes!

---

## 🎨 Design System

The Grand Table uses a custom, hand-crafted design system with:

- **Typography:** `Playfair Display` (headings) + `Inter` (body) via Google Fonts
- **Color Palette:**

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#c9a06c` | Gold — primary brand color |
| `--text-primary` | `#1a1a1a` | Main text |
| `--bg` | `#fafafa` | Page background |
| `--success` | `#2f8a52` | Order served / confirmed |
| `--warning` | `#c9822c` | Preparing / waiter alert |
| `--danger` | `#c94b4b` | Delete / error states |

- **Responsive** sidebar layout with mobile hamburger menu
- Smooth **cubic-bezier** transitions throughout
- Custom scrollbars, glassmorphism topbar, and hover lift effects

---

## 🍽️ Default Menu

The app ships with **21 pre-loaded menu items** across 6 categories:

| Category | Items |
|----------|-------|
| 🥗 Starters | Bruschetta, Chicken Wings, Spring Rolls, Crispy Calamari, Loaded Nachos, Creamy Alfredo Pasta |
| 🍔 Burgers | Crispy Zinger Burger, Classic Cheeseburger, BBQ Bacon Burger |
| 🍕 Pizza | Classic Pepperoni, Margherita, BBQ Chicken |
| 🥩 Main Course | Grilled Chicken Steak, Grilled Salmon, Beef Steak |
| 🥤 Drinks | Fresh Lemon Mojito, Iced Tea, Fresh Orange Juice |
| 🍰 Desserts | Chocolate Lava Cake, Tiramisu, Ice Cream Trio |

All items include ratings, badges (Bestseller, Chef Special, etc.), veg/non-veg labels, and optional discount pricing.

---

## 🔄 How the Dual-Mode Works

The single `index.html` file detects its mode from the URL:

```
index.html            → Admin Dashboard
index.html?table=05   → Customer Menu for Table 5
```

This means **one deployment URL** handles everything. The admin generates a QR code per table — each QR points to the same file with a different `?table=` parameter.

---

## 🗄️ Data Architecture

All data is stored in **`localStorage`** with these keys:

| Key | Description |
|-----|-------------|
| `gt_categories` | Menu categories array |
| `gt_products` | Full product catalog |
| `gt_tables` | Table definitions |
| `gt_waiter_calls` | Waiter call requests |
| `gt_orders` | Orders (fallback if Supabase not configured) |

When Supabase is configured, orders are stored in the cloud `orders` table with real-time `postgres_changes` subscription — enabling live kitchen displays across any device.

---

## 📱 Responsive Support

| Screen | Experience |
|--------|-----------|
| 🖥️ Desktop | Full sidebar + content layout |
| 💻 Laptop | Optimized spacing and grids |
| 📱 Mobile | Hamburger menu, stacked layout, touch-friendly targets |

---

## 🛠️ Tech Stack

- **Vanilla HTML5, CSS3, JavaScript** — zero dependencies
- **[QRCode.js](https://github.com/davidshimjs/qrcodejs)** — client-side QR code generation
- **[Supabase](https://supabase.com)** — optional real-time PostgreSQL backend
- **Google Fonts** — Playfair Display + Inter

---

## 📄 License

This project is open source. Feel free to use, modify, and build upon it for your own restaurant or project.

---

<div align="center">

Made with ❤️ and a lot of ☕

**[⭐ Star this repo](https://github.com/the-grand-table/the-grand-table/stargazers)** if you find it useful!

</div>
