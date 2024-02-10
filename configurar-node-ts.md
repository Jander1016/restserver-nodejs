<!-- 1 Creo carpeta node-auth -->
<!-- 2 npm init -y -->
<!-- 3 Sigo los pasos del archivo configurar-node-ts.md -->

# Node con TypeScript - TS-Node-dev (preferido)

1. Instalar TypeScript y demás dependencias
```
yarn add i -D typescript @types/node ts-node-dev rimraf
```
2. Inicializar el archivo de configuración de TypeScript ( Se puede configurar al gusto)
```
npx tsc --init --outDir dist/ --rootDir src
```

3. Crear scripts para dev, build y start ([Más sobre TS-Node-dev aquí](https://www.npmjs.com/package/ts-node-dev))
```
  "dev": "tsnd --respawn --clear src/app.ts",
  "build": "rimraf ./dist && tsc",
  "start": "yarn build && node dist/app.js"
```