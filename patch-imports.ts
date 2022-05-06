// import patchJsImports from '@digitak/grubber/library/utilities/patchJsImports'
import addJsExtensions from '@digitak/grubber/library/utilities/addJsExtensions'
import {
    AliasResolver,
    resolveAliases,
} from '@digitak/grubber/library/utilities/resolveAliases'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { relative, resolve as resolvePath } from 'path'

const require = createRequire(process.cwd())
const resolveImport = (dependency: string, directory: string) =>
    require.resolve(dependency, { paths: [directory] })

const tsconfig = JSON.parse(readFileSync('tsconfig.json').toString())
const rootDir = tsconfig.compilerOptions.rootDir
const outDir = tsconfig.compilerOptions.outDir
const aliases = Object.entries(tsconfig.compilerOptions.paths).map(
    ([pattern, replacements]) => ({
        find: new RegExp(pattern),
        replacement: replaceStart(replacements[0] as string, rootDir, './'),
    })
)

function replaceStart(x: string, old: string, newStart: string) {
    return x.startsWith(old) ? newStart + x.slice(old.length) : x
}

// const package_ = JSON.parse(readFileSync('package.json').toString())
// const deps = Object.keys(package_.dependencies)

// aliases.push(
//     ...deps.map(dep => ({
//         find: new RegExp(dep),
//         replacement: './node_modules/' + dep,
//     }))
// )

console.log({ outDir, aliases })
myPatcher(outDir, aliases)

function myPatcher(directory: string, aliases: AliasResolver[]) {
    directory = resolvePath(directory)
    for (const element of readdirSync(directory)) {
        const entity = `${directory}/${element}`
        if (statSync(entity).isDirectory()) {
            myPatcher(entity, aliases)
            continue
        }
        // only patch .js, .cjs and .mjs files
        if (!element.match(/\.[mc]?js$/)) continue
        updateFile(entity, content =>
            addJsExtensions(content, imported =>
                getImportPath(aliases, directory, imported)
            )
        )
    }
}

function updateFile(path: string, updater: (content: string) => string): void {
    const content = readFileSync(path).toString()
    const updatedContent = updater(content)
    writeFileSync(path, updatedContent)
}

function getImportPath(
    aliases: AliasResolver[],
    directory: string,
    imported: string
) {
    console.log({ arguments })
    let path = resolveAliases(imported, aliases) ?? imported
    path = resolveImport(path, directory)
    path = relative(directory, path)
    if (path[0] != '.' && path[0] != '/') path = './' + path
    return path
}
