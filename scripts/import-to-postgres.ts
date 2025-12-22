/**
 * Script de importação de dados para PostgreSQL
 * 
 * Este script importa os dados exportados do MongoDB para o PostgreSQL
 * usando a Payload Local API para garantir que todas as validações e hooks sejam executados.
 */

import { getPayload } from 'payload';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Carregar variáveis de ambiente
const envPath = path.resolve(ROOT_DIR, '.env');
dotenv.config({ path: envPath });

interface ImportStats {
    collection: string;
    total: number;
    success: number;
    failed: number;
    skipped: number;
}

const stats: ImportStats[] = [];

async function findLatestBackup(): Promise<string | null> {
    const backupDir = path.join(ROOT_DIR, 'mongodb-backup');
    
    if (!fs.existsSync(backupDir)) {
        return null;
    }
    
    const backups = fs.readdirSync(backupDir)
        .filter(dir => dir.startsWith('backup-'))
        .sort()
        .reverse();
    
    if (backups.length === 0) {
        return null;
    }
    
    return path.join(backupDir, backups[0]);
}

async function importCollection(
    payload: any,
    collectionSlug: string,
    backupDir: string
): Promise<ImportStats> {
    const stat: ImportStats = {
        collection: collectionSlug,
        total: 0,
        success: 0,
        failed: 0,
        skipped: 0
    };
    
    const filePath = path.join(backupDir, `${collectionSlug}.json`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  ℹ️ Arquivo não encontrado: ${collectionSlug}.json`);
        return stat;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        stat.total = data.length;
        
        console.log(`\n📦 Importando ${collectionSlug}: ${stat.total} documentos`);
        
        for (const doc of data) {
            try {
                // Remover campos que o Payload gerencia automaticamente
                const { _id, __v, createdAt, updatedAt, ...cleanDoc } = doc;
                
                // Converter ObjectId do MongoDB para string se necessário
                if (_id && typeof _id === 'object' && _id.$oid) {
                    cleanDoc.id = _id.$oid;
                }
                
                // Verificar se já existe (por ID ou campo único)
                let existing = null;
                
                if (cleanDoc.id) {
                    try {
                        existing = await payload.findByID({
                            collection: collectionSlug,
                            id: cleanDoc.id,
                        });
                    } catch (e) {
                        // Documento não existe
                    }
                }
                
                // Se não existe, verificar por campo único (email, slug, etc)
                if (!existing) {
                    const uniqueField = cleanDoc.email || cleanDoc.slug;
                    if (uniqueField) {
                        const fieldName = cleanDoc.email ? 'email' : 'slug';
                        try {
                            const result = await payload.find({
                                collection: collectionSlug,
                                where: {
                                    [fieldName]: { equals: uniqueField }
                                },
                                limit: 1
                            });
                            if (result.docs.length > 0) {
                                existing = result.docs[0];
                            }
                        } catch (e) {
                            // Continuar
                        }
                    }
                }
                
                if (existing) {
                    console.log(`  ⏭️ ${cleanDoc.email || cleanDoc.slug || cleanDoc.name || cleanDoc.id} já existe`);
                    stat.skipped++;
                    continue;
                }
                
                // Criar documento
                await payload.create({
                    collection: collectionSlug,
                    data: cleanDoc,
                });
                
                stat.success++;
                process.stdout.write('.');
                
            } catch (error: any) {
                stat.failed++;
                console.error(`\n  ❌ Erro ao importar documento:`, error.message);
            }
        }
        
        console.log(`\n  ✅ ${stat.success} importados, ${stat.skipped} pulados, ${stat.failed} falharam`);
        
    } catch (error) {
        console.error(`  ❌ Erro ao ler arquivo ${collectionSlug}.json:`, error);
    }
    
    return stat;
}

async function importGlobal(
    payload: any,
    globalSlug: string,
    backupDir: string
): Promise<void> {
    const filePath = path.join(backupDir, `global-${globalSlug}.json`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  ℹ️ Arquivo não encontrado: global-${globalSlug}.json`);
        return;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        console.log(`\n🌐 Importando global: ${globalSlug}`);
        
        // Remover campos gerenciados pelo Payload
        const { _id, __v, globalType, createdAt, updatedAt, ...cleanData } = data;
        
        await payload.updateGlobal({
            slug: globalSlug,
            data: cleanData,
        });
        
        console.log(`  ✅ Global ${globalSlug} importado com sucesso`);
        
    } catch (error: any) {
        console.error(`  ❌ Erro ao importar global ${globalSlug}:`, error.message);
    }
}

async function main() {
    console.log('🚀 Iniciando importação de dados para PostgreSQL...\n');
    
    try {
        // Encontrar backup mais recente
        const backupDir = await findLatestBackup();
        
        if (!backupDir) {
            console.error('❌ Nenhum backup encontrado em mongodb-backup/');
            console.log('ℹ️ Execute primeiro: npx tsx scripts/export-mongodb.ts');
            process.exit(1);
        }
        
        console.log(`📁 Usando backup: ${backupDir}\n`);
        
        // Carregar config do Payload
        const configModule = await import('../payload.config.js').catch(async () => {
            return await import('../payload.config.ts');
        });
        const config = configModule.default;
        
        const payload = await getPayload({ config });
        console.log('✅ Payload inicializado com PostgreSQL\n');
        
        // Ordem de importação (respeitando relacionamentos)
        const importOrder = [
            'users',
            'categories',
            'columnists',
            'media',
            'posts',
            'events',
            'sponsors',
            'newsletter-subscribers'
        ];
        
        console.log('═══════════════════════════════════════');
        console.log('  IMPORTANDO COLEÇÕES');
        console.log('═══════════════════════════════════════');
        
        for (const collectionSlug of importOrder) {
            const stat = await importCollection(payload, collectionSlug, backupDir);
            stats.push(stat);
        }
        
        // Importar globals
        console.log('\n═══════════════════════════════════════');
        console.log('  IMPORTANDO GLOBALS');
        console.log('═══════════════════════════════════════');
        
        const globals = ['site-settings', 'header', 'footer'];
        for (const globalSlug of globals) {
            await importGlobal(payload, globalSlug, backupDir);
        }
        
        // Exibir resumo
        console.log('\n═══════════════════════════════════════');
        console.log('  RESUMO DA IMPORTAÇÃO');
        console.log('═══════════════════════════════════════\n');
        
        console.table(stats.filter(s => s.total > 0));
        
        const totalSuccess = stats.reduce((sum, s) => sum + s.success, 0);
        const totalFailed = stats.reduce((sum, s) => sum + s.failed, 0);
        const totalSkipped = stats.reduce((sum, s) => sum + s.skipped, 0);
        
        console.log('\n═══════════════════════════════════════');
        console.log('✨ Importação concluída!');
        console.log('═══════════════════════════════════════');
        console.log(`✅ ${totalSuccess} documentos importados`);
        console.log(`⏭️ ${totalSkipped} documentos pulados (já existiam)`);
        console.log(`❌ ${totalFailed} documentos falharam`);
        
        if (totalFailed > 0) {
            console.log('\n⚠️ Alguns documentos falharam. Verifique os logs acima.');
        }
        
        console.log('\n📝 Próximos passos:');
        console.log('1. Verifique os dados no admin: http://localhost:3000/admin');
        console.log('2. Migre as imagens: npx tsx scripts/migrate-to-supabase.ts');
        console.log('3. Teste o frontend: http://localhost:3000');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Erro durante a importação:', error);
        process.exit(1);
    }
}

main();



