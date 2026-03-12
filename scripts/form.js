/* ============================================
   FORM.JS — IAP Camisetas
   Lógica de formulário + geração do link WhatsApp
   ============================================ */

'use strict';

/* =========================================
   CONFIGURAÇÃO
   ========================================= */
const WHATSAPP_NUMBER = '55XXXXXXXXXXX'; // ← Substituir pelo número real (ex: 559297001234)

const PRICES = {
  '1-pix':    74.90,
  '1-cartao': 79.90,
  '2-pix':   139.90,
  '2-cartao': 149.90, // 139.90 * 1.07 ≈ aprox., ajustar se necessário
};

/* =========================================
   INIT
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('reservaForm');
  if (!form) return;

  // Campos relevantes para recalcular o resumo
  const qtdInput      = form.querySelector('#campo-quantidade');
  const produtoSelect = form.querySelector('#campo-produto');
  const pagtoInputs   = form.querySelectorAll('input[name="pagamento"]');

  // Atualiza resumo ao mudar qualquer campo
  [qtdInput, produtoSelect].forEach(function (el) {
    if (el) el.addEventListener('input', updateSummary);
  });

  pagtoInputs.forEach(function (el) {
    el.addEventListener('change', updateSummary);
  });

  updateSummary(); // estado inicial

  // Submit → WhatsApp
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm(form)) return;

    const data    = collectFormData(form);
    const message = buildMessage(data);
    const url     = buildWhatsAppURL(message);

    window.open(url, '_blank', 'noopener,noreferrer');
  });
});


/* =========================================
   ATUALIZA RESUMO DO PEDIDO
   ========================================= */
function updateSummary() {
  const form   = document.getElementById('reservaForm');
  if (!form) return;

  const data   = collectFormData(form);
  const result = calcTotal(data);

  const elPagto = document.getElementById('summary-pagamento');
  const elTotal = document.getElementById('summary-total');
  const elDesc  = document.getElementById('summary-desconto');
  const elQtd   = document.getElementById('summary-qtd');

  if (elQtd) {
    elQtd.textContent = data.quantidade + (data.quantidade > 1 ? ' peças' : ' peça');
  }

  if (elPagto) {
    if (data.pagamento === 'Pix') {
      elPagto.textContent = 'Pix (6% de desconto)';
    } else {
      elPagto.textContent = 'Cartão de crédito (até 3x s/ juros)';
    }
  }

  if (elDesc) {
    elDesc.textContent = data.pagamento === 'Pix' ? 'Desconto aplicado' : '—';
  }

  if (elTotal) {
    elTotal.textContent = formatCurrency(result.total);
  }
}


/* =========================================
   CALCULA TOTAL
   ========================================= */
function calcTotal(data) {
  const isPix    = data.pagamento === 'Pix';
  const isKit2   = data.produto === 'Promoção Especial (2 Peças)';
  const qtd      = parseInt(data.quantidade, 10) || 1;

  let unitPrice;

  if (isKit2) {
    // Kit 2: preço fixo por kit
    const kits = Math.ceil(qtd / 2);
    const pricePerKit = isPix ? 139.90 : 149.90;
    return { total: kits * pricePerKit, unit: pricePerKit };
  } else {
    unitPrice = isPix ? 74.90 : 79.90;
    return { total: qtd * unitPrice, unit: unitPrice };
  }
}


/* =========================================
   COLETA DADOS DO FORM
   ========================================= */
function collectFormData(form) {
  const getValue = function (name) {
    const el = form.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  };

  const getRadio = function (name) {
    const checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  };

  return {
    nome:        getValue('nome'),
    whatsapp:    getValue('whatsapp'),
    produto:     getValue('produto'),
    tamanho:     getValue('tamanho'),
    quantidade:  getValue('quantidade') || '1',
    pagamento:   getRadio('pagamento') || 'Pix',
    observacoes: getValue('observacoes'),
  };
}


/* =========================================
   MONTA MENSAGEM WHATSAPP
   ========================================= */
function buildMessage(data) {
  const result = calcTotal(data);

  const lines = [
    'Olá! Quero reservar minha camiseta IAP. 👕',
    '',
    '📋 *Dados do Pedido*',
    '▸ Nome: ' + data.nome,
    '▸ Produto: ' + data.produto,
    '▸ Tamanho: ' + data.tamanho,
    '▸ Quantidade: ' + data.quantidade,
    '▸ Pagamento: ' + data.pagamento,
    '▸ Total estimado: ' + formatCurrency(result.total),
  ];

  if (data.observacoes) {
    lines.push('▸ Observações: ' + data.observacoes);
  }

  lines.push('', 'Aguardo confirmação! 🙏');

  return lines.join('\n');
}


/* =========================================
   MONTA URL WHATSAPP
   ========================================= */
function buildWhatsAppURL(message) {
  const encoded = encodeURIComponent(message);
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;
}


/* =========================================
   VALIDAÇÃO
   ========================================= */
function validateForm(form) {
  let valid = true;

  // Limpa erros anteriores
  form.querySelectorAll('.form-error').forEach(function (el) {
    el.remove();
  });
  form.querySelectorAll('.form-input--error, .form-select--error').forEach(function (el) {
    el.classList.remove('form-input--error', 'form-select--error');
  });

  const required = [
    { name: 'nome',      label: 'Nome completo' },
    { name: 'whatsapp',  label: 'WhatsApp' },
    { name: 'produto',   label: 'Produto' },
    { name: 'tamanho',   label: 'Tamanho' },
  ];

  required.forEach(function (field) {
    const el = form.querySelector('[name="' + field.name + '"]');
    if (!el) return;

    const val = el.value.trim();

    if (!val || val === '') {
      showError(el, field.label + ' é obrigatório.');
      valid = false;
    }
  });

  // Validar WhatsApp (mínimo 10 dígitos)
  const wppEl = form.querySelector('[name="whatsapp"]');
  if (wppEl && wppEl.value.trim()) {
    const digits = wppEl.value.replace(/\D/g, '');
    if (digits.length < 10) {
      showError(wppEl, 'Informe um número de WhatsApp válido.');
      valid = false;
    }
  }

  // Verificar pagamento selecionado
  const pagto = form.querySelector('input[name="pagamento"]:checked');
  if (!pagto) {
    const radioGroup = form.querySelector('.radio-group');
    if (radioGroup) {
      addErrorText(radioGroup, 'Selecione a forma de pagamento.');
    }
    valid = false;
  }

  if (!valid) {
    // Scroll para o primeiro erro
    const firstError = form.querySelector('.form-input--error, .form-select--error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
  }

  return valid;
}

function showError(el, msg) {
  el.classList.add('form-input--error');
  addErrorText(el.parentElement, msg);
}

function addErrorText(container, msg) {
  const err = document.createElement('span');
  err.className = 'form-error';
  err.textContent = msg;
  err.style.cssText = 'display:block;font-size:11px;color:#C8102E;margin-top:4px;';
  container.appendChild(err);
}


/* =========================================
   HELPERS
   ========================================= */
function formatCurrency(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

/* Máscara de telefone */
document.addEventListener('DOMContentLoaded', function () {
  const wppInput = document.querySelector('[name="whatsapp"]');
  if (!wppInput) return;

  wppInput.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    let masked = '';
    if (v.length > 0) masked = '(' + v.slice(0, 2);
    if (v.length > 2) masked += ') ' + v.slice(2, 7);
    if (v.length > 7) masked += '-' + v.slice(7, 11);

    e.target.value = masked;
  });
});


/* Estilos de erro inline (garantia) */
(function addErrorStyles() {
  const style = document.createElement('style');
  style.textContent = '.form-input--error { border-color: #C8102E !important; }';
  document.head.appendChild(style);
})();
