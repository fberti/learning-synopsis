// L1.1 – Az Arduino mint elektroszkóp
// Elektromosságtan és digitális elektronika, 1. fejezet (Synopsis)
//
// Az A0 lábra csak egy hosszú jumperkábel van kötve ("antenna"), más semmi.
// A sketch két görbét küld a soros plotternek:
//   nyers – egyetlen mérés (látszik rajta a hálózat 50 Hz-es "zümmögése")
//   atlag – 20 ms-on, azaz egy teljes hálózati perióduson át átlagolt érték
// Biztonság: a feltöltött fésűt ne érintsd az antennához és a lábakhoz (ESD)!

const int ANTENNA = A0;          // melyik lábat olvassuk

void setup() {
  Serial.begin(115200);          // a soros plotterben is 115200 baudot válassz!
}

void loop() {
  int nyers = analogRead(ANTENNA);       // egyetlen mérés: 0 ... 1023

  long osszeg = 0;                       // 20 ms-ig mérünk és összeadunk
  int db = 0;
  unsigned long kezdet = millis();
  while (millis() - kezdet < 20) {
    osszeg += analogRead(ANTENNA);
    db++;
  }

  Serial.print("nyers:");                // "név:érték" formában a plotter
  Serial.print(nyers);                   // jelmagyarázatot is rajzol
  Serial.print(",atlag:");
  Serial.println(osszeg / db);
}
