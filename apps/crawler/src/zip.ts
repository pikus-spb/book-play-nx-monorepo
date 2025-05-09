const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

export async function unzipFile(
  fileName: string,
  outputPath: string
): Promise<boolean> {
  try {
    await exec(`unzip ${fileName} -d ${outputPath}`);
    console.log('Unzipped ' + fileName + '...');
    return true;
  } catch (err) {
    console.error('Error occurred while unzipping:', err);
    return false;
  }
}
