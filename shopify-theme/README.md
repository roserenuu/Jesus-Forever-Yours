# Forever Yours — Shopify Theme

Custom Shopify theme for jesusforeveryours.com, converted from 15 custom HTML files.

---

## Theme Structure

```
shopify-theme/
├── assets/
│   ├── theme.css          — All page styles (extracted from HTML files)
│   └── theme.js           — All JS: reveal animations, FAQ, gallery, mobile nav
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.liquid       — Main layout: <head>, nav, footer
├── locales/
│   └── en.default.json
├── templates/
│   ├── index.liquid            → jesusforeveryours.com/
│   ├── 404.liquid              → jesusforeveryours.com/404
│   ├── cart.liquid             → jesusforeveryours.com/cart
│   ├── page.liquid             → Generic page fallback
│   ├── page.contact.liquid     → /pages/contact
│   ├── page.digital.liquid     → /pages/digital (or use for product template)
│   ├── page.hardcover.liquid   → /pages/hardcover (or use for product template)
│   ├── page.sample.liquid      → /pages/sample
│   ├── page.about.liquid       → /pages/testimony (Rose's story)
│   ├── page.privacy-policy.liquid    → /pages/privacy-policy
│   ├── page.shipping-policy.liquid   → /pages/shipping-policy
│   ├── page.terms-of-service.liquid  → /pages/terms-of-service
│   ├── page.thank-you-digital.liquid → /pages/thank-you-digital
│   └── page.thank-you-hardcover.liquid → /pages/thank-you-hardcover
└── templates/customers/
    ├── new_account.liquid          — Welcome email notification
    └── order_confirmation.liquid   — Order confirmation email
```

---

## Setup Checklist

### 1. Upload Images to Shopify CDN (Files → Upload)

Upload these from the `brand-assets/` folder and name them exactly:

| File to upload | Name it as |
|---|---|
| `white logo forever yours text.png` | `logo-white.png` |
| `black logo forever yours text.png` | `logo-black.png` |
| `Forever yours book mock 1.jpg` | `book-mock-1.jpg` |
| `Forever yours book mock 2.jpg` | `book-mock-2.jpg` |
| `Forever yours book mock 3.jpg` | `book-mock-3.jpg` |
| `Forever yours book mock 4.png` | `book-mock-4.png` |
| `Forever yours book mock 5.png` | `book-mock-5.png` |
| `Forever yours book mock 6.png` | `book-mock-6.png` |
| `rose renuu picture website.jpg` | `rose-renuu.jpg` |
| Hero photo (book/lifestyle shot) | `hero-bg.jpg` |
| Book cover PNG | `book-cover.jpg` |

### 2. Install the Theme

1. Go to **Shopify Admin → Online Store → Themes**
2. Click **Add theme → Upload zip file**
3. Zip the `shopify-theme/` folder and upload it
4. Click **Customize** to preview

### 3. Create Shopify Pages

In **Shopify Admin → Online Store → Pages**, create these pages and assign the template:

| Page title | Handle (URL) | Template |
|---|---|---|
| Sample | `sample` | `page.sample` |
| Rose's Testimony | `testimony` | `page.about` |
| Contact | `contact` | `page.contact` |
| Privacy Policy | `privacy-policy` | `page.privacy-policy` |
| Shipping Policy | `shipping-policy` | `page.shipping-policy` |
| Terms of Service | `terms-of-service` | `page.terms-of-service` |
| Thank You — Digital | `thank-you-digital` | `page.thank-you-digital` |
| Thank You — Hardcover | `thank-you-hardcover` | `page.thank-you-hardcover` |

### 4. Create Shopify Products

| Product | Handle |
|---|---|
| Forever Yours — Hardcover ($20) | `forever-yours-24-days-with-jesus` |
| Forever Yours — Digital ($10) | `forever-yours-24-days-with-jesus-digital` |

### 5. Navigation

In **Shopify Admin → Online Store → Navigation**, add these links to your Main Menu:

- Home → `/`
- Hardcover → `/products/forever-yours-24-days-with-jesus`
- Digital → `/products/forever-yours-24-days-with-jesus-digital`
- Sample → `/pages/sample`
- Testimony → `/pages/testimony`
- Contact → `/pages/contact`

### 6. Newsletter (Email Signup)

The newsletter form uses Shopify's native `{% form 'customer' %}` tag. It:
- Subscribes customers to your Shopify Email list with tag `newsletter`
- Shows a success message on submission
- Shows validation errors if email is invalid
- No third-party app required

To view subscribers: **Shopify Admin → Customers** → filter by tag `newsletter`

### 7. Contact Form

The contact page uses Shopify's native `{% form 'contact' %}` tag. Submissions arrive in:
**Shopify Admin → Inbox** (or your store email)

### 8. Email Notifications

The files in `templates/customers/` are reference designs for Shopify's email notifications.
To use them: **Shopify Admin → Settings → Notifications** → paste HTML into the relevant email.

---

## Mobile

The theme is fully responsive:
- Navigation collapses to a hamburger menu at 960px
- All sections stack vertically on mobile
- Touch-friendly gallery sliders on product pages
- Font sizes use `clamp()` for fluid scaling
