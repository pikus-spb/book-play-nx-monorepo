import { log } from '@book-play/utils-common';
import { run } from './app';

run().then(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  log('Exiting...');
  process.exit(0);
});
