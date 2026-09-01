resource "newrelic_synthetics_script_monitor" "coupang_monitor" {
  status           = "ENABLED"
  name             = "Coupang Browser Workflow Check"
  type             = "SCRIPT_BROWSER"
  period           = "EVERY_15_MINUTES"
  locations_public = ["AP_NORTHEAST_2"] # Must NOT include "AWS_" prefix

  runtime_type         = "CHROME_BROWSER"
  runtime_type_version = "LATEST"
  script_language      = "JAVASCRIPT"

  script = file("${path.module}/monitors/coupang_check.js")
}

resource "newrelic_alert_policy" "synthetic_policy" {
  name                = "Coupang Synthetic Alerts"
  incident_preference = "PER_CONDITION"
}

resource "newrelic_nrql_alert_condition" "synthetic_failure_condition" {
  policy_id                    = newrelic_alert_policy.synthetic_policy.id
  type                         = "static"
  name                         = "Synthetic Failure: Coupang Workflow Interrupted"
  enabled                      = true
  violation_time_limit_seconds = 3600

  nrql {
    query = "SELECT count(*) FROM SyntheticCheck WHERE monitorId = '${newrelic_synthetics_script_monitor.coupang_monitor.id}' AND result = 'FAILED'"
  }

  critical {
    operator              = "above"
    threshold             = 0
    threshold_duration    = 60
    threshold_occurrences = "at_least_once"
  }
}
