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
| K13 | Terminal | Sekmeler + bölünmüş paneller | iTerm / VS Code alışkanlığı |
| K14 | Claude sohbetleri | Varsayılan ana pencerede sekme; sekme sürüklenince ayrı pencere olur | En esnek düzen |
| K15 | Kalıcı oturum | Var, varsayılan açık (ayarlardan kapatılır) | Uygulama kapansa da Claude çalışmaya devam eder; yöntem açık soru |
| K16 | Proje listesi | Sol kenar çubuğunda; projelerin altında oturumlar; "VS Code'da aç" | Hep görünür |
| K17 | Ana yerleşim | Kenar çubuğu + ortada sekmeler + sağda detay paneli | IDE düzeni |
| K18 | Yoğunluk | Kompakt (varsayılan; ayarlardan değişir) | Ekrana çok oturum sığar |
| K19 | Tema modu | Sistemi takip eder; ayarlardan Koyu / Açık / Sistem | Koyu mod kesin, açık mod da olsun |
| K20 | Arayüz fontu | Sistem fontu (SF Pro) | İndirme yok, en hafif, Mac'e yerli |
| K21 | Terminal fontu | JetBrains Mono (varsayılan; ayarlardan değişir) | Okunaklı, uygulamayla gelir |
| K22 | Oturum kartı | Listede orta kart (başlık, durum, bağlam çubuğu); ayrıntılar (token, maliyet, alt ajanlar, son araçlar) sağdaki detay panelinde | Liste sade, detay panelde tam bilgi |
| K23 | Dar pencere | Kenar çubuğu simge şeridine küçülür | Terminal yerini korur |
| K24 | Onay bildirimi | macOS bildirimi + menü çubuğu simgesinde bekleyen sayısı | Uygulama arkadayken de görülür |
| K25 | Animasyon | Varsayılan tam; ayarlardan sade / kapalı; "azaltılmış hareket" açık Mac'te otomatik sade | Görsel deneyim öncelikli |
| K26 | Görsel harita | Devre kartı temel; daha kurumsal ve kaliteli görünüm (HeroUI kartları, renk yalnız etkinlikte, modülde mini ölçüler, ipucu, filtre) | Sabit yerleşim, sinyal izi |
| K27 | Haritada "Kaynaklar" sütunu | Skill'ler, MCP sunucuları, hook'lar, alt ajan tipleri; kullanılınca yanan modüller | Verimlilik bilgisi haritada görünür |

## Açık sorular

- Kalıcı oturum yöntemi: araştırmanın önerisi kendi Rust servisimiz ([TEKNIK.md](TEKNIK.md#2-kalıcı-oturum)); onay bekliyor.
- Onay bekleme sinyali için Claude Code hook'ları kurulsun mu (kullanıcının ayarına eklenir, kapatılabilir)? ([TEKNIK.md](TEKNIK.md#3-claude-code-yerel-verisi-21319))
- K27'ye eklenecek başka kaynak var mı? Devre kartının yeni hali için canlı örnek hazırlanacak.
- v1 dışı önerisi (onay bekliyor): sosyal / XP, bulut senkronu, kendi modelini çalıştırma.
