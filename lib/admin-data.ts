import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type ClientLinkInput = {
  id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  style?: 'compact' | 'artwork';
  isActive?: boolean;
};

export type ClientPixInput = {
  id?: string;
  title: string;
  pixKey: string;
  amount?: number | null;
  description?: string;
  isActive?: boolean;
};

export type ClientPayload = {
  name: string;
  slug: string;
  title?: string;
  description?: string;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  fontFamily?: string;
  logo?: string;
  headerImage?: string;
  showBranding?: boolean;
  clientEmail?: string;
  clientPassword?: string;
  links?: ClientLinkInput[];
  pixQRCodes?: ClientPixInput[];
};

export function normalizeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function optionalText(value: unknown, max = 1500) {
  const result = text(value, max);
  return result || null;
}

function color(value: unknown, fallback: string) {
  const result = text(value, 20);
  return /^#[0-9a-fA-F]{6}$/.test(result) ? result : fallback;
}

function normalizeUrl(value: unknown) {
  const raw = text(value, 1200);
  if (!raw) return '';
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(normalized).toString();
  } catch {
    return '';
  }
}

function normalizeEmail(value: unknown) {
  const email = text(value, 180).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

export function parseClientPayload(body: any): ClientPayload {
  const name = text(body?.name, 120);
  const slug = normalizeSlug(text(body?.slug || name, 120));

  if (!name) throw new Error('Informe o nome do cliente.');
  if (!slug) throw new Error('Informe um endereço válido.');

  const links = Array.isArray(body?.links)
    ? body.links
        .map((item: any) => ({
          id: text(item?.id, 80) || undefined,
          title: text(item?.title, 120),
          url: normalizeUrl(item?.url),
          description: optionalText(item?.description, 300) || undefined,
          icon: normalizeUrl(item?.icon) || undefined,
          style: item?.style === 'artwork' ? 'artwork' : 'compact',
          isActive: item?.isActive !== false,
        }))
        .filter((item: ClientLinkInput) => item.title && item.url)
    : [];

  const pixQRCodes = Array.isArray(body?.pixQRCodes)
    ? body.pixQRCodes
        .map((item: any) => ({
          id: text(item?.id, 80) || undefined,
          title: text(item?.title, 120) || 'Pagar com Pix',
          pixKey: text(item?.pixKey, 180),
          amount:
            item?.amount === '' || item?.amount === null || item?.amount === undefined
              ? null
              : Number(item.amount),
          description: optionalText(item?.description, 300) || undefined,
          isActive: item?.isActive !== false,
        }))
        .filter((item: ClientPixInput) => item.pixKey)
        .map((item: ClientPixInput) => ({
          ...item,
          amount: Number.isFinite(item.amount) ? item.amount : null,
        }))
    : [];

  return {
    name,
    slug,
    title: optionalText(body?.title, 180) || undefined,
    description: optionalText(body?.description, 1200) || undefined,
    theme: ['modern', 'dark', 'minimal', 'vibrant'].includes(text(body?.theme, 30))
      ? text(body?.theme, 30)
      : 'modern',
    primaryColor: color(body?.primaryColor, '#EF232A'),
    secondaryColor: color(body?.secondaryColor, '#111111'),
    backgroundColor: color(body?.backgroundColor, '#FFFFFF'),
    backgroundImage: normalizeUrl(body?.backgroundImage) || undefined,
    fontFamily: text(body?.fontFamily, 80) || 'Tecna',
    logo: normalizeUrl(body?.logo) || undefined,
    headerImage: normalizeUrl(body?.headerImage) || undefined,
    showBranding: body?.showBranding !== false,
    clientEmail: normalizeEmail(body?.clientEmail) || undefined,
    clientPassword: text(body?.clientPassword, 200) || undefined,
    links,
    pixQRCodes,
  };
}

export function workspaceFields(payload: ClientPayload) {
  return {
    name: payload.name,
    slug: payload.slug,
    title: payload.title,
    description: payload.description,
    theme: payload.theme,
    primaryColor: payload.primaryColor,
    secondaryColor: payload.secondaryColor,
    backgroundColor: payload.backgroundColor,
    backgroundImage: payload.backgroundImage,
    fontFamily: payload.fontFamily,
    logo: payload.logo,
    headerImage: payload.headerImage,
    showBranding: payload.showBranding,
  };
}

export async function syncWorkspaceItems(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  payload: ClientPayload,
) {
  const links = payload.links || [];
  const retainedLinkIds = links.map((item) => item.id).filter(Boolean) as string[];
  await tx.link.deleteMany({
    where: {
      workspaceId,
      ...(retainedLinkIds.length ? { id: { notIn: retainedLinkIds } } : {}),
    },
  });

  for (const [order, link] of links.entries()) {
    const data = {
      title: link.title,
      url: link.url,
      description: link.description,
      icon: link.icon,
      style: link.style === 'artwork' ? 'artwork' : 'compact',
      isActive: link.isActive !== false,
      order,
    };

    if (link.id) {
      const existing = await tx.link.findFirst({ where: { id: link.id, workspaceId } });
      if (existing) {
        await tx.link.update({ where: { id: link.id }, data });
        continue;
      }
    }

    await tx.link.create({ data: { workspaceId, ...data } });
  }

  const pixItems = payload.pixQRCodes || [];
  const retainedPixIds = pixItems.map((item) => item.id).filter(Boolean) as string[];
  await tx.pixQRCode.deleteMany({
    where: {
      workspaceId,
      ...(retainedPixIds.length ? { id: { notIn: retainedPixIds } } : {}),
    },
  });

  for (const pix of pixItems) {
    const data = {
      title: pix.title,
      pixKey: pix.pixKey,
      amount: pix.amount ?? null,
      description: pix.description,
      isActive: pix.isActive !== false,
    };

    if (pix.id) {
      const existing = await tx.pixQRCode.findFirst({ where: { id: pix.id, workspaceId } });
      if (existing) {
        await tx.pixQRCode.update({ where: { id: pix.id }, data });
        continue;
      }
    }

    await tx.pixQRCode.create({ data: { workspaceId, ...data } });
  }
}

export async function getOrCreateAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@orbitlink.com';
  return prisma.user.upsert({
    where: { clerkId: 'orbit_local_admin' },
    update: { email, name: 'Administrador Orbit' },
    create: {
      clerkId: 'orbit_local_admin',
      email,
      name: 'Administrador Orbit',
      plan: 'premium',
    },
  });
}
