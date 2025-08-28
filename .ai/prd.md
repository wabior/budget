# Dokument wymagań produktu (PRD) - Budżet Domowy MVP

## 1. Przegląd produktu

### Nazwa produktu
Budżet Domowy MVP

### Opis produktu
Aplikacja webowa do zarządzania budżetem domowym z inteligentną funkcją AI, która automatycznie generuje listę wydatków na nowy miesiąc. Produkt rozwiązuje problem zapominania o nieregularnych wydatkach (kwartalnych, półrocznych, rocznych) poprzez analizę historycznych danych i proponowanie inteligentnych list wydatków.

### Cel produktu
Zapewnienie użytkownikom prostego i niezawodnego sposobu zarządzania budżetem domowym bez ryzyka pominięcia ważnych, nieregularnych płatności.

### Grupa docelowa
Osoby zarządzające budżetem domowym, które chcą mieć pewność, że nie zapomną o żadnych płatnościach, szczególnie tych o nieregularnej cykliczności.

### Kluczowe korzyści
- Automatyczne generowanie listy wydatków na nowy miesiąc
- Eliminacja ryzyka pominięcia nieregularnych płatności
- Prosty i intuicyjny interfejs
- Inteligentne propozycje kwot oparte na historii płatności

## 2. Problem użytkownika

### Główny problem
Zarządzanie budżetem domowym w Excelu jest angażujące i podatne na błędy. Wiele wydatków ma nieregularną cykliczność:
- Ubezpieczenie mieszkania - co rok
- Ubezpieczenie samochodu - co 6 miesięcy
- Wydatki kwartalne (np. opłaty za media)
- Wydatki miesięczne (np. raty kredytów)
- Wydatki jednorazowe

### Konkretne problemy
1. **Kopiowanie wierszy w Excelu** - łatwo zapomnieć o wydatku nie miesięcznym
2. **Brak przypomnienia** o zbliżających się płatnościach
3. **Trudność w śledzeniu** różnych cykliczności wydatków
4. **Ryzyko pominięcia** ważnych płatności
5. **Czasochłonność** ręcznego zarządzania budżetem

### Obecne rozwiązania i ich wady
- **Excel** - podatny na błędy, brak automatyzacji
- **Tradycyjne aplikacje budżetowe** - nie obsługują inteligentnego generowania list wydatków
- **Kalendarze płatności** - brak integracji z budżetem

## 3. Wymagania funkcjonalne

### System zarządzania wydatkami
- Jedna tabela wydatków, jedna tabela płatności (relacja 1:N)
- Dodawanie i modyfikacja wydatków z polami:
  - Nazwa wydatku
  - Cena (stała dla zwykłych wydatków, bazowa dla zmiennych)
  - Cykliczność (1-12 miesięcy, gdzie 1=co miesiąc, 12=co rok)
  - Data rozpoczęcia
  - Data końcowa (opcjonalna)
  - Status (aktywny, zakończony, zawieszony)
  - Notatki
  - Typ wydatku (zwykły, ratalny, zmienny)
- Architektura danych: każdy wydatek to jedna jednostka z wieloma płatnościami
- Wydatek zmienny: cena zależy od zużycia (np. rachunki za prąd), cykliczność stała
- Obsługa wydatków ratalnych:
  - Dowolna liczba rat (mogą przekraczać 12 miesięcy)
  - Automatyczne generowanie przyszłych płatności
  - Obliczanie całkowitej kwoty na podstawie liczby rat i kwoty raty
  - Data zakończenia (opcjonalna dla długoterminowych zobowiązań)

### System kont użytkowników
- Prosty system uwierzytelniania
- Pełna izolacja kont użytkowników
- Powiązanie użytkownika z wydatkami

### Funkcja "Nowy miesiąc"
- Generowanie listy wydatków na nowy miesiąc
- Dla wydatków ratalnych: automatyczne tworzenie kolejnych rat
- Analiza historii płatności i proponowanie korekt dla nadpłat/niedopłat
- Możliwość oznaczenia płatności jako zapłacone/niezapłacone

### Logika tworzenia i zarządzania miesiącami
- **Stan początkowy**: Po zalogowaniu użytkownik widzi tylko dwa przyciski: [Utwórz wydatek] i [Utwórz pierwszy miesiąc]
- **Tworzenie pierwszego miesiąca**: 
  - Użytkownik wybiera datę startową dla pierwszego miesiąca
  - System tworzy pierwszy miesiąc i wyświetla wydatki trwające w tym okresie
  - Przycisk zmienia się na [Nowy miesiąc]
- **Generowanie kolejnych miesięcy**: 
  - Kliknięcie [Nowy miesiąc] tworzy nowy miesiąc (+1 miesiąc od ostatniego istniejącego)
  - System automatycznie generuje listę wydatków dla nowego miesiąca
- **Nawigacja miesięcy**: 
  - Pojawia się dopiero po utworzeniu pierwszego miesiąca
  - Zawiera wszystkie utworzone miesiące z możliwością nawigacji
  - Maksymalnie 6 widocznych zakładek + nawigacja do starszych/nowszych

### Zarządzanie płatnościami
- Architektura: jedna wspólna tabela płatności powiązana z tabelą wydatków
- Relacja: 1 wydatek : N płatności (jeden do wielu)
- Płatności mają przypisany miesiąc (bez konkretnej daty w miesiącu)
- Widok miesięczny z podstawowymi informacjami o płatnościach
- Szczegółowy widok płatności dla każdego wydatku z pełną historią
- Obsługa nadpłat: podświetlanie pól i propozycje korekt przez AI
- Obsługa niedopłat: podświetlanie i propozycje korekt
- Edycja kwot płatności w obu widokach
- Możliwość dodawania, edycji i usuwania płatności w szczegółowym widoku

### Interfejs użytkownika
- **Stan początkowy**: Dwa główne przyciski [Utwórz wydatek] i [Utwórz pierwszy miesiąc] (dopóki nie ma wydatków)
- **Po utworzeniu pierwszego wydatku**: Pojawia się przycisk [Lista wydatków]
- **Po utworzeniu pierwszego miesiąca**: Przycisk zmienia się na [Nowy miesiąc], pojawia się nawigacja miesięcy
- Nawigacja miesięcy: maksymalnie 6 widocznych zakładek + strzałki do nawigacji
- Modal do dodawania wydatków
- Lista płatności z checkboxami (automatycznie wypełnia domyślną kwotę)
- Edycja wydatków i płatności z wszystkich miesięcy
- Lista wydatków: wszystkie wydatki z przełącznikiem wyświetlania zakończonych

## 4. Granice produktu

### Co wchodzi w zakres MVP
- Aplikacja webowa online
- Podstawowe zarządzanie wydatkami
- Funkcja AI generująca listę wydatków
- System kont użytkowników
- Zarządzanie płatnościami
- Interfejs z zakładkami miesięcy

### Co NIE wchodzi w zakres MVP
- Import i export z Excela
- Współdzielenie wydatków między kontami
- Synchronizacja między urządzeniami
- Zaawansowane raporty i analizy
- Integracje z bankami
- Aplikacja mobilna

### Ograniczenia techniczne
- Maksymalna cykliczność wydatków: 12 miesięcy (1=co miesiąc, 12=co rok)
- Wydatki ratalne: dowolna liczba rat (mogą przekraczać 12 miesięcy)
- Limit wydatków na miesiąc: 256
- Aplikacja online (brak wersji offline)
- Brak synchronizacji między urządzeniami

## 5. Historyjki użytkowników

### US-001: Rejestracja i logowanie użytkownika
**Tytuł**: Użytkownik może utworzyć konto i zalogować się do aplikacji

**Opis**: Jako nowy użytkownik chcę móc utworzyć konto w aplikacji, aby móc zarządzać swoim budżetem domowym w bezpieczny sposób.

**Kryteria akceptacji**:
- Użytkownik może utworzyć konto podając email i hasło
- Użytkownik może zalogować się używając swoich danych
- Użytkownik może wylogować się z aplikacji
- Dane użytkownika są bezpiecznie przechowywane
- Każde konto jest w pełni izolowane od innych

### US-002: Dodawanie nowego wydatku
**Tytuł**: Użytkownik może dodać nowy wydatek z określeniem jego parametrów

**Opis**: Jako zalogowany użytkownik chcę móc dodać nowy wydatek, aby śledzić swoje płatności w systemie.

**Kryteria akceptacji**:
- Użytkownik może otworzyć modal dodawania wydatku
- Użytkownik może wprowadzić nazwę wydatku (wymagane)
- Użytkownik może wprowadzić cenę wydatku (wymagane, bazowa dla zmiennych)
- Użytkownik może określić cykliczność (1-12 miesięcy, gdzie 1=co miesiąc, 12=co rok)
- Użytkownik może ustawić datę rozpoczęcia
- Użytkownik może ustawić datę końcową (opcjonalnie)
- Użytkownik może wybrać typ wydatku (zwykły, ratalny, zmienny)
- Wydatek zmienny: cena zależy od zużycia, ale cykliczność jest stała
- Użytkownik może dodać notatki (opcjonalnie)
- System waliduje wszystkie wymagane pola
- Wydatek jest zapisywany w tabeli wydatków i przypisany do użytkownika
- System automatycznie tworzy wpisy w tabeli płatności dla nowego wydatku

### US-003: Dodawanie wydatku ratalnego
**Tytuł**: Użytkownik może dodać wydatek ratalny z automatycznym generowaniem przyszłych płatności

**Opis**: Jako użytkownik chcę móc dodać wydatek ratalny, aby system automatycznie wygenerował wszystkie przyszłe płatności.

**Kryteria akceptacji**:
- Użytkownik może oznaczyć wydatek jako ratalny podczas dodawania
- Użytkownik może podać datę początkową pierwszej płatności (miesiąc)
- Użytkownik może określić liczbę rat (dowolna, może przekraczać 12 miesięcy)
- Użytkownik może podać kwotę pojedynczej raty
- System automatycznie oblicza całkowitą kwotę wydatku (liczba rat × kwota raty)
- System automatycznie generuje wszystkie przyszłe płatności jako niezapłacone
- System automatycznie oblicza datę ostatniej płatności (opcjonalna dla długoterminowych zobowiązań)
- Każda płatność ma przypisany miesiąc płatności (co miesiąc od daty początkowej)
- Wydatek ratalny jest traktowany jako jeden wydatek z wieloma płatnościami w tabeli płatności
- System tworzy wpisy w wspólnej tabeli płatności dla wydatku ratalnego

### US-004: Zarządzanie listą wydatków
**Tytuł**: Użytkownik może przeglądać i zarządzać listą wszystkich swoich wydatków

**Opis**: Jako użytkownik chcę móc zobaczyć listę wszystkich moich wydatków w jednym miejscu, aby móc je łatwo zarządzać, edytować i monitorować.

**Kryteria akceptacji**:
- **Przycisk "Lista wydatków"** pojawia się po utworzeniu pierwszego wydatku
- **Lista zawiera wszystkie wydatki użytkownika** z bazy danych
- **Przełącznik wyświetlania zakończonych wydatków**
- **Każdy wydatek wyświetla podstawowe informacje**: nazwa, cena, cykliczność, status, data rozpoczęcia
- **Użytkownik może filtrować wydatki** po statusie (aktywny, zakończony, zawieszony)
- **Użytkownik może sortować wydatki** po nazwie, cenie, dacie rozpoczęcia
- **Każdy wydatek ma przyciski akcji**: edytuj, zawieś/aktywuj, usuń
- **Lista jest responsywna** i działa poprawnie na różnych urządzeniach
- **Widok jest dostępny z głównego interfejsu** aplikacji

### US-005: Edycja istniejącego wydatku
**Tytuł**: Użytkownik może edytować parametry istniejącego wydatku

**Opis**: Jako użytkownik chcę móc edytować wydatki, aby dostosować je do zmieniających się okoliczności.

**Kryteria akceptacji**:
- Użytkownik może wybrać wydatek do edycji z listy wydatków
- Użytkownik może zmodyfikować wszystkie pola wydatku
- Użytkownik może zmienić status wydatku (aktywny, zakończony, zawieszony)
- Zmiany są zapisywane i aktualizowane w systemie
- Edycja nie wpływa na poprzednie płatności
- Edycja odbywa się przez modal podobny do dodawania wydatku

### US-006: Obsługa przypadków brzegowych cykliczności
**Tytuł**: System obsługuje wydatki o nietypowej cykliczności i przypadki brzegowe

**Opis**: Jako użytkownik chcę, aby system poprawnie obsługiwał wydatki o różnej cykliczności, nawet jeśli przekraczają standardowe limity.

**Kryteria akceptacji**:
- System obsługuje cykliczność od 1 do 12 miesięcy (1=co miesiąc, 12=co rok)
- System poprawnie oblicza miesiące następnych płatności
- System obsługuje wydatki jednorazowe (cykliczność = 0 lub data końcowa = data rozpoczęcia)
- Wydatki ratalne mogą mieć dowolną liczbę rat (mogą przekraczać 12 miesięcy)
- Płatności mają przypisany miesiąc, nie konkretną datę w miesiącu
- Przypadki brzegowe są obsługiwane bez błędów

### US-007: Stan początkowy aplikacji po zalogowaniu
**Tytuł**: Użytkownik widzi odpowiedni interfejs początkowy po zalogowaniu do aplikacji

**Opis**: Jako nowo zalogowany użytkownik chcę widzieć jasny interfejs początkowy, który pokazuje mi, co mogę zrobić w aplikacji.

**Kryteria akceptacji**:
- **Po pierwszym zalogowaniu**: Użytkownik widzi tylko dwa przyciski: [Utwórz wydatek] i [Utwórz pierwszy miesiąc]
- **Brak nawigacji miesięcy**: Interfejs nie zawiera zakładek miesięcy ani nawigacji
- **Brak listy wydatków**: Nie ma wyświetlonej listy wydatków ani miesięcy
- **Jasne instrukcje**: Interfejs jasno pokazuje, że użytkownik musi najpierw utworzyć wydatki lub pierwszy miesiąc
- **Przycisk [Utwórz wydatek]**: Pozwala na dodanie pierwszego wydatku bez konieczności tworzenia miesiąca
- **Przycisk [Utwórz pierwszy miesiąc]**: Pozwala na rozpoczęcie pracy z miesiącami
- **Stan przejściowy**: Po utworzeniu pierwszego miesiąca interfejs zmienia się na pełną funkcjonalność

### US-008: Tworzenie pierwszego miesiąca i generowanie kolejnych miesięcy
**Tytuł**: Użytkownik może utworzyć pierwszy miesiąc i generować kolejne miesiące z automatyczną listą wydatków

**Opis**: Jako użytkownik chcę móc utworzyć pierwszy miesiąc z wybraną datą startową, a następnie generować kolejne miesiące z automatycznie wygenerowaną listą wydatków.

**Kryteria akceptacji**:
- **Stan początkowy**: Użytkownik widzi przyciski [Utwórz wydatek] i [Utwórz pierwszy miesiąc] (dopóki nie ma wydatków)
- **Tworzenie pierwszego miesiąca**:
  - Użytkownik może kliknąć [Utwórz pierwszy miesiąc]
  - System wyświetla pole wyboru daty startowej dla pierwszego miesiąca
  - Po wybraniu daty system tworzy pierwszy miesiąc
  - System wyświetla wydatki trwające w tym miesiącu (jeśli istnieją)
  - Przycisk zmienia się na [Nowy miesiąc]
  - Pojawia się nawigacja miesięcy z pierwszym miesiącem
- **Generowanie kolejnych miesięcy**:
  - Użytkownik może kliknąć [Nowy miesiąc]
  - System tworzy nowy miesiąc (+1 miesiąc od ostatniego istniejącego)
  - System generuje listę wydatków na nowy miesiąc
  - Dla wydatków ratalnych: automatycznie tworzy kolejne raty
  - AI analizuje historię płatności i proponuje korekty dla nadpłat/niedopłat
  - Lista zawiera wszystkie wydatki z datą rozpoczęcia i trwania w nowym miesiącu
  - Każdy wydatek ma edytowalne pole płatności
  - Każdy wydatek ma checkbox do oznaczenia jako zapłacony
  - Po zaznaczeniu checkboxa zapłacenia, pole płatności wypełnia się domyślną kwotą
  - Jeśli pole płatności będzie miało wartość większą lub równą niż kwota, checkbox zaznacza się automatycznie
  - Użytkownik może edytować proponowane kwoty przed akceptacją

### US-009: Nawigacja między miesiącami
**Tytuł**: Użytkownik może przechodzić między różnymi miesiącami używając zakładek i nawigacji

**Opis**: Jako użytkownik chcę móc łatwo przechodzić między miesiącami, aby przeglądać historię wydatków i planować przyszłość.

**Kryteria akceptacji**:
- **Nawigacja pojawia się dopiero po utworzeniu pierwszego miesiąca**
- **Stan początkowy**: Brak nawigacji miesięcy (tylko przyciski [Utwórz wydatek] i [Utwórz pierwszy miesiąc])
- Użytkownik widzi maksymalnie 6 widocznych zakładek z miesiącami
- Użytkownik może nawigować do starszych i nowszych miesięcy za pomocą strzałek (+/- 1 miesiąc)
- Każda zakładka wyświetla odpowiedni miesiąc i rok
- Przejście między miesiącami jest płynne i szybkie
- Aktualny miesiąc jest wyraźnie oznaczony

### US-010: Zarządzanie płatnościami w widoku miesięcznym
**Tytuł**: Użytkownik może zarządzać płatnościami za wydatki w widoku miesięcznym

**Opis**: Jako użytkownik chcę móc oznaczać płatności jako zapłacone, edytować kwoty i obsługiwać nadpłaty w widoku miesięcznym.

**Kryteria akceptacji**:
- Użytkownik może oznaczyć wydatek jako zapłacony używając checkboxa (wtedy pole 'zapłacono' wypełnia się domyślną kwotą)
- Użytkownik może edytować kwotę płatności w widoku miesięcznym
- Użytkownik może przejść do szczegółowego widoku płatności dla konkretnego wydatku
- System podświetla pola przy nadpłatach i proponuje korekty przez AI
- System obsługuje niedopłaty z propozycjami korekt
- Wszystkie płatności są w wspólnej tabeli płatności (relacja 1:N z wydatkami)
- System traktuje każdy wydatek jako jedną jednostkę z wieloma płatnościami

### US-011: Szczegółowy widok płatności dla wydatku
**Tytuł**: Użytkownik może przejść do szczegółowego widoku płatności dla konkretnego wydatku

**Opis**: Jako użytkownik chcę móc przejść do szczegółowego widoku płatności dla konkretnego wydatku, aby zarządzać pełną historią płatności.

**Kryteria akceptacji**:
- Użytkownik może kliknąć na wydatek w widoku miesięcznym, aby przejść do szczegółowego widoku płatności
- W szczegółowym widoku płatności użytkownik widzi listę wszystkich płatności dla danego wydatku
- Każda płatność ma datę, kwotę, status i możliwość edycji
- Użytkownik może dodać nową płatność w szczegółowym widoku
- Użytkownik może edytować istniejące płatności (datę, kwotę, status)
- Użytkownik może usunąć płatności (z potwierdzeniem)
- Użytkownik może wrócić do widoku miesięcznego
- Widok jest dostępny z każdego miesiąca, w którym występuje dany wydatek
- Szczegółowy widok pokazuje wszystkie płatności powiązane z jednym wydatkiem
- Historia płatności jest dostępna dla każdego wydatku w formie listy z możliwością edycji

### US-012: Zawieszanie i aktywowanie wydatków
**Tytuł**: Użytkownik może zawiesić lub aktywować wydatki w zależności od sytuacji

**Opis**: Jako użytkownik chcę móc zawiesić wydatki (np. podczas wakacji kredytowych) i ponownie je aktywować.

**Kryteria akceptacji**:
- Użytkownik może zmienić status wydatku na "zawieszony" lub "zakończony"
- Zakończony = wydatek już nie występuje (np. spłacony kredyt)
- Zawieszony = wydatek tymczasowo wstrzymany (np. wakacje kredytowe, wakacje od ZUS)
- Zawieszone wydatki pojawiają się w listach nowych miesięcy (brak płatności w danym miesiącu)
- Użytkownik może ponownie aktywować zawieszone wydatki
- Statusy są wyraźnie oznaczone w interfejsie
- Zmiana statusu nie wpływa na historię poprzednich płatności

### US-013: Wyświetlanie wydatków z poprzednich miesięcy
**Tytuł**: Użytkownik może przeglądać i edytować wydatki z poprzednich miesięcy

**Opis**: Jako użytkownik chcę móc wrócić do poprzednich miesięcy, aby poprawić błędy lub dodać brakujące informacje.

**Kryteria akceptacji**:
- Użytkownik może przejść do dowolnego poprzedniego miesiąca
- Użytkownik może edytować wydatki i płatności z wszystkich miesięcy
- Edycja nie wpływa na przyszłe generowania list wydatków
- Historia zmian jest zachowana
- Poprzednie miesiące są wyraźnie oznaczone jako "przeszłe"

### US-014: Walidacja danych i obsługa błędów
**Tytuł**: System waliduje dane i wyświetla odpowiednie komunikaty błędów

**Opis**: Jako użytkownik chcę otrzymywać jasne komunikaty o błędach, aby móc je szybko poprawić.

**Kryteria akceptacji**:
- System waliduje wszystkie wymagane pola
- System wyświetla jasne komunikaty o błędach
- System zapobiega zapisaniu nieprawidłowych danych
- Walidacja obejmuje format dat, zakresy cykliczności i wymagane pola
- Komunikaty błędów są wyświetlane w odpowiednim miejscu

### US-015: Bezpieczeństwo i izolacja danych
**Tytuł**: Dane użytkowników są bezpiecznie przechowywane i w pełni izolowane

**Opis**: Jako użytkownik chcę mieć pewność, że moje dane finansowe są bezpieczne i nie są dostępne dla innych użytkowników.

**Kryteria akceptacji**:
- Każde konto użytkownika jest w pełni izolowane
- Dane są szyfrowane podczas przesyłania i przechowywania
- Użytkownik ma dostęp tylko do swoich wydatków
- Sesje użytkownika są bezpiecznie zarządzane
- System loguje próby nieautoryzowanego dostępu

### US-016: Responsywność interfejsu
**Tytuł**: Interfejs aplikacji jest responsywny i działa poprawnie na różnych urządzeniach

**Opis**: Jako użytkownik chcę, aby aplikacja działała poprawnie niezależnie od urządzenia, z którego korzystam.

**Kryteria akceptacji**:
- Interfejs dostosowuje się do różnych rozmiarów ekranów
- Aplikacja działa poprawnie na komputerach stacjonarnych i laptopach
- Elementy interfejsu są odpowiednio skalowane
- Nawigacja jest intuicyjna na wszystkich urządzeniach
- Modal i formularze są responsywne
