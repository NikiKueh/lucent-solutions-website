export const SERVICES = { website: 'Website', automation: 'Automatisierung', ai: 'KI-Projekte', software: 'Software' };
export const BUDGETS = { '': 'Noch offen', under5: 'Unter 5.000 €', '5to15': '5.000 bis 15.000 €', '15to50': '15.000 bis 50.000 €', over50: 'Über 50.000 €' };
export const TIMINGS = { '': 'Noch offen', soon: 'Möglichst bald', quarter: 'In den nächsten 3 Monaten', later: 'Später in diesem Jahr', exploring: 'Erst einmal besprechen' };

export function validateInquiry(input = {}) {
  const text = (key) => typeof input[key] === 'string' ? input[key].trim() : '';
  const data = {
    services: Array.isArray(input.services) ? [...new Set(input.services)] : [],
    message: text('message'), name: text('name'), email: text('email'), company: text('company'),
    budget: text('budget'), timing: text('timing'),
  };
  const errors = {};
  if (!data.services.length || data.services.length > 4 || data.services.some((key) => typeof key !== 'string' || !Object.hasOwn(SERVICES, key))) errors.services = 'Bitte wählen Sie mindestens einen der vier Bereiche.';
  if (data.message.length < 20) errors.message = 'Beschreiben Sie Ihr Vorhaben bitte in mindestens 20 Zeichen.';
  else if (data.message.length > 5000) errors.message = 'Bitte kürzen Sie die Beschreibung auf höchstens 5000 Zeichen.';
  if (data.name.length < 2 || data.name.length > 100 || /[\r\n\x00]/.test(data.name)) errors.name = 'Bitte geben Sie Ihren Namen an (2 bis 100 Zeichen).';
  if (data.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
  if (data.company.length > 160 || /[\r\n\x00]/.test(data.company)) errors.company = 'Bitte kürzen Sie den Unternehmensnamen auf höchstens 160 Zeichen.';
  if (!Object.hasOwn(BUDGETS, data.budget)) errors.budget = 'Bitte wählen Sie einen Budgetrahmen aus der Liste.';
  if (!Object.hasOwn(TIMINGS, data.timing)) errors.timing = 'Bitte wählen Sie einen Zeitpunkt aus der Liste.';
  return { data, errors, valid: Object.keys(errors).length === 0 };
}

export function inquiryText(data) {
  return [
    'Neue Projektanfrage über die Lucent-Website', '',
    `Bereiche: ${data.services.map((key) => SERVICES[key]).join(', ')}`,
    `Name: ${data.name}`, `E-Mail: ${data.email}`, `Unternehmen: ${data.company || 'Nicht angegeben'}`,
    `Budget: ${BUDGETS[data.budget]}`, `Zeitpunkt: ${TIMINGS[data.timing]}`, '',
    'Projektbeschreibung:', data.message,
  ].join('\n');
}
