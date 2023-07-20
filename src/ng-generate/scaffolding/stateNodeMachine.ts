import { FolderStructure, ScaffoldOptions } from './scaffold.interfaces';
import { noop, Rule } from '@angular-devkit/schematics';
import {
  addExportsToNearestIndex,
  addShortPath,
  createEmptyFolder,
  createIndexFile,
  createModuleFolder,
  createRoutingFile,
  ProjectDefinition,
} from '../../utils';

import { externalSchematic } from '@angular-devkit/schematics/src/rules/schematic';

export type State = (
  structure: FolderStructure,
  options: ScaffoldOptions,
  project: ProjectDefinition,
  globalSettings?: {
    [option: string]: string;
  }
) => Rule[];

export class NodeFactory {
  private states: State[];

  constructor(states: State[]) {
    this.states = states;
  }

  public execute(
    structure: FolderStructure,
    options: ScaffoldOptions,
    project: ProjectDefinition,
    globalSettings?: {
      [option: string]: string;
    }
  ): Rule[] {
    return this.states
      .map((state: State) => state(structure, options, project, globalSettings))
      .flat();
  }
}

export const addModuleState: State = (
  structure: FolderStructure,
  options: ScaffoldOptions
): Rule[] => [createModuleFolder(structure, options)];

export const addEmptyFolderState: State = (
  structure: FolderStructure,
  _options: ScaffoldOptions
): Rule[] => [createEmptyFolder(structure.path?.getPath() || '')];

export const addComponentState: State = (
  structure: FolderStructure,
  _options: ScaffoldOptions,
  _project: ProjectDefinition,
  globalSettings: { [key: string]: string }
): Rule[] => {
  return [
    externalSchematic('@schematics/angular', 'component', {
      ...(structure.addComponent ?? {}),
      ...(globalSettings ?? {}),
      path: structure.path?.getPath(),
      name: structure.name,
    }),
  ];
};
export const addRoutingState: State = (
  structure: FolderStructure,
  options: ScaffoldOptions
): Rule[] => [createRoutingFile(structure, options)];
export const addShortPathState: State = (
  structure: FolderStructure,
  options: ScaffoldOptions
): Rule[] => {
  const calls: Rule[] = [];
  if (structure.hasShortPath) {
    const exportsPaths: string[] = [];
    if (structure.hasModule) exportsPaths.push(`./${structure.name}.module`);
    if (structure.hasRouting) exportsPaths.push(`./${structure.name}.routing`);
    calls.push(createIndexFile(options, structure.path?.getPath() || '', exportsPaths));
    calls.push(
      addShortPath({
        packageName: `@${structure.name}`,
        paths: [structure.path?.getPath() || ''],
      })
    );
  } else {
    calls.push(
      structure.hasModule ? addExportsToNearestIndex(options, structure, 'module') : noop()
    );
    calls.push(
      structure.hasRouting ? addExportsToNearestIndex(options, structure, 'routing') : noop()
    );
  }
  return calls;
};


export const emptyState: State = () => [];