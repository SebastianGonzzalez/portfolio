import { casaNua } from './casa-nua';
import { doose } from './doose';
import { galeriaVisual } from './galeria-visual';
import { portfolio } from './portfolio';

export type { CaseStudy, Project } from './types';

/**
 * Projects in the order they are numbered on the page (01, 02, 03…); the first one opens with its case.
 * To add one: create its file and list it here.
 */
export const PROJECTS = [portfolio, casaNua, doose, galeriaVisual];
