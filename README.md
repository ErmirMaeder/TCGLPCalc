# Yu-Gi-Oh Lebenspunktezähler (TCGLPCalc)

Eine Progressive Web App (PWA) für zwei Spieler, um Lebenspunkte (LP) während eines Yu-Gi-Oh-Duells zu tracken. Läuft komplett im Browser, keine Backend-Abhängigkeit, ein einziges `index.html` (HTML/CSS/JS in einer Datei, kein Build-Schritt nötig).

**Live-Repo:** `github.com/ermirmaeder/TCGLPCalc`
**Live-URL:** `https://ermirmaeder.github.io/TCGLPCalc/`

## Projektziel

Eine physische Duell-Mat-ähnliche App: zwei Spieler sitzen sich gegenüber (Handy liegt flach zwischen ihnen), oberer Spieler sieht seine Anzeige automatisch um 180° gedreht, damit er sie von seiner Seite aus richtig herum lesen kann. Master-Duel-inspiriertes visuelles Design (dunkler Hintergrund, Rot für Spieler oben, Blau für Spieler unten, Orbitron/Rajdhani-Schriftarten).

## Dateistruktur (aktueller Stand des Repos)

```
TCGLPCalc/
├── index.html          ← Die komplette App (HTML+CSS+JS in einer Datei)
├── manifest.json        ← PWA-Manifest ("Zum Home-Bildschirm hinzufügen")
├── favicon-32.png        ← Browser-Tab-Icon
├── icon-180.png          ← iOS Home-Bildschirm-Icon
├── icon-192.png          ← Android Home-Bildschirm-Icon
├── icon-512.png          ← Große Auflösung für PWA/Android
└── audio/
    └── letsduel.mp3      ← Eigene Hintergrundmusik des Nutzers (loop)
```

## Implementierte Features

1. **LP-Zähler für 2 Spieler**
   - Start-LP wählbar: 8000 / 4000 / 2000 (Speed Duel) / 16000
   - Schnellwahl-Buttons: ±50 / ±100 / ±500 / ±1000
   - Eigener Betrag über ein selbstgebautes Zahlen-Tastenfeld (0–9, Löschen, Rückschritt, "− Abziehen" / "+ Hinzufügen") — bewusst **kein natives Zahlen-Keyboard**, damit es sich für den oberen (gespiegelten) Spieler ebenfalls um 180° drehen lässt (native OS-Tastaturen lassen sich nicht mitdrehen).
   - Lebensbalken pro Spieler, färbt sich bei kritisch niedrigen LP (≤15 % vom Start-LP) intensiver rot/blau.

2. **3D-Würfel** (echtes CSS-3D-Objekt, `transform-style: preserve-3d`)
   - 6 Seiten mit echten Würfelpunkten, gegenüberliegende Seiten ergeben 7 (wie ein echter Würfel).
   - Rollt über mehrere Achsen (X und Y) mit zufälligen vollen Umdrehungen, landet korrekt auf dem Ergebnis.

3. **3D-Münze** (echtes CSS-3D-Objekt mit echter Kanten-Geometrie)
   - Vorderseite "KOPF" / Rückseite "ZAHL", Farben passend zum Rot/Blau-Duell-Theme.
   - Echter Münzrand (32 einzelne Segmente, geometrisch korrekt um den tatsächlichen Umfang berechnet – **wichtig:** das war ein mehrfacher Debugging-Prozess, siehe Hinweise unten).
   - Wurfbewegung: rotiert um die horizontale Achse (echtes Kippen/Tumbeln wie ein realer Münzwurf, nicht wie ein Rad) **und** springt sichtbar nach oben, bevor sie zurückfällt (kombinierte `rotateX` + `translateY`-Keyframe-Animation).

4. **Bildschirm wach halten (Wake Lock)**
   - Button (☀/🔒) in der mittleren Button-Leiste, per Klick an/aus umschaltbar (kein automatisches Folgen einer Systemeinstellung mehr, sondern manuell per Button gesteuert – das war explizit gewünscht, nachdem die automatische Erkennung auf iOS unzuverlässig war).
   - Zusätzlicher Fallback: ein unsichtbares, selbst erzeugtes (schwarzes) Loop-Video hält den Bildschirm auf älteren/inkompatiblen Browsern zusätzlich wach.
   - **Bekannte Grenze:** iOS im "Zum Home-Bildschirm hinzufügen"-Standalone-Modus hat einen WebKit-Bug, bei dem die Wake-Lock-API teils komplett ignoriert wird. Das lässt sich von der Webseite aus nicht zuverlässig umgehen – einzige 100%ige Lösung ist die iPhone-Systemeinstellung "Automatische Sperre → Nie".

5. **Hintergrundmusik**
   - Eigene Audiodatei des Nutzers (`audio/letsduel.mp3`), Endlos-Loop.
   - Mute-Button (🔈/🔇) in der Button-Leiste. Startet **standardmäßig aus** und beginnt bei jeder Aktivierung wieder von vorne (`currentTime = 0`), das war explizit so gewünscht.
   - **Wichtig — technischer Kniff:** Die Musik läuft über ein `<video>`-Element (nicht `<audio>`), weil Safari auf iPhone bei reinen `<audio>`-Elementen den physischen Stumm-Schalter respektiert (kein Ton, wenn der Schalter auf lautlos steht) — bei `<video>`-Elementen wird der Schalter ignoriert.
   - **Debugging-Historie:** Es gab mehrere 404-Fehler, weil der Datei-Pfad im Code nicht exakt mit dem tatsächlichen Speicherort/Namen im Repo übereinstimmte. **Faustregel für die Zukunft:** Pfad in `index.html` (`<video id="bgMusic" src="...">`) muss exakt (inkl. Groß-/Kleinschreibung) mit dem echten Pfad der Datei im Repo übereinstimmen.

6. **Splash-/Intro-Screen**
   - Rotierender Beschwörungskreis (CSS-Ringe + Glyphen-Punkte), 3 Sekunden Anzeige, danach automatisches Ausblenden oder durch Antippen überspringbar.
   - Titel "YU-GI-OH" fix, Untertitel "Lebenspunktezähler" wird automatisch je nach Gerätesprache übersetzt (`navigator.language`) — Deutsch, Englisch, Französisch, Spanisch, Italienisch, Portugiesisch, Niederländisch, Polnisch, Türkisch, Russisch, Japanisch, Koreanisch, Chinesisch, Fallback Englisch.

7. **Responsive Design + manueller Layout-Wechsel**
   - Hochformat (Standard): Spieler oben/unten, oberer Spieler um 180° gedreht.
   - Querformat-Layout verfügbar: Spieler links/rechts (links = ursprünglich "oben"/Rot, rechts = ursprünglich "unten"/Blau), linker Spieler bleibt gespiegelt.
   - **Wichtig:** Das Layout folgt NICHT automatisch der Sensor-Ausrichtung des Handys — es gibt einen expliziten Button (⤢) in der Button-Leiste, der manuell zwischen Hoch- und Querformat umschaltet, unabhängig davon, wie das Handy tatsächlich gehalten wird (das war eine bewusste Design-Entscheidung nach Rücksprache).
   - Auf Tablets/Desktop (≥720px breit, ≥640px hoch) wird die App als abgerundete, zentrierte Karte mit Schatten dargestellt statt vollflächig.

8. **Eigenes App-Icon**
   - Gold/gedecktes Design, "Auge des Horus"-Motiv (antikes, gemeinfreies ägyptisches Symbol — **nicht** das geschützte "Millennium-Auge" aus dem Spiel), Buchstaben "LP", dezenter roter/blauer Glow in den Ecken.
   - Wurde komplett per Python/Pillow-Skript selbst gezeichnet (kein externes Bild), um Copyright-Probleme zu vermeiden.

## Bewusste Design-/Rechtsentscheidungen (wichtig für Weiterarbeit!)

- **Keine echten Yu-Gi-Oh-Kartenbilder, kein offizielles Logo, keine Anime-Screenshots.** Mehrfach im Projektverlauf angefragt, aber abgelehnt, da geschütztes Konami-Material. Stattdessen: eigene, stilisierte Grafiken (Drachen-Silhouetten wurden zwischenzeitlich gebaut und auf Wunsch des Nutzers später wieder entfernt, da er sie nicht schön fand).
- **Keine echte Spielmusik** (z. B. aus "Forbidden Memories") wurde eingebaut — eine hochgeladene Datei `39__Free_Duel.mp3` wurde erkannt und abgelehnt. Die aktuell verwendete `letsduel.mp3` wurde vom Nutzer als eigene Musik deklariert.

## Nicht umgesetzte Ideen (bewusst verworfen oder nur als Entwurf)

- **Apple-Human-Interface-Guidelines-Redesign:** Ein Mockup wurde gezeigt (große Titelzeile, gruppierte Listen, SF-Symbol-artige Icons), der Nutzer wollte das aber explizit **nicht** — aktuelles Master-Duel-Design bleibt bestehen.
- **Vereinfachtes Zahlenfeld-Layout** (1 Zahlenblock + großer "−"/"+" statt der 8 Preset-Buttons, bzw. später ein Ziffernblock im Layout `123/456/789/-0+`): wurde einmal versehentlich in die echte App gebaut, dann auf Wunsch des Nutzers wieder zurückgesetzt. Falls das Thema nochmal aufkommt, nicht ungefragt in `index.html` übernehmen.

## Offene Punkte / mögliche nächste Schritte

- Musik-Wiedergabe: zuletzt am 404-Pfadproblem gearbeitet, sollte nach dem letzten Fix (`audio/letsduel.mp3`, `<video>`-Tag) funktionieren.
- Wake Lock im iOS-Standalone-Modus bleibt technisch limitiert (siehe oben) — evtl. lohnt sich ein Hinweistext in der App selbst, der Nutzer auf die iPhone-Einstellung hinweist, falls der Button nicht zuverlässig hilft.
- Kein Backspace/Clear mehr im ursprünglichen Zahlen-Tastenfeld-Layout wurde NICHT verworfen (das Zahlenfeld mit 1-9/C/0/⌫ + separaten Minus/Plus-Buttons ist weiterhin aktiv in der App).

## Technische Hinweise für Claude Code

- Alles ist Vanilla JS, kein Framework, keine Build-Tools, kein `npm install` nötig — einfach die Dateien direkt im Ordner öffnen/bearbeiten.
- Icons wurden mit Python (Pillow) generiert, das Skript selbst liegt nicht im Repo (nur die fertigen PNGs) — bei Wunsch nach neuem Icon-Design am besten neu aufsetzen.
- Responsive CSS nutzt `clamp()` und Media Queries für verschiedene Bildschirmgrößen, `dvh`/`--vh`-Trick für mobile Adressleisten-Probleme.
