File: 01_docs/production/domain-and-dns-guide.md

# Domain and DNS Guide

## 1. Domain Selection

Choose:

- Short
- Easy to type
- Easy to print
- Easy to remember

Example:
yourname.wedding
love2035.com

---

## 2. DNS Configuration

If using Vercel:

- Add domain in Vercel dashboard
- Update DNS A or CNAME record
- Wait for propagation (up to 24h)

---

## 3. SSL

Must use HTTPS.

Vercel provides automatic SSL.

Verify:

https://yourdomain.com
No security warning.

---

## 4. QR Strategy

Generate QR code pointing to:

https://yourdomain.com

Print on:
- Invitation
- Reception desk
- Slide presentation

Test QR on:
- iPhone
- Android
- 4G network

---

## 5. Subdomain Strategy (Optional)

admin.yourdomain.com → private  
www.yourdomain.com → public  

Avoid exposing admin route publicly.