# AI Chat untuk sebastian.my.id

Widget chat (tombol bulat di pojok kanan bawah) yang dijawab oleh Cloudflare Workers AI (gratis, tanpa API key).

## Deploy Worker (sekali saja)

1. Daftar/login di https://dash.cloudflare.com (gratis).
2. Di komputer dengan Node.js, buka folder `ai/` lalu jalankan:
   ```
   npx wrangler login
   npx wrangler deploy
   ```
3. Hasilnya URL seperti `https://sebastian-ai.NAMAKAMU.workers.dev`.

   Tanpa terminal: Dashboard -> Workers & Pages -> Create -> Create Worker -> paste isi `worker.js`.
   Lalu Settings -> Bindings -> Add -> **Workers AI**, nama variabel `AI`.

## Sambungkan ke web

Buka `ai/chat.js`, ganti baris paling atas:
```js
var AI_ENDPOINT = 'https://sebastian-ai.NAMAKAMU.workers.dev';
```
Commit + push semua file (`ai/`, `script.js`). Selesai.

## Mengubah isi pengetahuan AI
Edit `SYSTEM_PROMPT` di `worker.js` (tambah proyek baru, info baru), lalu `npx wrangler deploy` lagi.

## Catatan
- `ALLOWED_ORIGINS` di `worker.js` membatasi domain yang boleh memakai Worker. Tambahkan domain lain jika perlu.
- Ada pembatasan 20 pesan/menit per IP.
- Kuota gratis Workers AI terbatas per hari; kalau habis, widget menampilkan pesan error sopan.
