# 一个react的后台系统

```typescript
  目前完成骨架搭建。后续慢慢完善。希望能坚持下去
```

## 关于Icon组件

```typescript
  src/compoents/common/icon
  在某些场景下，比如路由遍历，通过变量属性来获取icon时，使用React.createElement(Icons[v.icon])方式，Icons会提示ts报错，所以使用import Icons from 'src/components/common/icon'引入。
  其他场景下，比如    React.createElement(Icons['CopyrightOutlined'])；可以使用import * as Icons from '@ant-design/icons'方式引入
```
