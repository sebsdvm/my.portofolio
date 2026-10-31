/* Widget chat AI - sebastian.my.id
   Isi AI_ENDPOINT dengan URL Worker kamu setelah deploy. */
(function () {
  var AI_ENDPOINT = 'https://sebastian-ai.GANTI-DENGAN-SUBDOMAIN-KAMU.workers.dev';
  var SUGGESTIONS = ['Proyek apa saja yang pernah dibuat?', 'Sekolah di mana?', 'Cara menghubungi Sebastian?'];
  var history = [];
  var busy = false;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // Ubah URL di teks jadi link (aman: pakai textContent + node <a>)
  function render(target, text) {
    target.textContent = '';
    var re = /(https?:\/\/[^\s)]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      target.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = el('a', '', m[1]);
      a.href = m[1]; a.target = '_blank'; a.rel = 'noopener noreferrer';
      target.appendChild(a);
      last = m.index + m[1].length;
    }
    target.appendChild(document.createTextNode(text.slice(last)));
  }

  function build() {
    var fab = el('button', 'ai-fab');
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Buka chat AI');
    fab.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i>';

    var box = el('div', 'ai-box');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Chat AI Sebastian');
    box.hidden = true;

    var head = el('div', 'ai-head');
    var title = el('div', 'ai-title');
    title.innerHTML = '<span class="ai-dot"></span><span>Tanya AI Sebastian</span>';
    var close = el('button', 'ai-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Tutup chat');
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    head.append(title, close);

    var list = el('div', 'ai-list');
    list.setAttribute('aria-live', 'polite');
    var sugg = el('div', 'ai-sugg');

    var form = el('form', 'ai-form');
    var input = el('input', 'ai-input');
    input.type = 'text'; input.maxLength = 500; input.placeholder = 'Tulis pertanyaan...';
    input.autocomplete = 'off'; input.setAttribute('aria-label', 'Pesan');
    var send = el('button', 'ai-send');
    send.type = 'submit'; send.setAttribute('aria-label', 'Kirim');
    send.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    form.append(input, send);

    box.append(head, list, sugg, form);
    document.body.append(fab, box);

    function add(role, text) {
      var b = el('div', 'ai-msg ai-' + role);
      render(b, text);
      list.appendChild(b);
      list.scrollTop = list.scrollHeight;
      return b;
    }

    function ask(q) {
      q = (q || '').trim();
      if (!q || busy) return;
      busy = true; send.disabled = true; sugg.hidden = true;
      add('user', q);
      history.push({ role: 'user', content: q });
      var wait = add('bot', '');
      wait.classList.add('ai-typing');
      wait.innerHTML = '<i></i><i></i><i></i>';

      fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10) })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          wait.classList.remove('ai-typing');
          var text = res.ok && res.d.reply ? res.d.reply : (res.d.error || 'Terjadi kesalahan.');
          render(wait, text);
          if (res.ok) history.push({ role: 'assistant', content: text });
          else history.pop();
        })
        .catch(function () {
          wait.classList.remove('ai-typing');
          render(wait, 'Gagal terhubung ke AI. Coba lagi nanti.');
          history.pop();
        })
        .finally(function () {
          busy = false; send.disabled = false; list.scrollTop = list.scrollHeight; input.focus();
        });
    }

    SUGGESTIONS.forEach(function (s) {
      var c = el('button', 'ai-chip', s);
      c.type = 'button';
      c.addEventListener('click', function () { ask(s); });
      sugg.appendChild(c);
    });

    add('bot', 'Halo! Aku asisten AI Sebastian. Tanya apa saja soal proyek, sekolah, atau cara menghubunginya.');

    function toggle(open) {
      box.hidden = !open;
      fab.classList.toggle('ai-hide', open);
      if (open) setTimeout(function () { input.focus(); }, 50);
    }
    fab.addEventListener('click', function () { toggle(true); });
    close.addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) toggle(false); });
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
