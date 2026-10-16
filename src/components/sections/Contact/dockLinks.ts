import { PROFILE, asset } from '@/config/site';
import type { Dictionary } from '@/content/i18n';

export interface DockLink {
  label: string;
  /** Shown under the dock while hovered. */
  detail: string;
  href: string;
  icon: string;
  external: boolean;
  /** Click copies the email instead of opening the mail client. */
  copies?: boolean;
}

export function dockLinks(t: Dictionary['contact'], copied: boolean): DockLink[] {
  return [
    {
      label: 'GitHub',
      detail: '@' + PROFILE.github.user,
      href: PROFILE.github.url,
      icon: asset('/icons/github.svg'),
      external: true,
    },
    {
      label: 'Email',
      detail: `${PROFILE.email} · ${copied ? t.copied : t.dockCopy}`,
      href: `mailto:${PROFILE.email}`,
      icon: asset('/icons/mail.svg'),
      external: false,
      copies: true,
    },
    {
      label: 'WhatsApp',
      detail: PROFILE.whatsapp.display,
      href: PROFILE.whatsapp.url,
      icon: asset('/icons/message-circle.svg'),
      external: true,
    },
    {
      label: 'Instagram',
      detail: PROFILE.instagram.display,
      href: PROFILE.instagram.url,
      icon: asset('/icons/instagram.svg'),
      external: true,
    },
  ];
}
