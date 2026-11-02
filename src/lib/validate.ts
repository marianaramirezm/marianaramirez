/**
 * Contact-form rules shared by the browser and any future server endpoint.
 * Field names below are the POST payload. Do not rename them without updating
 * Netlify and the provider endpoint together.
 *
 *   name, email, phone, language, interest, neighborhood, budget, message, consent
 *   bot-field  (honeypot — must be empty)
 *
 * consent must be the string "yes".
 * language, interest, budget, and neighborhood are the English values in
 * LANGUAGE_VALUES, INTEREST_VALUES, BUDGET_VALUES, and the neighborhood list.
 */

export const INTEREST_VALUES = ['Buy', 'Sell', 'Rent', 'Invest'] as const;
export const LANGUAGE_VALUES = ['English', 'Spanish'] as const;
export const BUDGET_VALUES = [
  'Prefer to discuss',
  'Under $1 million',
  '$1–2 million',
  '$2–5 million',
  '$5–10 million',
  '$10 million and above',
] as const;

export const EXTRA_NEIGHBORHOODS = ['Other', 'Not sure yet'] as const;

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  language: string;
  interest: string;
  neighborhood: string;
  budget: string;
  message: string;
  consent: boolean;
  honeypot: string;
};

export type ContactErrorCode =
  | 'name'
  | 'email'
  | 'phone'
  | 'language'
  | 'interest'
  | 'neighborhood'
  | 'budget'
  | 'message'
  | 'consent';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function contactFromFormData(data: FormData): ContactInput {
  return {
    name: String(data.get('name') ?? ''),
    email: String(data.get('email') ?? ''),
    phone: String(data.get('phone') ?? ''),
    language: String(data.get('language') ?? ''),
    interest: String(data.get('interest') ?? ''),
    neighborhood: String(data.get('neighborhood') ?? ''),
    budget: String(data.get('budget') ?? ''),
    message: String(data.get('message') ?? ''),
    consent: data.get('consent') === 'yes',
    honeypot: String(data.get('bot-field') ?? ''),
  };
}

export function validateContact(
  input: ContactInput,
  neighborhoods: readonly string[],
): Partial<Record<ContactErrorCode, true>> {
  const errors: Partial<Record<ContactErrorCode, true>> = {};
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) errors.name = true;

  const email = input.email.trim();
  if (!EMAIL.test(email) || email.length > 120) errors.email = true;

  const phone = input.phone.trim();
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15 || phone.length > 24) errors.phone = true;
  }

  if (!LANGUAGE_VALUES.includes(input.language as (typeof LANGUAGE_VALUES)[number])) {
    errors.language = true;
  }
  if (!INTEREST_VALUES.includes(input.interest as (typeof INTEREST_VALUES)[number])) {
    errors.interest = true;
  }
  if (!neighborhoods.includes(input.neighborhood)) errors.neighborhood = true;
  if (!BUDGET_VALUES.includes(input.budget as (typeof BUDGET_VALUES)[number])) {
    errors.budget = true;
  }

  const message = input.message.trim();
  if (message.length < 10 || message.length > 2000) errors.message = true;
  if (!input.consent) errors.consent = true;

  return errors;
}
