/**
 * FileName : websocket.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-08 10:33:24
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import bus from 'src/utils/eventBus';
type SocketProperty = {
  onopen: any;
  onclose: any;
  close (code?: number, reason?: string): void;
  onerror: any;
  onmessage: any;
  send (data: any): void;
  parentAttr?: any;
  readyState: number;
}

type Params = {
  url?: string; // 链接地址
  timeout?: number; // 超时时间
  // 下面参数需要就使用，不得更改已有逻辑,可自行添加其他方法
  socketOpen?: Function;
  socketClose?: Function;
  socketError?: Function;
}

/**
 * websocket参数说明
 * @param {Params} params 其他参数
 */

class Socket {
  private url:string = 'ws://172.20.8.146:9085';
  private timeout: number = 5000;
  private socket: null | SocketProperty = null;
  private intervalTime: number = 8000;
  private isSucces: boolean = false;
  private taskRemindInterval: any = null;
  private params: any = {};
  constructor (params: Params = {}) {
      this.url = params.url || this.url;
      this.params = params;
      this.timeout = params.timeout || this.timeout;
  }
  connection () {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = this.onOpen;
      this.socket.onclose = this.onClose;
      this.socket.onerror = this.onError;
      this.socket.onmessage = this.onMessage;
      if (this.timeout) {
          let time = setTimeout(() => {
              if (this.socket && this.socket.readyState !== 1) {
                  this.socket.close();
              }
              clearInterval(time);
          }, this.timeout);
      }
  }
    onOpen = () => { // 启动成功事件，并开启心跳
        const socketOpen = this.params?.socketOpen;

        console.log('a-----成功');
        this.isSucces = true;
        socketOpen && socketOpen();
        if (typeof this.heartCeck === 'function') {
            this.heartCeck();
        }
    }
  onClose = (e?: any) => { // 关闭事件
      this.isSucces = false;
      const socketClose = this.params?.socketClose;

      console.log('b-----关闭', e);
      socketClose && socketClose(e);
      this.socket?.close();
  }
  onError = (e: any) => { // 异常事件
      let socketError = this.params?.socketError;

      console.log('c-----失败', e);

      this.socket = null;
      this.isSucces = false;
      socketError && socketError(e);
      //   this.connection();

  }
  onMessage = (msg: any) => { // 接收消息，并ibus推送消息，某些业务模块需要对消息处理，则需要对返回消息名称进行判断，然后处理赋值给result
      let socketMessage = this.params?.socketMessage;

      socketMessage && socketMessage(msg.data);
      // 打印出后端推得数据
      if (typeof msg.data === 'string' && msg.data.includes('HeartBeat')) {
          return;
      }
      try {
          const list = JSON.parse(msg.data).OBJ;

          for (const item of list) {
              let result: any = item;
              // const result = item.result.split('@');

              bus.emit(item.name, result);
          }
      } catch (error) {
          console.log('d---------错误消息', msg);
          console.error(error);
      }
  }
  sendMessage (value: any) { // 发送消息
      if (this.socket && this.isSucces) {
          this.socket.send(value);
      }
  }
  heartCeck () { // 链接正常发送心跳
      this.taskRemindInterval = setInterval(() => {
          if (this.isSucces) {
              this.sendMessage('HeartBeat');
          } else {
              clearInterval(this.taskRemindInterval);
          }
      }, this.intervalTime);
  }
}

export default Socket;
