import {chain, Rule} from "@angular-devkit/schematics";

export default function (): Rule {
    return () => {
        return chain([]);
        // return chain([addPrettier(linterOptions), linterOptions.addHusky ? addHusky(linterOptions) : noop()]);
    };
}