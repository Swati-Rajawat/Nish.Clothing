# NishClothing 🖤

A luxury streetwear brand website — editorial, dark, and unforgettable.

## ✦ Features

- **Home Page** — Hero section, product highlights, categories, and testimonials
- **Shop / Products** — Full product grid with category filters and quick-add to cart
- **Journal / Blog** — Editorial content with featured and grid layout
- **Sign In / Register** — Auth page with tabbed login & registration
- **Shopping Cart** — Slide-in cart sidebar with quantity controls
- **Checkout** — Multi-step checkout with order summary, promo codes & payment methods

## 🚀 Deploy to GitHub Pages

1. **Create a new GitHub repository** (e.g. `nishclothing`)

2. **Push this project:**
```bash
git init
git add .
git commit -m "Initial commit — NishClothing website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nishclothing.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `root`
   - Click Save

4. **Your site will be live at:**
   `https://YOUR_USERNAME.github.io/nishclothing/`

## 📁 Project Structure

```
nishclothing/
├── index.html          # Main HTML — all pages (SPA)
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # All JavaScript & cart logic
└── README.md
```

## 🎨 Design

- **Aesthetic:** Dark luxury editorial — deep blacks, warm golds, cream accents
- **Typography:** Playfair Display (display) + Cormorant Garamond (body) + Space Mono (labels)
- **Features:** Custom cursor, scroll-triggered navbar, marquee, cart with localStorage

## 🛠️ Customization

- **Products:** Edit the `products` array in `js/main.js`
- **Colors:** CSS variables in `:root` in `css/style.css`
- **Brand name / copy:** Edit directly in `index.html`
- **Add real images:** Replace emoji placeholders in product cards with `<img>` tags

## Tech Stack

Pure HTML, CSS, JavaScript — zero dependencies, zero build step.
