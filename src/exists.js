import fs from 'fs/promises';

async function stat(path) {
    try {
        const stat = await fs.stat(path);
        return stat
    }
    
    catch { return false }
}

export async function exists(path) {
    return (await stat(path))?.isFile?.();
}

export async function dirExists(path) {
    return (await stat(path))?.isDirectory?.();
}