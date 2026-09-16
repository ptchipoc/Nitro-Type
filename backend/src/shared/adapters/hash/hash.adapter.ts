import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HashPort } from './hash.port';
@Injectable()
export class HashAdapter extends HashPort {
  async hash(plain: string)                      { return bcrypt.hash(plain, 12); }
  async compare(plain: string, hashed: string)   { return bcrypt.compare(plain, hashed); }
}
