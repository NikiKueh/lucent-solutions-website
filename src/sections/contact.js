import { validateInquiry } from '../contact/inquiry.js';
import { initContactMotion } from './contact-motion.js';

export function initContact() {
  const form = document.querySelector('[data-inquiry]');
  if (!form) return;
  const motion = initContactMotion(form);
  form.noValidate = true;
  const submit = form.querySelector('[type="submit"]');
  const label = form.querySelector('[data-submit-label]');
  const status = form.querySelector('[data-form-status]');
  const message = form.elements.namedItem('message');
  let attempted = false;
  let pending = false;
  let submissionId = null;

  const values = () => {
    const entries = new FormData(form);
    return { ...Object.fromEntries(entries), services: entries.getAll('services') };
  };

  function showErrors(errors) {
    form.querySelectorAll('[data-error-for]').forEach((el) => {
      const key = el.dataset.errorFor;
      el.textContent = errors[key] || '';
      el.hidden = !errors[key];
      const field = key === 'services' ? form.querySelector('.inquiry__services') : form.elements.namedItem(key);
      if (errors[key]) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      if (key === 'services') form.querySelectorAll('[name="services"]').forEach((input) => {
        input.setAttribute('aria-describedby', 'services-hint services-error');
        if (errors[key]) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      });
    });
  }

  function edited() {
    form.querySelector('[data-message-count]').textContent = `${message.value.length} / 5000`;
    if (pending) return;
    submissionId = null;
    status.hidden = true;
    submit.disabled = false;
    label.textContent = 'Anfrage senden';
    if (attempted) showErrors(validateInquiry(values()).errors);
  }
  form.addEventListener('input', edited);
  form.addEventListener('change', edited);

  document.querySelectorAll('[data-inquiry-service]').forEach((link) => {
    link.addEventListener('click', () => {
      if (pending) return;
      form.querySelectorAll('[name="services"]').forEach((input) => {
        input.checked = input.value === link.dataset.inquiryService;
        motion.select(input.value, input.checked);
      });
      edited();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    attempted = true;
    const raw = values();
    const result = validateInquiry(raw);
    showErrors(result.errors);
    if (!result.valid) {
      const key = Object.keys(result.errors)[0];
      (key === 'services' ? form.querySelector('[name="services"]') : form.elements.namedItem(key)).focus();
      return;
    }

    pending = true;
    motion.launch();
    submissionId ??= crypto.randomUUID();
    submit.disabled = true;
    label.textContent = 'Wird gesendet …';
    form.setAttribute('aria-busy', 'true');
    status.hidden = true;
    // Keep the payload stable until the server responds.
    const controls = [...form.querySelectorAll('input, textarea, select')];
    controls.forEach((control) => { control.disabled = true; });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, url: raw.url, submissionId }),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || body?.ok !== true) {
        if (body?.errors) showErrors(body.errors);
        throw new Error(response.status === 429 ? 'rate' : 'send');
      }
      status.dataset.state = 'success';
      status.textContent = 'Danke, Ihre Anfrage ist angekommen. Wir melden uns per E-Mail bei Ihnen.';
      status.hidden = false;
      label.textContent = 'Anfrage gesendet';
      attempted = false;
      status.focus({ preventScroll: true });
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.message === 'rate'
        ? 'Sie haben gerade mehrere Anfragen gesendet. Bitte warten Sie einige Minuten oder schreiben Sie uns direkt per E-Mail.'
        : 'Der Versand konnte nicht bestätigt werden. Ihre Eingaben bleiben erhalten. Versuchen Sie es erneut oder schreiben Sie uns direkt per E-Mail.';
      status.hidden = false;
      submit.disabled = false;
      label.textContent = 'Erneut senden';
      status.focus({ preventScroll: true });
    } finally {
      clearTimeout(timeout);
      controls.forEach((control) => { control.disabled = false; });
      form.removeAttribute('aria-busy');
      pending = false;
    }
  });
}
