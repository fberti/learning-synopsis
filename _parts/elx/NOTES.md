# Elektronika – munkajegyzetek

## Források kinyerése
- `_parts/src/ED.txt` / `END.txt`: `pdftotext -layout` a könyvekből. Az ED (és valószínűleg a többi McGraw-Hill *Demystified*) szövege
  **eltolt kódolású** betűkészlettel van kiszedve. Dekódolás: `python3 -I _parts/elx/decode_ed.py ED.txt ED_dec.txt`
  (cp1252-bájt b → `288 − b`, ha b ≥ 0x80, különben `160 − b`). Az `_parts/src` tartalmát ne commitoljuk.
- A multiméter kézikönyve (`multimeter.pdf`) szkennelt: `pdftoppm -r 110 -png` → `_parts/elx/mm/p-*.png`, képként olvasható.
  NCV: a kijelzőn „Riasztás/Élő” jel, a vonalak („----”) az erős → gyenge jelet mutatják.

## Forráshibák, pontosítások (az oldalon jelölve)
- **ED 2. fejezet, „Units of charge”:** „1 C represents a moderate amount of electrical charge, something often encountered” – csak mozgó
  töltésre igaz; álló töltésként óriási (két 1 C-os töltés 1 m-ről 9·10⁹ N). → 1. fejezet, 1.1 c, `box warn` „Pontosítás a forráshoz”.
- **ED 2-1. feladat:** a két töltés szorzatát „total charge”-nak nevezi, C-ban („4 C”). A szorzat C², és nem az összes töltés. → 1.3 a buktató-doboz.
- **KIT-L1** (a TERV.md-ből): a LED „ellenállása” helyett a nyitófeszültség miatt kell az előtétellenállás – a 4. és 12. fejezetben jelölendő.

## 1. fejezet – rögzített számok
Lásd `_parts/elx/c1.py` és `_parts/el1/qcheck*`. Konvenció: számpéldákban k = 9·10⁹, e = 1,602·10⁻¹⁹ C; ESD: emberi test modell 100 pF.
