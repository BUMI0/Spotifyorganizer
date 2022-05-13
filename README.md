# Projekt „Spotifyorganizer“

## Über das Projekt:
Unsere Gruppe, also Isabel Norpoth, Veronika Svientik, Djibril Chehab und Tim Kanbur haben es uns zur Aufgabe gemacht, das Web Engineering Projekt für eine sinnvolle Anwendung zu nutzen, die uns und andere auch über das Studium hinaus helfen kann.

Unser Projekt soll sich auf das Management von Spotify Playlists fokussieren. Wir möchten eine Oberfläche schaffen, in welcher man einfach Songs zu seiner Spotifyplaylist hinzufügt oder diese ändert. Eine unkomplizierte und intuitive Navigation durch die eigenen Playlists. Eventuell noch eine Sortierfunktion, die viel mehr Funktionalität bietet, statt einfach nach „zuletzt Hinzugefügt“, „Titel“ oder „benutzerdefinierte Reihenfolge“ zu sortieren. Dieses Tool kann dann dafür genutzt werden, die eigenen Spotify Playlists effizient zu verwalten und eine eigene Reihenfolge festzulegen, ohne jeden Song einzeln an die richtige Stelle ziehen zu müssen.

Das Backend wird mit Node.js und das Frontend mit React realisiert. Eine Authentisierung wird hierbei durch den eigenen Spotify Account gewährleistet. Ein angebundenes Benutzerkontensystem wird gegebenenfalls auch realisiert. Um dieses persistent zu gestalten, benutzen wir im Backend eine MongoDB. 

## Warum haben wir uns für diese Projektidee entschieden:
Musik gehört mittlerweile zu dem Alltag der meisten Menschen. In der heutigen Zeit ist es einfacher denn je, Musik zu konsumieren. Während man früher einen tragbaren CD oder Kassettenspieler mitnehmen musste, um auch unterwegs Musik zu hören, reicht heute im Zeitalter des Internets ein einfaches Handy und eine App. Hierfür muss man nicht mal mehr die Datei der Musik irgendwo gespeichert haben, sondern kann über den Internetzugang des Gerätes beinahe jeden Song aus jeder Epoche hören. 
Spotify hat (laut Statista) im 1. Quartal 2021 mit 32% den größten Marktanteil an zahlenden Abonnenten, und liegt damit weit vor dem zweiten Platz Apple Music mit 16%. Und diesen Abstand merkt man auch gewaltig. Die meisten in unserem Umfeld zahlen monatlich für Spotify oder haben zumindest das Gratismodell von Spotify. Ob bei einem Treffen mit Freunden, auf dem Weg zur Uni oder beim Lernen. Spotify ist bei den meisten ein fester Bestandteil in ihrem Alltag. Obwohl Spotify einen so großen Einfluss hat, fehlen unserer Ansicht nach manchmal wichtige Bestandteile in der Benutzeroberfläche und dem Backend. Die Suche von Songs ist in Spotify zwar möglich, jedoch wirkt diese recht unübersichtlich und hat bei einigen Liedern Probleme, das gesuchte Ergebnis auch als erstes anzuzeigen. Möchte man zum Beispiel einen Remix eines Liedes hören, reicht eine einfache Suche oft nicht aus. Hierfür muss man dann auf den Künstler gehen und dort nach dem Remix suchen. Neben der Suche in Spotify selber ist aber auch die Organisation von Playlists oft sehr schwer. Möchte man zum Beispiel ein Lied zu einer Playlist hinzufügen, muss man erst einen Rechtsklick auf einen Song machen, dann in einer meist endlosen Liste der eigenen Playlists die gewünschte davon finden und kann dann erst den Song hinzufügen. Die Nachricht der Oberfläche, dass das ausgewählte Lied „Zur Playlist hinzugefügt“ wurde, bringt dem Benutzer als Feedback gar nichts. Denn ob es jetzt zu der richtigen aus tausenden anderen hinzugefügt wurde, muss man manuell nachschauen. Jetzt ist es aber natürlich nur der Fall für ein einziges Lied. Will man jetzt eine Playlist mit 30 Liedern zusammenstellen, kann man auch 30 mal diese umständliche Auswahl durchführen. Wenigstens hat man dann mit etwas Glück immer die richtige Playlist ausgewählt und hat keinen Sommerhit in seine Klassikplaylist hinzugefügt. Eigentlich gängige Features wie Mehrfachauswahl, (einfache) Ergebnisfilterung nach Genre oder Künstler und ähnliches fehlen völlig oder sind sehr unintuitiv in irgendwelchen Untermenüs. Aus diesem Grund wollen wir ein einfaches Tool entwickeln, welches den genannten Problemen vorbeugen soll.
