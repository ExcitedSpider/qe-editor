# QE Editor

基于 slatejs 的富文本编辑器

## 开始

```bash
yarn
yarn dev
```

## 打包

```bash
yarn build
```

项目架构基于 [Vite](https://cn.vitejs.dev/)，打包问题请参考 Vite 官方文档

## 编写样式

采用通用样式类 + [Styled Components](https://styled-components.com/docs/basics#getting-started)，这样有几个好处:

- 通用样式类方便落实样式规范，提高开发效率。
- CSS in JS 方案编写样式很灵活，特别是在需要根据 prop 条件渲染样式的时候。适合作为通用样式类的补充。

推荐安装 vscode 插件 [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
