import type { Ref } from 'react';
import { PROFILE } from '@/config/site';
import type { Dictionary } from '@/content/i18n';
import { SKILL_GROUPS } from '@/content/skills';
import { Corners, type Corner } from '@/components/ui/Corners';
import { cx } from '@/lib/cx';
import text from '@/styles/text.module.css';
import styles from './IsoStack.module.css';

type HeroText = Dictionary['hero'];

interface Box {
  /** Depth index: higher floats further toward the viewer when the stack spreads. */
  z: number;
  left?: number;
  top: number;
  width: number;
  height: number;
}

type Slab =
  | (Box & { kind: 'layer'; layer: number; large?: boolean; corners: Corner[] })
  | (Box & { kind: 'skills' })
  | (Box & { kind: 'badge' });

// Bottom-up, which is also paint order. `layer` indexes t.hero.layers (0 = You … 3 = Foundations).
const SLABS: Slab[] = [
  {
    kind: 'layer',
    layer: 3,
    z: 0,
    top: 464,
    width: 520,
    height: 112,
    large: true,
    corners: ['tl', 'tr', 'bl', 'br'],
  },
  { kind: 'skills', z: 1, top: 324, width: 520, height: 128 },
  { kind: 'layer', layer: 2, z: 2, top: 216, width: 360, height: 96, corners: ['tl', 'br'] },
  { kind: 'layer', layer: 1, z: 3, top: 108, width: 360, height: 96, corners: ['tl', 'br'] },
  { kind: 'layer', layer: 0, z: 4, top: 0, width: 360, height: 96, corners: ['tl', 'br'] },
  { kind: 'badge', z: 3, left: 372, top: 0, width: 148, height: 312 },
];

interface IsoStackProps {
  ref: Ref<HTMLDivElement>;
  layers: HeroText['layers'];
  skillGroups: HeroText['skillGroups'];
}

/** The layered "how I build" diagram. Markup only: tilt and spread are driven by useIsoStack. */
export function IsoStack({ ref, layers, skillGroups }: IsoStackProps) {
  return (
    <div ref={ref} className={styles.group}>
      {SLABS.map(({ z, left = 0, top, width, height, ...slab }) => (
        <div key={slab.kind + z} data-z={z} className={styles.slab} style={{ left, top, width, height }}>
          <div className={styles.shadow} />
          {slab.kind === 'layer' && (
            <div className={cx(styles.face, styles.layerFace, slab.large && styles.layerFaceLarge)}>
              <Corners at={slab.corners} />
              <span className={styles.layerTitle}>{layers[slab.layer].title}</span>
              <span className={styles.layerText}>{layers[slab.layer].description}</span>
            </div>
          )}
          {slab.kind === 'skills' && <SkillsFace groups={skillGroups} />}
          {slab.kind === 'badge' && (
            <div className={cx(styles.face, styles.badgeFace)}>
              <Corners at={['tr', 'bl']} />
              <span className={styles.badgeMark}>{PROFILE.initials}.</span>
              <span className={styles.badgeVersion}>{PROFILE.version}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Each skill chip lifts toward the viewer on hover. */
function SkillsFace({ groups }: { groups: string[] }) {
  return (
    <div className={cx(styles.face, styles.skillsFace)}>
      <Corners at={['tr', 'bl']} />
      {SKILL_GROUPS.map((skills, gi) => (
        <div key={groups[gi]} className={cx(styles.skillGroup, gi === 0 && styles.skillGroupMain)}>
          <span className={cx(text.label, styles.skillLabel)}>{groups[gi]}</span>
          <div className={styles.skillRow} translate="no">
            {skills.map((s) => (
              <span key={s} className={styles.skill}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
