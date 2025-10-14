<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Jobber_API {
    
    private static $instance = null;
    private $api_key;
    private $account_id;
    private $api_base = 'https://api.getjobber.com/api/graphql';
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->api_key = get_option('gogreen_jobber_api_key');
        $this->account_id = get_option('gogreen_jobber_account_id');
    }
    
    private function make_request($query, $variables = array()) {
        if (empty($this->api_key)) {
            return new WP_Error('no_api_key', __('Jobber API key not configured', 'gogreen-jobber'));
        }
        
        $response = wp_remote_post($this->api_base, array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->api_key,
                'X-JOBBER-GRAPHQL-VERSION' => '2024-01-01',
            ),
            'body' => wp_json_encode(array(
                'query' => $query,
                'variables' => $variables,
            )),
            'timeout' => 30,
        ));
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['errors'])) {
            return new WP_Error('api_error', $data['errors'][0]['message']);
        }
        
        return $data;
    }
    
    public function create_client($data) {
        $query = '
            mutation CreateClient($input: CreateClientInput!) {
                createClient(input: $input) {
                    client {
                        id
                        firstName
                        lastName
                        email
                        phone
                    }
                    userErrors {
                        message
                        path
                    }
                }
            }
        ';
        
        $variables = array(
            'input' => array(
                'firstName' => $data['first_name'],
                'lastName' => $data['last_name'],
                'email' => $data['email'],
                'phones' => array(
                    array(
                        'number' => $data['phone'],
                        'description' => 'Primary',
                    )
                ),
                'addresses' => isset($data['address']) ? array(
                    array(
                        'street1' => $data['address']['street1'] ?? '',
                        'street2' => $data['address']['street2'] ?? '',
                        'city' => $data['address']['city'] ?? '',
                        'province' => $data['address']['province'] ?? '',
                        'postalCode' => $data['address']['postal_code'] ?? '',
                    )
                ) : array(),
            )
        );
        
        return $this->make_request($query, $variables);
    }
    
    public function get_client($client_id) {
        $query = '
            query GetClient($id: ID!) {
                client(id: $id) {
                    id
                    firstName
                    lastName
                    email
                    phones {
                        number
                        description
                    }
                    addresses {
                        street1
                        street2
                        city
                        province
                        postalCode
                    }
                }
            }
        ';
        
        $variables = array('id' => $client_id);
        
        return $this->make_request($query, $variables);
    }
    
    public function create_job($data) {
        $query = '
            mutation CreateJob($input: CreateJobInput!) {
                createJob(input: $input) {
                    job {
                        id
                        title
                        startAt
                        endAt
                        client {
                            id
                            firstName
                            lastName
                        }
                    }
                    userErrors {
                        message
                        path
                    }
                }
            }
        ';
        
        $variables = array(
            'input' => array(
                'clientId' => $data['client_id'],
                'title' => $data['title'],
                'startAt' => $data['start_at'],
                'endAt' => $data['end_at'],
                'lineItems' => isset($data['line_items']) ? $data['line_items'] : array(),
                'propertyId' => isset($data['property_id']) ? $data['property_id'] : null,
            )
        );
        
        return $this->make_request($query, $variables);
    }
    
    public function get_jobs_for_client($client_id, $limit = 10) {
        $query = '
            query GetClientJobs($clientId: ID!, $first: Int!) {
                jobs(clientId: $clientId, first: $first) {
                    nodes {
                        id
                        title
                        startAt
                        endAt
                        jobStatus
                        total {
                            amount
                            currency
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        ';
        
        $variables = array(
            'clientId' => $client_id,
            'first' => $limit
        );
        
        return $this->make_request($query, $variables);
    }
    
    public function get_invoices_for_client($client_id, $limit = 10) {
        $query = '
            query GetClientInvoices($clientId: ID!, $first: Int!) {
                invoices(clientId: $clientId, first: $first) {
                    nodes {
                        id
                        invoiceNumber
                        subject
                        total {
                            amount
                            currency
                        }
                        outstanding {
                            amount
                            currency
                        }
                        invoiceStatus
                        sentAt
                        dueDate
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        ';
        
        $variables = array(
            'clientId' => $client_id,
            'first' => $limit
        );
        
        return $this->make_request($query, $variables);
    }
    
    public function create_quote($data) {
        $query = '
            mutation CreateQuote($input: CreateQuoteInput!) {
                createQuote(input: $input) {
                    quote {
                        id
                        quoteNumber
                        subject
                        total {
                            amount
                            currency
                        }
                    }
                    userErrors {
                        message
                        path
                    }
                }
            }
        ';
        
        $variables = array(
            'input' => array(
                'clientId' => $data['client_id'],
                'subject' => $data['subject'],
                'lineItems' => $data['line_items'],
            )
        );
        
        return $this->make_request($query, $variables);
    }
    
    public function update_job($job_id, $data) {
        $query = '
            mutation UpdateJob($id: ID!, $input: UpdateJobInput!) {
                updateJob(id: $id, input: $input) {
                    job {
                        id
                        title
                        startAt
                        endAt
                        jobStatus
                    }
                    userErrors {
                        message
                        path
                    }
                }
            }
        ';
        
        $variables = array(
            'id' => $job_id,
            'input' => $data
        );
        
        return $this->make_request($query, $variables);
    }
    
    public function test_connection() {
        $query = '
            query {
                account {
                    id
                    name
                }
            }
        ';
        
        return $this->make_request($query);
    }
}
