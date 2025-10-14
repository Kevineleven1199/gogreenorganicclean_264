<?php
/**
 * @package Schema - Schema Post Type Columns 
 * @category Core
 * @author Hesham Zebida
 * @version 1.6.7
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'admin_init', 'schema_wp_setup_post_columns' );
/**
 * Setup Schema Post Type Columns
 *
 * @since 1.7.9.6
 */
function schema_wp_setup_post_columns() {
    if ( ! class_exists( 'Schema_WP_CPT_columns' ) ) {
        return;
    }

    $post_columns = new Schema_WP_CPT_columns( 'schema' );

    $post_columns->add_column( 'title', array(
        'label'    => __( 'Name', 'schema-wp' ),
        'type'     => 'native',
        'sortable' => true,
    ) );

    $post_columns->add_column( 'schema_type', array(
        'label'    => __( 'Schema Type', 'schema-wp' ),
        'type'     => 'post_meta',
        'meta_key' => '_schema_type',
        'orderby'  => 'meta_value',
        'sortable' => true,
        'prefix'   => '',
        'suffix'   => '',
        'std'      => __( 'Not set!', 'schema-wp' ),
    ) );

    $post_columns->add_column( 'schema_post_types', array(
        'label'    => __( 'Post Type', 'schema-wp' ),
        'type'     => 'post_meta_array',
        'meta_key' => '_schema_post_types',
        'orderby'  => 'meta_value',
        'sortable' => true,
        'prefix'   => '',
        'suffix'   => '',
        'std'      => __( '-', 'schema-wp' ),
    ) );

    $post_columns->add_column( 'schema_cpt_post_count', array(
        'label'    => __( 'Content', 'schema-wp' ),
        'type'     => 'cpt_post_count',
        'meta_key' => '_schema_post_types',
        'orderby'  => 'meta_value',
        'sortable' => true,
        'prefix'   => '',
        'suffix'   => '',
        'std'      => __( '-', 'schema-wp' ),
    ) );

    $post_columns->remove_column( 'post_type' );
    $post_columns->remove_column( 'categories' );
    $post_columns->remove_column( 'date' );
    $post_columns->remove_column( 'gadwp_stats' );
    $post_columns->remove_column( 'mashsb_shares' );
}
