# 🤖 PollakGPT

![PollakGPT](https://img.shields.io/badge/PollakGPT-v1.0-blue)

## 📝 Projekt leírás

PollakGPT egy modern, magyar nyelvű AI chat alkalmazás, amely a Google Gemini API-t használja. Az alkalmazás Next.js-sel készült és a mesterséges intelligencia erejét használja, hogy természetes nyelvű beszélgetéseket folytasson a felhasználókkal.

## ✨ Funkciók

- 💬 Valós idejű chat interfész
- 📚 Beszélgetési előzmények tárolása
- 📋 Markdown tartalom másolása
- 🔄 Újrapróbálási lehetőség hiba esetén
- 🌙 Sötét mód dizájn
- ⚡ Válaszok animált megjelenítése
- ❌ Megerősítés beszélgetés törléséhez
- ⚙️ Környezeti változók használata az API kulcs és modell tárolásához

## 🚀 Kezdő lépések

1. **Klónozd a repót**

```bash
git clone https://github.com/felhasznalonev/pollakgpt.git
cd pollakgpt
```

2. **Telepítsd a függőségeket**

```bash
npm install
# vagy
pnpm install
```

3. **Konfiguráld a környezeti változókat**

Hozz létre egy `.env.local` fájlt a következő tartalommal:

```bash
NEXT_PUBLIC_APIKEY=your_gemini_api_key
NEXT_PUBLIC_AI_MODEL=gemini-2.0-flash
```

4. **Indítsd el a fejlesztői szervert**

```bash
npm run dev
# vagy
pnpm dev
```

5. **Nyisd meg a böngészőben**

Látogass el a [http://localhost:3000](http://localhost:3000) címre a böngésződben.

## 💻 Technológiák

- [Next.js](https://nextjs.org/) - React keretrendszer
- [React](https://react.dev/) - Frontend könyvtár
- [Tailwind CSS](https://tailwindcss.com/) - CSS keretrendszer
- [Google Gemini API](https://ai.google.dev/) - AI modell

## 📦 Projektstruktúra

```
src/
  app/
    components/    # UI komponensek
    hooks/         # React hook-ok
    utils/         # Segédfunkciók és típusok
    globals.css    # Globális stílusok
    page.tsx       # Főoldal komponens
```

## 🤝 Hozzájárulás

A hozzájárulásokat szívesen fogadjuk! Nyiss egy pull request-et vagy jelentsd a hibákat az issue szekcióban.

## 📄 Licenc

Ez a projekt MIT licenc alatt áll - lásd a [LICENSE](LICENSE) fájlt a részletekért.

---

Készítette a 12. SZF1 csoport a Szentesi Pollák Antal Technikum számára.
