// L0.3 – Az első sketch: villogó LED és üzenet a gépnek
// Elektromosságtan és digitális elektronika, 0. fejezet (Synopsis)
//
// A beépített LED (13-as láb) fél másodpercenként vált,
// a soros monitorra / plotterre pedig egy számláló értéke megy.
// Soros monitor és plotter: 115200 baud!

int n = 0;                          // számláló

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);     // a 13-as láb kimenet lesz
  Serial.begin(115200);             // soros kapcsolat a géppel
  Serial.println("Hello, itt az Arduino!");
}

void loop() {
  digitalWrite(LED_BUILTIN, n % 2 == 0 ? HIGH : LOW);  // páros n: világít, páratlan: nem

  Serial.print("szamlalo:");        // "név:érték" – a plotter jelmagyarázata
  Serial.println(n);

  n = n + 1;
  delay(500);                       // fél másodperc szünet
}
