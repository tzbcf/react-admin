# 一个react的后台系统

```typescript
  目前完成骨架搭建。后续慢慢完善。希望能坚持下去
```

## 启动

```typescript
  启动：npm run dev
  打包：npm run build
  使用craco进行打包，基于webpack封装的插件，在配置文件中可以添加webpack等配置以及进行优化
```

## 语言

```typescript
  语言包存放地址：/src/assets/langLocales；根据目录各种语言设置。
  语言切换组件： /src/components/common/language/index.tsx; langLocale.ts是antd语言切换
  store语言配置缓存：/src/store/common/language.ts;
  目前支持三种语言：英语，西班牙语，中文，如需增加其他语种，在这store的language.ts增加其他语种引入
  在/src/components/common/language/index.tsx下面增加option其他语言选项
  使用：
    在新开发组件时，使用redux引入state的语言配置。
    如登陆中：
    export default connect((state: any) => {
      return {
        Mes: state.langSwitch.message,
      };
    })(Login);
    Mes作为语言配置。统一格式。
    组件中直接使用: <div>Mes['login']</div>;
  增加语言配置的时候，按照业务模块新建文件夹。
  命名规范：模块名+类型名+设置名称；采用大小写驼峰命名法。如：中-'loginBtnOk': '同意',英-'loginBtnOk': 'ok'等
```

## 关于Icon组件

```typescript
  src/compoents/common/icon
  在某些场景下，比如路由遍历，通过变量属性来获取icon时，使用React.createElement(Icons[v.icon])方式，Icons会提示ts报错，所以使用import Icons from 'src/components/common/icon'引入。
  其他场景下，比如    React.createElement(Icons['CopyrightOutlined'])；可以使用import * as Icons from '@ant-design/icons'方式引入
```

## 关于样式

```less
  公共样式路径： src/utils/style
  私有样式：
    一：可以在src/utils/style新建模块文件夹，然后新建如index.module.less样式文件
    二：可以直接在业务模块文件夹下面新建index.module.less下面新增私有样式
    引入使用如:import indexStyle from './index.module.less'；
    在html使用如： <div classname={indexStyle.f12}></div>
```
