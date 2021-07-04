import {post} from 'src/api/http';
import {Login} from './types.d';
class User{
  async login(data: Login) {
    return await post('/login', data);
  }
}

export default new User();