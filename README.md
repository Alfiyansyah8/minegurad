# MineGuard

Dashboard pemantauan Minecraft (Java dan Bedrock) untuk deploy ke GitHub + Vercel.

## Fitur
- Cek status server, latency pengukuran API, versi, pemain online/maksimum.
- Riwayat status selama tab dashboard terbuka.
- Refresh manual dan pemantauan berkala (30 detik).
- Validasi input host/port dan penolakan alamat lokal/private.
- Tampilan responsif dark gaming.

## Batasan penting
- Vercel menjalankan dashboard/API, bukan Minecraft server.
- Status TPS/MSPT tidak tersedia dari ping status standar Minecraft. Untuk TPS nyata dibutuhkan plugin/mod dan endpoint metrik yang diamankan pada server sendiri.
- Stress-test trafik atau flood tidak disertakan. Jangan mengirim trafik berlebihan ke server. Untuk evaluasi kapasitas, gunakan staging milik sendiri, jendela uji yang disetujui, dan alat load-test yang membatasi laju serta jumlah koneksi.
- Endpoint status memakai layanan publik mcstatus.io. Jangan masukkan alamat server privat/internal.
- Ini bukan layanan mitigasi DDoS. Gunakan proteksi dari penyedia hosting, firewall, rate limit, dan layanan proteksi jaringan.

## Deploy ke Vercel
1. Buat repository GitHub baru bernama `mineguard`.
2. Upload seluruh isi folder proyek ini ke root repository.
3. Login ke Vercel, pilih **Add New → Project**, lalu import repository.
4. Framework preset: **Other**. Build command dan output directory boleh dikosongkan.
5. Klik **Deploy**.
6. Buka URL Vercel, masukkan hostname publik dan port server, lalu pilih Java atau Bedrock.

## Jalankan lokal
```bash
npm install
npm install --global vercel
vercel dev
```

## Format host
Masukkan hostname atau IPv4 publik saja, tanpa `https://`, path, atau port. Port diisi terpisah.
