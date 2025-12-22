/**
 * Script de migração de assets locais para o Supabase (via Payload CMS - Local API)
 * 
 * Este script percorre as pastas public/sponsors e public/uploads,
 * além de arquivos na raiz de public/, e faz o upload para o Payload CMS
 * usando a API Local para maior confiabilidade.
 */

import { getPayload } from 'payload';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const envPath = path.resolve(ROOT_DIR, '.env');
dotenv.config({ path: envPath });

async function uploadLocalImage(
    payload: any,
    localPath: string,
    alt?: string
): Promise<string | null> {
    try {
        if (!fs.existsSync(localPath)) {
            console.warn(`⚠️ Arquivo não encontrado: ${localPath}`);
            return null;
        }

        const fileBuffer = fs.readFileSync(localPath);
        const filename = path.basename(localPath);
        const ext = path.extname(filename).toLowerCase();

        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.webp') mimeType = 'image/webp';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.svg') mimeType = 'image/svg+xml';

        // Verificar se já existe (opcional, por nome de arquivo)
        const existing = await payload.find({
            collection: 'media',
            where: {
                filename: { equals: filename }
            }
        });

        if (existing.docs.length > 0) {
            console.log(`  ℹ️ Arquivo ${filename} já existe (ID: ${existing.docs[0].id}), pulando.`);
            return existing.docs[0].id;
        }

        const media = await payload.create({
            collection: 'media',
            data: {
                alt: alt || filename,
            },
            file: {
                data: fileBuffer,
                name: filename,
                mimetype: mimeType,
                size: fileBuffer.length,
            }
        });

        return media.id;
    } catch (error) {
        console.error(`❌ Erro ao fazer upload de ${localPath}:`, error);
        return null;
    }
}

async function migrateFolder(payload: any, folderPath: string, label: string) {
    console.log(`\n📂 Migrando ${label} de ${folderPath}...`);
    
    if (!fs.existsSync(folderPath)) {
        console.log(`ℹ️ Pasta não existe, pulando.`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => 
        ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(path.extname(f).toLowerCase())
    );

    console.log(`Found ${imageFiles.length} images.`);

    for (const file of imageFiles) {
        const filePath = path.join(folderPath, file);
        process.stdout.write(`📤 Enviando ${file}... `);
        const resultId = await uploadLocalImage(payload, filePath);
        if (resultId) {
            process.stdout.write(`✅ OK (ID: ${resultId})\n`);
        } else {
            process.stdout.write(`❌ Falhou\n`);
        }
    }
}

async function main() {
    console.log('🚀 Iniciando migração de imagens para o Supabase (Local API)...');
    
    try {
        // Carregar config do Payload
        // Nota: Importante usar o caminho correto para o build do payload.config
        const configModule = await import('../payload.config.js').catch(async () => {
            return await import('../payload.config.ts');
        });
        const config = configModule.default;

        const payload = await getPayload({ config });
        console.log('✅ Payload inicializado.');

        // 1. Migrar public/sponsors
        await migrateFolder(payload, path.join(ROOT_DIR, 'public', 'sponsors'), 'Sponsors');

        // 2. Migrar public/uploads
        await migrateFolder(payload, path.join(ROOT_DIR, 'public', 'uploads'), 'Uploads');

        // 3. Migrar imagens na raiz do public
        const publicPath = path.join(ROOT_DIR, 'public');
        const files = fs.readdirSync(publicPath);
        const rootImages = files.filter(f => 
            fs.statSync(path.join(publicPath, f)).isFile() &&
            ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(path.extname(f).toLowerCase()) &&
            !f.startsWith('apple-icon') && !f.startsWith('icon') && !f.startsWith('favicon')
        );

        console.log(`\n📂 Migrando imagens da raiz de public/ (${rootImages.length} arquivos)...`);
        for (const file of rootImages) {
            const filePath = path.join(publicPath, file);
            process.stdout.write(`📤 Enviando ${file}... `);
            const resultId = await uploadLocalImage(payload, filePath);
            if (resultId) {
                process.stdout.write(`✅ OK (ID: ${resultId})\n`);
            } else {
                process.stdout.write(`❌ Falhou\n`);
            }
        }

        console.log('\n✨ Migração concluída!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    }
}

main();



