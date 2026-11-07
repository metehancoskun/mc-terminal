# Kararlar

Her karar: tarih, ne seçildi, neden. Bir karar değişirse eskisi silinmez, üstü çizilir ve yenisi eklenir.

## 2026-11-07

| # | Konu | Karar | Neden |
|---|------|-------|-------|
| K1 | Ürün tipi | Ayrı masaüstü uygulaması + VS Code köprüsü | Kendi penceresi olan bir uygulama; projeyi VS Code'da açabilir, VS Code'daki Claude oturumlarını görebilir |
| K2 | Kabuk | Tauri | Olabildiğince hafif ve optimize olması istendi; Electron elendi |
| K3 | Arayüz kütüphanesi | HeroUI v3 (React 19 + Tailwind v4) | Kesin tercih |
| K4 | Görünüm | HeroUI varsayılan teması | Ek tema işi olmadan tutarlı görünüm |
| K5 | Platform | Önce macOS, Windows sonra | Geliştirme Mac'te; Windows'a sonra taşınır |
| K6 | Desteklenen AI aracı | Şimdilik yalnız Claude Code | Codex, Gemini vb. sonra değerlendirilecek |
| K7 | v1 izleme | Canlı oturum durumu + bildirim; token / maliyet / bağlam; alt ajan + araç akışı | Seçildi |
| K8 | Görsel harita | 3 boyutlu yörünge yok; biçimi açık | Atalay's Terminal'deki örnek alınabilir ama tam beğenilmedi |
| K9 | v1 verimlilik modülü | Duruma göre ipuçları; skill / hook / MCP / `CLAUDE.md` yöneticisi; bilgi bankası; haftalık verim raporu | Hepsi seçildi |
| K10 | Genel ilke | Özellikler ayarlardan açılıp kapatılabilir, özelleştirilebilir | İstendi |
| K11 | Ad | MC Terminal (repo: `mc-terminal`) | Seçildi; `mc` (Midnight Commander) ile karışma riski bilinerek |
| K12 | Repo | GitHub, public, MIT lisansı | Seçildi |

## Açık sorular

- v1 çekirdek: sekmeli terminal + split, Claude sohbet pencereleri, kalıcı oturum, proje listesi + VS Code köprüsü. Her biri ayrıntılı anlatılıp tek tek sorulacak.
- Kalıcı oturum yöntemi: araştırmanın önerisi kendi Rust servisimiz ([TEKNIK.md](TEKNIK.md#2-kalıcı-oturum)); onay bekliyor.
- Onay bekleme sinyali için Claude Code hook'ları kurulsun mu (kullanıcının ayarına eklenir, kapatılabilir)? ([TEKNIK.md](TEKNIK.md#3-claude-code-yerel-verisi-21319))
- Arayüz soruları 2–8: ana yerleşim, yoğunluk, tema modu (koyu mod isteniyor), font, oturum kartı, dar pencerede davranış (responsive isteniyor), görsel harita.
- v1 dışı önerisi (onay bekliyor): sosyal / XP, bulut senkronu, kendi modelini çalıştırma.
