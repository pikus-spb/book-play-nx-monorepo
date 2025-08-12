import { ReadableStream, TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.MessagePort = class MessagePort {};
