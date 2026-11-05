# Plan pastrimi dhe ofertë me shkrim: shablloni

The website promises: **"Plan pastrimi dhe ofertë me shkrim, pa pagesë."** This file is how
Arbri fulfils that promise by hand, after the assessment (phone call, optional photos or a
visit). The website never says the plan is generated automatically, so it must be sent by a
person, with real values. Never send a plan with an unfilled `[…]`.

How to use: copy the Albanian block below into WhatsApp (or email), fill every line that applies,
delete lines that don't apply. Keep the indicative amount and the confirmed total separate.

---

## Before you write it: checklist

- [ ] Service is clear: pastrim me themel / gjeneral / pas ndërtimit / divane / vila / biznes.
- [ ] Property basics known: m², rooms, bathrooms, floors; occupied, empty or after works.
- [ ] Zone known. Outside Tirana: travel feasibility and any transport cost decided **before** the offer.
- [ ] Property type: apartment, house or villa. Only apartments use the 250 reference.
- [ ] Upholstery counted: how many sofas/corners, armchairs, mattresses (sizes), material, stains.
      In apartment deep cleaning, the sofa and all mattresses are included: list each one.
- [ ] After works: are works finished? Large debris removed? Which residues (dust, glue, paint, cement)?
- [ ] What the customer cares about most (their words: "kuzhina", "banja", "xhamat"…).
- [ ] Anything that changes the price compared with the indicative amount, and why.
- [ ] Realistic duration, only if you actually know it.
- [ ] Real available dates (never invent availability).
- [ ] If a visit was needed and has a cost, it was stated and agreed before the visit.

## Albanian template (send to the customer)

```
Përshëndetje [emri], ja plani i pastrimit dhe oferta për [banesën / ambientin] tuaj.

PRONA
• [X] m², [N] dhoma, [N] banjo, kati [N]
• Gjendja: [banesë ku jetohet / bosh / pas punimeve]
• Zona: [zona]

ÇFARË JU DUHET
• [me fjalët e klientit: p.sh. "kuzhina dhe banja kanë më shumë nevojë"]

PUNËT QË PËRFSHIHEN
• Kuzhina: [banakët, dollapët nga brenda, furra, frigoriferi…]
• Banja: [pllakat, dushi, lavamani, tualeti, pasqyrat…]
• Dhomat: [dyshemetë, mobiliet, dyert, kornizat, bazamentet…]
• Xhamat dhe kornizat: [cilat]
• Divani dhe dyshekët (të përfshirë në pastrimin me themel të apartamentit):
  [p.sh. 1 divan 3-vendësh me pëlhurë, gjendje mesatare; 2 dyshekë dopio 160×200; 1 dyshek tek 90×200]
• Pajisjet dhe solucionet i sjellim ne.

NUK PËRFSHIHEN
• [p.sh. larja dhe hekurosja e rrobave, largimi i mbetjeve të ndërtimit, lyerja e mureve]
• [çdo gjë tjetër që sqaruam se nuk e bëjmë]

ÇMIMI
• Vlerësimi orientues që ju dhamë: [X] m² × 250 = [Y] lekë të reja   ← vetëm apartament, pastrim me themel
• Totali i konfirmuar: [Z] lekë të reja
• Pse ndryshon (nëse ndryshon): [p.sh. mbetje pas punimeve në dysheme dhe xhama / 1 kënd shtesë]
• Transporti: [përfshihet / X lekë të reja / nuk aplikohet]

KOHA
• Kohëzgjatja e parashikuar: [interval realist, vetëm nëse e dimë]
• Tharja e divanit dhe e dyshekëve: varet nga materiali dhe ajrimi; nuk thahen menjëherë.
  [Nëse ju duhen po atë ditë, e planifikojmë kështu: …]

PËRGATITJA
• Largoni nga sipërfaqet sendet personale dhe të vlefshme.
• Na tregoni për sende të brishta ose zona ku nuk duhet të prekim.
• [Pas punimeve: mbetjet e mëdha të jenë larguar para se të vijmë.]

HAPI TJETËR
Kjo ofertë nuk ju detyron të rezervoni. Nëse ju përshtatet, kemi të lirë
[data/orari A] ose [data/orari B]. Cili ju përshtatet?
```

## Rules

- The indicative amount (250 lekë të reja/m²) applies **only** to deep cleaning of an occupied
  or empty apartment. Never write it for houses, villas, offices, hotels, recurring cleaning or
  standalone upholstery.
- Don't add preparation requirements that aren't confirmed (e.g. water/electricity on site is
  still an open question for Arbri).
- After works, state the reason for any higher rate with the specific residues you saw.
- The confirmed total includes everything (transport too). No surcharge on arrival.
- Sofa and mattresses in a deep-clean package are **included**, not a "free bonus". Still list
  the quantities, sizes and materials so both sides know what "included" covers.
- No promises about instant drying, complete stain removal, disinfection, "100% ekologjik",
  insurance, guarantees, re-cleans or response times. Never describe the visit as free.
- Only real dates. A booking exists only when scope, total and date are all agreed (see
  `docs/sales-handoff.md`, "Konfirmimi i rezervimit").
- After sending: set the lead's status to `OFERTE_DERGUAR` and fill `quotedTotalLek`
  (see `docs/sales-handoff.md`, "Ndjekja e rezultateve").
