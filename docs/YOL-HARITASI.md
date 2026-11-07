# Yol haritası (taslak)

Taslaktır: aşamalar ve sıra, açık kararlar netleştikçe birlikte güncellenecek. Her aşama bir "bitti" ölçütüyle kapanır.

| Aşama | İçerik | Bitti ölçütü |
|-------|--------|--------------|
| 0. Kararlar | Özellikler ve arayüz soruları tek tek; repo, dokümanlar | `docs/KARARLAR.md`'de açık soru kalmadı |
| 1. Deneme | Tauri + HeroUI + xterm.js iskeleti; WKWebView'de terminal performansı | Boş pencerede çalışan bir terminal açılıyor |
| 2. Terminal çekirdeği | Sekmeler, bölünmüş paneller, kalıcı oturum, proje listesi | Uygulama kapatılıp açılınca oturumlar geri geliyor |
| 3. Claude motoru | `~/.claude` okuma: oturumlar, transcript'ler, durum | Çalışan oturumlar doğru durumla listeleniyor |
| 4. İzleme | Bildirim, token / maliyet / bağlam, alt ajan ve araç akışı | Onay bekleyen oturum bildirim gönderiyor |
| 5. Verimlilik modülü | İpuçları, yönetici ekranları, bilgi bankası, haftalık rapor | Dört bölüm de ayarlardan açılıp kapanıyor |
| 6. Paketleme | Ayarlar, simge, imzalı `.dmg`, güncelleme | Temiz bir Mac'e kurulup çalışıyor |

## Çalışma şekli

- Bir çalışmada bir aşama. Kararlar `docs/KARARLAR.md`'ye yazılır.
- Her çalışan adım ayrı commit.
- Her aşama sonunda uygulama gerçekten açılıp denenir.
