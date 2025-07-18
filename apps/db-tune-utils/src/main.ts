import { runGenres } from './genre';
import { runFix } from './genre-fix';

if (process.argv[2] === 'genre') {
  runGenres().then(() => {
    console.log('Completed successfully!');
  });
} else if (process.argv[2] === 'genre-fix') {
  runFix().then(() => {
    console.log('Completed successfully!');
  });
} else {
  console.log('Invalid argument! Use "genre" or "genre-fix"');
}
