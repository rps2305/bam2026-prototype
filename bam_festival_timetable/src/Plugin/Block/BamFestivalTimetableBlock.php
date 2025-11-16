<?php

namespace Drupal\bam_festival_timetable\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'BAM Festival Timetable' Block.
 *
 * @Block(
 *   id = "bam_festival_timetable_block",
 *   admin_label = @Translation("BAM Festival Timetable"),
 *   category = @Translation("Custom"),
 * )
 */
class BamFestivalTimetableBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new BamFestivalTimetableBlock instance.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    $form['festival_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Festival Title'),
      '#description' => $this->t('The title to display at the top of the timetable.'),
      '#default_value' => $config['festival_title'] ?? 'BAM! Festival 2025',
    ];

    $form['festival_year'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Festival Year'),
      '#description' => $this->t('Filter artists by year (leave empty to show all years).'),
      '#default_value' => $config['festival_year'] ?? '',
    ];

    $form['date_format'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Date Format'),
      '#description' => $this->t('PHP date format for displaying dates (e.g., "l j F Y" for "Friday 23 May 2025").'),
      '#default_value' => $config['date_format'] ?? 'l j F Y',
    ];

    $form['show_unpublished'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show unpublished artists'),
      '#description' => $this->t('Include unpublished artist nodes in the timetable.'),
      '#default_value' => $config['show_unpublished'] ?? FALSE,
    ];

    $form['debug_mode'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Debug mode'),
      '#description' => $this->t('Show debug information for troubleshooting field values.'),
      '#default_value' => $config['debug_mode'] ?? FALSE,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['festival_title'] = $values['festival_title'];
    $this->configuration['festival_year'] = $values['festival_year'];
    $this->configuration['date_format'] = $values['date_format'];
    $this->configuration['show_unpublished'] = $values['show_unpublished'];
    $this->configuration['debug_mode'] = $values['debug_mode'];
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    $festival_data = $this->getFestivalData();

    return [
      '#theme' => 'bam_festival_timetable_block',
      '#festival_data' => $festival_data,
      '#festival_title' => $config['festival_title'] ?? 'BAM! Festival 2025',
      '#attached' => [
        'library' => [
          'bam_festival_timetable/timetable',
        ],
      ],
      '#cache' => [
        'tags' => ['node_list:artists'],
        'max-age' => 0, // Disable cache during debugging
      ],
    ];
  }

  /**
   * Get festival data from Artists content type.
   */
  protected function getFestivalData() {
    $config = $this->getConfiguration();
    $node_storage = $this->entityTypeManager->getStorage('node');
    $term_storage = $this->entityTypeManager->getStorage('taxonomy_term');

    $debug_info = [];
    $debug_info[] = "=== BAM Festival Timetable Debug ===";
    $debug_info[] = "Config: " . print_r($config, TRUE);
    $debug_info[] = "Timezone: Europe/Amsterdam";

    // Build query for artists
    $query = $node_storage->getQuery()
      ->condition('type', 'artists')
      ->accessCheck(TRUE);

    // Add status condition unless showing unpublished
    if (!($config['show_unpublished'] ?? FALSE)) {
      $query->condition('status', 1);
      $debug_info[] = "Filtering for published nodes only";
    } else {
      $debug_info[] = "Including unpublished nodes";
    }

    // Filter by year if specified
    if (!empty($config['festival_year'])) {
      $year_terms = $term_storage->loadByProperties([
        'vid' => 'jaren',
        'name' => $config['festival_year'],
      ]);
      if (!empty($year_terms)) {
        $year_term = reset($year_terms);
        $query->condition('field_year', $year_term->id());
        $debug_info[] = "Filtering by year: {$config['festival_year']} (term ID: {$year_term->id()})";
      } else {
        $debug_info[] = "Year filter '{$config['festival_year']}' not found in 'jaren' taxonomy";
      }
    } else {
      $debug_info[] = "No year filter applied";
    }

    $nids = $query->execute();
    $debug_info[] = "Query found " . count($nids) . " artist nodes: " . implode(', ', $nids);

    if (empty($nids)) {
      $debug_info[] = "No artists found - checking if any artists exist at all...";

      // Check total artists
      $total_query = $node_storage->getQuery()
        ->condition('type', 'artists')
        ->accessCheck(TRUE);
      $total_nids = $total_query->execute();
      $debug_info[] = "Total artists in system: " . count($total_nids);

      if (!empty($total_nids)) {
        // Load a sample to check fields
        $sample_artists = $node_storage->loadMultiple(array_slice($total_nids, 0, 3));
        foreach ($sample_artists as $sample) {
          $debug_info[] = "Sample artist '{$sample->getTitle()}' (ID: {$sample->id()})";
          $debug_info[] = "  - Status: " . ($sample->isPublished() ? 'Published' : 'Unpublished');
          $debug_info[] = "  - Has field_datumstart: " . ($sample->hasField('field_datumstart') ? 'Yes' : 'No');
          $debug_info[] = "  - Has field_starttijd: " . ($sample->hasField('field_starttijd') ? 'Yes' : 'No');
          $debug_info[] = "  - Has field_eindetijd: " . ($sample->hasField('field_eindetijd') ? 'Yes' : 'No');
          $debug_info[] = "  - Has field_year: " . ($sample->hasField('field_year') ? 'Yes' : 'No');

          if ($sample->hasField('field_year') && !$sample->get('field_year')->isEmpty()) {
            $year_terms = $sample->get('field_year')->referencedEntities();
            $year_names = [];
            foreach ($year_terms as $term) {
              $year_names[] = $term->getName();
            }
            $debug_info[] = "  - Year values: " . implode(', ', $year_names);
          }
        }
      }

      return ['debug' => $debug_info];
    }

    $artists = $node_storage->loadMultiple($nids);
    $festival_data = [];

    foreach ($artists as $artist) {
      $debug_info[] = "\n--- Processing artist: {$artist->getTitle()} (ID: {$artist->id()}) ---";

      // Check required fields
      $required_fields = ['field_datumstart', 'field_starttijd', 'field_eindetijd'];
      $missing_fields = [];

      foreach ($required_fields as $field_name) {
        if (!$artist->hasField($field_name)) {
          $missing_fields[] = $field_name . " (field doesn't exist)";
        } elseif ($artist->get($field_name)->isEmpty()) {
          $missing_fields[] = $field_name . " (field is empty)";
        }
      }

      if (!empty($missing_fields)) {
        $debug_info[] = "Skipping - missing fields: " . implode(', ', $missing_fields);
        continue;
      }

      // Get raw field values
      $start_date_raw = $artist->get('field_datumstart')->getValue();
      $start_time_raw = $artist->get('field_starttijd')->getValue();
      $end_time_raw = $artist->get('field_eindetijd')->getValue();

      $debug_info[] = "Raw field values:";
      $debug_info[] = "  - field_datumstart: " . print_r($start_date_raw, TRUE);
      $debug_info[] = "  - field_starttijd: " . print_r($start_time_raw, TRUE);
      $debug_info[] = "  - field_eindetijd: " . print_r($end_time_raw, TRUE);

      // Extract actual values
      $start_date_value = $this->extractFieldValue($start_date_raw);
      $start_time_value = $this->extractFieldValue($start_time_raw);
      $end_time_value = $this->extractFieldValue($end_time_raw);

      $debug_info[] = "Extracted values:";
      $debug_info[] = "  - start_date_value: " . print_r($start_date_value, TRUE);
      $debug_info[] = "  - start_time_value: " . print_r($start_time_value, TRUE);
      $debug_info[] = "  - end_time_value: " . print_r($end_time_value, TRUE);

      if (!$start_date_value || !$start_time_value || !$end_time_value) {
        $debug_info[] = "Skipping - one or more values are empty";
        continue;
      }

      try {
        // Parse datetime fields with Amsterdam timezone
        $start_datetime = $this->parseDateTime($start_time_value);
        $end_datetime = $this->parseDateTime($end_time_value);
        $date_obj = $this->parseDateTime($start_date_value);

        if (!$start_datetime || !$end_datetime || !$date_obj) {
          $debug_info[] = "Skipping - failed to parse datetime objects";
          continue;
        }

        $debug_info[] = "Parsed datetime objects (Amsterdam timezone):";
        $debug_info[] = "  - date_obj: " . $date_obj->format('Y-m-d H:i:s T');
        $debug_info[] = "  - start_datetime: " . $start_datetime->format('Y-m-d H:i:s T');
        $debug_info[] = "  - end_datetime: " . $end_datetime->format('Y-m-d H:i:s T');

        $date_formatted = $date_obj->format($config['date_format'] ?? 'l j F Y');
        $debug_info[] = "Formatted date: " . $date_formatted;

        // Get stage/location
        $stage_name = 'Unknown Stage';
        if ($artist->hasField('field_locatie') && !$artist->get('field_locatie')->isEmpty()) {
          $location_term = $artist->get('field_locatie')->entity;
          if ($location_term) {
            $stage_name = $location_term->getName();
          }
        }
        $debug_info[] = "Stage: " . $stage_name;

        // Get genre
        $genre_name = 'Unknown Genre';
        if ($artist->hasField('field_genre') && !$artist->get('field_genre')->isEmpty()) {
          $genre_terms = $artist->get('field_genre')->referencedEntities();
          if (!empty($genre_terms)) {
            $genre_names = [];
            foreach ($genre_terms as $genre_term) {
              $genre_names[] = $genre_term->getName();
            }
            $genre_name = implode('/', $genre_names);
          }
        }
        $debug_info[] = "Genre: " . $genre_name;

        // Find or create day entry
        $day_index = null;
        foreach ($festival_data as $index => $day) {
          if ($day['day'] === $date_formatted) {
            $day_index = $index;
            break;
          }
        }

        if ($day_index === null) {
          $day_index = count($festival_data);
          $festival_data[$day_index] = [
            'day' => $date_formatted,
            'stages' => [],
            'events' => [],
          ];
          $debug_info[] = "Created new day entry: " . $date_formatted;
        }

        // Add stage if not exists
        $stage_index = array_search($stage_name, $festival_data[$day_index]['stages']);
        if ($stage_index === false) {
          $festival_data[$day_index]['stages'][] = $stage_name;
          $stage_index = count($festival_data[$day_index]['stages']) - 1;
          $debug_info[] = "Added new stage: " . $stage_name;
        }

        // Add event
        $event_data = [
          'id' => (int) $artist->id(),
          'title' => $artist->getTitle(),
          'genre' => $genre_name,
          'stage' => $stage_index,
          'startTime' => $start_datetime->format('H:i'),
          'endTime' => $end_datetime->format('H:i'),
          'day' => $day_index,
        ];

        $festival_data[$day_index]['events'][] = $event_data;
        $debug_info[] = "Added event: " . print_r($event_data, TRUE);

      } catch (\Exception $e) {
        $debug_info[] = "Error processing artist: " . $e->getMessage();
        \Drupal::logger('bam_festival_timetable')->error('Error processing artist @title: @error', [
          '@title' => $artist->getTitle(),
          '@error' => $e->getMessage(),
        ]);
        continue;
      }
    }

    $debug_info[] = "\n=== Final festival data structure ===";
    $debug_info[] = print_r($festival_data, TRUE);

    // Add debug info to festival data if debug mode is enabled
    if ($config['debug_mode'] ?? FALSE) {
      $festival_data['debug'] = $debug_info;
    }

    return $festival_data;
  }

  /**
   * Extract field value from Drupal field array structure.
   */
  protected function extractFieldValue($field_array) {
    if (empty($field_array)) {
      return null;
    }

    // Handle array structure from getValue()
    if (is_array($field_array)) {
      // Check if it's a multi-value field array
      if (isset($field_array[0])) {
        $first_value = $field_array[0];
        if (is_array($first_value)) {
          // Look for common field value keys
          if (isset($first_value['value'])) {
            return $first_value['value'];
          }
          if (isset($first_value['target_id'])) {
            return $first_value['target_id'];
          }
        }
        return $first_value;
      }

      // Direct array with value key
      if (isset($field_array['value'])) {
        return $field_array['value'];
      }
      if (isset($field_array['target_id'])) {
        return $field_array['target_id'];
      }
    }

    return $field_array;
  }

  /**
   * Parse datetime value handling both timestamps and datetime strings with Amsterdam timezone.
   */
  protected function parseDateTime($value) {
    if (empty($value)) {
      return null;
    }

    try {
      $amsterdam_timezone = new \DateTimeZone('Europe/Amsterdam');

      // If it's a numeric timestamp
      if (is_numeric($value)) {
        $datetime = new \DateTime('@' . $value);
        // Convert to Amsterdam timezone
        $datetime->setTimezone($amsterdam_timezone);
        return $datetime;
      }

      // If it's already a DateTime string
      if (is_string($value)) {
        $datetime = new \DateTime($value);
        // Ensure it's in Amsterdam timezone
        $datetime->setTimezone($amsterdam_timezone);
        return $datetime;
      }

      return null;
    } catch (\Exception $e) {
      \Drupal::logger('bam_festival_timetable')->error('Failed to parse datetime: @value - @error', [
        '@value' => print_r($value, TRUE),
        '@error' => $e->getMessage(),
      ]);
      return null;
    }
  }

}
