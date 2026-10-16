# Final Albanian copy for the business-first redesign

Source: the Albanian-language reviewer's reply to `prompts/05-rishikim-teksti-shqip.md`
(17 Oct 2026), plus Arbri's answers to the reviewer's open points. The final texts live in
the code (`lib/services.ts`, `lib/content.ts`, `app/page.tsx`, `app/per-biznese`,
`components/LeadForm.tsx`, `lib/whatsapp-messages.ts`); IDs below refer to the prompt.

## Reviewer's answers to P1–P5

| # | Question | Decision |
|---|---|---|
| P1 | ti / ju on the main button | **"Merrni ofertën tuaj"** (polite form, matches the rest of the site) |
| P2 | Business button | **"Merrni ofertë për biznesin tuaj"** |
| P3 | "Pastrim me themel" vs "pastrim gjeneral" | Both kept and distinguished: gjeneral = full routine clean; me themel = also built-up dirt and missed places (inside cupboards, behind furniture) |
| P4 | "Ambiente" vs "hapësira" të përbashkëta | **"Ambientet e përbashkëta"** |
| P5 | "Larje" vs "pastrim" divanesh | **"Larje divanesh"** as the service name; "pastrim" fine in descriptions |

## Arbri's answers to the reviewer's open points (17 Oct 2026)

| # | Point | Answer | Effect on copy |
|---|---|---|---|
| 1 | "Kontratë" or "marrëveshje me shkrim" | **Kontratë** | BIZ-20 uses "kontratë" |
| 2 | Weekends, same team, hotel extra staff | Every day of the week; hotels get extra staff according to demand | BIZ-10, HOME-12, EX-S-159/161 kept. Same team stays "përpiqemi … sa herë që është e mundur" (already on the live site) |
| 3 | Laundry, ironing, restocking | **No** | EX-S-024 and EX-S-059 notes removed; EX-S-068 and EX-C-034 lose the laundry sentence; the FAQ "A ofroni larje dhe hekurosje rrobash?" (EX-C-045/046) is removed |
| 4 | Lift in common areas | Only inside offices, villas, apartments; **not** apartment-block lifts | Lift removed from COM-06 |
| 5 | Upholstery process and drying | Yes, as written | UPH-08, UPH-12 (corrected version), UPH-14 used |
| 6 | Privacy line on the form | Yes | FORM-18 kept |
| 7 | "Mbi 10 vjet përvojë" for team members | Yes | GEN-06, EX-C-050 |
| 8 | Free visit for villas and larger jobs | Already confirmed 17 Oct | VIL-02, GEN-02 |

## Reviewer corrections applied

- FORM-04: "Pas ndërtimit ose rinovimit" (not "Pas pastrimit të punimeve").
- UPH-12: the cautious version ("Rezultati varet nga lloji i pëlhurës dhe i njollës…").
- FORM-22: no example number in the phone error.
- FORM-28: no "së shpejti".

## Implementation notes (where the reviewed text needed a technical adjustment)

- HOME-01: the reviewer's "Kompani pastrimi në Tiranë" is kept with the brand, as the homepage
  title has always been: "Kompani Pastrimi në Tiranë | Limoni Cleaning".
- FORM-27: the name placeholder was lost in the reply ("Faleminderit, !"); the form shows
  "Faleminderit, {emri}!".
- BIZ-20 with "kontratë": "A bëni kontratë për pastrim të rregullt? Po. Pasi biem dakord për
  ofertën, bëjmë një kontratë ku përcaktojmë çfarë përfshihet dhe sa shpesh vijmë."
- EX-S-068 without laundry: "Po, i ndërrojmë kur ka çarçafë të pastër në pronë."
- EX-C-034 without laundry: ends at "Çarçafët i ndërrojmë kur ka të pastër në pronë."
- Vila (no "Vilë" chip in FORM-04): on the villa page the form preselects the property type
  "Vilë" and leaves the cleaning type to the visitor.
