# 🌿 Chooose Partnership Manager

A modern React single-page application (SPA) built with **Vite** that enables Account Managers to **create, view, and edit partnerships** in a sustainability-focused B2B platform.

This app simulates the partnership configuration process used by organizations like airlines and corporate clients to manage **climate action programs**, such as carbon offsetting and **Sustainable Aviation Fuel (SAF)** portfolios.

---

## 🚀 Tech Stack

- **React 18** — component-based UI architecture  
- **Vite** — ultra-fast development build tool with HMR  
- **JavaScript (ESNext)** — lightweight, framework-agnostic logic  
- **LocalStorage** — browser persistence for demo purposes  
- **Tailwind-like styling** — clean utility classes for simple, maintainable design  

---

## ⚙️ Installation & Setup

Follow these steps to set up the project using **Vite** in an existing React environment or from scratch.

### 🧩 1. Prerequisites

Ensure you have the following installed:
- **Node.js** v16 or higher  
- **npm** or **yarn**

---

### ⚡ 2. Setup Using Vite

If you're integrating into an existing React app:
```bash
npm install vite @vitejs/plugin-react --save-dev
```

If you're creating a new project from scratch:
```bash
npm create vite@latest chooose-partnership -- --template react
cd chooose-partnership
npm install
```

---

### 🧱 3. Configure Vite

Create a `vite.config.js` file in your root directory:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

---

### 🪶 4. Adjust the Entry Point

Replace the default entry (`index.js` or `main.jsx`) by editing your `index.html`:

```html
<div id="root"></div>
<script type="module" src="/src/App.jsx"></script>
```

This ensures that **App.jsx** is used as the main entry point.

---

### ▶️ 5. Run the App

Start the development server:
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💡 Application Overview

The **Partnership Manager App** provides a simple, intuitive interface for managing partner configurations. It mirrors how a sustainability platform (like Chooose) structures B2B partnership settings.

---

## 🧠 Core Features

### 1. Partnership Management  
- **Create, view, and edit partnerships** directly in the browser  
- Each partnership includes:
  - `name`
  - `currency`
  - `portalUrl`
  - `features`
  - `itemFeePercent`
  - `instantBilling`

### 2. Data Persistence  
- Uses **LocalStorage** to store and persist data without requiring a backend.
- Supports multiple sessions — all changes are saved locally in your browser.

### 3. Default Partnership Template  
When creating a new partnership, the following default structure is loaded:
```js
{
  name: "New Partnership",
  currency: "USD",
  portalUrl: "https://demo.portal.chooose.today",
  features: [
    "EmissionsDashboard",
    "EmissionCompensate",
    "EmissionCompensate_AirFreight",
  ],
  itemFeePercent: 15.0,
  instantBilling: true
}
```

### 4. Dynamic Filtering & Search  
- Quickly locate existing partnerships via a built-in **search bar**.  
- Filters in real-time without reloading the page.

### 5. Responsive & Modular Design  
- Built using reusable components:  
  `Header`, `PartnershipList`, `PartnershipDetails`, `FieldRow`, and `Tag`  
- Responsive grid layout suitable for desktop or tablet.

---

## 🧩 Directory Structure

```bash
src/
├─ App.jsx
├─ components/
│  ├─ Header.jsx
│  ├─ PartnershipList.jsx
│  ├─ PartnershipDetails.jsx
│  ├─ FieldRow.jsx
│  └─ Tag.jsx
├─ data/
│  ├─ seeds.js
│  └─ constants.js
├─ lib/
│  ├─ storage.js
│  └─ validators.js
└─ styles/
   └─ index.css
```

---

## 🧭 Behavior Summary

- When the user clicks **“+ New Partnership”**, a new partnership object is created using the default parameters above.  
- The app enters **edit mode**, allowing the user to customize fields and save changes.  
- Partnerships can be selected from the sidebar for quick viewing or editing.  
- Validation ensures that names, URLs, and fee percentages are properly formatted.  
- All data persists automatically in LocalStorage.

---

## 🧰 Future Enhancements

- Integrate with a real backend API (GraphQL or REST).  
- Add authentication and role-based access control.  
- Enable CSV export/import of partnerships.  
- Include dark mode and accessibility improvements.

---

## 👨‍💻 Author

Developed by **Leeron Arad** 

---



---

## 🧩 Architectural and Library Choices

I chose to build this project using **React** because it’s my preferred UI framework and one that I’ve extensively used across many of my professional projects. React’s component-based architecture allows for a clean separation of logic and presentation, making it ideal for scalable and maintainable front-end systems.

To enhance the developer experience, I integrated **Vite** as the build tool. Vite provides a lightweight, lightning-fast development environment with hot module replacement (HMR) and modern ES module support, allowing for quick iteration and styling flexibility without heavy build overhead.

This combination — React + Vite — ensures high performance, modularity, and an enjoyable developer workflow that aligns with enterprise standards.

---

## 🧮 Assumptions About the Data Structure

My assumptions about the data structure are that it is **highly detailed and deeply configurable**, enabling a customizable user experience. Each partnership object is designed to be flexible, supporting numerous configuration options such as currency, features, billing behavior, and visual settings.

This structure allows the application to provide a tailored experience to different types of users and organizations, offering significant **flexibility in how data is consumed and presented**. The modularity of the data model also ensures smooth scalability as additional fields or integrations are introduced in future iterations.


## 🪄 License

This project is open-source and available under the [MIT License](LICENSE).
