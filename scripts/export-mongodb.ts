/**
 * Script de exportação de dados do MongoDB
 * 
 * Este script exporta todas as coleções do MongoDB para arquivos JSON
 * que serão posteriormente importados para o PostgreSQL.
 */

import { MongoClient } from 'mongodb';
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

// Coleções a exportar
const COLLECTIONS = [
    'users',
    'categories',
    'posts',
    'columnists',
    'events',
    'media',
    'sponsors',
    'newsletter-subscribers',
    'payload-preferences',
    'payload-migrations'
];

// Globals a exportar
const GLOBALS = [
    'site-settings',
    'header',
    'footer'
];

async function exportCollection(db: any, collectionName: string, outputDir: string) {
    try {
        console.log(`\n📦 Exportando coleção: ${collectionName}`);
        
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        
        if (count === 0) {
            console.log(`  ℹ️ Coleção vazia, pulando.`);
            return;
        }
        
        const documents = await collection.find({}).toArray();
        
        const outputPath = path.join(outputDir, `${collectionName}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));
        
        console.log(`  ✅ ${count} documentos exportados para ${outputPath}`);
    } catch (error) {
        console.error(`  ❌ Erro ao exportar ${collectionName}:`, error);
    }
}

async function exportGlobal(db: any, globalSlug: string, outputDir: string) {
    try {
        console.log(`\n🌐 Exportando global: ${globalSlug}`);
        
        const collection = db.collection('globals');
        const document = await collection.findOne({ globalType: globalSlug });
        
        if (!document) {
            console.log(`  ℹ️ Global não encontrado, pulando.`);
            return;
        }
        
        const outputPath = path.join(outputDir, `global-${globalSlug}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
        
        console.log(`  ✅ Global exportado para ${outputPath}`);
    } catch (error) {
        console.error(`  ❌ Erro ao exportar global ${globalSlug}:`, error);
    }
}

async function main() {
    console.log('🚀 Iniciando exportação de dados do MongoDB...\n');
    
    // Verificar se MongoDB URI está configurado
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI;
    
    if (!mongoUri) {
        console.error('❌ MONGODB_URI não está configurado no .env');
        process.exit(1);
    }
    
    // Verificar se é uma URI do MongoDB
    if (!mongoUri.includes('mongodb://') && !mongoUri.includes('mongodb+srv://')) {
        console.error('❌ DATABASE_URI parece ser PostgreSQL. Configure MONGODB_URI para exportar dados.');
        console.log('ℹ️ Adicione MONGODB_URI=mongodb://localhost:27017/edashow no .env');
        process.exit(1);
    }
    
    console.log(`📍 Conectando ao MongoDB: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    
    let client: MongoClient | null = null;
    
    try {
        // Conectar ao MongoDB
        client = new MongoClient(mongoUri);
        await client.connect();
        console.log('✅ Conectado ao MongoDB\n');
        
        const db = client.db();
        
        // Criar diretório de backup
        const backupDir = path.join(ROOT_DIR, 'mongodb-backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        // Adicionar timestamp ao nome do diretório
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const outputDir = path.join(backupDir, `backup-${timestamp}`);
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        console.log(`📁 Backup será salvo em: ${outputDir}\n`);
        
        // Exportar coleções
        console.log('═══════════════════════════════════════');
        console.log('  EXPORTANDO COLEÇÕES');
        console.log('═══════════════════════════════════════');
        
        for (const collectionName of COLLECTIONS) {
            await exportCollection(db, collectionName, outputDir);
        }
        
        // Exportar globals
        console.log('\n═══════════════════════════════════════');
        console.log('  EXPORTANDO GLOBALS');
        console.log('═══════════════════════════════════════');
        
        for (const globalSlug of GLOBALS) {
            await exportGlobal(db, globalSlug, outputDir);
        }
        
        // Criar arquivo de metadados
        const metadata = {
            exportDate: new Date().toISOString(),
            mongoUri: mongoUri.replace(/:([^@]+)@/, ':****@'),
            collections: COLLECTIONS,
            globals: GLOBALS,
            outputDir
        };
        
        fs.writeFileSync(
            path.join(outputDir, '_metadata.json'),
            JSON.stringify(metadata, null, 2)
        );
        
        console.log('\n═══════════════════════════════════════');
        console.log('✨ Exportação concluída com sucesso!');
        console.log('═══════════════════════════════════════');
        console.log(`\n📁 Backup salvo em: ${outputDir}`);
        console.log('\n⚠️ IMPORTANTE: Mantenha este backup até confirmar que a migração foi bem-sucedida!');
        
    } catch (error) {
        console.error('\n❌ Erro durante a exportação:', error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('\n🔌 Conexão com MongoDB fechada.');
        }
    }
}

main();
