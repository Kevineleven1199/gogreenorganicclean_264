<?php
/**
 * Schema Tax Meta
 *
 * @package     Schema
 * @subpackage  Schema Tax Meta
 * @copyright   Copyright (c) 2016, Hesham Zebida
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.5.9.8
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;


add_action( 'admin_init', 'schema_wp_register_tax_meta_box' );
//
//  Register tax meta box
//
function schema_wp_register_tax_meta_box() {
    // Only run in admin
    if ( ! is_admin() ) return;

    if ( class_exists('Schema_Custom_Add_Meta_Tax') ) {

      $prefix = 'schema_wp_';

      $config = array(
          'id' => 'schema_wp_meta_box',
          'title' => __('Schema', 'schema-wp'),
          'pages' => array('category', 'post_tag'),
          'context' => 'normal',
          'fields' => array(),
          'local_images' => false,
          'use_with_theme' => false
      );

    
      $my_meta = new Schema_Custom_Add_Meta_Tax($config);

      $my_meta->addText( $prefix.'sameAs', array(
          'name' => __('sameAs', 'schema-wp'),
          'desc' => __("URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.", 'schema-wp')
      ));

      $my_meta->Finish();
    }
}
