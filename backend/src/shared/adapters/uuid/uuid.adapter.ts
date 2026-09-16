import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UUIDPort } from './uuid.port';
@Injectable()
export class UUIDAdapter extends UUIDPort { generate() { return randomUUID(); } }
