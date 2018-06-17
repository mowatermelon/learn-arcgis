# arcgis-4.0.0-ts

A arcgis V4 demo by using typescript

# how work

``` bash
# clone the project
git clone -b arcgisV4-TS https://github.com/mowatermelon/learn-arcgis.git arcgisV4-TS

# enter the project files
cd arcgisV4-TS

# install dependencies

  # Good network environment
    # install dependencies by cnpm or npm
    cnpm i

  # Bad network environment
    # global install yarn
    cnpm i yarn -g

    # install dependencies by yarn
    yarn install

# serve with hot reload in the development mode
npm run dev
# you can open the index.html in the default browser
# with every time you saving in editor
# you will see any error log and more detail in the console

# if you just want to compile *.ts to *.js
npm run build

# starting the service port as a preview
npm run service

# run lint tests
npm run lint

# test typescript install
npm run test
```

# instructions to folder

```text
├── build                          // Compile production file
│   │   ├── main.js
│   │   ├── main.js.map
├── service                          // Service launch related configuration
│   │   ├── dev.js                              // Start the service file
├── src                                     // Not compile ts files
│   │   ├── main.ts
│   │   ├── main.d.ts
├── package.json                                  // package setting
├── README.md                                  // project introduce
├── tsconfig.json                                  // typescript config setting
├── index.html                                  // The default home page
```

# instructions to tsconfig.json

- `compilerOptions.module` - Specify module code generation: `"None"`, `"CommonJS"`, `"AMD"`, `"System"`, `"UMD"`, `"ES6"`, `"ES2015"` or `"ESNext"`.<br>► Only `"AMD"` and `"System"` can be used in conjunction with `--outFile`.<br>► `"ES6"` and `"ES2015"` values may be used when targeting `"ES5"` or lower.
- `compilerOptions.noImplicitAny` - Raise error on expressions and declarations with an implied `any` type.
- `compilerOptions.sourceMap` - Generates corresponding `.map` file.
- `compilerOptions.target` - Output to ES5 to work across all supported browsers.
- `compilerOptions.experimentalDecorators` - Enables experimental support for ES decorators.
- `compilerOptions.preserveConstEnums` - Do not erase const enum declarations in generated code. See [const enums documentation](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#94-constant-enum-declarations) for more details.
- `compilerOptions.suppressImplicitAnyIndexErrors` - Suppress `--noImplicitAny` errors for indexing objects lacking index signatures. See [issue #1232](https://github.com/Microsoft/TypeScript/issues/1232#issuecomment-64510362) for more details.
- `compilerOptions.outDir` - Redirect output structure to the directory.
- `compilerOptions.declaration` - Generates corresponding `.d.ts` file.
- `compilerOptions.declarationDir` - Output directory for generated declaration files.
- `include` - Array of files to compile. Can use glob-like file patterns.
- `"noImplicitUseStrict": true.` [See Mozilla strict mode documentation](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode) for further information regarding working in strict mode.

- [more detail](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)