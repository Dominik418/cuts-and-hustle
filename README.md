# ✂️ Cuts & Hustle – Barbershop Management System

Egy **Node.js / Express / MySQL** alapú barber shop webalkalmazás, amely egy fodrászüzlet online működésének több részét kezeli egy rendszerben.

A projektben megtalálható a vendégoldal, a regisztráció és bejelentkezés, az online időpontfoglalás, valamint külön barber- és adminisztrációs felületek.

> **Projekt típusa:** szakmai vizsgaprojekt  
> **Backend:** Node.js + Express  
> **Adatbázis:** MySQL  
> **Template engine:** Handlebars (HBS)

---

## 📌 Főbb funkciók

### 👤 Vendégek és felhasználók

- Regisztráció új felhasználóknak
- Bejelentkezés és kijelentkezés
- Session alapú felhasználókezelés
- Hibás bejelentkezési adatok kezelése
- Felhasználói adatok tárolása MySQL adatbázisban
- Jelszavak hash-elése `bcryptjs` használatával

### 📅 Online időpontfoglalás

- Barber kiválasztása
- Szolgáltatás kiválasztása
- Dátum és időpont kiválasztása
- Már foglalt időpontok ellenőrzése
- A szolgáltatás időtartamának figyelembevétele a foglaltság ellenőrzésekor
- Sikeres foglalás után e-mailes visszaigazolás küldése

### 💈 Barber felület

- A barberhez tartozó időpontok megjelenítése
- Vendégadatok és foglalási adatok áttekintése
- Szolgáltatás és időpont megjelenítése

### 🛠️ Adminisztrációs felület

- Foglalások kezelése
- Felhasználók kezelése
- Szolgáltatások kezelése
- Barberek / munkatársak kezelése
- Barber portfóliók és munkaképek kezelése
- Rekordok hozzáadása, módosítása és törlése
- Képek lekérése a `public/images` mappából

### 🖼️ Barber portfólió

- A barberek saját bemutatóoldallal rendelkeznek
- Profilkép és munkaképek kezelése
- Tapasztalat, specialitás, rövid szöveg és részletes leírás megjelenítése

---

## 🧰 Használt technológiák

| Technológia | Szerepe |
|---|---|
| **Node.js** | Backend futtatási környezet |
| **Express** | Webszerver és routing |
| **MySQL** | Adatbázis |
| **Handlebars (HBS)** | Szerveroldali HTML templating |
| **bcryptjs** | Jelszavak hash-elése |
| **express-session** | Session kezelés |
| **cookie-parser** | Cookie-k kezelése |
| **dotenv** | Környezeti változók betöltése |
| **mysql2** | MySQL kapcsolat Node.js-ből |
| **multer** | Fájlkezelés |
| **morgan** | HTTP request naplózás |
| **cors** | CORS támogatás |
| **Resend** | E-mail küldés |
| **Nodemon** | Fejlesztés közbeni automatikus újraindítás |

---

## 📁 Projektstruktúra

```text
Cuts & Hustle/
│
├── app.js
├── database.js
├── package.json
├── package-lock.json
├── .env
├── schema.sql
│
├── controllers/
│   ├── auth.js
│   ├── booking.js
│   ├── delete.js
│   ├── login.js
│   ├── record.js
│   └── update.js
│
├── routes/
│   ├── auth.js
│   └── pages.js
│
├── utils/
│   └── mailers.js
│
├── views/
│   ├── login.hbs
│   ├── register.hbs
│   ├── guest.hbs
│   ├── logged.hbs
│   ├── barber-dashboard.hbs
│   ├── admin-dashboard.hbs
│   ├── users.hbs
│   ├── services.hbs
│   ├── employees.hbs
│   ├── works.hbs
│   └── admin-works.hbs
│
└── public/
    ├── *.css
    ├── *.js
    └── images/
```

> A `node_modules` mappát GitHubra nem szükséges feltölteni. A csomagok a `package.json` alapján újratelepíthetők az `npm install` paranccsal.

---

## 🗄️ Adatbázis

A projekt MySQL adatbázist használ. A `schema.sql` tartalmazza az adatbázis tábláinak struktúráját és a hozzájuk tartozó adatokat.

### Főbb táblák

- **`users`** – regisztrált felhasználók, jelszóhash és szerepkör
- **`employees`** – barberek adatai, profilképei és munkaképei
- **`services`** – szolgáltatások, áraik, időtartamuk és képeik
- **`appointments`** – lefoglalt időpontok és a hozzájuk tartozó vendég-, barber- és szolgáltatásadatok

Az `appointments` tábla idegen kulcsokkal kapcsolódik az `employees` és `services` táblákhoz. Emellett egyedi kulcs védi a barber + dátum + időpont kombinációt a dupla foglalások ellen.

A felhasználók szerepkörei:

```text
customer
admin
barber
```

---

## ⚙️ Telepítés

### 1. Előfeltételek

Szükséges:

- Node.js
- npm
- MySQL Server
- Git

### 2. Repository klónozása

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

### 3. Függőségek telepítése

```bash
npm install
```

### 4. MySQL adatbázis létrehozása

Hozd létre a `barbershop` adatbázist:

```sql
CREATE DATABASE barbershop
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;
```

Ezután importáld a projektben található `schema.sql` fájlt.

Parancssorból például:

```bash
mysql -u root -p barbershop < schema.sql
```

### 5. Környezeti változók beállítása

Hozz létre egy `.env` fájlt a projekt gyökerében:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=barbershop

TRANSPORT_USER=your_email_sender
TRANSPORT_PASS=your_resend_api_key
```

A valódi jelszavakat és API-kulcsokat **ne töltsd fel GitHubra**.

Érdemes a `.env` fájlt `.gitignore`-ba helyezni:

```gitignore
node_modules/
.env
```

### 6. Alkalmazás indítása

```bash
npm start
```

A projekt a `3000`-as porton indul:

```text
http://localhost:3000
```

A kezdőoldal automatikusan a bejelentkezési oldalra irányít.

---

## 🔐 Bejelentkezési működés

Sikeres bejelentkezés után a rendszer a felhasználó `role` értéke alapján különböző felületre irányítja a felhasználót:

```text
customer → /login/logged
barber   → /login/barber-dashboard
admin    → /login/admin-dashboard
```

A session többek között a felhasználó azonosítóját, nevét, e-mail címét, telefonszámát és szerepkörét tárolja.

---

## 🌐 Főbb oldalak

| Útvonal | Funkció |
|---|---|
| `/login` | Bejelentkezés |
| `/login/register` | Regisztráció |
| `/login/guest` | Vendég nézet |
| `/login/logged` | Bejelentkezett felhasználói nézet |
| `/login/works/:id` | Barber portfólió |
| `/login/barber-dashboard` | Barber kezelőfelület |
| `/login/admin-dashboard` | Admin kezelőfelület |
| `/login/users` | Felhasználók kezelése |
| `/login/services` | Szolgáltatások kezelése |
| `/login/employees` | Barberek kezelése |
| `/login/admin-works` | Munkaképek / portfólió kezelése |

---

## 🔌 Főbb API végpontok

### Auth és felhasználókezelés

```text
POST /auth/register
POST /auth/login
GET  /auth/logout
```

### Időpontfoglalás

```text
POST /auth/booking
GET  /auth/busy-slots
```

A `/auth/busy-slots` végpont a kiválasztott barberhez és dátumhoz tartozó foglalt időpontokat adja vissza, a szolgáltatás időtartamát is figyelembe véve.

### Adminisztratív CRUD műveletek

```text
POST /auth/add-record
POST /auth/update-record
POST /auth/delete-record
```

### Képek

```text
GET /auth/get-images
```

---

## ✉️ E-mail értesítés

Sikeres időpontfoglalás után a rendszer a **Resend** szolgáltatáson keresztül e-mailt küld.

Az e-mail küldéséhez szükséges értékeket a `.env` fájlban kell megadni:

```env
TRANSPORT_USER=...
TRANSPORT_PASS=...
```

---

## 🧩 Adatkezelési logika

Az alkalmazás a frontend és a backend között HTTP kéréseken keresztül kommunikál. Az űrlapok adatai az Express route-okon keresztül jutnak el a controller réteghez, ahol a MySQL adatbázissal történik az adatkezelés.

A rendszer több helyen paraméterezett SQL lekérdezéseket használ, például a felhasználók keresésénél és az időpontfoglalásnál.

A barber- és szolgáltatásképek kezelésére a projekt kétféle megoldást is kezel: fájlútvonalak, illetve adatbázisból érkező bináris adatok megjelenítését.

---

## 🎓 A projekt célja

A projekt célja egy működő, többfelhasználós barbershop rendszer elkészítése, amelyben a vendégek online időpontot foglalhatnak, a barberek megtekinthetik a saját foglalásaikat, az adminisztrátor pedig kezelheti a rendszer főbb adatait.

A projekt a webfejlesztés több területét kapcsolja össze:

- frontend megjelenítés
- backend fejlesztés
- REST-szerű végpontok
- adatbázis-kezelés
- session alapú hitelesítés
- jelszóhash-elés
- képek kezelése
- e-mail küldés

---

## 🚀 További fejlesztési lehetőségek

A projekt továbbfejleszthető például az alábbiakkal:

- részletesebb jogosultság-ellenőrzés az admin és barber végpontokon
- session cookie biztonsági beállítások finomítása
- erősebb bemeneti validáció
- CSRF-védelem
- strukturáltabb API és hibakezelés
- adminisztrációs műveletek külön jogosultság-middleware-rel
- foglalások lemondásának és módosításának kezelése
- automatikus tesztek
- produktív környezethez igazított konfiguráció

---

## 📄 Dokumentáció

A projektcsomag fejlesztői és felhasználói dokumentációt is tartalmaz a rendszer működéséről.

---

## 👨‍💻 Projekt

**Cuts & Hustle** – Barbershop webalkalmazás és időpontfoglaló rendszer.

*Készült szakmai vizsgaprojektként.*
