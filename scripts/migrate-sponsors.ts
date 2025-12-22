/**
 * Script para migrar patrocinadores locais para o Payload CMS + Supabase
 */

import { getPayload } from 'payload';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

dotenv.config({ path: path.resolve(ROOT_DIR, '.env') });

async function main() {
    console.log('🚀 Migrando patrocinadores para o CMS...');

    try {
        const configModule = await import('../payload.config.js').catch(async () => {
            return await import('../payload.config.ts');
        });
        const config = configModule.default;
        const payload = await getPayload({ config });

        const sponsorsDir = path.join(ROOT_DIR, 'public', 'sponsors');
        if (!fs.existsSync(sponsorsDir)) {
            console.error('❌ Pasta public/sponsors não encontrada.');
            return;
        }

        const files = fs.readdirSync(sponsorsDir).filter(f => 
            ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(path.extname(f).toLowerCase())
        );

        console.log(`Encontrados ${files.length} patrocinadores.`);

        for (const filename of files) {
            const filePath = path.join(sponsorsDir, filename);
            const sponsorName = path.parse(filename).name;

            console.log(`📦 Processando: ${sponsorName}`);

            // 1. Upload da Logo
            const fileBuffer = fs.readFileSync(filePath);
            const ext = path.extname(filename).toLowerCase();
            let mimeType = 'image/png';
            if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
            else if (ext === '.webp') mimeType = 'image/webp';
            else if (ext === '.gif') mimeType = 'image/gif';
            else if (ext === '.svg') mimeType = 'image/svg+xml';

            const media = await payload.create({
                collection: 'media',
                data: { alt: `Logo ${sponsorName}` },
                file: {
                    data: fileBuffer,
                    name: filename,
                    mimetype: mimeType,
                    size: fileBuffer.length,
                }
            });

            // 2. Criar Patrocinador
            await payload.create({
                collection: 'sponsors',
                data: {
                    name: sponsorName,
                    logo: media.id,
                    active: true
                }
            });

            console.log(`  ✅ Patrocinador ${sponsorName} criado com sucesso.`);
        }

        console.log('\n✨ Migração de patrocinadores concluída!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

main();



