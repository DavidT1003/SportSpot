# SportSpot

Jednostavna web aplikacija za organiziranje i pronalaženje sportskih događaja.
Korisnici se registriraju, objavljuju oglase za sportske aktivnosti (sport, grad,
adresa, datum, opis) i mogu se pridružiti tuđim događajima.

## Tehnologije

- **Frontend:** Vue 3 (Vite) + Bootstrap 5
- **Backend:** Node.js + Express
- **Baza:** MongoDB (Mongoose)
- **Autentikacija:** JWT

## Funkcionalnosti

- Registracija i prijava (email + lozinka)
- Objava novog sportskog oglasa
- Pregled svih oglasa (najnoviji prvi)
- Pridruživanje događaju (brojač dolazaka)
- Uređivanje opisa vlastitog oglasa
- Brisanje vlastitog oglasa
- Odjava

## Struktura

```
SportSpot/
├── server/     # Express API + MongoDB
└── client/     # Vue 3 frontend
```

## Pokretanje

Potreban je Node.js. Aplikacija se sastoji od dva dijela koja se pokreću odvojeno
(u dva terminala).

### 1. Backend (server)

```bash
cd server
npm install
npm run dev
```

Server se pokreće na `http://localhost:5000`.
Podaci o bazi (konekcijski string, JWT ključ, port) nalaze se u `server/.env`.

### 2. Frontend (client)

```bash
cd client
npm install
npm run dev
```

Frontend se pokreće na `http://localhost:5173`.
Zahtjevi prema `/api` se automatski proxiraju na backend (port 5000).

Otvori `http://localhost:5173` u pregledniku, registriraj se i kreni.
