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

## 文件目录

```html
|-- system
    |-- .DS_Store
    |-- .eslintrc    // eslint代码检查配置
    |-- .gitignore
    |-- .prettierrc.js  // prettier代码风格配置
    |-- craco.config.js  // 项目运行配置
    |-- package-lock.json
    |-- package.json  // 第三方依赖与启动配置
    |-- README.md
    |-- tsconfig.json  // typescript相关配置
    |-- .vscode
    |   |-- launch.json
    |   |-- st.json
    |-- public  // 静态目录
    |   |-- favicon.ico
    |   |-- index.html  // 项目入口html
    |   |-- logo192.png
    |   |-- logo512.png
    |   |-- manifest.json
    |   |-- robots.txt
    |   |-- static  // 静态资源
    |       |-- images
    |       |   |-- bg9.png
    |       |   |-- login_03.png
    |       |   |-- navigation_bars.png
    |       |-- js
    |       |   |-- less.min.js
    |       |-- style
    |           |-- bg.less
    |           |-- theme.less
    |-- src   // 业务相关目录
        |-- .DS_Store
        |-- App.tsx   // 路由与初始化目录
        |-- index.tsx  // 入口js
        |-- react-app-env.d.ts
        |-- reportWebVitals.ts
        |-- setupTests.ts
        |-- api   // 接口请求
        |   |-- http.ts
        |   |-- index.ts
        |   |-- homePage
        |   |   |-- index.tsx
        |   |   |-- type.d.ts
        |   |-- test
        |   |   |-- user.http
        |   |-- user
        |       |-- index.ts
        |       |-- types.d.ts
        |-- assets    // 静态资源，主要能打包的资源。大型文件与不需要打包的放置public的static
        |   |-- imgs
        |   |   |-- common
        |   |       |-- logo5.png
        |   |       |-- logo_login.png
        |   |       |-- overseas.png
        |   |-- langLocales
        |       |-- en_US
        |       |   |-- index.ts
        |       |   |-- common
        |       |   |   |-- index.ts
        |       |   |-- login
        |       |   |   |-- index.ts
        |       |   |-- menu
        |       |       |-- index.ts
        |       |-- es_ES
        |       |   |-- index.ts
        |       |   |-- common
        |       |   |   |-- index.ts
        |       |   |-- login
        |       |   |   |-- index.ts
        |       |   |-- menu
        |       |       |-- index.ts
        |       |-- zhCN
        |           |-- index.ts
        |           |-- common
        |           |   |-- index.ts
        |           |-- header
        |           |   |-- index.ts
        |           |-- login
        |           |   |-- index.ts
        |           |-- menu
        |           |   |-- index.ts
        |           |-- operatorMgnt
        |               |-- index.ts
        |-- components  // 封装组件
        |   |-- business  // 业务特性的组件
        |   |   |-- addRowCom
        |   |   |   |-- index.tsx
        |   |   |-- searchList
        |   |       |-- index.module.less
        |   |       |-- index.tsx
        |   |-- common  // 公共组件
        |   |   |-- echarts   // 图表
        |   |   |   |-- index.tsx
        |   |   |-- icon    // icon
        |   |   |   |-- index.tsx
        |   |   |-- language  // 国际化选择
        |   |   |   |-- index.tsx
        |   |   |   |-- langLocale.ts
        |   |   |-- loding    // 带浮窗的loading，全局
        |   |   |   |-- index.tsx
        |   |   |-- toLoad    // 不带浮窗的loading
        |   |       |-- index.tsx
        |   |-- footer    // 底部
        |   |   |-- index.tsx
        |   |-- header    // 头部
        |   |   |-- index.less
        |   |   |-- index.tsx
        |   |   |-- news.tsx
        |   |-- menu    // 菜单
        |       |-- index.less
        |       |-- index.tsx
        |       |-- menuTabs.tsx
        |-- layout    // 布局
        |   |-- home  // 业务系统页面
        |   |   |-- index.module.less
        |   |   |-- index.tsx
        |   |-- login // 登陆页面
        |   |   |-- index.module.less
        |   |   |-- index.tsx
        |   |-- nofound // 404,403,500等异常页面
        |       |-- index.tsx
        |-- pages   // 业务组件
        |   |-- amiFunction
        |   |   |-- abnormalManagement
        |   |   |   |-- index.tsx
        |   |   |-- connectAndDisconnect
        |   |   |   |-- index.tsx
        |   |   |-- dcuMonitoring
        |   |   |   |-- index.tsx
        |   |   |-- firmwareUpgrade
        |   |   |   |-- index.tsx
        |   |   |-- meterParam
        |   |   |   |-- index.tsx
        |   |   |-- meterReadingSuccessRate
        |   |   |   |-- index.tsx
        |   |   |-- networkManagement
        |   |   |   |-- index.tsx
        |   |   |-- onDemandReading
        |   |   |   |-- index.tsx
        |   |   |-- taskManagement
        |   |       |-- index.tsx
        |   |-- basicData
        |   |   |-- commandScheme
        |   |   |   |-- index.tsx
        |   |   |-- dataDefinition
        |   |   |   |-- index.tsx
        |   |   |-- dcuInWareHouse
        |   |   |   |-- index.tsx
        |   |   |-- excelFileImport
        |   |   |   |-- index.tsx
        |   |   |-- feederManagement
        |   |   |   |-- index.tsx
        |   |   |-- meterInWareHouse
        |   |   |   |-- index.tsx
        |   |   |-- organizationalStructure
        |   |   |   |-- index.tsx
        |   |   |-- transformerManagement
        |   |       |-- index.tsx
        |   |-- collectReport
        |   |   |-- dailyFrozenDataQuery
        |   |   |   |-- index.tsx
        |   |   |-- dcuAlarmEvent
        |   |   |   |-- index.tsx
        |   |   |-- lineLossQuery
        |   |   |   |-- index.tsx
        |   |   |-- loadProfileDataQuery
        |   |   |   |-- index.tsx
        |   |   |-- meterAlarmEvent
        |   |   |   |-- index.tsx
        |   |   |-- monthlyFrozenDataQuery
        |   |       |-- index.tsx
        |   |-- components  // 公共组件（不在角色权限中，提供开发者使用）
        |   |   |-- langManage
        |   |   |   |-- index.tsx
        |   |   |-- searchList
        |   |   |   |-- index.tsx
        |   |   |-- table
        |   |       |-- details
        |   |       |   |-- index.tsx
        |   |       |-- list
        |   |           |-- index.tsx
        |   |-- configuration
        |   |   |-- activityCalender
        |   |   |   |-- index.tsx
        |   |   |-- alarmInfoConfig
        |   |   |   |-- index.tsx
        |   |   |-- commandConfig
        |   |   |   |-- index.tsx
        |   |   |-- configDcuArchive
        |   |   |   |-- index.tsx
        |   |   |-- configLoadProfile
        |   |   |   |-- index.tsx
        |   |   |-- dcuSchedule
        |   |   |   |-- index.tsx
        |   |   |-- lineLossAnalysis
        |   |   |   |-- index.tsx
        |   |   |-- meterTypeParameters
        |   |   |   |-- index.tsx
        |   |   |-- NTPConfig
        |   |   |   |-- index.tsx
        |   |   |-- opreatorOnlineMgnt
        |   |   |   |-- index.tsx
        |   |   |-- specialDays
        |   |   |   |-- index.tsx
        |   |   |-- systemParametersMgnt
        |   |       |-- index.tsx
        |   |-- customerAndDevice
        |   |   |-- customerManagement
        |   |   |   |-- index.tsx
        |   |   |-- dcuManagement
        |   |   |   |-- index.tsx
        |   |   |-- measurePointManagement
        |   |   |   |-- index.tsx
        |   |   |-- meterManagement
        |   |       |-- index.tsx
        |   |-- homePage
        |   |   |-- index.less
        |   |   |-- homeCom
        |   |   |   |-- FilesOverview.tsx
        |   |   |   |-- FrozenData.tsx
        |   |   |   |-- Overview.tsx
        |   |   |   |-- Quickperations.tsx
        |   |   |-- mdrHomePage
        |   |   |   |-- index.tsx
        |   |   |-- pvmsHomePage
        |   |       |-- index.tsx
        |   |-- opreatorMgnt
        |   |   |-- roleManage
        |   |   |   |-- roleAdd
        |   |   |   |   |-- index.tsx
        |   |   |   |-- roleList
        |   |   |       |-- index.tsx
        |   |   |-- userMange
        |   |       |-- userList
        |   |           |-- index.tsx
        |   |-- others  // 其他组件， 不在角色菜单中，提供系统帮助
        |       |-- noAccess.tsx
        |       |-- serviceException.tsx
        |       |-- langManage
        |       |   |-- index.tsx
        |       |-- searchList
        |       |-- table
        |           |-- details
        |           |-- list
        |-- router    // 路由相关
        |   |-- menuRouter.ts
        |   |-- router.tsx
        |   |-- routerWrap.tsx
        |   |-- types.ts
        |   |-- config
        |       |-- amiFunction
        |       |   |-- index.ts
        |       |-- basicData
        |       |   |-- index.ts
        |       |-- collectReport
        |       |   |-- index.ts
        |       |-- components
        |       |   |-- index.ts
        |       |-- configuration
        |       |   |-- index.ts
        |       |-- customerAndDevice
        |       |   |-- index.ts
        |       |-- homePage
        |       |   |-- index.ts
        |       |-- opreatorMgnt
        |       |   |-- index.ts
        |       |-- others
        |           |-- index.ts
        |-- store   // 公共数据
        |   |-- index.ts
        |   |-- common
        |       |-- collapsed.ts
        |       |-- language.ts
        |       |-- menuTabs.ts
        |       |-- news.ts
        |-- utils   // 其他封装的公共函数
            |-- utils.ts
            |-- style
                |-- index.less
```
