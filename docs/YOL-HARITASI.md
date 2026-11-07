# Yol haritası

Aşamalar ve sıra yapım sırasında birlikte güncellenir (K31). Her aşama bir "bitti" ölçütüyle kapanır.

| Aşama | İçerik | Bitti ölçütü | Durum |
|-------|--------|--------------|-------|
| 0. Kararlar | Özellikler ve arayüz soruları tek tek; repo, dokümanlar | `docs/KARARLAR.md`'de açık soru kalmadı | bitti (2026-11-07) |
| 1. Deneme | Tauri + HeroUI + xterm.js iskeleti; WKWebView'de terminal performansı | Boş pencerede çalışan bir terminal açılıyor | bitti (2026-11-07) |
| 2. Terminal çekirdeği | Bölünmüş paneller, menü ve ⌘W, kısayol altyapısı (K38), kalıcı oturum servisi (K28), proje listesi | Uygulama kapatılıp açılınca oturumlar geri geliyor | sırada |
| 3. Claude motoru | `~/.claude` okuma: oturumlar, transcript'ler, durum | Çalışan oturumlar doğru durumla listeleniyor | |
| 4. İzleme | Bildirim, token / maliyet / bağlam, alt ajan ve araç akışı | Onay bekleyen oturum bildirim gönderiyor | |
| 5. Verimlilik modülü | İpuçları, yönetici ekranları, bilgi bankası, haftalık rapor | Dört bölüm de ayarlardan açılıp kapanıyor | |
| 6. Paketleme | Ayarlar, simge, imzalı `.dmg`, güncelleme | Temiz bir Mac'e kurulup çalışıyor | |

## Çalışma şekli

- Bir çalışmada bir aşama. Kararlar `docs/KARARLAR.md`'ye yazılır.
- Her çalışan adım ayrı commit.
- Her aşama sonunda uygulama gerçekten açılıp denenir.

## Aşama 1 notları

- Denendi ve çalıştı: Türkçe karakterler, Option+Q ile `@`, `claude`, `top` ile yeniden boyutlanma, çoklu sekme.
- Çizim şimdilik DOM. WebGL WKWebView'de ayrıca denenecek (`localStorage.mc.webgl = "1"`); titreme olmazsa yalnız görünen sekmede açılır.
- Tuzak: React StrictMode bileşeni iki kez bağlar; kendi kapattığımız kabuğun çıkışı sekmeyi kapatmamalı (aksi halde sonsuz döngü).
- Çalıştırma: `source ~/.cargo/env && npm run tauri dev`.
