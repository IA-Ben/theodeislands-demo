import { writeFile, readdir, mkdir, unlink, stat, rm } from 'node:fs/promises';

const tmpDir = './tmp';

const _path = (fileName: string) => `${tmpDir}/${fileName}`;

const resetDir = async (): Promise<boolean> => {
  try {
    const files = await readdir(tmpDir);
    for (const file of files) {
      const filePath = _path(file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await rm(filePath, { recursive: true, force: true });
      } else {
        await unlink(filePath);
      }
    }
    return true;
  } catch (err) {
    console.error('Error resetting tmp dir', err);
    return false;
  }
};

const addFile = async (fileName: string, buffer: Buffer): Promise<boolean> => {
  try {
    await writeFile(_path(fileName), buffer);
    return true;
  } catch (err) {
    console.error('Error writing file', err);
    return false;
  }
};

const addDir = async (dirName: string): Promise<boolean> => {
  try {
    await mkdir(_path(dirName), { recursive: true });
    return true;
  } catch (err) {
    console.error('Error creating directory', err);
    return false;
  }
};

const deleteFile = async (fileName: string): Promise<boolean> => {
  try {
    await unlink(_path(fileName));
    return true;
  } catch (err) {
    console.error('Error deleting file', err);
    return false;
  }
};

const deleteDir = async (dirName: string): Promise<boolean> => {
  try {
    await rm(_path(dirName), { recursive: true, force: true });
    return true;
  } catch (err) {
    console.error('Error deleting directory', err);
    return false;
  }
};

export { tmpDir, addFile, addDir, deleteFile, deleteDir, resetDir };
