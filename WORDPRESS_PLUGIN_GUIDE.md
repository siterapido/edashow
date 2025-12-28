# 🔌 Guia de Desenvolvimento do Plugin WordPress

Este documento detalha como desenvolver um plugin WordPress para integração com a API de importação do EdaShow.

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Requisitos](#requisitos)
3. [Configuração](#configuração)
4. [Especificação da API](#especificação-da-api)
5. [Estrutura do Plugin](#estrutura-do-plugin)
6. [Código de Exemplo](#código-de-exemplo)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

O plugin WordPress deve:
1. Capturar posts publicados no WordPress
2. Coletar imagens em destaque e inline
3. Formatar dados no payload esperado pela API
4. Enviar para o endpoint do EdaShow
5. Armazenar status de sincronização

### Fluxo de Operação

```
WordPress (Publish Post)
        ↓
    Plugin Hook (publish_post)
        ↓
    Coleta dados do post
        ↓
    Formata payload JSON
        ↓
    Envia para API EdaShow
        ↓
    Armazena resposta como meta
```

---

## ⚙️ Requisitos

### WordPress
- WordPress 5.8+
- PHP 7.4+
- `curl` habilitado

### EdaShow
- URL da API de produção
- API Key de autenticação

---

## 🔧 Configuração

### Variáveis Necessárias

```php
define('EDASHOW_API_URL', 'https://seusite.com/api/wordpress');
define('EDASHOW_API_KEY', 'sua-api-key-aqui');
```

### Página de Configurações (Recomendado)

O plugin deve ter uma página de configurações em **Configurações > EdaShow** onde o usuário pode:
- Inserir a URL da API
- Inserir a API Key
- Testar conexão
- Escolher tipos de post para sincronizar
- Mapear categorias locais para categorias do EdaShow

---

## 📡 Especificação da API

### Endpoint de Importação

```
POST /api/wordpress/import
```

#### Headers Obrigatórios

| Header | Valor | Descrição |
|--------|-------|-----------|
| `Content-Type` | `application/json` | Tipo do conteúdo |
| `x-wp-api-key` | `string` | Chave de autenticação |

#### Payload (JSON Body)

```json
{
  "site_url": "https://seuwordpress.com.br",
  "action": "create",
  "post": {
    "wp_id": 12345,
    "title": "Título do Post no WordPress",
    "slug": "titulo-do-post-no-wordpress",
    "content": "<p>Conteúdo HTML completo do post...</p>",
    "excerpt": "Resumo ou subtítulo do post",
    "status": "published",
    "published_at": "2025-12-27T15:30:00Z",
    "author": {
      "name": "Nome do Autor",
      "email": "autor@email.com"
    },
    "categories": [
      "Notícias",
      "Política"
    ],
    "tags": [
      "Brasil",
      "Economia",
      "2025"
    ],
    "featured_image": {
      "url": "https://seuwordpress.com.br/wp-content/uploads/2025/12/imagem.jpg",
      "alt": "Descrição alternativa da imagem",
      "caption": "Legenda da imagem",
      "width": 1200,
      "height": 630
    },
    "inline_images": [
      {
        "original_url": "https://seuwordpress.com.br/wp-content/uploads/2025/12/foto1.jpg",
        "alt": "Foto 1"
      },
      {
        "original_url": "https://seuwordpress.com.br/wp-content/uploads/2025/12/foto2.jpg",
        "alt": "Foto 2"
      }
    ],
    "meta": {
      "seo_title": "Título SEO Customizado",
      "seo_description": "Meta descrição para SEO",
      "canonical_url": "https://seuwordpress.com.br/post-original/"
    }
  }
}
```

#### Campos do Payload

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `site_url` | string | ✅ | URL do site WordPress de origem |
| `action` | string | ❌ | `create`, `update` ou `delete` (default: `create`) |
| `post.wp_id` | number | ✅ | ID do post no WordPress |
| `post.title` | string | ✅ | Título do post |
| `post.slug` | string | ✅ | Slug/permalink do post |
| `post.content` | string | ✅ | Conteúdo HTML do post |
| `post.excerpt` | string | ❌ | Resumo do post |
| `post.status` | string | ❌ | `published` ou `draft` (default: `draft`) |
| `post.published_at` | string | ❌ | Data ISO 8601 (default: agora) |
| `post.author` | object | ❌ | Dados do autor |
| `post.categories` | string[] | ❌ | Nomes das categorias |
| `post.tags` | string[] | ❌ | Nomes das tags |
| `post.featured_image` | object | ❌ | Imagem em destaque |
| `post.inline_images` | array | ❌ | Imagens no conteúdo |
| `post.meta` | object | ❌ | Metadados SEO |

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Post importado com sucesso",
  "data": {
    "post_id": "uuid-do-post-criado",
    "slug": "titulo-do-post-no-wordpress",
    "url": "https://edashow.com/posts/titulo-do-post-no-wordpress",
    "images_processed": 3,
    "category_id": "uuid-da-categoria"
  }
}
```

#### Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Título é obrigatório",
    "details": {
      "field": "post.title"
    }
  }
}
```

### Endpoint de Status

```
GET /api/wordpress/status
```

#### Headers

| Header | Valor |
|--------|-------|
| `x-wp-api-key` | Sua API Key |

#### Resposta

```json
{
  "success": true,
  "api_version": "1.0.0",
  "site_name": "EdaShow",
  "categories": [
    { "id": "uuid", "name": "Notícias", "slug": "noticias" },
    { "id": "uuid", "name": "Análises", "slug": "analises" }
  ],
  "features": {
    "image_processing": true,
    "auto_categories": true,
    "seo_meta": true
  }
}
```

---

## 📁 Estrutura do Plugin

```
edashow-sync/
├── edashow-sync.php           # Arquivo principal do plugin
├── includes/
│   ├── class-api-client.php   # Cliente HTTP para API
│   ├── class-post-handler.php # Manipulador de posts
│   ├── class-image-handler.php# Processamento de imagens
│   ├── class-settings.php     # Página de configurações
│   └── class-sync-log.php     # Log de sincronizações
├── admin/
│   ├── settings-page.php      # Template da página de config
│   └── css/admin.css          # Estilos do admin
├── assets/
│   └── js/admin.js            # Scripts do admin
└── languages/
    └── edashow-sync-pt_BR.po  # Traduções
```

---

## 💻 Código de Exemplo

### Arquivo Principal (edashow-sync.php)

```php
<?php
/**
 * Plugin Name: EdaShow Sync
 * Description: Sincroniza posts do WordPress com o EdaShow
 * Version: 1.0.0
 * Author: Sua Empresa
 * Text Domain: edashow-sync
 */

if (!defined('ABSPATH')) exit;

define('EDASHOW_SYNC_VERSION', '1.0.0');
define('EDASHOW_SYNC_PATH', plugin_dir_path(__FILE__));

// Autoload classes
require_once EDASHOW_SYNC_PATH . 'includes/class-api-client.php';
require_once EDASHOW_SYNC_PATH . 'includes/class-post-handler.php';
require_once EDASHOW_SYNC_PATH . 'includes/class-settings.php';

class EdaShow_Sync {
    
    private static $instance = null;
    private $api_client;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->api_client = new EdaShow_API_Client();
        $this->init_hooks();
    }
    
    private function init_hooks() {
        // Hook quando post é publicado
        add_action('publish_post', [$this, 'on_post_publish'], 10, 2);
        
        // Hook quando post é atualizado
        add_action('post_updated', [$this, 'on_post_update'], 10, 3);
        
        // Hook quando post é deletado
        add_action('before_delete_post', [$this, 'on_post_delete']);
        
        // Meta box no editor
        add_action('add_meta_boxes', [$this, 'add_sync_meta_box']);
        
        // Página de configurações
        add_action('admin_menu', [$this, 'add_settings_page']);
        
        // AJAX para sincronização manual
        add_action('wp_ajax_edashow_sync_post', [$this, 'ajax_sync_post']);
    }
    
    /**
     * Sincroniza post quando publicado
     */
    public function on_post_publish($post_id, $post) {
        // Verificar se sincronização automática está ativa
        if (!get_option('edashow_auto_sync', false)) {
            return;
        }
        
        // Evitar loops de autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Verificar tipo de post
        $allowed_types = get_option('edashow_post_types', ['post']);
        if (!in_array($post->post_type, $allowed_types)) {
            return;
        }
        
        $this->sync_post($post_id);
    }
    
    /**
     * Prepara e envia dados do post
     */
    public function sync_post($post_id) {
        $post = get_post($post_id);
        if (!$post) return false;
        
        // Preparar payload
        $payload = $this->prepare_payload($post);
        
        // Enviar para API
        $response = $this->api_client->import_post($payload);
        
        // Salvar resultado como meta
        if ($response['success']) {
            update_post_meta($post_id, '_edashow_synced', true);
            update_post_meta($post_id, '_edashow_post_id', $response['data']['post_id']);
            update_post_meta($post_id, '_edashow_last_sync', current_time('mysql'));
        } else {
            update_post_meta($post_id, '_edashow_sync_error', $response['error']['message']);
        }
        
        return $response;
    }
    
    /**
     * Prepara payload para API
     */
    private function prepare_payload($post) {
        // Obter categorias
        $categories = wp_get_post_categories($post->ID, ['fields' => 'names']);
        
        // Obter tags
        $tags = wp_get_post_tags($post->ID, ['fields' => 'names']);
        
        // Obter imagem em destaque
        $featured_image = null;
        $thumbnail_id = get_post_thumbnail_id($post->ID);
        if ($thumbnail_id) {
            $image_url = wp_get_attachment_image_url($thumbnail_id, 'full');
            $image_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
            $image_data = wp_get_attachment_metadata($thumbnail_id);
            
            $featured_image = [
                'url' => $image_url,
                'alt' => $image_alt ?: $post->post_title,
                'width' => $image_data['width'] ?? null,
                'height' => $image_data['height'] ?? null
            ];
        }
        
        // Extrair imagens inline do conteúdo
        $inline_images = $this->extract_inline_images($post->post_content);
        
        // Obter autor
        $author = get_userdata($post->post_author);
        
        return [
            'site_url' => get_site_url(),
            'action' => get_post_meta($post->ID, '_edashow_synced', true) ? 'update' : 'create',
            'post' => [
                'wp_id' => $post->ID,
                'title' => $post->post_title,
                'slug' => $post->post_name,
                'content' => apply_filters('the_content', $post->post_content),
                'excerpt' => $post->post_excerpt ?: wp_trim_words($post->post_content, 30),
                'status' => $post->post_status === 'publish' ? 'published' : 'draft',
                'published_at' => get_the_date('c', $post),
                'author' => [
                    'name' => $author->display_name,
                    'email' => $author->user_email
                ],
                'categories' => $categories,
                'tags' => $tags,
                'featured_image' => $featured_image,
                'inline_images' => $inline_images,
                'meta' => $this->get_seo_meta($post->ID)
            ]
        ];
    }
    
    /**
     * Extrai imagens do conteúdo
     */
    private function extract_inline_images($content) {
        $images = [];
        
        // Regex para encontrar tags <img>
        preg_match_all('/<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\'][^>]*>/i', $content, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            // Verificar se é imagem local
            if (strpos($match[1], get_site_url()) !== false) {
                $images[] = [
                    'original_url' => $match[1],
                    'alt' => $match[2] ?? ''
                ];
            }
        }
        
        return $images;
    }
    
    /**
     * Obtém metadados SEO (compatível com Yoast, RankMath, etc)
     */
    private function get_seo_meta($post_id) {
        $meta = [];
        
        // Yoast SEO
        if (defined('WPSEO_VERSION')) {
            $meta['seo_title'] = get_post_meta($post_id, '_yoast_wpseo_title', true);
            $meta['seo_description'] = get_post_meta($post_id, '_yoast_wpseo_metadesc', true);
        }
        
        // RankMath
        if (class_exists('RankMath')) {
            $meta['seo_title'] = get_post_meta($post_id, 'rank_math_title', true);
            $meta['seo_description'] = get_post_meta($post_id, 'rank_math_description', true);
        }
        
        return array_filter($meta);
    }
    
    /**
     * Adiciona página de configurações
     */
    public function add_settings_page() {
        add_options_page(
            'EdaShow Sync',
            'EdaShow Sync',
            'manage_options',
            'edashow-sync',
            [$this, 'render_settings_page']
        );
    }
    
    /**
     * Renderiza página de configurações
     */
    public function render_settings_page() {
        include EDASHOW_SYNC_PATH . 'admin/settings-page.php';
    }
    
    /**
     * Adiciona meta box no editor
     */
    public function add_sync_meta_box() {
        add_meta_box(
            'edashow-sync-status',
            'EdaShow Sync',
            [$this, 'render_meta_box'],
            'post',
            'side',
            'default'
        );
    }
    
    /**
     * Renderiza meta box
     */
    public function render_meta_box($post) {
        $synced = get_post_meta($post->ID, '_edashow_synced', true);
        $last_sync = get_post_meta($post->ID, '_edashow_last_sync', true);
        $error = get_post_meta($post->ID, '_edashow_sync_error', true);
        
        if ($synced) {
            echo '<p style="color: green;">✅ Sincronizado</p>';
            echo '<p><small>Última sync: ' . esc_html($last_sync) . '</small></p>';
        } elseif ($error) {
            echo '<p style="color: red;">❌ Erro: ' . esc_html($error) . '</p>';
        } else {
            echo '<p>⏳ Não sincronizado</p>';
        }
        
        echo '<button type="button" class="button" onclick="edashowSyncPost(' . $post->ID . ')">Sincronizar Agora</button>';
    }
}

// Inicializar plugin
add_action('plugins_loaded', ['EdaShow_Sync', 'get_instance']);
```

### Cliente API (class-api-client.php)

```php
<?php
class EdaShow_API_Client {
    
    private $api_url;
    private $api_key;
    
    public function __construct() {
        $this->api_url = get_option('edashow_api_url', '');
        $this->api_key = get_option('edashow_api_key', '');
    }
    
    /**
     * Testa conexão com a API
     */
    public function test_connection() {
        $response = $this->request('GET', '/status');
        return $response;
    }
    
    /**
     * Envia post para importação
     */
    public function import_post($payload) {
        return $this->request('POST', '/import', $payload);
    }
    
    /**
     * Executa requisição HTTP
     */
    private function request($method, $endpoint, $body = null) {
        $url = rtrim($this->api_url, '/') . $endpoint;
        
        $args = [
            'method' => $method,
            'headers' => [
                'Content-Type' => 'application/json',
                'x-wp-api-key' => $this->api_key,
            ],
            'timeout' => 60,
        ];
        
        if ($body) {
            $args['body'] = json_encode($body);
        }
        
        $response = wp_remote_request($url, $args);
        
        if (is_wp_error($response)) {
            return [
                'success' => false,
                'error' => [
                    'code' => 'HTTP_ERROR',
                    'message' => $response->get_error_message()
                ]
            ];
        }
        
        $status_code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($status_code >= 400) {
            return [
                'success' => false,
                'error' => $body['error'] ?? [
                    'code' => 'API_ERROR',
                    'message' => 'Erro desconhecido'
                ]
            ];
        }
        
        return $body;
    }
}
```

---

## ⚠️ Tratamento de Erros

### Códigos de Erro da API

| Código | Descrição | Ação Recomendada |
|--------|-----------|------------------|
| `UNAUTHORIZED` | API Key inválida | Verificar configurações |
| `VALIDATION_ERROR` | Dados inválidos | Checar payload |
| `DUPLICATE_POST` | Post já existe | Usar action `update` |
| `IMAGE_DOWNLOAD_FAILED` | Erro ao baixar imagem | Verificar URL/permissões |
| `CATEGORY_NOT_FOUND` | Categoria não encontrada | Verificar mapeamento |
| `RATE_LIMIT_EXCEEDED` | Muitas requisições | Aguardar e tentar novamente |

### Exemplo de Tratamento

```php
$response = $api_client->import_post($payload);

if (!$response['success']) {
    $error_code = $response['error']['code'];
    
    switch ($error_code) {
        case 'UNAUTHORIZED':
            // Notificar admin sobre API key inválida
            $this->notify_admin_error('API Key inválida. Verifique as configurações.');
            break;
            
        case 'DUPLICATE_POST':
            // Tentar atualizar ao invés de criar
            $payload['action'] = 'update';
            return $this->import_post($payload);
            
        case 'RATE_LIMIT_EXCEEDED':
            // Agendar retry
            wp_schedule_single_event(time() + 300, 'edashow_retry_sync', [$post_id]);
            break;
            
        default:
            // Log genérico
            error_log('EdaShow Sync Error: ' . $response['error']['message']);
    }
}
```

---

## ✅ Boas Práticas

### 1. Sincronização em Background

Para evitar lentidão no salvamento de posts, use WP Cron:

```php
// Ao publicar post, agendar sincronização
add_action('publish_post', function($post_id) {
    wp_schedule_single_event(time(), 'edashow_sync_post', [$post_id]);
});

// Hook do cron
add_action('edashow_sync_post', function($post_id) {
    EdaShow_Sync::get_instance()->sync_post($post_id);
});
```

### 2. Bulk Sync

Para sincronização em massa de posts antigos:

```php
public function bulk_sync($limit = 50) {
    $posts = get_posts([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
        'meta_query' => [
            [
                'key' => '_edashow_synced',
                'compare' => 'NOT EXISTS'
            ]
        ]
    ]);
    
    $results = ['success' => 0, 'errors' => 0];
    
    foreach ($posts as $post) {
        $response = $this->sync_post($post->ID);
        if ($response['success']) {
            $results['success']++;
        } else {
            $results['errors']++;
        }
        
        // Pausa para evitar rate limiting
        usleep(500000); // 0.5 segundos
    }
    
    return $results;
}
```

### 3. Logs

Mantenha logs de sincronização:

```php
class EdaShow_Sync_Log {
    
    public static function log($post_id, $action, $result, $details = []) {
        global $wpdb;
        
        $wpdb->insert(
            $wpdb->prefix . 'edashow_sync_log',
            [
                'post_id' => $post_id,
                'action' => $action,
                'result' => $result ? 'success' : 'error',
                'details' => json_encode($details),
                'created_at' => current_time('mysql')
            ]
        );
    }
}
```

### 4. Verificação de Imagens

Antes de enviar, verificar se imagens são acessíveis:

```php
private function validate_image_url($url) {
    $response = wp_remote_head($url, ['timeout' => 5]);
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $status = wp_remote_retrieve_response_code($response);
    return $status === 200;
}
```

---

## 🚀 Próximos Passos

1. **Desenvolver plugin base** seguindo estrutura acima
2. **Testar com a API** usando endpoint de status
3. **Implementar página de configurações** no WordPress
4. **Testar sincronização** com posts de exemplo
5. **Implementar bulk sync** para posts existentes
6. **Adicionar logs e notificações** para monitoramento

---

## 📞 Suporte

Para dúvidas sobre a integração, consulte:
- Documentação da API: `/api/wordpress/status`
- Logs do sistema: `/cms/import`

