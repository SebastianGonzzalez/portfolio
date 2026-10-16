import { casaNua } from './casa-nua';
import { doose } from './doose';
import { galeriaVisual } from './galeria-visual';

export type { CaseStudy, Project } from './types';

/** Projects in the order they are numbered on the page (01, 02, 03…). To add one: create its file and list it here. */
export const PROJECTS = [casaNua, doose, galeriaVisual];
