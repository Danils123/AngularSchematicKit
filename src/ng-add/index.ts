import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default function (): Rule {
  return (_host: Tree, context: SchematicContext) => {
    context.logger.log('info', `You can use these schematics to your project, only copy the name`);
    context.logger.log('info', `✨ add-linters`);
    context.logger.log('info', `✨ add-git-hooks`);
    return chain([]);
  };
}
