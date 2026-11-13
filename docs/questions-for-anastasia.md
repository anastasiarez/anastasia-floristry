# Questions for Anastasia

Everything the site needs from her before launch. Agents: add new questions
here as they come up, and move answered ones to "Answered" with the answer and
date. Never fill a site fact from a guess; it waits here until she confirms.

Ukrainian version for sending to her is at the bottom.

## Open

### Photos (the biggest gap: every photo on the full site is a stand-in)

- [ ] 1 wide, high-quality photo for the top of each page (6 total: home,
      about, services, portfolio, contact, plus the call-to-action band).
- [ ] A portrait of her for the About page.
- [ ] 2 or 3 real weddings for the Portfolio, 3 or more photos each, with the
      venue name, area and season for each, and confirmation the couple agreed
      to be shown.
- [ ] One photo for each package (Signature Weddings, Intimate Celebrations).
- [ ] Original files, not Instagram exports (those are too small).

Sizes: `docs/photo-brief.md`. She drops originals into `incoming/`.

### Facts the site currently states (must be confirmed or corrected)

- [ ] "More than 150 weddings" (About, FAQ). True?
- [ ] "Since 2019" (footer copyright year). True?
- [ ] Home city. The site assumes Brantford.
- [ ] Public email: `hello@anastasiafloristry.com` or her Gmail? Show a phone
      number, yes or no?
- [ ] Prices still current? $5,000 to $6,500 (70 to 80 guests), $6,500 to
      $7,500 (80 to 100), $7,500 to $9,500+ (100 to 125), $5,000 minimum.
- [ ] "We reply within two business days."
- [ ] "Local growers wherever the season allows."
- [ ] "Arrangements are composted or rehomed after the event."
- [ ] "We avoid single-use floral foam."
- [ ] Booking process: enquiry, call, written proposal, signed agreement and
      deposit. Correct?
- [ ] "Dates book up well ahead, particularly through summer and early
      autumn." True for her?

### Content only she can give

- [ ] 2 or 3 real client quotes, with permission to publish and the name to
      show.
- [ ] Approve the About story (drafted from her old site): rural Ukraine,
      gardens, corporate career, then floristry.

### Setup only she (or Oleh) can do

- [ ] Contact form email: set `RESEND_API_KEY` and `RESEND_FROM` in the Vercel
      project settings (probably not set yet), then send one real test
      enquiry. Until then the form shows "not configured" and logs enquiries
      on the server only. Launch blocker.

### Decisions

- [ ] Brand book says her main clients are wedding planners; the site talks to
      couples. Keep it for couples, or add a section for planners?
- [ ] Enquiries currently go to `floweryoursoul@gmail.com`. Move to an inbox
      on the new domain?

### Price calculator (she wants one on the site soon)

- [ ] What should a visitor enter? For example guest count, package, date or
      season, venue area, ceremony installation yes or no, number of tables.
- [ ] How does each input change the price? A simple rule per input is enough
      (for example "+$X per table above Y").
- [ ] Is Intimate Celebrations priced separately? The price guide currently
      covers full-service weddings only.
- [ ] Should the result be a range ("$6,500 to $7,500") or a "from" price?
- [ ] Should the calculator send the result with the enquiry form?

## Answered

(none yet)

---

## Українською (для надсилання)

**Фото** (зараз на сайті всі фото тимчасові):
- 1 широке якісне фото для верху кожної сторінки (6 штук).
- Твій портрет для сторінки «Про мене».
- 2–3 справжні весілля для портфоліо, по 3+ фото, з назвою локації, регіоном і сезоном. Чи погодились пари, щоб їх показували?
- По одному фото для кожного пакету (Signature Weddings, Intimate Celebrations).
- Оригінали файлів, не з Instagram (там замалі).

**Підтверди або виправ, що зараз написано на сайті:**
1. «Понад 150 весіль». Це правда?
2. «З 2019 року». Правильно?
3. Твоє місто. Зараз вказано Brantford.
4. Публічна пошта: hello@anastasiafloristry.com чи твій Gmail? Показувати телефон?
5. Ціни актуальні? $5,000–6,500 (70–80 гостей), $6,500–7,500 (80–100), $7,500–9,500+ (100–125), мінімум $5,000.
6. «Відповідаємо протягом двох робочих днів».
7. «Місцеві фермери, коли дозволяє сезон».
8. «Композиції компостуються або передаються далі після події».
9. «Не використовуємо одноразову флористичну губку».
10. Процес: заявка, дзвінок, письмова пропозиція, договір і завдаток. Так?
11. «Дати бронюються заздалегідь, особливо влітку та на початку осені». Так?

**Тільки ти можеш дати:**
- 2–3 справжні відгуки клієнтів, з дозволом і іменем.
- Затвердити історію «Про мене» (село в Україні, сади, корпоративна робота, потім флористика).

**Калькулятор ціни** (ти хотіла його на сайт):
- Що відвідувач має вводити? Наприклад: кількість гостей, пакет, дата/сезон, район локації, церемоніальна інсталяція так/ні, кількість столів.
- Як кожен пункт змінює ціну? Достатньо простого правила (напр. «+$X за кожен стіл понад Y»).
- Чи має Intimate Celebrations окрему ціну? Зараз прайс показує лише повний весільний сервіс.
- Результат показувати діапазоном («$6,500–7,500») чи «від $X»?
- Надсилати результат разом із заявкою?

**Рішення:**
- У брендбуку головні клієнти це весільні планувальники, а сайт говорить до пар. Залишаємо для пар чи додаємо розділ для планувальників?
- Заявки зараз приходять на floweryoursoul@gmail.com. Перенести на пошту нового домену?
