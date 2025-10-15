<?php

if (!defined('ABSPATH')) {
    exit;
}

class GoGreen_Schedule_Matcher {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
    }
    
    public function find_optimal_cleaner_and_time($request) {
        global $wpdb;
        
        $target_date = $request->preferred_date;
        $target_day_of_week = date('N', strtotime($target_date));
        
        $available_cleaners = $wpdb->get_results($wpdb->prepare(
            "SELECT ca.*, u.display_name as cleaner_name, u.user_email as cleaner_email
            FROM {$wpdb->prefix}gogreen_cleaner_availability ca
            INNER JOIN {$wpdb->users} u ON ca.cleaner_id = u.ID
            WHERE ca.day_of_week = %d AND ca.is_active = 1",
            $target_day_of_week
        ));
        
        if (empty($available_cleaners)) {
            return $this->find_alternative_day($request);
        }
        
        $best_match = null;
        $highest_score = 0;
        
        foreach ($available_cleaners as $cleaner) {
            $existing_jobs = $this->get_cleaner_jobs_on_date($cleaner->cleaner_id, $target_date);
            
            $available_slots = $this->find_available_slots(
                $cleaner->start_time,
                $cleaner->end_time,
                $existing_jobs,
                $request->duration_minutes
            );
            
            foreach ($available_slots as $slot) {
                $score = $this->calculate_match_score($request, $cleaner, $slot, $existing_jobs);
                
                if ($score > $highest_score) {
                    $highest_score = $score;
                    $best_match = array(
                        'cleaner_id' => $cleaner->cleaner_id,
                        'cleaner_name' => $cleaner->cleaner_name,
                        'cleaner_email' => $cleaner->cleaner_email,
                        'datetime' => date('Y-m-d', strtotime($target_date)) . ' ' . $slot['start_time'],
                        'end_datetime' => date('Y-m-d', strtotime($target_date)) . ' ' . $slot['end_time'],
                        'confidence' => $score,
                        'reason' => $this->generate_match_reason($score, $request, $cleaner, $slot),
                    );
                }
            }
        }
        
        return $best_match;
    }
    
    private function get_cleaner_jobs_on_date($cleaner_id, $date) {
        global $wpdb;
        
        $date_start = date('Y-m-d 00:00:00', strtotime($date));
        $date_end = date('Y-m-d 23:59:59', strtotime($date));
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT ai_suggested_datetime, duration_minutes
            FROM {$wpdb->prefix}gogreen_schedule_requests
            WHERE ai_matched_cleaner_id = %d
            AND ai_suggested_datetime BETWEEN %s AND %s
            AND status IN ('matched', 'confirmed', 'completed')
            ORDER BY ai_suggested_datetime ASC",
            $cleaner_id,
            $date_start,
            $date_end
        ));
    }
    
    private function find_available_slots($start_time, $end_time, $existing_jobs, $duration_minutes) {
        $slots = array();
        $buffer_minutes = get_option('gogreen_ai_scheduler_buffer_minutes', 30);
        
        list($start_hour, $start_min) = explode(':', $start_time);
        list($end_hour, $end_min) = explode(':', $end_time);
        
        $day_start = ($start_hour * 60) + $start_min;
        $day_end = ($end_hour * 60) + $end_min;
        
        $busy_periods = array();
        foreach ($existing_jobs as $job) {
            $job_start = strtotime(date('H:i', strtotime($job->ai_suggested_datetime)));
            $job_start_minutes = (date('H', $job_start) * 60) + date('i', $job_start);
            $job_end_minutes = $job_start_minutes + $job->duration_minutes + $buffer_minutes;
            
            $busy_periods[] = array(
                'start' => $job_start_minutes,
                'end' => $job_end_minutes
            );
        }
        
        usort($busy_periods, function($a, $b) {
            return $a['start'] - $b['start'];
        });
        
        $current_time = $day_start;
        
        foreach ($busy_periods as $busy) {
            if ($busy['start'] - $current_time >= $duration_minutes) {
                $slots[] = array(
                    'start_time' => sprintf('%02d:%02d:00', floor($current_time / 60), $current_time % 60),
                    'end_time' => sprintf('%02d:%02d:00', floor(($current_time + $duration_minutes) / 60), ($current_time + $duration_minutes) % 60),
                    'start_minutes' => $current_time,
                );
            }
            $current_time = max($current_time, $busy['end']);
        }
        
        if ($day_end - $current_time >= $duration_minutes) {
            $slots[] = array(
                'start_time' => sprintf('%02d:%02d:00', floor($current_time / 60), $current_time % 60),
                'end_time' => sprintf('%02d:%02d:00', floor(($current_time + $duration_minutes) / 60), ($current_time + $duration_minutes) % 60),
                'start_minutes' => $current_time,
            );
        }
        
        return $slots;
    }
    
    private function calculate_match_score($request, $cleaner, $slot, $existing_jobs) {
        $score = 100;
        
        if ($request->preferred_time !== 'flexible') {
            $preferred_hour = (int)substr($request->preferred_time, 0, 2);
            $slot_hour = (int)substr($slot['start_time'], 0, 2);
            
            $hour_diff = abs($preferred_hour - $slot_hour);
            $score -= ($hour_diff * 5);
        }
        
        $jobs_count = count($existing_jobs);
        if ($jobs_count >= $cleaner->max_jobs_per_day) {
            $score -= 50;
        } else {
            $score -= ($jobs_count * 5);
        }
        
        if ($request->preferred_time === 'flexible') {
            $morning_hours = array(8, 9, 10);
            $slot_hour = (int)substr($slot['start_time'], 0, 2);
            if (in_array($slot_hour, $morning_hours)) {
                $score += 10;
            }
        }
        
        if ($request->location_lat && $request->location_lng) {
            foreach ($existing_jobs as $job) {
                $score += 5;
            }
        }
        
        return max(0, min(100, $score));
    }
    
    private function generate_match_reason($score, $request, $cleaner, $slot) {
        if ($score >= 90) {
            return 'Perfect match: Cleaner available at preferred time with light workload';
        } elseif ($score >= 75) {
            return 'Good match: Cleaner available close to preferred time';
        } elseif ($score >= 60) {
            return 'Acceptable match: Alternative time slot available';
        } else {
            return 'Low confidence match: May need manual review';
        }
    }
    
    private function find_alternative_day($request) {
        $target_date = strtotime($request->preferred_date);
        
        for ($i = 1; $i <= 7; $i++) {
            $alt_date = date('Y-m-d', strtotime("+{$i} days", $target_date));
            $alt_request = clone $request;
            $alt_request->preferred_date = $alt_date;
            
            $match = $this->find_optimal_cleaner_and_time($alt_request);
            if ($match && $match['confidence'] > 50) {
                $match['is_alternative_date'] = true;
                $match['original_date'] = $request->preferred_date;
                return $match;
            }
        }
        
        return null;
    }
}
