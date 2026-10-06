# 🎁 Cadou de zi de naștere

Mini-site React (Vite) cu un cadou 3D: dezlegi panglica (tragi de fundiță sau dai click),
deschizi cutia, apare mesajul **„Dă sunetul la MAXIM!”** și apoi pornește videoclipul.

## Rulare locală

```bash
npm install
npm run dev
```

## Personalizare

În `src/App.jsx`, sus de tot:

```js
const NAME = 'Ana'              // numele de sub „La mulți ani”
const VIDEO_SRC = '/bosquito.mp4' // videoclipul din folderul public/
```

Videoclipul stă în `public/bosquito.mp4`.

## Deploy pe Vercel

Varianta cea mai rapidă:

```bash
npx vercel --prod
```

Sau: pui folderul pe GitHub → vercel.com → **Add New… → Project** → importezi repo-ul.
Vercel detectează singur Vite (build: `npm run build`, output: `dist`).
