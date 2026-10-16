'use client';
import type { ReactNode } from 'react';
import { GitHubProvider } from './GitHubProvider';
import { IntroProvider } from './IntroProvider';
import { MotionProvider } from './MotionProvider';
import { ScrollStackProvider } from './ScrollStackProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <IntroProvider>
        <ScrollStackProvider>
          <GitHubProvider>{children}</GitHubProvider>
        </ScrollStackProvider>
      </IntroProvider>
    </MotionProvider>
  );
}
