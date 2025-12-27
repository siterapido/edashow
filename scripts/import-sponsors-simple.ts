
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import sharp from 'sharp'

// Load environment variables
dotenv.config({ path: '.env.local', override: true });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importSponsors() {
    console.log('Starting sponsor import with image processing...');

    // Read the mapping file
    const mapPath = path.join(process.cwd(), 'scripts', 'sponsors_map.json');
    const sponsorsMap: Array<{ filename: string; name: string; display_order?: number }> = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    const logosDir = path.join(process.cwd(), 'LOGOS PATROCINADORES');
    const bucketName = 'sponsors';

    let successCount = 0;
    let failCount = 0;

    for (const sponsor of sponsorsMap) {
        const originalFilePath = path.join(logosDir, sponsor.filename);

        if (!fs.existsSync(originalFilePath)) {
            console.error(`File not found: ${originalFilePath}`);
            failCount++;
            continue;
        }

        const ext = path.extname(sponsor.filename).toLowerCase();

        let fileBuffer: Buffer | Uint8Array = fs.readFileSync(originalFilePath);
        let contentType = getContentType(sponsor.filename);

        try {
            // Process image with Sharp
            if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
                const image = sharp(fileBuffer);
                const metadata = await image.metadata();

                if (metadata) {
                    // Optimized processing with high threshold for noisy backgrounds
                    const threshold = 35;

                    const processedBuffer = await image
                        .trim({ threshold: threshold }) // Aggressive trim
                        .resize({
                            width: 500,
                            height: 300,
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .toBuffer();

                    // Convert to Uint8Array to avoid type issues
                    fileBuffer = new Uint8Array(processedBuffer);
                }
            }
        } catch (err) {
            console.error(`Error processing image ${sponsor.filename}:`, err);
            // Continue with original buffer if processing fails
        }

        const storagePath = `${sponsor.filename}`;

        try {
            // Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(storagePath, fileBuffer, {
                    contentType: contentType,
                    upsert: true
                });

            if (uploadError) {
                console.error(`Error uploading ${sponsor.filename}:`, uploadError);
                failCount++;
                continue;
            }

            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(storagePath);

            // Add a cache buster explicitly
            const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

            // Update Database - simplified to only use existing columns
            const { data: existingSponsor } = await supabase
                .from('sponsors')
                .select('id')
                .eq('name', sponsor.name)
                .single();

            // Prepare data object with only fields that exist in the table
            const sponsorData: any = {
                name: sponsor.name,
                logo_path: publicUrl,
                active: true
            };

            if (existingSponsor) {
                const { error: updateError } = await supabase
                    .from('sponsors')
                    .update(sponsorData)
                    .eq('id', existingSponsor.id);

                if (updateError) {
                    console.error(`Error updating ${sponsor.name}:`, updateError);
                    failCount++;
                } else {
                    console.log(`Processed and updated: ${sponsor.name}`);
                    successCount++;
                }
            } else {
                const { error: insertError } = await supabase
                    .from('sponsors')
                    .insert(sponsorData);

                if (insertError) {
                    console.error(`Error inserting ${sponsor.name}:`, insertError);
                    failCount++;
                } else {
                    console.log(`Processed and inserted: ${sponsor.name}`);
                    successCount++;
                }
            }
        } catch (uploadOrDbError) {
            console.error(`Error for ${sponsor.filename}:`, uploadOrDbError);
            failCount++;
        }
    }

    console.log(`\nImport complete! Success: ${successCount}, Failed: ${failCount}`);
}

function getContentType(filename: string) {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.webp': return 'image/webp';
        default: return 'application/octet-stream';
    }
}

importSponsors().catch(console.error);
