/* Formularz rekrutacji → n8n (Notion + powiadomienie na Discordzie) */
(function () {
  'use strict';
  var WEBHOOK = 'https://n8n.kooperatywa.online/webhook/rekrutacja-cp-5b9e27c4a1';
  var form = document.getElementById('apply-form');
  if (!form) return;
  var err = document.getElementById('f-err');
  var ok = document.getElementById('f-ok');
  var btn = document.getElementById('f-send');
  var started = Date.now();

  function fail(msg, el) {
    err.textContent = msg;
    if (el) el.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.textContent = '';
    var f = form.elements;
    if (f.website && f.website.value) return; // pułapka na boty
    if (!f.imie.value.trim()) return fail('Wpisz imię i nazwisko.', f.imie);
    var digits = f.telefon.value.replace(/\D/g, '');
    if (digits.length < 9) return fail('Wpisz numer telefonu (9 cyfr).', f.telefon);
    if (!f.miejscowosc.value.trim()) return fail('Wpisz miejscowość.', f.miejscowosc);
    if (f.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) return fail('Sprawdź adres e-mail albo zostaw to pole puste.', f.email);
    if (!f.zgoda.checked) return fail('Zaznacz zgodę na przetwarzanie danych, żebyśmy mogli oddzwonić.', f.zgoda);
    if (Date.now() - started < 2500) return fail('Chwileczkę, spróbuj jeszcze raz za moment.');

    var body = new URLSearchParams();
    new FormData(form).forEach(function (v, k) { body.append(k, String(v)); });
    body.set('strona', location.href.split('#')[0]);
    btn.disabled = true;
    var label = btn.firstChild.textContent;
    btn.firstChild.textContent = 'Wysyłam… ';
    fetch(WEBHOOK, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        form.hidden = true;
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        btn.disabled = false;
        btn.firstChild.textContent = label;
        fail('Nie udało się wysłać. Sprawdź internet i spróbuj jeszcze raz.');
      });
  });
})();
