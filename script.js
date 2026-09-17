/* Gerson Breno — interações da página.
   Regra que segui aqui: animação só quando o usuário pede,
   fora o único momento de entrada da capa. */

(function () {
  'use strict';

  /* --- entrada da capa: dispara uma vez, no carregamento --- */
  requestAnimationFrame(function () {
    document.body.classList.add('carregado');
  });

  /* --- menu no celular --- */
  var botao = document.getElementById('abrirMenu');
  var menu = document.getElementById('menu');

  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', String(aberto));
      botao.querySelector('.sr').textContent = aberto ? 'Fechar menu' : 'Abrir menu';
    });

    // fecha ao escolher um destino
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && menu.classList.contains('aberto')) {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.focus();
      }
    });
  }

  /* --- marca no menu a seção que está na tela --- */
  var secoes = document.querySelectorAll('main section[id]');
  var links = {};

  document.querySelectorAll('.menu a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && secoes.length) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        var link = links[entrada.target.id];
        if (!link) return;
        if (entrada.isIntersecting) {
          Object.keys(links).forEach(function (id) { links[id].classList.remove('atual'); });
          link.classList.add('atual');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secoes.forEach(function (s) { observador.observe(s); });
  }

  /* --- copiar e-mail --- */
  var copiar = document.getElementById('copiarEmail');

  if (copiar) {
    copiar.addEventListener('click', function () {
      var email = 'gersonfagundes2016@gmail.com';
      var original = 'Copiar e-mail';

      function avisar(texto) {
        copiar.textContent = texto;
        setTimeout(function () { copiar.textContent = original; }, 2200);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(function () { avisar('E-mail copiado'); })
          .catch(function () { avisar('Não copiou — selecione o endereço acima'); });
      } else {
        var campo = document.createElement('textarea');
        campo.value = email;
        campo.setAttribute('readonly', '');
        campo.style.position = 'absolute';
        campo.style.left = '-9999px';
        document.body.appendChild(campo);
        campo.select();
        try {
          document.execCommand('copy');
          avisar('E-mail copiado');
        } catch (err) {
          avisar('Não copiou — selecione o endereço acima');
        }
        document.body.removeChild(campo);
      }
    });
  }

  /* --- só uma dúvida aberta por vez (para navegadores sem suporte a name em details) --- */
  var perguntas = document.querySelectorAll('.duvidas details');
  var suportaGrupo = 'name' in document.createElement('details');

  if (!suportaGrupo) {
    perguntas.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        perguntas.forEach(function (outro) {
          if (outro !== item) outro.open = false;
        });
      });
    });
  }

  /* --- ano do rodapé --- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();