<?php
/**
 * Plugin Name: Cardify Integration
 * Description: Integra Cardify ao WordPress via shortcode [amazon asin="B08N5WRWNW"]
 * Version: 1.0
 * Author: Seu Nome
 */

// Prevenir acesso direto
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Shortcode: [amazon asin="B08N5WRWNW" marketplace="us"]
 */
function cardify_amazon_product_shortcode($atts) {
    // Atributos padrão
    $atts = shortcode_atts([
        'asin' => '',
        'marketplace' => 'us',
        'tag' => '' // Opcional, usa o padrão do backend se vazio
    ], $atts);
    
    // Validar ASIN
    if (empty($atts['asin'])) {
        return '<p style="color: red;">Erro: ASIN é obrigatório no shortcode [amazon]</p>';
    }
    
    // URL da API Cardify
    $api_url = 'http://localhost:3333/api/card'; // MUDAR PARA PRODUÇÃO!
    
    // Construir query string
    $query = http_build_query([
        'asin' => $atts['asin'],
        'marketplace' => $atts['marketplace'],
        'tag' => $atts['tag']
    ]);
    
    // Fazer requisição
    $response = wp_remote_get($api_url . '?' . $query, [
        'timeout' => 10,
        'headers' => [
            'Accept' => 'application/json'
        ]
    ]);
    
    // Verificar erros
    if (is_wp_error($response)) {
        return '<p style="color: red;">Erro ao conectar com Cardify API</p>';
    }
    
    $body = wp_remote_retrieve_body($response);
    $product = json_decode($body, true);
    
    if (!$product || isset($product['error'])) {
        $error_msg = $product['error'] ?? 'Produto não encontrado';
        return '<p style="color: red;">Erro: ' . esc_html($error_msg) . '</p>';
    }
    
    // Renderizar card
    ob_start();
    ?>
    <div class="cardify-product-card" style="max-width: 400px; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; background: white;">
        <?php if (!empty($product['image']['large'])): ?>
            <img src="<?php echo esc_url($product['image']['large']); ?>" 
                 alt="<?php echo esc_attr($product['title']); ?>"
                 style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">
        <?php endif; ?>
        
        <h3 style="font-size: 20px; margin-bottom: 10px; color: #111;">
            <?php echo esc_html($product['title']); ?>
        </h3>
        
        <?php if (!empty($product['author'])): ?>
            <p style="color: #666; margin-bottom: 10px;">
                por <strong><?php echo esc_html($product['author']); ?></strong>
            </p>
        <?php endif; ?>
        
        <?php if (!empty($product['rating']['stars'])): ?>
            <div style="color: #FF9900; margin-bottom: 10px;">
                <?php echo str_repeat('⭐', round($product['rating']['stars'])); ?>
                <?php echo $product['rating']['stars']; ?>
                <?php if (!empty($product['rating']['count'])): ?>
                    (<?php echo number_format($product['rating']['count']); ?> avaliações)
                <?php endif; ?>
            </div>
        <?php endif; ?>
        
        <?php if (!empty($product['price']['display'])): ?>
            <p style="font-size: 28px; font-weight: bold; color: #B12704; margin: 15px 0;">
                <?php echo esc_html($product['price']['display']); ?>
            </p>
        <?php endif; ?>
        
        <?php if (!empty($product['features'])): ?>
            <ul style="margin: 15px 0; padding-left: 20px; color: #555;">
                <?php foreach (array_slice($product['features'], 0, 3) as $feature): ?>
                    <li style="margin-bottom: 5px;">
                        <?php echo esc_html($feature); ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
        
        <a href="<?php echo esc_url($product['affiliateUrl']); ?>" 
           target="_blank" 
           rel="noopener noreferrer sponsored"
           style="display: block; width: 100%; padding: 14px; background: #FF9900; color: white; text-align: center; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px;">
            🛒 Ver na Amazon
        </a>
        
        <p style="text-align: center; font-size: 11px; color: #666; margin-top: 10px; font-style: italic;">
            As an Amazon Associate I earn from qualifying purchases.
        </p>
        
        <?php if (!empty($product['fromCache'])): ?>
            <p style="text-align: center; font-size: 10px; color: #999; margin-top: 5px;">
                ⚡ Cache
            </p>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}

// Registrar shortcode
add_shortcode('amazon', 'cardify_amazon_product_shortcode');

/**
 * Adicionar CSS customizado (opcional)
 */
function cardify_enqueue_styles() {
    wp_enqueue_style('cardify-styles', plugins_url('cardify-styles.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'cardify_enqueue_styles');

/**
 * Adicionar botão no editor (opcional - requer JavaScript)
 */
function cardify_add_editor_button() {
    if (current_user_can('edit_posts')) {
        add_filter('mce_buttons', 'cardify_register_button');
        add_filter('mce_external_plugins', 'cardify_add_plugin');
    }
}
add_action('admin_init', 'cardify_add_editor_button');

function cardify_register_button($buttons) {
    array_push($buttons, 'cardify_button');
    return $buttons;
}

function cardify_add_plugin($plugin_array) {
    $plugin_array['cardify_button'] = plugins_url('cardify-editor.js', __FILE__);
    return $plugin_array;
}
?>
